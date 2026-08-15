<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\UserActivityLogService;
use Illuminate\Http\Request;
use Modules\DashboardPortal\app\Models\Production;

class ProductionController extends Controller
{
    const CATEGORIES = [
        ['name' => 'Coal Shiping',   'slug' => 'coal_shiping'],
        ['name' => 'Waste Removal',  'slug' => 'waste_removal'],
        ['name' => 'Coal Mining',    'slug' => 'coal_mining'],
        ['name' => 'Coal Hauling',   'slug' => 'coal_hauling'],
        ['name' => 'Coal Barged',    'slug' => 'coal_barged'],
    ];

    /**
     * GET /api/dashboard-portal/production
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');
            $page   = $request->query('page', 1);

            $query = Production::selectRaw("
                    *,
                    DATE_FORMAT(month, '%b %Y') as month_label,
                    COALESCE(coal_shiping,0) + COALESCE(waste_removal,0) +
                    COALESCE(coal_mining,0)  + COALESCE(coal_hauling,0)  +
                    COALESCE(coal_barged,0)  as total
                ");

            if (!empty($search)) {
                $query->where('month', 'like', "%{$search}%");
            }

            $data = $query->orderBy('month', 'desc')->paginate($limit, ['*'], 'page', $page);

            return ResponseFormatter::success($data, 'Production data retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/production
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'month'         => 'required|date_format:Y-m',
                'coal_shiping'  => 'required|numeric|min:0',
                'waste_removal' => 'required|numeric|min:0',
                'coal_mining'   => 'required|numeric|min:0',
                'coal_hauling'  => 'required|numeric|min:0',
                'coal_barged'   => 'required|numeric|min:0',
            ]);

            $input = $request->only(['coal_shiping', 'waste_removal', 'coal_mining', 'coal_hauling', 'coal_barged']);
            $input['user_id'] = auth()->id();
            $input['month']   = $request->input('month') . '-01'; // YYYY-MM → YYYY-MM-01
            $input['visible'] = 'true';

            $record = Production::create($input);

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'create',
                resource: 'Production',
                resourceId: $record->id,
                description: "Membuat data production bulan " . date('M Y', strtotime($record->month)),
                newData: $record->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($record, 'Production created successfully', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error creating data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT/POST /api/dashboard-portal/production/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $record = Production::findOrFail($id);

            $request->validate([
                'month'         => 'required|date_format:Y-m',
                'coal_shiping'  => 'required|numeric|min:0',
                'waste_removal' => 'required|numeric|min:0',
                'coal_mining'   => 'required|numeric|min:0',
                'coal_hauling'  => 'required|numeric|min:0',
                'coal_barged'   => 'required|numeric|min:0',
            ]);

            $oldData = $record->toArray();
            $input   = $request->only(['coal_shiping', 'waste_removal', 'coal_mining', 'coal_hauling', 'coal_barged']);
            $input['month'] = $request->input('month') . '-01';

            $record->update($input);

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'update',
                resource: 'Production',
                resourceId: $record->id,
                description: "Memperbarui data production bulan " . date('M Y', strtotime($record->month)),
                oldData: $oldData,
                newData: $record->fresh()->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($record->fresh(), 'Production updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error updating data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE/POST /api/dashboard-portal/production/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $record  = Production::findOrFail($id);
            $oldData = $record->toArray();
            $record->delete();

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'delete',
                resource: 'Production',
                resourceId: (string) $id,
                description: "Menghapus data production bulan " . date('M Y', strtotime($oldData['month'])),
                oldData: $oldData,
                request: $request,
            );

            return ResponseFormatter::success(null, 'Production deleted successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error deleting data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/production/bulk-delete
     */
    public function bulkDestroy(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array', 'ids.*' => 'required|string']);
            $count = Production::whereIn('id', $request->input('ids'))->delete();

            return ResponseFormatter::success(['deleted' => $count], "{$count} production data berhasil dihapus");
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error bulk deleting: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/production/{id}/toggle-visible
     */
    public function toggleVisible(Request $request, $id)
    {
        try {
            $record          = Production::findOrFail($id);
            $record->visible = $record->visible === 'true' ? 'false' : 'true';
            $record->save();

            return ResponseFormatter::success($record, 'Visibility toggled successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error toggling visibility: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/production/bulk-toggle-visible
     */
    public function bulkToggleVisible(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array', 'ids.*' => 'required|string']);

            $ids        = $request->input('ids');
            $records    = Production::whereIn('id', $ids)->get();
            $trueCount  = $records->where('visible', 'true')->count();
            $newVisible = $trueCount > ($records->count() / 2) ? 'false' : 'true';

            Production::whereIn('id', $ids)->update(['visible' => $newVisible]);

            return ResponseFormatter::success(
                ['updated' => $records->count(), 'visible' => $newVisible],
                'Bulk visibility updated successfully'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error bulk toggling visibility: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/dashboard-portal/production/stats
     * GET /api/dashboard/production/stats
     * Widget stats for the main dashboard.
     */
    public function stats(Request $request)
    {
        try {
            $thisYear  = date('Y');
            $year      = $request->query('year', $thisYear);
            $thisMonth = date('m');

            // ── Summary ───────────────────────────────────────────────────────
            $ytdData = Production::where('visible', 'true')
                ->whereYear('month', $year)
                ->selectRaw("
                    COALESCE(SUM(coal_shiping),0)  as coal_shiping,
                    COALESCE(SUM(waste_removal),0) as waste_removal,
                    COALESCE(SUM(coal_mining),0)   as coal_mining,
                    COALESCE(SUM(coal_hauling),0)  as coal_hauling,
                    COALESCE(SUM(coal_barged),0)   as coal_barged
                ")
                ->first();

            $totalYtd = $ytdData
                ? ($ytdData->coal_shiping + $ytdData->waste_removal + $ytdData->coal_mining + $ytdData->coal_hauling + $ytdData->coal_barged)
                : 0;

            $mtdData = Production::where('visible', 'true')
                ->whereYear('month', $thisYear)
                ->whereMonth('month', $thisMonth)
                ->selectRaw("
                    COALESCE(SUM(coal_shiping),0)  as coal_shiping,
                    COALESCE(SUM(waste_removal),0) as waste_removal,
                    COALESCE(SUM(coal_mining),0)   as coal_mining,
                    COALESCE(SUM(coal_hauling),0)  as coal_hauling,
                    COALESCE(SUM(coal_barged),0)   as coal_barged
                ")
                ->first();

            $totalMtd = $mtdData
                ? ($mtdData->coal_shiping + $mtdData->waste_removal + $mtdData->coal_mining + $mtdData->coal_hauling + $mtdData->coal_barged)
                : 0;

            $summary = [
                'ytd'  => round($totalYtd, 2),
                'mtd'  => round($totalMtd, 2),
                'year' => (int) $year,
            ];

            // ── Monthly trend (per bulan dalam tahun yang dipilih) ───────────
            $monthly = Production::where('visible', 'true')
                ->whereYear('month', $year)
                ->selectRaw("
                    DATE_FORMAT(month, '%b') as month_label,
                    MONTH(month) as month_num,
                    COALESCE(SUM(coal_shiping),0) + COALESCE(SUM(waste_removal),0) +
                    COALESCE(SUM(coal_mining),0)  + COALESCE(SUM(coal_hauling),0)  +
                    COALESCE(SUM(coal_barged),0)  as total
                ")
                ->groupByRaw("DATE_FORMAT(month, '%b'), MONTH(month)")
                ->orderBy('month_num')
                ->get()
                ->map(fn($r) => [
                    'month' => $r->month_label,
                    'total' => (float) $r->total,
                ]);

            // ── Yearly trend (per tahun, multi-year, dengan breakdown kategori) ─
            $dataYears = Production::where('visible', 'true')
                ->selectRaw("DATE_FORMAT(month, '%Y') as year")
                ->groupByRaw("DATE_FORMAT(month, '%Y')")
                ->orderByRaw("DATE_FORMAT(month, '%Y')")
                ->pluck('year');

            $yearly = [];
            foreach ($dataYears as $y) {
                $prod = Production::where('visible', 'true')
                    ->whereYear('month', $y)
                    ->get();

                $totalYear = $prod->sum(function ($r) {
                    return ($r->coal_shiping ?? 0) + ($r->waste_removal ?? 0) +
                           ($r->coal_mining  ?? 0) + ($r->coal_hauling  ?? 0) +
                           ($r->coal_barged  ?? 0);
                });

                $yearlyCategory = collect(self::CATEGORIES)->map(fn($cat) => [
                    'name'  => $cat['name'],
                    'slug'  => $cat['slug'],
                    'total' => round((float) $prod->sum($cat['slug']), 2),
                ])->values();

                $yearly[] = [
                    'year'     => $y,
                    'total'    => round($totalYear, 2),
                    'category' => $yearlyCategory,
                ];
            }

            // ── Category breakdown (per kategori untuk tahun yang dipilih) ────
            $category = [];
            foreach (self::CATEGORIES as $cat) {
                $total = Production::where('visible', 'true')
                    ->whereYear('month', $year)
                    ->sum($cat['slug']);
                $category[] = [
                    'category' => $cat['name'],
                    'slug'     => $cat['slug'],
                    'total'    => round((float) $total, 2),
                ];
            }

            // ── MTD category breakdown (per kategori bulan ini) ───────────────
            $mtdCategory = collect(self::CATEGORIES)->map(fn($cat) => [
                'category' => $cat['name'],
                'slug'     => $cat['slug'],
                'total'    => round((float) ($mtdData?->{$cat['slug']} ?? 0), 2),
            ])->values();

            // ── Progress (MTD actual vs YTD) ──────────────────────────────────
            $actual   = $totalYtd > 0 ? round($totalMtd / $totalYtd * 100, 1) : 0;
            $progress = [
                'actual' => $actual,
                'target' => $actual > 0 ? round(100 - $actual, 1) : 0,
            ];

            return ResponseFormatter::success(
                compact('summary', 'monthly', 'yearly', 'category', 'mtdCategory', 'progress'),
                'Production stats retrieved successfully'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving production stats: ' . $e->getMessage(), 500);
        }
    }
}
