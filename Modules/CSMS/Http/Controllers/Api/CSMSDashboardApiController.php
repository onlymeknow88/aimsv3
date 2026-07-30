<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsChecklist;
use Modules\CSMS\Entities\CsmsPjo;

class CSMSDashboardApiController extends CSMSBaseApiController
{
    public function stats(Request $request)
    {
        // ── Filter ────────────────────────────────────────────────────────────
        $thisYear = (int) date('Y');

        $year      = $request->query('year', (string) $thisYear);
        $year      = preg_replace('/[^0-9,]/', '', (string) $year);
        if (empty($year)) $year = (string) $thisYear;

        $arrayYear  = array_map('intval', explode(',', $year));
        $safeYears  = implode(',', $arrayYear);
        $monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // ── Summary KPI Cards ─────────────────────────────────────────────────
        $totalBidding  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_BIDDING)->count();
        $totalPB       = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_POST_BIDDING)->count();
        $totalRenewal  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_RENEWAL)->count();
        $totalApproved = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_APPROVED)->count();
        $totalOnReview = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('status', [self::STATUS_ON_REVIEW_OHS, self::STATUS_ON_REVIEW_DHOHS, self::STATUS_ON_REVIEW_KTT])->count();
        $totalDraft    = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_DRAFT)->count();

        $summary = [
            'totalBidding'  => $totalBidding,
            'totalPB'       => $totalPB,
            'totalRenewal'  => $totalRenewal,
            'totalApproved' => $totalApproved,
            'totalOnReview' => $totalOnReview,
            'totalDraft'    => $totalDraft,
        ];

        // ── Donut PJO — Valid vs Inactive ─────────────────────────────────────
        $pjoValid    = CsmsPjo::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_APPROVED)->count();
        $pjoInactive = CsmsPjo::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_INACTIVE)->count();
        $pjoAll      = $pjoValid + $pjoInactive;
        $donutPJO = [
            'actual' => $pjoAll > 0 ? round($pjoValid   / $pjoAll * 100) : 0,
            'target' => $pjoAll > 0 ? round($pjoInactive / $pjoAll * 100) : 0,
            'valid'  => $pjoValid,
            'inactive' => $pjoInactive,
        ];

        // ── Helper: monthly series builder ────────────────────────────────────
        // Returns array of {month, count, count2?, label, label2?}
        $monthlyBidding = function (string $criteria, string $status1, string $label1, string $status2, string $label2) use ($arrayYear, $monthNames, $safeYears) {
            $series = [];
            foreach ($arrayYear as $yr) {
                for ($i = 1; $i <= 12; $i++) {
                    $mn = $monthNames[$i - 1];
                    $c1 = Bidding::where('criteria', $criteria)
                        ->where('status', $status1)
                        ->whereYear('created_at', $yr)
                        ->whereMonth('created_at', $i)
                        ->count();
                    $c2 = Bidding::where('criteria', $criteria)
                        ->where('status', $status2)
                        ->whereYear('created_at', $yr)
                        ->whereMonth('created_at', $i)
                        ->count();
                    $series[] = [
                        'month'  => $mn,
                        'count'  => $c1,
                        'count2' => $c2,
                        'label'  => $label1,
                        'label2' => $label2,
                    ];
                }
            }
            return $series;
        };

        // ── Evaluasi PJO — Approved vs Inactive per bulan ─────────────────────
        $evaluatedPJO = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $evaluatedPJO[] = [
                    'month'  => $mn,
                    'count'  => CsmsPjo::where('status', self::STATUS_APPROVED)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => CsmsPjo::where('status', self::STATUS_INACTIVE)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Approved',
                    'label2' => 'Inactive',
                ];
            }
        }

        // ── Approved KTT — PostBidding Approved vs Renewal Approved per bulan ──
        $approvedKTT = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $approvedKTT[] = [
                    'month'  => $mn,
                    'count'  => Bidding::where('criteria', self::CRITERIA_POST_BIDDING)->where('status', self::STATUS_APPROVED)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => Bidding::where('criteria', self::CRITERIA_RENEWAL)->where('status', self::STATUS_APPROVED)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Post Bidding',
                    'label2' => 'Renewal',
                ];
            }
        }

        // ── Post Bidding — Draft vs Approved per bulan ────────────────────────
        $postBidding = $monthlyBidding(self::CRITERIA_POST_BIDDING, self::STATUS_DRAFT, 'Draft', self::STATUS_APPROVED, 'Approved');

        // ── Renewal — Draft vs Approved per bulan ─────────────────────────────
        $renewal = $monthlyBidding(self::CRITERIA_RENEWAL, self::STATUS_DRAFT, 'Draft', self::STATUS_APPROVED, 'Approved');

        // ── Bidding Valid — Active vs Expired per bulan ───────────────────────
        $biddingValid = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $biddingValid[] = [
                    'month'  => $mn,
                    'count'  => Bidding::whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => Bidding::whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_INACTIVE)->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Valid',
                    'label2' => 'Expired',
                ];
            }
        }

        // ── Risk Level — Tinggi / Menengah / Rendah per bulan ─────────────────
        $riskLevel = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $riskLevel[] = [
                    'month'  => $mn,
                    'count'  => Bidding::where('risk_category', 'Tinggi')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => Bidding::where('risk_category', 'Menengah')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count3' => Bidding::where('risk_category', 'Rendah')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Tinggi',
                    'label2' => 'Menengah',
                    'label3' => 'Rendah',
                ];
            }
        }

        // ── PICA — Open / Outstanding / Closed per bulan ─────────────────────
        $picaCount = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $picaCount[] = [
                    'month'  => $mn,
                    'count'  => DB::table('csms_picas')->where('status', 'Open')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => DB::table('csms_picas')->where('status', 'Outstanding')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count3' => DB::table('csms_picas')->where('status', 'Closed')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Open',
                    'label2' => 'Outstanding',
                    'label3' => 'Closed',
                ];
            }
        }

        // ── Contractor Classification per bulan ───────────────────────────────
        $contractorClassification = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $contractorClassification[] = [
                    'month'  => $mn,
                    'count'  => Bidding::where('classification', 'Kontraktor Utama')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => Bidding::where('classification', 'Kontraktor Langsung')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count3' => Bidding::where('classification', 'Subkontraktor Tunggal')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count4' => Bidding::where('classification', 'Kontraktor Bersama')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'Kontraktor Utama',
                    'label2' => 'Kontraktor Langsung',
                    'label3' => 'Subkontraktor Tunggal',
                    'label4' => 'Kontraktor Bersama',
                ];
            }
        }

        // ── SPV Stats — POP / POM / POU per bulan ────────────────────────────
        $spvStats = [];
        foreach ($arrayYear as $yr) {
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                $spvStats[] = [
                    'month'  => $mn,
                    'count'  => CsmsPjo::where('competence', 'POP')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count2' => CsmsPjo::where('competence', 'POM')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'count3' => CsmsPjo::where('competence', 'POU')->whereYear('created_at', $yr)->whereMonth('created_at', $i)->count(),
                    'label'  => 'POP',
                    'label2' => 'POM',
                    'label3' => 'POU',
                ];
            }
        }

        // ── Available Years ───────────────────────────────────────────────────
        $availableYears = Bidding::selectRaw('DISTINCT YEAR(created_at) as yr')
            ->whereNotNull('created_at')
            ->orderBy('yr', 'desc')
            ->pluck('yr');

        return ResponseFormatter::success([
            'summary'                  => $summary,
            'donutPJO'                 => $donutPJO,
            'evaluatedPJO'             => $evaluatedPJO,
            'approvedKTT'              => $approvedKTT,
            'postBidding'              => $postBidding,
            'renewal'                  => $renewal,
            'biddingValid'             => $biddingValid,
            'riskLevel'                => $riskLevel,
            'picaCount'                => $picaCount,
            'contractorClassification' => $contractorClassification,
            'spvStats'                 => $spvStats,
            'availableYears'           => $availableYears,
        ], 'Dashboard stats retrieved successfully');
    }

    public function statsMainDashboard(Request $request)
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
