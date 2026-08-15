<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\UserActivityLogService;
use Illuminate\Http\Request;
use Modules\DashboardPortal\app\Models\SafetyPerformance;

class SafetyPerformanceController extends Controller
{
    const METRICS = [
        ['key' => 'aifr',   'label' => 'AIFR'],
        ['key' => 'ainfr',  'label' => 'AINFR'],
        ['key' => 'lti_fr', 'label' => 'LTI FR'],
        ['key' => 'lti_sr', 'label' => 'LTI SR'],
    ];

    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');
            $page   = $request->query('page', 1);

            $query = SafetyPerformance::query();
            if (!empty($search)) {
                $query->where('month', 'like', "%{$search}%");
            }

            $data = $query->orderBy('month', 'desc')->paginate($limit, ['*'], 'page', $page);
            return ResponseFormatter::success($data, 'Safety performance data retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'month'  => 'required|date_format:Y-m',
                'aifr'   => 'required|numeric|min:0',
                'ainfr'  => 'required|numeric|min:0',
                'lti_fr' => 'required|numeric|min:0',
                'lti_sr' => 'required|numeric|min:0',
            ]);

            $input = $request->only(['aifr', 'ainfr', 'lti_fr', 'lti_sr']);
            $input['user_id'] = auth()->id();
            $input['month']   = $request->input('month') . '-01';
            $input['visible'] = 'true';

            $record = SafetyPerformance::create($input);

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'create',
                resource: 'SafetyPerformance', resourceId: $record->id,
                description: "Membuat safety performance bulan " . date('M Y', strtotime($record->month)),
                newData: $record->toArray(), request: $request,
            );

            return ResponseFormatter::success($record, 'Safety performance created', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $record = SafetyPerformance::findOrFail($id);
            $request->validate([
                'month'  => 'required|date_format:Y-m',
                'aifr'   => 'required|numeric|min:0',
                'ainfr'  => 'required|numeric|min:0',
                'lti_fr' => 'required|numeric|min:0',
                'lti_sr' => 'required|numeric|min:0',
            ]);

            $oldData = $record->toArray();
            $input   = $request->only(['aifr', 'ainfr', 'lti_fr', 'lti_sr']);
            $input['month'] = $request->input('month') . '-01';
            $record->update($input);

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'update',
                resource: 'SafetyPerformance', resourceId: $record->id,
                description: "Update safety performance bulan " . date('M Y', strtotime($record->month)),
                oldData: $oldData, newData: $record->fresh()->toArray(), request: $request,
            );

            return ResponseFormatter::success($record->fresh(), 'Safety performance updated');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $record  = SafetyPerformance::findOrFail($id);
            $oldData = $record->toArray();
            $record->delete();

            UserActivityLogService::log(
                module: 'dashboard_portal', action: 'delete',
                resource: 'SafetyPerformance', resourceId: (string) $id,
                description: "Hapus safety performance", oldData: $oldData, request: $request,
            );

            return ResponseFormatter::success(null, 'Safety performance deleted');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function bulkDestroy(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array']);
            $count = SafetyPerformance::whereIn('id', $request->input('ids'))->delete();
            return ResponseFormatter::success(['deleted' => $count], "{$count} records deleted");
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    public function toggleVisible(Request $request, $id)
    {
        try {
            $record          = SafetyPerformance::findOrFail($id);
            $record->visible = $record->visible === 'true' ? 'false' : 'true';
            $record->save();
            return ResponseFormatter::success($record, 'Visibility toggled');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/dashboard/safety-performance/stats
     * Line chart data: per bulan, per metric (AIFR, AINFR, LTI FR, LTI SR)
     */
    public function stats(Request $request)
    {
        try {
            $year = $request->query('year', date('Y'));

            // Ambil 5 record terbaru seperti aimsv2
            $rows = SafetyPerformance::where('visible', 'true')
                ->orderBy('created_at', 'DESC')
                ->take(5)
                ->get();

            // Sumbu X = nama metric
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

            // Latest month values
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
            ], 'Safety performance stats retrieved');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error: ' . $e->getMessage(), 500);
        }
    }
}
