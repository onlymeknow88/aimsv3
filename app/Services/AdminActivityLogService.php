<?php

namespace App\Services;

use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminActivityLogService
{
    /**
     * Catat aktivitas admin ke database.
     *
     * @param  string       $action      create|update|delete|activate|deactivate
     * @param  string       $resource    Nama entity: User, Company, Department, etc.
     * @param  string|null  $resourceId  ID record yang diubah
     * @param  string|null  $description Kalimat deskriptif
     * @param  array|null   $oldData     Snapshot data sebelum perubahan
     * @param  array|null   $newData     Snapshot data setelah perubahan
     * @param  Request|null $request     HTTP Request (untuk IP + User-Agent)
     */
    public static function log(
        string   $action,
        string   $resource,
        ?string  $resourceId  = null,
        ?string  $description = null,
        ?array   $oldData     = null,
        ?array   $newData     = null,
        ?Request $request     = null,
    ): void {
        try {
            // Coba ambil admin dari guard 'admin', fallback ke 'web'
            $admin = Auth::guard('admin')->user() ?? Auth::guard('web')->user();

            $req = $request ?? request();

            AdminActivityLog::create([
                'admin_id'    => $admin?->id,
                'admin_email' => $admin?->email,
                'admin_name'  => $admin?->name,
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
            // Jangan sampai gagal logging menghentikan proses utama
            Log::warning('AdminActivityLogService: Failed to record log.', [
                'error'    => $e->getMessage(),
                'action'   => $action,
                'resource' => $resource,
            ]);
        }
    }
}
