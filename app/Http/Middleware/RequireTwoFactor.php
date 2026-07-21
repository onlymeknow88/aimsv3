<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireTwoFactor
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Kalau 2FA aktif tapi belum diverifikasi di session ini
        if ($user->google2fa_enabled && !$request->session()->get('2fa_verified')) {
            return redirect()->route('two-factor.show');
        }

        return $next($request);
    }
}