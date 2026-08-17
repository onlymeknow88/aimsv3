<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\SendsEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationApprovalController extends Controller
{
    use SendsEmail;

    /**
     * Approve user registration.
     */
    public function approve(Request $request, $id)
    {
        // Only super_admin is allowed
        if (auth()->user()->role !== 'super_admin') {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Hanya pengguna dengan peran Super Admin yang diizinkan untuk menyetujui pendaftaran ini.',
            ]);
        }

        // Route must have valid signature
        if (!$request->hasValidSignature()) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Link verifikasi tidak valid atau sudah kedaluwarsa.',
            ]);
        }

        $user = User::find($id);

        if (!$user) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan atau sudah dihapus.',
            ]);
        }

        if ($user->is_active) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'info',
                'message' => "Akun untuk {$user->name} ({$user->email}) sudah aktif sebelumnya.",
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
        }

        // Activate the user
        $user->is_active = true;
        $user->save();

        // Send email to user
        $subject = '[AIMS] Akun Anda Telah Disetujui';
        $loginUrl = route('login');
        $body = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;'>
            <div style='background-color: #10233F; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
                <h1 style='color: #ffffff; margin: 0; font-size: 22px;'>AIMS</h1>
                <p style='color: #94a3b8; margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;'>Integrated Management System</p>
            </div>
            <div style='padding: 30px 20px; line-height: 1.6;'>
                <h2 style='color: #153B73; margin-top: 0;'>Pendaftaran Akun Disetujui</h2>
                <p>Halo <strong>{$user->name}</strong>,</p>
                <p>Selamat! Pendaftaran akun AIMS Anda telah disetujui oleh administrator.</p>
                <p>Anda sekarang dapat masuk ke portal AIMS menggunakan alamat email terdaftar (<strong>{$user->email}</strong>) dan kata sandi yang telah Anda buat.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$loginUrl}' style='display: inline-block; padding: 12px 30px; background-color: #153B73; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 8px;'>Masuk Ke AIMS</a>
                </div>
                <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                <p style='font-size: 11px; color: #64748b;'>Email ini dikirimkan otomatis oleh sistem AIMS. Harap jangan membalas email ini.</p>
            </div>
        </div>";

        $this->sendSimpleEmail($user->email, $subject, $body, true);

        return Inertia::render('Auth/RegistrationVerification', [
            'status' => 'approved',
            'message' => "Akun {$user->name} ({$user->email}) berhasil disetujui dan diaktifkan. Pengguna telah menerima notifikasi email.",
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Reject user registration.
     */
    public function reject(Request $request, $id)
    {
        // Only super_admin is allowed
        if (auth()->user()->role !== 'super_admin') {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Hanya pengguna dengan peran Super Admin yang diizinkan untuk menolak pendaftaran ini.',
            ]);
        }

        // Route must have valid signature
        if (!$request->hasValidSignature()) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Link verifikasi tidak valid atau sudah kedaluwarsa.',
            ]);
        }

        $user = User::find($id);

        if (!$user) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan atau sudah dihapus.',
            ]);
        }

        if ($user->is_active) {
            return Inertia::render('Auth/RegistrationVerification', [
                'status' => 'error',
                'message' => 'Tidak dapat menolak akun yang sudah aktif.',
            ]);
        }

        $userName = $user->name;
        $userEmail = $user->email;

        // Send email notification to user first
        $subject = '[AIMS] Pendaftaran Akun Ditolak';
        $body = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;'>
            <div style='background-color: #10233F; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;'>
                <h1 style='color: #ffffff; margin: 0; font-size: 22px;'>AIMS</h1>
                <p style='color: #94a3b8; margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;'>Integrated Management System</p>
            </div>
            <div style='padding: 30px 20px; line-height: 1.6;'>
                <h2 style='color: #ef4444; margin-top: 0;'>Pendaftaran Akun Ditolak</h2>
                <p>Halo <strong>{$userName}</strong>,</p>
                <p>Mohon maaf, pendaftaran akun AIMS Anda dengan email <strong>{$userEmail}</strong> belum dapat disetujui oleh administrator pada saat ini.</p>
                <p>Jika Anda merasa ini adalah kesalahan atau memerlukan penjelasan lebih lanjut, silakan hubungi administrator AIMS perusahaan Anda.</p>
                <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                <p style='font-size: 11px; color: #64748b;'>Email ini dikirimkan otomatis oleh sistem AIMS. Harap jangan membalas email ini.</p>
            </div>
        </div>";

        $this->sendSimpleEmail($userEmail, $subject, $body, true);

        // Soft delete the user
        $user->delete();

        return Inertia::render('Auth/RegistrationVerification', [
            'status' => 'rejected',
            'message' => "Pendaftaran {$userName} ({$userEmail}) telah ditolak dan data akun telah dihapus. Pengguna telah menerima notifikasi email.",
            'user' => [
                'name' => $userName,
                'email' => $userEmail,
            ],
        ]);
    }
}
