<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Modules\CSMS\Entities\Bidding;

class CSMSDashboardApiController extends CSMSBaseApiController
{
    public function stats(Request $request)
    {
        $year      = $request->query('year', date('Y'));
        $year      = preg_replace('/[^0-9,]/', '', (string) $year);
        if (empty($year)) $year = (string) date('Y');

        $month       = $request->query('month', null);
        $arrayYear   = array_map('intval', explode(',', $year));
        $safeYears   = implode(',', $arrayYear);
        $monthFilter = $month ? explode(',', $month) : [];
        $monthNames  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $thisYear    = max($arrayYear);
        $lastYear    = $thisYear - 1;

        // ── YTD summary (migrasi: $yearly aimsv2) ─────────────────────────────
        $totalBidding  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_BIDDING)->count();
        $totalPB       = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_POST_BIDDING)->count();
        $totalRenewal  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_RENEWAL)->count();
        $totalApproved = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_APPROVED)->count();
        $totalOnReview = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('status', [self::STATUS_ON_REVIEW_OHS, self::STATUS_ON_REVIEW_DHOHS, self::STATUS_ON_REVIEW_KTT])->count();
        $totalDraft    = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_DRAFT)->count();
        $ytd           = $totalBidding + $totalPB + $totalRenewal;

        $summary = [
            'ytd'           => $ytd,
            'percent'       => $ytd > 0 ? round($totalApproved / $ytd * 100) : 0,
            'totalBidding'  => $totalBidding,
            'totalPB'       => $totalPB,
            'totalRenewal'  => $totalRenewal,
            'totalApproved' => $totalApproved,
            'totalOnReview' => $totalOnReview,
            'totalDraft'    => $totalDraft,
        ];

        // ── Detail: 3 kategori horizontal (migrasi: $detail aimsv2) ──────────
        // aimsv2 menampilkan this_year + this_year_percent + mark (up/down)
        $lyBidding = Bidding::whereYear('created_at', $lastYear)->where('criteria', self::CRITERIA_BIDDING)->count();
        $lyPB      = Bidding::whereYear('created_at', $lastYear)->where('criteria', self::CRITERIA_POST_BIDDING)->count();
        $lyRenewal = Bidding::whereYear('created_at', $lastYear)->where('criteria', self::CRITERIA_RENEWAL)->count();

        $detail = [
            [
                'name'              => 'Bidding',
                'this_year'         => $totalBidding,
                'this_year_percent' => $ytd > 0 ? round($totalBidding / $ytd * 100) : 0,
                'this_year_mark'    => $totalBidding >= $lyBidding ? 'up' : 'down',
            ],
            [
                'name'              => 'Extension',
                'this_year'         => $totalPB,
                'this_year_percent' => $ytd > 0 ? round($totalPB / $ytd * 100) : 0,
                'this_year_mark'    => $totalPB >= $lyPB ? 'up' : 'down',
            ],
            [
                'name'              => 'Qualification',
                'this_year'         => $totalRenewal,
                'this_year_percent' => $ytd > 0 ? round($totalRenewal / $ytd * 100) : 0,
                'this_year_mark'    => $totalRenewal >= $lyRenewal ? 'up' : 'down',
            ],
        ];

        // ── Monthly: total per bulan (migrasi: $monthly aimsv2) ──────────────
        $monthlyRows = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->selectRaw("YEAR(created_at) AS yr, MONTH(created_at) AS mo")
            ->get();

        $mMap = [];
        foreach ($monthlyRows as $row) {
            $mMap[$row->yr][$row->mo] = ($mMap[$row->yr][$row->mo] ?? 0) + 1;
        }

        $monthly = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                if (!empty($monthFilter) && !in_array($mn, $monthFilter)) continue;
                $monthly[] = ['month' => $mn, 'count' => $mMap[$yr][$i] ?? 0];
            }
        }

        // ── Category: % komposisi (migrasi: $categories aimsv2) ──────────────
        $grandTotal = $ytd > 0 ? $ytd : 1;
        $category   = [
            ['name' => 'Bidding',      'count' => $totalBidding, 'value' => round($totalBidding / $grandTotal * 100)],
            ['name' => 'Post Bidding', 'count' => $totalPB,      'value' => round($totalPB      / $grandTotal * 100)],
            ['name' => 'Renewal',      'count' => $totalRenewal, 'value' => round($totalRenewal / $grandTotal * 100)],
        ];

        // ── Progress: 4 donut (migrasi: $progress aimsv2) ────────────────────
        // aimsv2: pra_kualifikasi & certification pakai nilai valid/expired yang sama
        $valid   = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->count();
        $expired = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL, self::CRITERIA_INACTIVE])->where('status', self::STATUS_INACTIVE)->count();
        $all     = $valid + $expired;
        $vPct    = $all > 0 ? round($valid   / $all * 100) : 0;
        $ePct    = $all > 0 ? round($expired / $all * 100) : 0;

        $progress = [
            ['name' => 'Pra Qualification Valid',    'actual' => $vPct, 'target' => max(0, 100 - $vPct), 'count' => $valid],
            ['name' => 'Pra Qualification Expired',  'actual' => $ePct, 'target' => max(0, 100 - $ePct), 'count' => $expired],
            ['name' => 'Certification Extention Valid',   'actual' => $vPct, 'target' => max(0, 100 - $vPct), 'count' => $valid],
            ['name' => 'Certification Extention Expired', 'actual' => $ePct, 'target' => max(0, 100 - $ePct), 'count' => $expired],
        ];

        $availableYears = Bidding::selectRaw('DISTINCT YEAR(created_at) as yr')
            ->whereNotNull('created_at')
            ->orderBy('yr', 'desc')
            ->pluck('yr');

        return ResponseFormatter::success([
            'summary'        => $summary,
            'detail'         => $detail,
            'monthly'        => $monthly,
            'category'       => $category,
            'progress'       => $progress,
            'availableYears' => $availableYears,
        ], 'Dashboard stats retrieved successfully');
    }
}