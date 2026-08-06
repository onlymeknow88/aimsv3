<?php

namespace App\Services;

use App\Models\LoginLog;
use Illuminate\Http\Request;

class LoginLogService
{
    /**
     * Record a login or logout event.
     */
    public static function record(string $event, Request $request, $user = null, ?string $failureReason = null, ?string $loginMethod = null): void
    {
        $userAgent = $request->userAgent() ?? '';
        $parsed = self::parseUserAgent($userAgent);

        LoginLog::create([
            'user_id' => $user ? $user->id : null,
            'user_email' => $user ? $user->email : ($request->input('email') ?? null),
            'user_name' => $user ? $user->name : null,
            'event' => $event,
            'login_method' => $loginMethod,
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'browser' => $parsed['browser'],
            'os' => $parsed['os'],
            'device_type' => $parsed['device_type'],
            'session_id' => $request->hasSession() ? $request->session()->getId() : null,
            'failure_reason' => $failureReason,
        ]);
    }

    /**
     * Parse raw user agent string to extract Browser, OS, and Device Type.
     */
    private static function parseUserAgent(string $userAgent): array
    {
        $browser = 'Unknown Browser';
        $os = 'Unknown OS';
        $device_type = 'desktop';

        if (empty($userAgent)) {
            return compact('browser', 'os', 'device_type');
        }

        // Detect OS
        if (preg_match('/windows|win32/i', $userAgent)) {
            $os = 'Windows';
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/android/i', $userAgent)) {
            $os = 'Android';
            $device_type = 'mobile';
        } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            $os = 'iOS';
            $device_type = 'mobile';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $os = 'Linux';
        }

        // Detect Device Type specifically
        if (preg_match('/tablet|ipad/i', $userAgent)) {
            $device_type = 'tablet';
        } elseif (preg_match('/mobile|phone/i', $userAgent)) {
            $device_type = 'mobile';
        }

        // Detect Browser
        if (preg_match('/msie|trident/i', $userAgent)) {
            $browser = 'Internet Explorer';
        } elseif (preg_match('/edg/i', $userAgent)) {
            $browser = 'Edge';
        } elseif (preg_match('/chrome/i', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/safari/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/firefox/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/opera|opr/i', $userAgent)) {
            $browser = 'Opera';
        }

        return compact('browser', 'os', 'device_type');
    }
}
