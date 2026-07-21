<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FieldLeadershipMasterApiController extends Controller
{
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
        if (!$updated) return ResponseFormatter::error(null, 'Category not found', 404);
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
        if (!$updated) return ResponseFormatter::error(null, 'KTA/TTA not found', 404);
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
        if (!$updated) return ResponseFormatter::error(null, 'Potency not found', 404);
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
