<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FieldLeadershipStatsController extends Controller
{
    /**
     * GET /api/dashboard/field-leadership/stats
     *
     * Query params (semua opsional):
     *   - years     : comma-separated years, e.g. "2024"
     *   - months    : comma-separated months 1-12, e.g. "1,2,3"
     *   - companies : comma-separated company UUIDs
     */
    public function index(Request $request)
    {
        // Cek apakah tabel field_leaderships ada (modul mungkin belum di-migrate)
        if (!$this->tableExists('field_leaderships')) {
            return ResponseFormatter::success(
                $this->emptyStats(),
                'Field Leadership stats retrieved (no data)'
            );
        }

        $now = Carbon::now();

        // ── Parse filter params ───────────────────────────────────────────────
        $years = $request->filled('years')
            ? array_filter(array_map('intval', explode(',', $request->query('years'))))
            : [$now->year];

        $months = $request->filled('months')
            ? array_filter(array_map('intval', explode(',', $request->query('months'))))
            : [];

        $companyIds = $request->filled('companies')
            ? array_filter(explode(',', $request->query('companies')))
            : [];

        $primaryYear = $years[0];

        // ── Base query helper ─────────────────────────────────────────────────
        $base = fn () => $this->baseQuery($years, $months, $companyIds);

        // ── YTD: target = semua record periode, actual = status Closed ────────
        $ytdTarget = (clone $base())->count();
        $ytdActual = (clone $base())->where('status', 'Closed')->count();

        // ── Bar chart by month (Actual Closed per bulan, tahun utama) ─────────
        $monthlyCounts = (clone $base())
            ->where('status', 'Closed')
            ->whereYear('created_at', $primaryYear)
            ->selectRaw('MONTH(created_at) as month_num, COUNT(*) as total')
            ->groupBy('month_num')
            ->pluck('total', 'month_num')
            ->all();

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $barChartByMonth = [];
        foreach ($monthNames as $i => $name) {
            $m = $i + 1;
            $barChartByMonth[$name] = [
                'month'  => $m,
                'actual' => $monthlyCounts[$m] ?? 0,
            ];
        }

        // ── Bar chart by category (PTO / TTT / HR) ────────────────────────────
        $categoryTypes = [
            'Planned Task Observation',
            'Take Time Talk',
            'Hazard Report',
        ];

        $categoryCounts = (clone $base())
            ->whereIn('type', $categoryTypes)
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type')
            ->all();

        $totalCategoryCount = array_sum($categoryCounts) ?: 1;
        $barChartByCategory = array_map(function ($type) use ($categoryCounts, $totalCategoryCount) {
            $count = $categoryCounts[$type] ?? 0;
            return [
                'name'  => $type,
                'count' => $count,
                'value' => round(($count / $totalCategoryCount) * 100),
            ];
        }, $categoryTypes);

        // ── Donut charts ──────────────────────────────────────────────────────
        $targetPercent = $ytdTarget > 0 ? round(($ytdActual / $ytdTarget) * 100) : 0;
        $donutChartByTarget = [
            'target' => $ytdTarget,
            'actual' => $ytdActual,
        ];
        $donutChartByActual = [
            'target' => [
                'complete' => $targetPercent,
                'ongoing'  => 100 - $targetPercent,
            ],
            'actual' => [
                'complete' => 100 - $targetPercent,
                'ongoing'  => $targetPercent,
            ],
        ];

        // ── Monthly comparison ────────────────────────────────────────────────
        $thisMonth   = $now->month;
        $lastMonthDt = $now->copy()->subMonth();
        $lastMonth   = $lastMonthDt->month;
        $lastMonthYr = $lastMonthDt->year;

        $thisMonthDone   = $this->countClosedInMonth($thisMonth,  $now->year,   $companyIds);
        $thisMonthTarget = $this->countInMonth($thisMonth,        $now->year,   $companyIds);
        $thisMonthPct    = $thisMonthTarget > 0 ? round(($thisMonthDone / $thisMonthTarget) * 100) : 0;

        $pastMonthDone   = $this->countClosedInMonth($lastMonth,  $lastMonthYr, $companyIds);
        $pastMonthTarget = $this->countInMonth($lastMonth,        $lastMonthYr, $companyIds);
        $pastMonthPct    = $pastMonthTarget > 0 ? round(($pastMonthDone / $pastMonthTarget) * 100) : 0;

        // ── Yearly comparison ─────────────────────────────────────────────────
        $thisYear = $now->year;
        $lastYear = $now->year - 1;

        $thisYearDone   = $this->countClosedInYear($thisYear, $companyIds);
        $thisYearTarget = $this->countInYear($thisYear,       $companyIds);
        $thisYearPct    = $thisYearTarget > 0 ? round(($thisYearDone / $thisYearTarget) * 100) : 0;

        $pastYearDone   = $this->countClosedInYear($lastYear, $companyIds);
        $pastYearTarget = $this->countInYear($lastYear,       $companyIds);
        $pastYearPct    = $pastYearTarget > 0 ? round(($pastYearDone / $pastYearTarget) * 100) : 0;

        return ResponseFormatter::success([
            'ytd'                => $donutChartByTarget,
            'barChartByMonth'    => $barChartByMonth,
            'barChartByCategory' => $barChartByCategory,
            'donutChartByTarget' => $donutChartByTarget,
            'donutChartByActual' => $donutChartByActual,
            'summary_all'        => $ytdTarget,
            'summary_monthly'    => [
                'this_month_done'    => $thisMonthDone,
                'this_month_target'  => $thisMonthTarget,
                'this_month_percent' => $thisMonthPct,
                'this_month_mark'    => $thisMonthDone >= $pastMonthDone ? 'up' : 'down',
                'past_month_done'    => $pastMonthDone,
                'past_month_target'  => $pastMonthTarget,
                'past_month_percent' => $pastMonthPct,
                'past_month_mark'    => $pastMonthDone >= $thisMonthDone ? 'up' : 'down',
            ],
            'summary_yearly' => [
                'this_year_done'    => $thisYearDone,
                'this_year_target'  => $thisYearTarget,
                'this_year_percent' => $thisYearPct,
                'this_year_mark'    => $thisYearDone >= $pastYearDone ? 'up' : 'down',
                'past_year_done'    => $pastYearDone,
                'past_year_target'  => $pastYearTarget,
                'past_year_percent' => $pastYearPct,
                'past_year_mark'    => $pastYearDone >= $thisYearDone ? 'up' : 'down',
            ],
        ], 'Field Leadership stats retrieved successfully');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function tableExists(string $table): bool
    {
        try {
            return DB::getSchemaBuilder()->hasTable($table);
        } catch (\Exception $e) {
            return false;
        }
    }

    private function baseQuery(array $years, array $months, array $companyIds)
    {
        $query = DB::table('field_leaderships');

        if (count($years) === 1) {
            $query->whereYear('created_at', $years[0]);
        } else {
            $query->where(function ($q) use ($years) {
                foreach ($years as $y) {
                    $q->orWhereYear('created_at', $y);
                }
            });
        }

        if (!empty($months)) {
            $query->whereIn(DB::raw('MONTH(created_at)'), $months);
        }

        if (!empty($companyIds)) {
            $query->whereIn('company_id', $companyIds);
        }

        return $query;
    }

    private function countClosedInMonth(int $month, int $year, array $companyIds): int
    {
        $q = DB::table('field_leaderships')
            ->where('status', 'Closed')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year);
        if (!empty($companyIds)) {
            $q->whereIn('company_id', $companyIds);
        }
        return $q->count();
    }

    private function countInMonth(int $month, int $year, array $companyIds): int
    {
        $q = DB::table('field_leaderships')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year);
        if (!empty($companyIds)) {
            $q->whereIn('company_id', $companyIds);
        }
        return $q->count();
    }

    private function countClosedInYear(int $year, array $companyIds): int
    {
        $q = DB::table('field_leaderships')
            ->where('status', 'Closed')
            ->whereYear('created_at', $year);
        if (!empty($companyIds)) {
            $q->whereIn('company_id', $companyIds);
        }
        return $q->count();
    }

    private function countInYear(int $year, array $companyIds): int
    {
        $q = DB::table('field_leaderships')->whereYear('created_at', $year);
        if (!empty($companyIds)) {
            $q->whereIn('company_id', $companyIds);
        }
        return $q->count();
    }

    private function emptyStats(): array
    {
        $months   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $emptyBar = [];
        foreach ($months as $i => $name) {
            $emptyBar[$name] = ['month' => $i + 1, 'actual' => 0];
        }
        return [
            'ytd'                => ['target' => 0, 'actual' => 0],
            'barChartByMonth'    => $emptyBar,
            'barChartByCategory' => [
                ['name' => 'Planned Task Observation', 'count' => 0, 'value' => 0],
                ['name' => 'Take Time Talk',            'count' => 0, 'value' => 0],
                ['name' => 'Hazard Report',             'count' => 0, 'value' => 0],
            ],
            'donutChartByTarget' => ['target' => 0, 'actual' => 0],
            'donutChartByActual' => [
                'target' => ['complete' => 0, 'ongoing' => 100],
                'actual'  => ['complete' => 0, 'ongoing' => 100],
            ],
            'summary_all'     => 0,
            'summary_monthly' => [
                'this_month_done' => 0, 'this_month_target' => 0,
                'this_month_percent' => 0, 'this_month_mark' => 'up',
                'past_month_done' => 0, 'past_month_target' => 0,
                'past_month_percent' => 0, 'past_month_mark' => 'down',
            ],
            'summary_yearly' => [
                'this_year_done' => 0, 'this_year_target' => 0,
                'this_year_percent' => 0, 'this_year_mark' => 'up',
                'past_year_done' => 0, 'past_year_target' => 0,
                'past_year_percent' => 0, 'past_year_mark' => 'down',
            ],
        ];
    }
}