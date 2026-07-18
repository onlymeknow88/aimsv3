<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoginController extends Controller
{
    /**
     * Tampilkan halaman login khusus administrator backoffice
     */
    public function showLoginForm(): Response|RedirectResponse
    {
        if (Auth::guard('admin')->check() && Auth::guard('admin')->user()->role === 'super_admin') {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Proses autentikasi login khusus admin
     */
    public function login(AdminLoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Validasi role setelah berhasil login
        $user = Auth::guard('admin')->user();
        if (! $user || $user->role !== 'super_admin') {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return Inertia::render('Admin/Login', [
                'errors' => ['email' => 'Akun Anda tidak memiliki hak akses administrator.']
            ]);
        }

        return redirect()->route('admin.dashboard');
    }

    /**
     * Logout khusus admin
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
