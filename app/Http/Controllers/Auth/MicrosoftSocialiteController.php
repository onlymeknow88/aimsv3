<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LoginLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class MicrosoftSocialiteController extends Controller
{
    /**
     * Inject Azure config from app_settings table into Socialite.
     * Redirect URI is built dynamically from APP_URL.
     */
    private function injectConfig(): void
    {
        config([
            'services.azure.client_id'     => setting('microsoft_graph_client_id'),
            'services.azure.client_secret' => setting('microsoft_graph_client_secret'),
            'services.azure.redirect'      => rtrim(config('app.url'), '/') . '/auth/microsoft/callback',
            'services.azure.tenant'        => setting('microsoft_graph_tenant_id'),
        ]);
    }

    /**
     * Redirect to Microsoft Azure AD OAuth page.
     * Only available in production environment.
     */
    public function redirect(): RedirectResponse
    {
        if (! app()->environment('production')) {
            abort(403, 'Direct Microsoft SSO is only available in production. Use CMS handover flow on local.');
        }

        $this->injectConfig();

        if (! config('services.azure.client_id')) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Microsoft SSO belum dikonfigurasi. Hubungi administrator.']);
        }

        return Socialite::driver('azure')->stateless()->redirect();
    }

    /**
     * Handle the Microsoft OAuth callback.
     * Only available in production environment.
     */
    public function callback(Request $request): RedirectResponse|Response
    {
        if (! app()->environment('production')) {
            abort(403, 'Direct Microsoft SSO is only available in production. Use CMS handover flow on local.');
        }

        $this->injectConfig();

        try {
            $azureUser = Socialite::driver('azure')->stateless()->user();
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Login Microsoft gagal: ' . $e->getMessage()]);
        }

        // Try multiple email fields from Azure AD response
        $raw   = $azureUser->getRaw();
        $email = $raw['mail'] ?? $raw['userPrincipalName'] ?? $azureUser->getEmail() ?? null;

        if (! $email) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Microsoft tidak mengembalikan alamat email. Pastikan akun Anda memiliki email terdaftar.']);
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            if (! $user->is_active) {
                return redirect()->route('login')
                    ->withErrors(['email' => 'Akun Anda tidak aktif. Hubungi administrator.']);
            }

            // Update Microsoft fields
            $user->update([
                'microsoft_id'    => $azureUser->getId(),
                'microsoft_token' => $azureUser->token,
                'azure_tenant_id' => $raw['tid'] ?? null,
            ]);

            Auth::login($user);
            $request->session()->regenerate();

            LoginLogService::record('login_success', $request, $user, null, 'Microsoft');

            return redirect()->intended(route('dashboard', absolute: false));
        }

        // New user — create inactive, pending admin approval
        User::create([
            'name'            => $azureUser->getName() ?? explode('@', $email)[0],
            'email'           => $email,
            'microsoft_id'    => $azureUser->getId(),
            'microsoft_token' => $azureUser->token,
            'azure_tenant_id' => $raw['tid'] ?? null,
            'is_active'       => false,
            'password'        => null,
        ]);

        return Inertia::render('Auth/PendingApproval', [
            'message' => 'Akun baru telah dibuat. Menunggu persetujuan administrator sebelum dapat masuk.',
        ]);
    }
}
