<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Memastikan hanya user dengan role 'super_admin' yang bisa mengakses backoffice admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('admin')->user();

        if (! $user) {
            return redirect()->route('admin.login');
        }

        // Hanya super_admin yang boleh masuk backoffice admin
        if ($user->role !== 'super_admin') {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('admin.login')->withErrors(['email' => 'Akun Anda tidak memiliki hak akses administrator.']);
        }

        return $next($request);
    }
}
