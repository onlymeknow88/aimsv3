<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\PtwDocument;

class DocumentSystemWidgetController extends Controller
{
    /**
     * GET /api/portal/document-system/stats
     *
     * Query params:
     *   - years     : comma-separated years, e.g. "2025,2026"  (default: current year)
     *   - months    : comma-separated months 1-12, e.g. "1,2,3" (optional)
     *   - companies : comma-separated company IDs (optional)
     */
    public function stats(Request $request)
    {
        $now = Carbon::now();

        // ── Parse filter params ───────────────────────────────────────────────
        $years = $request->filled('years')
            ? array_filter(array_map('intval', explode(',', $request->query('years'))))
            : [$now->year];

        $months = $request->filled('months')
            ? array_filter(array_map('intval', explode(',', $request->query('months'))))
            : [];

        $companyIds = $request->filled('companies')
            ? array_filter(array_map('intval', explode(',', $request->query('companies'))))
            : [];

        // ── Base query builders ───────────────────────────────────────────────
        $docQuery = fn () => $this->applyFilters(Document::query(), $years, $months, $companyIds, 'doc_created');
        $jsaQuery = fn () => $this->applyFilters(JsaDocument::query(), $years, $months, $companyIds, 'doc_created');
        $ptwQuery = fn () => $this->applyFilters(PtwDocument::query(), $years, $months, $companyIds, 'doc_created');

        // ── Category breakdown (Active status = '5') ─────────────────────────
        $categoryBreakdown = [
            ['name' => 'Document',           'value' => (clone $docQuery())->where('status', '5')->count()],
            ['name' => 'Job Safety Analysis', 'value' => (clone $jsaQuery())->where('status', '5')->count()],
            ['name' => 'Permit to Work',      'value' => (clone $ptwQuery())->where('status', '5')->count()],
        ];

        // ── Donut: Active vs Obsolete (all three doc types combined) ─────────
        $totalActive   = array_sum(array_column($categoryBreakdown, 'value'));
        $totalObsolete = (clone $docQuery())->where('status', '6')->count()
                       + (clone $docQuery())->where('status', '8')->count()
                       + (clone $jsaQuery())->where('status', '6')->count()
                       + (clone $ptwQuery())->where('status', '6')->count();
        $totalAll      = $totalActive + $totalObsolete;

        $activePercent   = $totalAll > 0 ? round(($totalActive   / $totalAll) * 100) : 0;
        $obsoletePercent = $totalAll > 0 ? round(($totalObsolete / $totalAll) * 100) : 0;

        // ── YTD target vs actual ──────────────────────────────────────────────
        // "target" = all non-draft docs created in the period
        // "actual" = active docs (status 5) in the period
        $ytdTarget = (clone $docQuery())->whereNotIn('status', ['1'])->count()
                   + (clone $jsaQuery())->whereNotIn('status', ['1'])->count()
                   + (clone $ptwQuery())->whereNotIn('status', ['1'])->count();
        $ytdActual = $totalActive;

        // ── Monthly comparison ────────────────────────────────────────────────
        $thisMonth     = $now->month;
        $thisMonthYear = $now->year;
        $lastMonth     = $now->copy()->subMonth()->month;
        $lastMonthYear = $now->copy()->subMonth()->year;

        $thisMonthDone   = $this->countActiveInMonth($thisMonth, $thisMonthYear, $companyIds);
        $thisMonthTarget = $this->countNonDraftInMonth($thisMonth, $thisMonthYear, $companyIds);
        $thisMonthPct    = $thisMonthTarget > 0 ? round(($thisMonthDone / $thisMonthTarget) * 100) : 0;

        $pastMonthDone   = $this->countActiveInMonth($lastMonth, $lastMonthYear, $companyIds);
        $pastMonthTarget = $this->countNonDraftInMonth($lastMonth, $lastMonthYear, $companyIds);
        $pastMonthPct    = $pastMonthTarget > 0 ? round(($pastMonthDone / $pastMonthTarget) * 100) : 0;

        $monthMark = $thisMonthDone >= $pastMonthDone ? 'up' : 'down';

        // ── Yearly comparison ─────────────────────────────────────────────────
        $thisYear = $now->year;
        $lastYear = $now->year - 1;

        $thisYearDone   = $this->countActiveInYear($thisYear, $companyIds);
        $thisYearTarget = $this->countNonDraftInYear($thisYear, $companyIds);
        $thisYearPct    = $thisYearTarget > 0 ? round(($thisYearDone / $thisYearTarget) * 100) : 0;

        $pastYearDone   = $this->countActiveInYear($lastYear, $companyIds);
        $pastYearTarget = $this->countNonDraftInYear($lastYear, $companyIds);
        $pastYearPct    = $pastYearTarget > 0 ? round(($pastYearDone / $pastYearTarget) * 100) : 0;

        $yearMark = $thisYearDone >= $pastYearDone ? 'up' : 'down';

        return ResponseFormatter::success([
            'ytd' => [
                'target' => $ytdTarget,
                'actual' => $ytdActual,
            ],
            'category_breakdown' => $categoryBreakdown,
            'donut' => [
                'active'   => ['target' => 30, 'actual' => $activePercent],
                'obsolete' => ['target' => 80, 'actual' => $obsoletePercent],
            ],
            'summary_monthly' => [
                'this_month_done'    => $thisMonthDone,
                'this_month_target'  => $thisMonthTarget,
                'this_month_percent' => $thisMonthPct,
                'this_month_mark'    => $monthMark,
                'past_month_done'    => $pastMonthDone,
                'past_month_target'  => $pastMonthTarget,
                'past_month_percent' => $pastMonthPct,
            ],
            'summary_yearly' => [
                'this_year_done'    => $thisYearDone,
                'this_year_target'  => $thisYearTarget,
                'this_year_percent' => $thisYearPct,
                'this_year_mark'    => $yearMark,
                'past_year_done'    => $pastYearDone,
                'past_year_target'  => $pastYearTarget,
                'past_year_percent' => $pastYearPct,
            ],
        ], 'Document system metrics retrieved successfully');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Apply year/month/company filters to a query builder.
     */
    private function applyFilters($query, array $years, array $months, array $companyIds, string $dateCol)
    {
        $query->whereYear($dateCol, $years[0]); // primary year filter

        if (count($years) > 1) {
            // If multiple years, use whereIn on the year part
            $query->where(function ($q) use ($years, $dateCol) {
                foreach ($years as $y) {
                    $q->orWhereYear($dateCol, $y);
                }
            });
        }

        if (!empty($months)) {
            $query->whereIn(\Illuminate\Support\Facades\DB::raw("MONTH($dateCol)"), $months);
        }

        if (!empty($companyIds)) {
            $query->whereIn('company_id', $companyIds);
        }

        return $query;
    }

    private function countActiveInMonth(int $month, int $year, array $companyIds): int
    {
        $count = 0;
        foreach ([Document::class, JsaDocument::class, PtwDocument::class] as $model) {
            $q = $model::query()
                ->where('status', '5')
                ->whereMonth('doc_created', $month)
                ->whereYear('doc_created', $year);
            if (!empty($companyIds)) {
                $q->whereIn('company_id', $companyIds);
            }
            $count += $q->count();
        }
        return $count;
    }

    private function countNonDraftInMonth(int $month, int $year, array $companyIds): int
    {
        $count = 0;
        foreach ([Document::class, JsaDocument::class, PtwDocument::class] as $model) {
            $q = $model::query()
                ->whereNotIn('status', ['1'])
                ->whereMonth('doc_created', $month)
                ->whereYear('doc_created', $year);
            if (!empty($companyIds)) {
                $q->whereIn('company_id', $companyIds);
            }
            $count += $q->count();
        }
        return $count;
    }

    private function countActiveInYear(int $year, array $companyIds): int
    {
        $count = 0;
        foreach ([Document::class, JsaDocument::class, PtwDocument::class] as $model) {
            $q = $model::query()
                ->where('status', '5')
                ->whereYear('doc_created', $year);
            if (!empty($companyIds)) {
                $q->whereIn('company_id', $companyIds);
            }
            $count += $q->count();
        }
        return $count;
    }

    private function countNonDraftInYear(int $year, array $companyIds): int
    {
        $count = 0;
        foreach ([Document::class, JsaDocument::class, PtwDocument::class] as $model) {
            $q = $model::query()
                ->whereNotIn('status', ['1'])
                ->whereYear('doc_created', $year);
            if (!empty($companyIds)) {
                $q->whereIn('company_id', $companyIds);
            }
            $count += $q->count();
        }
        return $count;
    }
}