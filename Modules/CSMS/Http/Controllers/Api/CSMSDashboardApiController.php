<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsPjo;

class CSMSDashboardApiController extends CSMSBaseApiController
{
    public function stats(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $year = preg_replace('/[^0-9,]/', '', (string) $year);
        if (empty($year)) $year = (string) date('Y');

        $month       = $request->query('month', null);
        $arrayYear   = explode(',', $year);
        $safeYears   = implode(',', array_map('intval', $arrayYear));
        $monthFilter = $month ? explode(',', $month) : [];
        $monthNames  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // ── Donut: Persentase Evaluasi PJO ────────────────────────────────────
        $valid = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])
            ->where('status', self::STATUS_APPROVED)
            ->count();

        $expires = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")
            ->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL, self::CRITERIA_INACTIVE])
            ->where('status', self::STATUS_INACTIVE)
            ->count();

        $biddingAll   = $valid + $expires;
        $validPercent = $biddingAll > 0 ? round($valid   / $biddingAll * 100) : 0;
        $expiredPct   = $biddingAll > 0 ? round($expires / $biddingAll * 100) : 0;

        $donutPJO = [
            'name'   => 'Status Sertifikat',
            'actual' => $validPercent,
            'target' => $expiredPct,
        ];

        // ── Monthly series ────────────────────────────────────────────────────
        $evaluatedPJO         = [];
        $approvedKTT          = [];
        $postBiddingChart     = [];
        $renewalChart         = [];
        $biddingValidChart    = [];
        $riskLevelChart       = [];
        $picaCountChart       = [];
        $contractorClassChart = [];
        $spvStatsChart        = [];

        foreach ($arrayYear as $yr) {
            $yr = (int) $yr;
            for ($i = 1; $i <= 12; $i++) {
                $mn = $monthNames[$i - 1];
                if (!empty($monthFilter) && !in_array($mn, $monthFilter)) continue;

                // evaluatedPJO
                $pjoEval    = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', 'On Review KTT')->where('requested', 'Requested KTT')->count();
                $pjoNotEval = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', 'On Review Evaluator')->where('requested', 'Requested Evaluator')->count();
                $evaluatedPJO[] = ['month' => $mn, 'label' => 'Evaluated', 'label2' => 'Not Evaluated', 'count' => $pjoEval, 'count2' => $pjoNotEval];

                // approvedKTT
                $kttApproved    = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->count();
                $kttNotApproved = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', 'On Review KTT')->where('requested', 'Requested KTT')->count();
                $approvedKTT[] = ['month' => $mn, 'label' => 'Approved', 'label2' => 'Not Approved', 'count' => $kttApproved, 'count2' => $kttNotApproved];

                // postBidding
                $pbApproved = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('criteria', self::CRITERIA_POST_BIDDING)->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->count();
                $pbOngoing  = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('criteria', self::CRITERIA_POST_BIDDING)->whereIn('requested', ['Requested OHS', 'Requested D/H OHS', 'Requested Evaluator'])->count();
                $postBiddingChart[] = ['month' => $mn, 'label' => 'Approved', 'label2' => 'Not Approved', 'count' => $pbApproved, 'count2' => $pbOngoing];

                // renewal
                $rnApproved = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('criteria', self::CRITERIA_RENEWAL)->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->count();
                $rnOngoing  = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('criteria', self::CRITERIA_RENEWAL)->whereIn('requested', ['Requested OHS', 'Requested D/H OHS', 'Requested Evaluator'])->count();
                $renewalChart[] = ['month' => $mn, 'label' => 'Approved', 'label2' => 'Not Approved', 'count' => $rnApproved, 'count2' => $rnOngoing];

                // biddingValid (Status Ijin Perusahaan)
                $permitValid   = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->count();
                $permitExpired = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL, self::CRITERIA_INACTIVE])->where('status', self::STATUS_INACTIVE)->count();
                $biddingValidChart[] = ['month' => $mn, 'label' => 'Izin Valid', 'label2' => 'Izin Expired', 'count' => $permitValid, 'count2' => $permitExpired];

                // riskLevel (Tingkat Resiko)
                $riskLow  = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('risk_category', 'Rendah')->where('status', self::STATUS_APPROVED)->count();
                $riskMid  = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('risk_category', 'Menengah')->where('status', self::STATUS_APPROVED)->count();
                $riskHigh = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('risk_category', 'Tinggi')->where('status', self::STATUS_APPROVED)->count();
                $riskLevelChart[] = ['month' => $mn, 'label' => 'Rendah', 'label2' => 'Menengah', 'label3' => 'Tinggi', 'count' => $riskLow, 'count2' => $riskMid, 'count3' => $riskHigh];

                // picaCount
                $picaOpen        = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('requested', self::STATUS_APPROVED)->where('status', 'Open')->count();
                $picaOutstanding = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', 'On Review Evaluator')->where('requested', 'Requested Evaluator')->count();
                $picaClosed      = CsmsPjo::whereYear('created_at', $yr)->whereMonth('created_at', $i)->where('status', self::STATUS_APPROVED)->count();
                $picaCountChart[] = ['month' => $mn, 'label' => 'Open', 'label2' => 'Outstanding', 'label3' => 'Closed', 'count' => $picaOpen, 'count2' => $picaOutstanding, 'count3' => $picaClosed];

                // contractorClassification
                $cMain   = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->where('classification', 'Kontraktor Utama')->count();
                $cDirect = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('classification', 'Kontraktor Langsung')->count();
                $cSingle = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->where('classification', 'Subkontraktor Tunggal')->count();
                $cJoint  = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->where('requested', self::STATUS_APPROVED)->where('classification', 'Kontraktor Bersama')->count();
                $contractorClassChart[] = ['month' => $mn, 'label' => 'Kontraktor Utama', 'label2' => 'Kontraktor Langsung', 'label3' => 'Subkontraktor Tunggal', 'label4' => 'Kontraktor Bersama', 'count' => $cMain, 'count2' => $cDirect, 'count3' => $cSingle, 'count4' => $cJoint];

                // spvStats (Kompetensi PJO)
                $spvRows = Bidding::whereYear('created_at', $yr)->whereMonth('created_at', $i)->whereIn('criteria', [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])->where('status', self::STATUS_APPROVED)->whereNotNull('questionnaire')->pluck('questionnaire');
                $pop = 0; $pom = 0; $pou = 0;
                foreach ($spvRows as $qJson) {
                    $q   = is_string($qJson) ? json_decode($qJson, true) : (array) $qJson;
                    $pop += (int) ($q['number_of_spv_pop'] ?? 0);
                    $pom += (int) ($q['number_of_spv_pom'] ?? 0);
                    $pou += (int) ($q['number_of_spv_pou'] ?? 0);
                }
                $spvStatsChart[] = ['month' => $mn, 'label' => 'POP', 'label2' => 'POM', 'label3' => 'POU', 'count' => $pop, 'count2' => $pom, 'count3' => $pou];
            }
        }

        // ── Summary counts ────────────────────────────────────────────────────
        $totalBidding  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_BIDDING)->count();
        $totalPB       = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_POST_BIDDING)->count();
        $totalRenewal  = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('criteria', self::CRITERIA_RENEWAL)->count();
        $totalApproved = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_APPROVED)->count();
        $totalOnReview = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->whereIn('status', [self::STATUS_ON_REVIEW_OHS, self::STATUS_ON_REVIEW_DHOHS, self::STATUS_ON_REVIEW_KTT])->count();
        $totalDraft    = Bidding::whereRaw("YEAR(created_at) IN ({$safeYears})")->where('status', self::STATUS_DRAFT)->count();

        $availableYears = Bidding::selectRaw('DISTINCT YEAR(created_at) as yr')
            ->whereNotNull('created_at')
            ->orderBy('yr', 'desc')
            ->pluck('yr');

        return ResponseFormatter::success([
            'summary' => [
                'totalBidding'  => $totalBidding,
                'totalPB'       => $totalPB,
                'totalRenewal'  => $totalRenewal,
                'totalApproved' => $totalApproved,
                'totalOnReview' => $totalOnReview,
                'totalDraft'    => $totalDraft,
            ],
            'donutPJO'                 => $donutPJO,
            'evaluatedPJO'             => $evaluatedPJO,
            'approvedKTT'              => $approvedKTT,
            'postBidding'              => $postBiddingChart,
            'renewal'                  => $renewalChart,
            'biddingValid'             => $biddingValidChart,
            'riskLevel'                => $riskLevelChart,
            'picaCount'                => $picaCountChart,
            'contractorClassification' => $contractorClassChart,
            'spvStats'                 => $spvStatsChart,
            'availableYears'           => $availableYears,
        ], 'Dashboard stats retrieved successfully');
    }
}