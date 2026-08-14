<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\HmacHandoverService;
use App\Services\LoginLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class MicrosoftHandoverController extends Controller
{
    /**
     * Accept a signed handover token from CMS after Microsoft OAuth callback,
     * verify the HMAC signature, store a session-restore token in cache,
     * then redirect to APP_URL domain for final login.
     *
     * Query params:
     *   email  - the authenticated user's email
     *   ts     - UNIX timestamp when the token was generated (max 30s ago)
     *   sig    - HMAC-SHA256(email|ts, HANDOVER_SECRET)
     */
    public function handle(Request $request, HmacHandoverService $handover): RedirectResponse
    {
        $email  = $request->get('email', '');
        $ts     = (int) $request->get('ts', 0);
        $sig    = $request->get('sig', '');
        $secret = env('HANDOVER_SECRET', '');

        // --- Validate params and secret ---
        if (! $email || ! $ts || ! $sig || ! $secret) {
            return redirect()->to(rtrim(config('app.url'), '/') . '/login?error=sso_not_configured');
        }

        // --- Verify HMAC signature + TTL (30s) ---
        if (! $handover->verify($email, $ts, $sig, $secret)) {
            return redirect()->to(rtrim(config('app.url'), '/') . '/login?error=sso_invalid');
        }

        // --- Lookup user by email in aimsv3 database ---
        $user = User::where('email', $email)->first();

        if (! $user) {
            // Create inactive user — admin approval required
            User::create([
                'name'      => explode('@', $email)[0],
                'email'     => $email,
                'is_active' => false,
                'password'  => null,
            ]);

            return redirect()->to(rtrim(config('app.url'), '/') . '/login?error=sso_pending');
        }

        if (! $user->is_active) {
            return redirect()->to(rtrim(config('app.url'), '/') . '/login?error=sso_inactive');
        }

        // --- Store session-restore token in cache (60s TTL) ---
        // Cannot set session here because this runs on localhost/aimsv3 domain.
        // aimsv3.test is the canonical domain — restore login there via token.
        $token = Str::random(64);
        Cache::put('ms_login_token_' . $token, $user->id, 60);

        LoginLogService::record('login_success', $request, $user, null, 'Microsoft');

        return redirect()->to(
            rtrim(config('app.url'), '/') . '/auth/microsoft/session-restore?token=' . $token
        );
    }

    /**
     * Restore the user session on the canonical APP_URL domain (aimsv3.test).
     * Called after handle() stores the token in cache and redirects here.
     */
    public function sessionRestore(Request $request): RedirectResponse
    {
        $token  = $request->query('token', '');
        $userId = Cache::pull('ms_login_token_' . $token);

        if (! $userId) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Token sesi tidak valid atau sudah kadaluarsa.']);
        }

        $user = User::find($userId);

        if (! $user || ! $user->is_active) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Akun tidak ditemukan atau tidak aktif.']);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
