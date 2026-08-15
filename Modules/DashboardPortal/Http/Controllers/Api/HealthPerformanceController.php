<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\UserActivityLogService;
use Illuminate\Http\Request;
use Modules\DashboardPortal\app\Models\HealthPerformance;

class HealthPerformanceController extends Controller
{
    const METRICS = [
        ['key' => 'rkk', 'label' => 'RKK'],
        ['key' => 'cmr', 'label' => 'CMR'],
        ['key' => 'mmr', 'label' => 'MMR'],
        ['key' => 'ssr', 'label' => 'SSR'],
        ['key' => 'asr', 'label' => 'ASR'],
    ];

    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');
            $page   = $request->query('page', 1);

            $query = HealthPerformance::query();
            if (!empty($search)) {
                $query->where('month', 'like', "%{$search}%");
            }

            $data = $query->orderBy('month', 'desc')->paginate($limit, ['*'], 'page', $page);
            return ResponseFormatter::success($data, 'Health performance data retrieved');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'month' => 'required|date_format:Y-m',
                'rkk'   => 'required|numeric|min:0',
                'cmr'   => 'required|numeric|min:0',
                'mmr'   => 'required|numeric|min:0',
                'ssr'   => 'required|numeric|min:0',
                'asr'   => 'required|numeric|min:0',
            ]);

            $input = $request->only(['rkk', 'cmr', 'mmr', 'ssr', 'asr']);
            $input['user_id'] = auth()->id();
            $input['month']   = $request->input('month') . '-01';
            $input['visible'] = 'true';

            $record = HealthPerformance::create($input);

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'create',
                resource: 'HealthPerformance', resourceId: $record->id,
                description: "Membuat health performance bulan " . date('M Y', strtotime($record->month)),
                newData: $record->toArray(), request: $request,
            );

            return ResponseFormatter::success($record, 'Health performance created', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $record = HealthPerformance::findOrFail($id);
            $request->validate([
                'month' => 'required|date_format:Y-m',
                'rkk'   => 'required|numeric|min:0',
                'cmr'   => 'required|numeric|min:0',
                'mmr'   => 'required|numeric|min:0',
                'ssr'   => 'required|numeric|min:0',
                'asr'   => 'required|numeric|min:0',
            ]);

            $oldData = $record->toArray();
            $input   = $request->only(['rkk', 'cmr', 'mmr', 'ssr', 'asr']);
            $input['month'] = $request->input('month') . '-01';
            $record->update($input);

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'update',
                resource: 'HealthPerformance', resourceId: $record->id,
                description: "Update health performance bulan " . date('M Y', strtotime($record->month)),
                oldData: $oldData, newData: $record->fresh()->toArray(), request: $request,
            );

            return ResponseFormatter::success($record->fresh(), 'Health performance updated');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $record  = HealthPerformance::findOrFail($id);
            $oldData = $record->toArray();
            $record->delete();

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'delete',
                resource: 'HealthPerformance', resourceId: (string) $id,
                description: "Hapus health performance", oldData: $oldData, request: $request,
            );

            return ResponseFormatter::success(null, 'Health performance deleted');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function bulkDestroy(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array']);
            $count = HealthPerformance::whereIn('id', $request->input('ids'))->delete();
            return ResponseFormatter::success(['deleted' => $count], "{$count} records deleted");
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function toggleVisible(Request $request, $id)
    {
        try {
            $record          = HealthPerformance::findOrFail($id);
            $record->visible = $record->visible === 'true' ? 'false' : 'true';
            $record->save();
            return ResponseFormatter::success($record, 'Visibility toggled');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/dashboard/health-performance/stats
     * Line chart data: per bulan, per metric (RKK, CMR, MMR, SSR, ASR)
     */
    public function stats(Request $request)
    {
        try {
            $year = $request->query('year', date('Y'));

            $rows = HealthPerformance::where('visible', 'true')
                ->whereYear('month', $year)
                ->orderBy('month')
                ->get();

            // Ambil 3 record terbaru seperti aimsv2
            $rows = HealthPerformance::where('visible', 'true')
                ->orderBy('created_at', 'DESC')
                ->take(3)
                ->get();

            // Sumbu X = nama metric (RKK, CMR, MMR, SSR, ASR)
            $labels = collect(self::METRICS)->pluck('label')->values();

            // Setiap dataset = 1 record, label = 'Performance 0', 'Performance 1', dst
            $colors = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623'];
            $datasets = $rows->values()->map(fn($r, $i) => [
                'label'           => 'Performance ' . ($i + 1),
                'data'            => collect(self::METRICS)->map(fn($m) => (float) ($r->{$m['key']} ?? 0))->values(),
                'borderColor'     => $colors[$i % count($colors)],
                'backgroundColor' => $colors[$i % count($colors)],
            ])->values();

            // Trend: sumbu X = bulan, setiap dataset = 1 metric
            $monthLabels   = $rows->map(fn($r) => date('M', strtotime($r->month)))->values();
            $trendDatasets = collect(self::METRICS)->map(fn($m) => [
                'label' => $m['label'],
                'key'   => $m['key'],
                'data'  => $rows->map(fn($r) => (float) ($r->{$m['key']} ?? 0))->values(),
            ])->values();

            $latest  = $rows->last();
            $summary = collect(self::METRICS)->map(fn($m) => [
                'label' => $m['label'],
                'key'   => $m['key'],
                'value' => $latest ? (float) ($latest->{$m['key']} ?? 0) : 0,
            ])->values();

            return ResponseFormatter::success([
                'labels'        => $labels,
                'datasets'      => $datasets,
                'monthLabels'   => $monthLabels,
                'trendDatasets' => $trendDatasets,
                'summary'       => $summary,
            ], 'Health performance stats retrieved');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }
}
