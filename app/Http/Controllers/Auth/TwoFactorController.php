<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SendTwoFactorOtp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Show the 2FA challenge page.
     * Dipanggil setelah login berhasil tapi 2FA belum diverifikasi.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        if (!session('2fa_pending') || !session('2fa_user_id')) {
            return redirect()->route('login');
        }

        $user = $this->getChallengingUser();
        if (!$user) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge', [
            'hasTotpEnabled' => (bool) $user->google2fa_enabled,
            'email'          => Str::mask($user->email, '*', 3, strlen($user->email) - 6),
        ]);
    }

    /**
     * Verify TOTP code dari Google Authenticator.
     */
    public function verifyTotp(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ]);

        if (!session('2fa_pending') || !session('2fa_user_id')) {
            return redirect()->route('login');
        }

        $throttleKey = '2fa.totp.' . session('2fa_user_id') . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'code' => "Terlalu banyak percobaan. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        $user = $this->getChallengingUser();
        if (!$user || !$user->google2fa_secret) {
            return redirect()->route('login');
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey(
            $user->google2fa_secret,
            $request->code,
            2 // ±2 windows = toleransi 60 detik
        );

        if (!$valid) {
            RateLimiter::hit($throttleKey, 900);
            return back()->withErrors(['code' => 'Kode autentikator tidak valid.']);
        }

        RateLimiter::clear($throttleKey);
        $this->completeTwoFactor($request, $user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Verify Email OTP.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ]);

        if (!session('2fa_pending') || !session('2fa_user_id')) {
            return redirect()->route('login');
        }

        $throttleKey = '2fa.otp.' . session('2fa_user_id') . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'code' => "Terlalu banyak percobaan. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        $user = $this->getChallengingUser();
        if (!$user) {
            return redirect()->route('login');
        }

        // Cek expiry
        if (!$user->email_otp_expires_at || now()->isAfter($user->email_otp_expires_at)) {
            return back()->withErrors(['code' => 'Kode OTP sudah kadaluarsa. Minta kode baru.']);
        }

        // Verifikasi OTP (stored as hash)
        if (!$user->email_otp || !Hash::check($request->code, $user->email_otp)) {
            RateLimiter::hit($throttleKey, 900);
            return back()->withErrors(['code' => 'Kode OTP tidak valid.']);
        }

        // Clear OTP setelah berhasil dipakai
        $user->update([
            'email_otp'            => null,
            'email_otp_expires_at' => null,
        ]);

        RateLimiter::clear($throttleKey);
        $this->completeTwoFactor($request, $user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Kirim ulang Email OTP.
     */
    public function sendOtp(Request $request): RedirectResponse
    {
        if (!session('2fa_pending') || !session('2fa_user_id')) {
            return redirect()->route('login');
        }

        $throttleKey = '2fa.send-otp.' . session('2fa_user_id') . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'resend' => "Terlalu banyak permintaan. Coba lagi dalam {$seconds} detik.",
            ]);
        }
        RateLimiter::hit($throttleKey, 60); // cooldown 60 detik per kirim

        $user = $this->getChallengingUser();
        if (!$user) {
            return redirect()->route('login');
        }

        $this->generateAndSendOtp($user);

        return back()->with('otp_sent', true);
    }

    /**
     * Show TOTP setup page (diakses dari profile/settings saat sudah login).
     */
    public function setup(Request $request): Response
    {
        $user      = Auth::user();
        $google2fa = new Google2FA();

        // Generate secret baru jika belum punya
        if (!$user->google2fa_secret) {
            $secret = $google2fa->generateSecretKey();
            $user->update(['google2fa_secret' => $secret]);
            $user->refresh();
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->google2fa_secret
        );

        return Inertia::render('Auth/TwoFactorSetup', [
            'qrCodeUrl'  => $qrCodeUrl,
            'secret'     => $user->google2fa_secret,
            'isEnabled'  => (bool) $user->google2fa_enabled,
            'recoveryCodes' => $user->google2fa_enabled
                ? json_decode(decrypt($user->two_factor_recovery_codes ?? 'null'), true) ?? []
                : [],
        ]);
    }

    /**
     * Enable TOTP setelah user scan QR dan verifikasi kode.
     */
    public function enable(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ]);

        $user      = Auth::user();
        $google2fa = new Google2FA();

        if (!$user->google2fa_secret) {
            return back()->withErrors(['code' => 'Secret belum digenerate. Muat ulang halaman.']);
        }

        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->code, 2);

        if (!$valid) {
            return back()->withErrors(['code' => 'Kode tidak valid. Pastikan waktu perangkat Anda sinkron.']);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $user->update([
            'google2fa_enabled'         => true,
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
        ]);

        return redirect()->route('two-factor.setup')
            ->with('recovery_codes', $recoveryCodes)
            ->with('status', 'enabled');
    }

    /**
     * Disable TOTP (memerlukan konfirmasi password).
     */
    public function disable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Auth::user()->update([
            'google2fa_enabled'         => false,
            'google2fa_secret'          => null,
            'two_factor_recovery_codes' => null,
        ]);

        return back()->with('status', 'disabled');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function getChallengingUser(): ?User
    {
        $userId = session('2fa_user_id');
        if (!$userId) return null;
        return User::find($userId);
    }

    private function completeTwoFactor(Request $request, User $user): void
    {
        $request->session()->forget(['2fa_pending', '2fa_user_id']);
        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->put('2fa_verified', true);
    }

    public function generateAndSendOtp(User $user): void
    {
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'email_otp'            => Hash::make($otp),
            'email_otp_expires_at' => now()->addMinutes(5),
        ]);

        $user->notify(new SendTwoFactorOtp($otp));
    }

    private function generateRecoveryCodes(): array
    {
        return array_map(
            fn() => Str::random(10) . '-' . Str::random(10),
            range(1, 8)
        );
    }
}