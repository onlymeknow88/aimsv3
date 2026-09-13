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

        // Parity newaims Dashboard doughnut: Completed & Issue per kategori SPIP.
        $byCategory = ['completed' => [], 'issue' => []];
        $rows = (clone $base)->with('koUnit.koSpipUnit.koSpipType.koSpipCategory:id,name')
            ->whereIn('status', [
                \Modules\Ko\Enums\KoStatus::Completed->value,
                \Modules\Ko\Enums\KoStatus::Issue->value,
            ])->get(['id', 'status', 'ko_unit_id']);
        foreach ($rows->groupBy('status') as $status => $group) {
            $key = $status === \Modules\Ko\Enums\KoStatus::Completed->value ? 'completed' : 'issue';
            foreach ($group as $proposal) {
                $name = $proposal->koUnit?->koSpipUnit?->koSpipType?->koSpipCategory?->name ?? 'Tanpa Kategori';
                $byCategory[$key][$name] = ($byCategory[$key][$name] ?? 0) + 1;
            }
        }
        $byCategory = array_map(
            fn($map) => collect($map)->map(fn($total, $name) => ['name' => $name, 'total' => $total])->values()->all(),
            $byCategory
        );

        return $this->success([
            'total'     => (clone $base)->count(),
            'by_status' => $byStatus,
            'monthly'   => $monthly,
            'by_category' => $byCategory,
        ]);
    }
}
