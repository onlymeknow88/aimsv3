<?php

namespace App\Services;

use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserActivityLogService
{
    /**
     * Catat aktivitas pengguna (user biasa) ke database.
     *
     * @param  string       $module      coe|document_system|dashboard_portal
     * @param  string       $action      create|update|delete|approve|reject|submit|route
     * @param  string       $resource    Nama model/entity yang dimodifikasi
     * @param  string|null  $resourceId  ID record yang diubah
     * @param  string|null  $description Narasi penjelasan singkat aksi
     * @param  array|null   $oldData     Data lama (untuk update/delete)
     * @param  array|null   $newData     Data baru (untuk create/update)
     * @param  Request|null $request     HTTP Request
     */
    public static function log(
        string   $module,
        string   $action,
        string   $resource,
        ?string  $resourceId  = null,
        ?string  $description = null,
        ?array   $oldData     = null,
        ?array   $newData     = null,
        ?Request $request     = null,
    ): void {
        try {
            // Ambil user dari guard default (web session) atau guard admin
            $user = Auth::user() ?? Auth::guard('admin')->user();
            $req = $request ?? request();

            UserActivityLog::create([
                'user_id'     => $user?->id,
                'user_email'  => $user?->email,
                'user_name'   => $user?->name,
                'module'      => $module,
                'action'      => $action,
                'resource'    => $resource,
                'resource_id' => $resourceId ? (string) $resourceId : null,
                'description' => $description,
                'old_data'    => $oldData,
                'new_data'    => $newData,
                'ip_address'  => $req?->ip(),
                'user_agent'  => $req?->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // Mencegah error log menghentikan transaksi utama aplikasi
            Log::warning('UserActivityLogService: Failed to record user activity log.', [
                'error'    => $e->getMessage(),
                'module'   => $module,
                'action'   => $action,
                'resource' => $resource,
            ]);
        }
    }
}
