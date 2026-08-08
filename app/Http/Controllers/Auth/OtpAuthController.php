<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\SendsEmail;
use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtpAuthController extends Controller
{
    use SendsEmail;

    /**
     * Send OTP Code to user email.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Check if user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            return ResponseFormatter::error('Alamat email tidak terdaftar di sistem AIMS.', 404);
        }

        // Check cooldown of 10 minutes
        $existingOtp = DB::table('otp_codes')->where('email', $email)->first();
        if ($existingOtp) {
            $createdAt = \Carbon\Carbon::parse($existingOtp->created_at);
            $cooldownExpiresAt = $createdAt->addMinutes(10);
            if (now()->isBefore($cooldownExpiresAt)) {
                $diffInSeconds = now()->diffInSeconds($cooldownExpiresAt);
                $minutes = floor($diffInSeconds / 60);
                $seconds = $diffInSeconds % 60;
                $timeLeft = $minutes > 0 ? "{$minutes} menit {$seconds} detik" : "{$seconds} detik";
                return ResponseFormatter::error(
                    "Harap tunggu {$timeLeft} sebelum mengirim ulang OTP kembali.",
                    429
                );
            }
        }

        // Generate 6 digit random number
        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in database
        DB::table('otp_codes')->updateOrInsert(
            ['email' => $email],
            [
                'id' => (string) Str::uuid(),
                'otp_code' => Hash::make($otp),
                'expires_at' => now()->addMinutes(5),
                'attempts' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Send Simple Email
        $subject = 'Kode OTP Login AIMS V3';
        $body = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2 style='color: #153B73;'>Autentikasi Masuk AIMS V3</h2>
            <p>Halo,</p>
            <p>Gunakan kode OTP berikut untuk masuk ke akun Anda:</p>
            <div style='font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background-color: #f1f5f9; border-radius: 8px; display: inline-block; color: #1d4ed8; margin: 10px 0;'>
                {$otp}
            </div>
            <p style='color: #ef4444; font-size: 13px;'>Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan sebarkan kode ini kepada siapa pun demi keamanan akun Anda.</p>
            <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
            <p style='font-size: 11px; color: #64748b;'>Email ini dikirimkan otomatis oleh sistem AIMS V3. Harap jangan membalas email ini.</p>
        </div>";

        if (config('app.env') === 'production') {
            $mailResult = $this->sendSimpleEmail($email, $subject, $body, true);
        } else {
            \Illuminate\Support\Facades\Log::info("OTP Login AIMS V3 (Local/Dev) for {$email}: {$otp}");
            $mailResult = ['success' => true];
        }

        if (!$mailResult['success']) {
            return ResponseFormatter::error(
                'Gagal mengirimkan email OTP: ' . ($mailResult['message'] ?? 'Hubungi Administrator.'),
                500
            );
        }

        return ResponseFormatter::success(null, 'Kode OTP berhasil dikirimkan ke email Anda.');
    }

    /**
     * Verify OTP Code and Log user in.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6',
        ]);

        $email = $request->email;
        $otpCode = $request->otp_code;

        $dbOtp = DB::table('otp_codes')->where('email', $email)->first();
        if (!$dbOtp) {
            return ResponseFormatter::error('Kode OTP tidak ditemukan atau telah kadaluarsa. Silakan kirim ulang.', 404);
        }

        // Limit verification attempts to 3
        if ($dbOtp->attempts >= 3) {
            DB::table('otp_codes')->where('email', $email)->delete();
            return ResponseFormatter::error('Terlalu banyak percobaan salah. Silakan kirim ulang OTP baru.', 429);
        }

        // Check if OTP is expired (5 minutes)
        if (now()->isAfter($dbOtp->expires_at)) {
            DB::table('otp_codes')->where('email', $email)->delete();
            return ResponseFormatter::error('Kode OTP telah kedaluwarsa. Silakan kirim ulang.', 400);
        }

        // Check if OTP is valid
        if (!Hash::check($otpCode, $dbOtp->otp_code)) {
            $newAttempts = $dbOtp->attempts + 1;
            DB::table('otp_codes')->where('email', $email)->update([
                'attempts' => $newAttempts,
                'updated_at' => now(),
            ]);

            $remaining = 3 - $newAttempts;
            if ($remaining <= 0) {
                DB::table('otp_codes')->where('email', $email)->delete();
                return ResponseFormatter::error('Kode OTP salah. Terlalu banyak percobaan salah. Silakan kirim ulang OTP baru.', 400);
            }

            return ResponseFormatter::error("Kode OTP salah. Sisa percobaan: {$remaining} kali.", 400);
        }

        // OTP is correct! Clear OTP
        DB::table('otp_codes')->where('email', $email)->delete();

        // Login User
        $user = User::where('email', $email)->first();
        if (!$user) {
            return ResponseFormatter::error('Akun pengguna tidak ditemukan.', 404);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return ResponseFormatter::success([
            'redirect' => route('dashboard'),
        ], 'Masuk berhasil.');
    }
}
