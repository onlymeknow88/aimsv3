<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\UserActivityLog;
use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserActivityLogController extends Controller
{
    /**
     * Get a paginated list of user activity logs with filters.
     */
    public function index(Request $request)
    {
        try {
            $query = UserActivityLog::query();

            // Filter by search (user name, email, resource, or description)
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('user_name', 'like', "%{$search}%")
                      ->orWhere('user_email', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('resource', 'like', "%{$search}%");
                });
            }

            // Filter by module
            if ($request->filled('module')) {
                $query->where('module', $request->input('module'));
            }

            // Filter by action
            if ($request->filled('action')) {
                $query->where('action', $request->input('action'));
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

            return ResponseFormatter::success($logs, 'Data user activity logs berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal mengambil data user activity logs: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get summary statistics for user activity logs.
     */
    public function stats()
    {
        try {
            $today = Carbon::today();

            // 1. Total actions today
            $totalToday = UserActivityLog::whereDate('created_at', $today)->count();

            // 2. Total delete actions today
            $deletesToday = UserActivityLog::whereDate('created_at', $today)
                ->where('action', 'delete')
                ->count();

            // 3. Most active user today
            $mostActive = UserActivityLog::select('user_name', 'user_email', DB::raw('count(*) as total'))
                ->whereDate('created_at', $today)
                ->whereNotNull('user_id')
                ->groupBy('user_id', 'user_name', 'user_email')
                ->orderByDesc('total')
                ->first();

            return ResponseFormatter::success([
                'total_today' => $totalToday,
                'deletes_today' => $deletesToday,
                'most_active_user' => $mostActive ? [
                    'name' => $mostActive->user_name,
                    'email' => $mostActive->user_email,
                    'count' => $mostActive->total
                ] : null
            ], 'Statistik user activity log berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal mengambil statistik: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Export user activity logs to CSV format.
     */
    private function exportCsv($query)
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="user_activity_logs_' . date('Ymd_His') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');
            
            // Add UTF-8 BOM for proper excel formatting
            fputs($file, "\xEF\xBB\xBF");

            // Headers
            fputcsv($file, ['Waktu', 'User', 'Email', 'Modul', 'Aksi', 'Resource', 'ID Resource', 'Deskripsi', 'IP Address']);

            $query->orderBy('created_at', 'desc')->chunk(500, function ($logs) use ($file) {
                foreach ($logs as $log) {
                    fputcsv($file, [
                        $log->created_at->format('Y-m-d H:i:s'),
                        $log->user_name ?? '-',
                        $log->user_email ?? '-',
                        strtoupper(str_replace('_', ' ', $log->module)),
                        strtoupper($log->action),
                        $log->resource,
                        $log->resource_id ?? '-',
                        $log->description ?? '-',
                        $log->ip_address ?? '-',
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
