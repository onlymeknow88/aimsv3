<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FieldLeadershipMasterApiController extends Controller
{
    // ── Dropdown helpers for forms ───────────────────────────────────────────

    /**
     * GET /api/field-leadership/masters/departments
     * Optional: ?company_id=
     */
    public function getDepartments(Request $request)
    {
        // departments table has no company_id — return all, optionally filtered by name
        $query = DB::table('departments')->select('id', 'name');
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }
        return ResponseFormatter::success($query->orderBy('name')->get(), 'Departments retrieved');
    }

    /**
     * GET /api/field-leadership/masters/sections
     * Optional: ?department_id=
     */
    public function getSections(Request $request)
    {
        $query = DB::table('sections')->select('id', 'name', 'department_id');
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->query('department_id'));
        }
        return ResponseFormatter::success($query->orderBy('name')->get(), 'Sections retrieved');
    }


    /**
     * GET /api/field-leadership/masters/locations
     * Optional: ?section_id=
     */
    public function getLocations(Request $request)
    {
        // area_locations ↔ sections via pivot: section_area_locations
        $query = DB::table('area_locations as al')->select('al.id', 'al.name');
        if ($request->filled('section_id')) {
            $query->join('section_area_locations as sal', 'sal.area_location_id', '=', 'al.id')
                  ->where('sal.section_id', $request->query('section_id'));
        }
        return ResponseFormatter::success($query->orderBy('al.name')->get(), 'Locations retrieved');
    }

    /**
     * GET /api/field-leadership/masters/pja
     * Returns area managers (Penanggung Jawab Area).
     * Optional: ?section_id=
     */
    public function getPja(Request $request)
    {
        // area_managers ↔ sections via pivot: section_area_managers
        $query = DB::table('area_managers as am')
            ->leftJoin('users as u', 'am.user_id', '=', 'u.id')
            ->leftJoin('area_manager_locations as aml', 'aml.area_manager_id', '=', 'am.id')
            ->leftJoin('area_locations as al', 'al.id', '=', 'aml.area_location_id')
            ->select(
                'am.id',
                DB::raw("COALESCE(u.name, '—') as name"),
                'am.user_id',
                DB::raw("GROUP_CONCAT(al.name ORDER BY al.name SEPARATOR ', ') as area_name")
            )
            ->groupBy('am.id', 'u.name', 'am.user_id');
        if ($request->filled('section_id')) {
            $query->join('section_area_managers as sam', 'sam.area_manager_id', '=', 'am.id')
                  ->where('sam.section_id', $request->query('section_id'));
        }
        return ResponseFormatter::success($query->orderBy('u.name')->get(), 'PJA retrieved');
    }

    // ── Categories ────────────────────────────────────────────────────────────

    public function getCategories()
    {
        $data = DB::table('field_leadership_categories')->orderBy('name')->get();
        return ResponseFormatter::success($data, 'Categories retrieved');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $id = (string) Str::uuid();
        DB::table('field_leadership_categories')->insert([
            'id' => $id, 'name' => $validated['name'],
            'created_at' => now(), 'updated_at' => now(),
        ]);
        return ResponseFormatter::success(['id' => $id], 'Category created', 201);
    }

    public function updateCategory(Request $request, string $id)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $updated = DB::table('field_leadership_categories')->where('id', $id)
            ->update(['name' => $validated['name'], 'updated_at' => now()]);
        if (!$updated) return ResponseFormatter::error('Category not found', 404);
        return ResponseFormatter::success(['id' => $id], 'Category updated');
    }

    public function destroyCategory(string $id)
    {
        DB::table('field_leadership_categories')->where('id', $id)->delete();
        return ResponseFormatter::success(null, 'Category deleted');
    }

    // ── KTA & TTA ─────────────────────────────────────────────────────────────

    public function getKtaTta(Request $request)
    {
        $query = DB::table('field_leadership_kta_and_ttas')->orderBy('type')->orderBy('name');
        if ($request->filled('type')) $query->where('type', $request->query('type'));
        return ResponseFormatter::success($query->get(), 'KTA & TTA retrieved');
    }

    public function storeKtaTta(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|in:Kondisi Tidak Aman,Tindakan Tidak Aman',
        ]);
        $id = (string) Str::uuid();
        DB::table('field_leadership_kta_and_ttas')->insert(array_merge(
            $validated, ['id' => $id, 'created_at' => now(), 'updated_at' => now()]
        ));
        return ResponseFormatter::success(['id' => $id], 'KTA/TTA created', 201);
    }

    public function updateKtaTta(Request $request, string $id)
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:Kondisi Tidak Aman,Tindakan Tidak Aman',
        ]);
        $updated = DB::table('field_leadership_kta_and_ttas')->where('id', $id)
            ->update(array_merge($validated, ['updated_at' => now()]));
        if (!$updated) return ResponseFormatter::error('KTA/TTA not found', 404);
        return ResponseFormatter::success(['id' => $id], 'KTA/TTA updated');
    }

    public function destroyKtaTta(string $id)
    {
        DB::table('field_leadership_kta_and_ttas')->where('id', $id)->delete();
        return ResponseFormatter::success(null, 'KTA/TTA deleted');
    }

    // ── Potency & Consequences ────────────────────────────────────────────────

    public function getPotency()
    {
        $data = DB::table('field_leadership_potency_and_consequnces')->orderBy('code')->get();
        return ResponseFormatter::success($data, 'Potency & consequences retrieved');
    }

    public function storePotency(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
        ]);
        $id = (string) Str::uuid();
        DB::table('field_leadership_potency_and_consequnces')->insert(array_merge(
            $validated, ['id' => $id, 'created_at' => now(), 'updated_at' => now()]
        ));
        return ResponseFormatter::success(['id' => $id], 'Potency created', 201);
    }

    public function updatePotency(Request $request, string $id)
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|max:50',
            'name' => 'sometimes|string|max:255',
        ]);
        $updated = DB::table('field_leadership_potency_and_consequnces')->where('id', $id)
            ->update(array_merge($validated, ['updated_at' => now()]));
        if (!$updated) return ResponseFormatter::error('Potency not found', 404);
        return ResponseFormatter::success(['id' => $id], 'Potency updated');
    }

    public function destroyPotency(string $id)
    {
        DB::table('field_leadership_potency_and_consequnces')->where('id', $id)->delete();
        return ResponseFormatter::success(null, 'Potency deleted');
    }

    // ── Parameters ───────────────────────────────────────────────────────────

    public function getParameters()
    {
        $params = DB::table('field_leadership_parameters')->first();
        return ResponseFormatter::success($params, 'Parameters retrieved');
    }

    public function updateParameters(Request $request)
    {
        $validated = $request->validate([
            'max_item_member'             => 'sometimes|integer|min:0',
            'max_item_positive_condition' => 'sometimes|integer|min:0',
            'max_item_risk_condition'     => 'sometimes|integer|min:0',
            'max_item_corrective_action'  => 'sometimes|integer|min:0',
        ]);

        $existing = DB::table('field_leadership_parameters')->first();
        if ($existing) {
            DB::table('field_leadership_parameters')->where('id', $existing->id)
                ->update(array_merge($validated, ['updated_at' => now()]));
        } else {
            DB::table('field_leadership_parameters')->insert(array_merge(
                $validated,
                ['id' => (string) Str::uuid(), 'created_at' => now(), 'updated_at' => now()]
            ));
        }

        return ResponseFormatter::success(null, 'Parameters updated');
    }
}
