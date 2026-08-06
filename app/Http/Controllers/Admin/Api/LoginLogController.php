<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LoginLogController extends Controller
{
    /**
     * Get a paginated list of login logs with filters.
     */
    public function index(Request $request)
    {
        $query = LoginLog::with('user');

        // Filter by search (name or email)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('user_email', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        // Filter by event
        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Handle CSV Export
        if ($request->input('export') === 'csv') {
            return $this->exportCsv($query);
        }

        $limit = $request->integer('limit', 10);
        $logs = $query->orderBy('created_at', 'desc')->paginate($limit);

        return ResponseFormatter::success($logs, 'Data log login berhasil diambil');
    }

    /**
     * Get statistics for the dashboard.
     */
    public function stats(Request $request)
    {
        $today = Carbon::today();
        
        $successToday = LoginLog::where('event', 'login_success')
            ->whereDate('created_at', $today)
            ->count();

        $failedToday = LoginLog::where('event', 'login_failed')
            ->whereDate('created_at', $today)
            ->count();

        $activeUsersCount = LoginLog::where('event', 'login_success')
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->distinct('user_id')
            ->count('user_id');

        $stats = [
            'success_today' => $successToday,
            'failed_today' => $failedToday,
            'active_users_24h' => $activeUsersCount,
        ];

        return ResponseFormatter::success($stats, 'Statistik log login berhasil diambil');
    }

    /**
     * Export the filtered query to a CSV file download.
     */
    private function exportCsv($query)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="login_logs_' . date('Ymd_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');
            
            // Add UTF-8 BOM for proper excel formatting
            fputs($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, ['Waktu', 'Nama', 'Email', 'Event', 'Metode', 'IP Address', 'Browser', 'OS', 'Perangkat', 'Alasan Gagal']);

            $query->orderBy('created_at', 'desc')->chunk(500, function ($logs) use ($file) {
                foreach ($logs as $log) {
                    fputcsv($file, [
                        $log->created_at->format('Y-m-d H:i:s'),
                        $log->user_name ?? '-',
                        $log->user_email ?? '-',
                        strtoupper(str_replace('_', ' ', $log->event)),
                        $log->login_method ?? '-',
                        $log->ip_address ?? '-',
                        $log->browser ?? '-',
                        $log->os ?? '-',
                        strtoupper($log->device_type ?? '-'),
                        $log->failure_reason ?? '-',
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
