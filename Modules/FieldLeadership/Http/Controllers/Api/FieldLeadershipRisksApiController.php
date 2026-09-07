<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\FieldLeadership\App\Traits\AuthorizesFlActions;

class FieldLeadershipRisksApiController extends Controller
{
    use AuthorizesFlActions;
    /**
     * GET /api/field-leadership/risks
     */
    public function index(Request $request)
    {
        $search   = $request->query('search', '');
        $page     = max(1, (int) $request->query('page', 1));
        $limit    = min(100, max(1, (int) $request->query('limit', 10)));
        $status   = $request->query('status', '');
        $dateFrom = $request->query('date_from', '');
        $dateTo   = $request->query('date_to', '');

        $query = DB::table('field_leadership_risks as r')
            ->leftJoin('field_leaderships as fl',            'r.fl_id',       '=', 'fl.id')
            ->leftJoin('field_leadership_categories as cat', 'r.category_id', '=', 'cat.id')
            ->leftJoin('field_leadership_kta_and_ttas as k', 'r.type_id',     '=', 'k.id')
            ->leftJoin('field_leadership_potency_and_consequnces as p', 'r.potency_id', '=', 'p.id')
            ->leftJoin('companies as c', 'fl.company_id', '=', 'c.id')
            ->select([
                'r.*',
                DB::raw('COALESCE(cat.name, \'—\') as category_name'),
                DB::raw('COALESCE(k.name, \'—\') as kta_name'),
                DB::raw('COALESCE(p.name, \'—\') as potency_name'),
                'fl.date as fl_date',
                'fl.type as fl_type',
                DB::raw('COALESCE(c.company_name, fl.detail_company) as company_name'),
            ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('r.risk_condition', 'like', "%{$search}%")
                  ->orWhere('r.repair_action', 'like', "%{$search}%")
                  ->orWhere('cat.name', 'like', "%{$search}%");
            });
        }

        if ($status)   $query->where('r.status', $status);
        if ($dateFrom) $query->where('r.due_date', '>=', $dateFrom);
        if ($dateTo)   $query->where('r.due_date', '<=', $dateTo);

        $query->orderBy('r.due_date', 'asc');

        $total    = $query->count();
        $lastPage = max(1, (int) ceil($total / $limit));
        $offset   = ($page - 1) * $limit;
        $items    = $query->offset($offset)->limit($limit)->get();

        return ResponseFormatter::success([
            'data'         => $items,
            'current_page' => $page,
            'last_page'    => $lastPage,
            'total'        => $total,
            'per_page'     => $limit,
        ], 'Risks retrieved successfully');
    }

    /**
     * GET /api/field-leadership/risks/{id}
     */
    public function show(string $id)
    {
        $risk = DB::table('field_leadership_risks as r')
            ->leftJoin('field_leadership_categories as cat', 'r.category_id', '=', 'cat.id')
            ->leftJoin('field_leadership_kta_and_ttas as k', 'r.type_id', '=', 'k.id')
            ->leftJoin('field_leadership_potency_and_consequnces as p', 'r.potency_id', '=', 'p.id')
            ->leftJoin('field_leaderships as fl', 'r.fl_id', '=', 'fl.id')
            ->where('r.id', $id)
            ->select([
                'r.*',
                DB::raw('COALESCE(cat.name, \'—\') as category_name'),
                DB::raw('COALESCE(k.name, \'—\') as kta_name'),
                DB::raw('COALESCE(p.name, \'—\') as potency_name'),
                'fl.date as fl_date', 'fl.type as fl_type',
            ])
            ->first();

        if (!$risk) {
            return ResponseFormatter::error('Risk not found', 404);
        }

        $files = DB::table('field_leadership_risk_files')
            ->where('fl_risk_id', $id)->get();

        return ResponseFormatter::success([
            'risk'  => $risk,
            'files' => $files,
        ], 'Risk retrieved successfully');
    }

    /**
     * PUT /api/field-leadership/risks/{id}
     * Update status / supervisor / type_action
     */
    public function update(Request $request, string $id)
    {
        $risk = DB::table('field_leadership_risks')->where('id', $id)->first();
        if (!$risk) {
            return ResponseFormatter::error('Risk not found', 404);
        }

        // Otorisasi: maker/PJA dokumen induk atau admin modul
        $parent = $risk->fl_id ? DB::table('field_leaderships')->where('id', $risk->fl_id)->first() : null;
        if (!$parent || !$this->flCanManage($parent)) {
            return ResponseFormatter::error('Anda tidak berwenang mengubah risk ini.', 403);
        }

        // Status dibatasi ke daftar yang dikenal sistem
        $validated = $request->validate([
            'status'      => 'sometimes|in:' . implode(',', \Modules\FieldLeadership\App\Support\FieldLeadershipStatus::ALL),
            'supervisor'  => 'nullable|string|max:255',
            'type_action' => 'nullable|string|max:255',
            'due_date'    => 'sometimes|date',
        ]);

        DB::table('field_leadership_risks')->where('id', $id)->update(array_merge(
            $validated,
            ['updated_at' => now()]
        ));

        return ResponseFormatter::success(['id' => $id], 'Risk updated successfully');
    }
}
