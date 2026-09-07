<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Modules\Ko\Entities\KoProposal;

/**
 * Dashboard KO. SEMUA filter tahun/bulan memakai whereYear/whereMonth
 * (parameter binding) — DILARANG whereRaw interpolasi (pola aims rawan SQLi).
 */
class KoDashboardApiController extends KoBaseApiController
{
    public function stats(Request $request)
    {
        $year = $request->integer('year', now()->year);
        $month = $request->integer('month');

        $base = KoProposal::query();
        if ($year) $base->whereYear('created_at', $year);
        if ($month) $base->whereMonth('created_at', $month);

        $byStatus = (clone $base)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthly[] = [
                'month'  => $m,
                'target' => (clone $base)->whereMonth('created_at', $m)->count(),
                'actual' => (clone $base)->whereMonth('created_at', $m)
                    ->where('status', \Modules\Ko\Enums\KoStatus::Completed->value)->count(),
            ];
        }

        return $this->success([
            'total'     => (clone $base)->count(),
            'by_status' => $byStatus,
            'monthly'   => $monthly,
        ]);
    }
}
