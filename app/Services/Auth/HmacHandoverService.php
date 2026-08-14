<?php

namespace App\Services\Auth;

class HmacHandoverService
{
    /**
     * Verifikasi incoming handover request dari sender (CMS).
     * Dipakai di sisi receiver untuk memvalidasi signed URL.
     *
     * @param  string $email   Email dari query string
     * @param  int    $ts      Timestamp dari query string
     * @param  string $sig     Signature dari query string
     * @param  string $secret  Shared secret (plain)
     * @param  int    $ttl     Toleransi waktu dalam detik (default 30)
     * @return bool
     */
    public function verify(
        string $email,
        int $ts,
        string $sig,
        string $secret,
        int $ttl = 30
    ): bool {
        if (abs(time() - $ts) > $ttl) {
            return false;
        }

        $expected = hash_hmac('sha256', $email . '|' . $ts, $secret);

        return hash_equals($expected, $sig);
    }
}
