<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsChecklist;

class CSMSDashboardApiController extends CSMSBaseApiController
{
    public function stats(Request $request)
    {
        // ── Filter ────────────────────────────────────────────────────────────
        $thisYear = (int) date('Y');
        $lastYear = $thisYear - 1;

        $year        = $request->query('year', (string) $thisYear);
        $year        = preg_replace('/[^0-9,]/', '', (string) $year);
        if (empty($year)) $year = (string) $thisYear;

        $month       = $request->query('month', null);
        $arrayYear   = array_map('intval', explode(',', $year));
        $safeYears   = implode(',', $arrayYear);
        $monthFilter = $month ? explode(',', $month) : [];
        $monthNames  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // ── YTD summary — dari CsmsChecklist (sama persis aims lama) ─────────
        // YTD = total checklist rows untuk tahun tsb
        // complete = checklist yang point-nya POST KUALIFIKASI
        $ytd      = CsmsChecklist::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->whereNotNull('point')->where('point', '!=', '')->count();
        $complete = CsmsChecklist::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->where('point', 'POST KUALIFIKASI')
            ->count();

        // Untuk summary card juga tampilkan data Bidding (untuk context)
        $totalApproved = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_APPROVED)->count();
        $totalOnReview = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('status', [self::STATUS_ON_REVIEW_OHS, self::STATUS_ON_REVIEW_DHOHS, self::STATUS_ON_REVIEW_KTT])->count();
        $totalDraft    = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_DRAFT)->count();
        $totalBidding  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_BIDDING)->count();
        $totalPB       = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_POST_BIDDING)->count();
        $totalRenewal  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_RENEWAL)->count();

        $summary = [
            'ytd'           => $ytd,
            'percent'       => ($complete && $ytd) ? round($complete / $ytd * 100) : 0,
            'totalBidding'  => $totalBidding,
            'totalPB'       => $totalPB,
            'totalRenewal'  => $totalRenewal,
            'totalApproved' => $totalApproved,
            'totalOnReview' => $totalOnReview,
            'totalDraft'    => $totalDraft,
        ];

        // ── Detail: 3 kategori dari CsmsChecklist.point (sama persis aims lama)
        $manualCategory = [
            ['name' => 'Bidding',       'slug' => 'BIDDING PROCESS'],
            ['name' => 'Extension',     'slug' => 'PERPANJANGAN SERTIFIKASI CSMS'],
            ['name' => 'Qualification', 'slug' => 'POST KUALIFIKASI'],
        ];

        $detail = [];
        foreach ($manualCategory as $c) {
            $dataThisYear = CsmsChecklist::whereRaw("YEAR(created_at) IN ({$thisYear})")
                ->where('point', $c['slug'])->count();
            $dataLastYear = CsmsChecklist::whereYear('created_at', $lastYear)
                ->where('point', $c['slug'])->count();

            $detail[] = [
                'name'              => $c['name'],
                'this_year'         => $dataThisYear,
                'last_year'         => $dataLastYear,
                'this_year_percent' => ($dataThisYear && $ytd) ? round($dataThisYear / $ytd * 100) : 0,
                'this_year_mark'    => $dataThisYear > $dataLastYear ? 'up' : 'down',
            ];
        }

        // ── Monthly: dari CsmsChecklist (sama persis aims lama) ───────────────
        $monthly = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                if (!empty($monthFilter) && !in_array($mn, $monthFilter)) continue;
                $count = CsmsChecklist::whereYear('created_at', $yr)
                    ->whereMonth('created_at', $i)
                    ->count();
                $monthly[] = ['month' => $mn, 'count' => $count];
            }
        }

        // ── Category: group by point dari CsmsChecklist (sama persis aims lama)
        $categoryGroups = CsmsChecklist::groupBy('point')
            ->whereNotNull('point')
            ->where('point', '!=', '')
            ->get([\DB::raw('point as name')]);

        $category = [];
        foreach ($categoryGroups as $cat) {
            $countCat = CsmsChecklist::whereRaw("YEAR(created_at) IN ({$safeYears})")
                ->where('point', $cat->name)
                ->count();
            $category[] = [
                'name'  => ucfirst(strtolower($cat->name)),
                'count' => $countCat,
                'value' => ($countCat && $ytd) ? round($countCat / $ytd * 100) : 0,
            ];
        }

        // ── Progress: 4 donut dari Bidding valid/expired (sama persis aims lama)
        $valid   = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])
            ->where('status', self::STATUS_APPROVED)->count();
        $expired = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])
            ->where('status', self::STATUS_INACTIVE)->count();
        $all     = $valid + $expired;
        $vPct    = $all > 0 ? round($valid   / $all * 100) : 0;
        $ePct    = $all > 0 ? round($expired / $all * 100) : 0;

        $progress = [
            ['name' => 'Pra Qualification Valid',         'actual' => $vPct, 'target' => max(0, 100 - $vPct), 'count' => $valid],
            ['name' => 'Pra Qualification Expired',       'actual' => $ePct, 'target' => max(0, 100 - $ePct), 'count' => $expired],
            ['name' => 'Certification Extension Valid',   'actual' => $vPct, 'target' => max(0, 100 - $vPct), 'count' => $valid],
            ['name' => 'Certification Extension Expired', 'actual' => $ePct, 'target' => max(0, 100 - $ePct), 'count' => $expired],
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

