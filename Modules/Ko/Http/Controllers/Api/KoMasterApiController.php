<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Ko\Entities\KoBrand;
use Modules\Ko\Entities\KoSpipCategory;
use Modules\Ko\Entities\KoSpipType;
use Modules\Ko\Entities\KoSpipUnit;
use Modules\Ko\Entities\KoUnit;

/**
 * Master Library: SPIP Category/Type/Unit, Brand, Unit.
 * + Revoke flow unit (requestRevoke / verifyRevoke, parity aims RevokeRequest).
 */
class KoMasterApiController extends KoBaseApiController
{
    // ── MASTER DATA (untuk form proposal/unit) ──────────────────────────────
    public function masterData()
    {
        return $this->success([
            'companies'   => \App\Models\Company::select('id', 'company_name')->orderBy('company_name')->get(),
            'departments' => \App\Models\Department::select('id', 'name')->orderBy('name')->get(),
            'users'       => \App\Models\User::select('id', 'name', 'email')->orderBy('name')->get(),
            'units'       => \Modules\Ko\Entities\KoUnit::with('koBrand:id,name')->select('id', 'call_sign', 'identity_number', 'serial_number', 'model_unit', 'production_year', 'ko_spip_unit_id', 'ko_brand_id')->orderBy('call_sign')->get(),
            'categories'  => \Modules\Ko\Entities\KoSpipCategory::orderBy('name')->get(),
            'types'       => \Modules\Ko\Entities\KoSpipType::select('id', 'name', 'ko_spip_category_id')->orderBy('name')->get(),
            'spip_units'  => \Modules\Ko\Entities\KoSpipUnit::select('id', 'name', 'ko_spip_type_id')->orderBy('name')->get(),
            'brands'      => \Modules\Ko\Entities\KoBrand::select('id', 'name', 'ko_spip_category_id')->orderBy('name')->get(),
            'areas'       => ['Lampunut', 'Haju', 'Tuhup'],
        ]);
    }

    // ── SPIP CATEGORIES ─────────────────────────────────────────────────────
    public function indexCategories(Request $request)
    {
        $q = KoSpipCategory::orderBy('name');
        if ($s = $request->search) $q->where('name', 'like', "%{$s}%");
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name'                     => 'required|string|max:255',
            'internal_interval_year'   => 'required|integer|min:0',
            'contractor_interval_year' => 'required|integer|min:0',
        ]);
        return $this->success(KoSpipCategory::create($validated), 201);
    }

    public function updateCategory(Request $request, string $id)
    {
        $cat = KoSpipCategory::findOrFail($id);
        $cat->update($request->validate([
            'name'                     => 'sometimes|required|string|max:255',
            'internal_interval_year'   => 'sometimes|required|integer|min:0',
            'contractor_interval_year' => 'sometimes|required|integer|min:0',
        ]));
        return $this->success($cat->fresh());
    }

    public function destroyCategory(string $id)
    {
        KoSpipCategory::findOrFail($id)->delete();
        return $this->success(['message' => 'Kategori dihapus.']);
    }

    // ── SPIP TYPES ──────────────────────────────────────────────────────────
    public function indexTypes(Request $request)
    {
        $q = KoSpipType::with('koSpipCategory')->orderBy('name');
        if ($s = $request->search) $q->where('name', 'like', "%{$s}%");
        if ($cat = $request->category_id) $q->where('ko_spip_category_id', $cat);
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function storeType(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'ko_spip_category_id' => 'nullable|uuid|exists:ko_spip_categories,id',
        ]);
        return $this->success(KoSpipType::create($validated), 201);
    }

    public function updateType(Request $request, string $id)
    {
        $type = KoSpipType::findOrFail($id);
        $type->update($request->validate([
            'name'                => 'sometimes|required|string|max:255',
            'ko_spip_category_id' => 'nullable|uuid|exists:ko_spip_categories,id',
        ]));
        return $this->success($type->fresh());
    }

    public function destroyType(string $id)
    {
        KoSpipType::findOrFail($id)->delete();
        return $this->success(['message' => 'Tipe dihapus.']);
    }

    // ── SPIP UNITS ──────────────────────────────────────────────────────────
    public function indexSpipUnits(Request $request)
    {
        $q = KoSpipUnit::with('koSpipType')->orderBy('name');
        if ($s = $request->search) $q->where('name', 'like', "%{$s}%");
        if ($type = $request->type_id) $q->where('ko_spip_type_id', $type);
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function storeSpipUnit(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'ko_spip_type_id' => 'nullable|uuid|exists:ko_spip_types,id',
            'attachment_field' => 'nullable|array',
        ]);
        return $this->success(KoSpipUnit::create($validated), 201);
    }

    public function updateSpipUnit(Request $request, string $id)
    {
        $unit = KoSpipUnit::findOrFail($id);
        $unit->update($request->validate([
            'name'            => 'sometimes|required|string|max:255',
            'ko_spip_type_id' => 'nullable|uuid|exists:ko_spip_types,id',
            'attachment_field' => 'nullable|array',
        ]));
        return $this->success($unit->fresh());
    }

    public function destroySpipUnit(string $id)
    {
        KoSpipUnit::findOrFail($id)->delete();
        return $this->success(['message' => 'Unit SPIP dihapus.']);
    }

    // ── BRANDS ──────────────────────────────────────────────────────────────
    public function indexBrands(Request $request)
    {
        $q = KoBrand::with('koSpipCategory')->orderBy('name');
        if ($s = $request->search) $q->where('name', 'like', "%{$s}%");
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function storeBrand(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'nullable|string|max:255',
            'ko_spip_category_id' => 'nullable|uuid|exists:ko_spip_categories,id',
        ]);
        return $this->success(KoBrand::create($validated), 201);
    }

    public function updateBrand(Request $request, string $id)
    {
        $brand = KoBrand::findOrFail($id);
        $brand->update($request->validate([
            'name'                => 'nullable|string|max:255',
            'ko_spip_category_id' => 'nullable|uuid|exists:ko_spip_categories,id',
        ]));
        return $this->success($brand->fresh());
    }

    public function destroyBrand(string $id)
    {
        KoBrand::findOrFail($id)->delete();
        return $this->success(['message' => 'Brand dihapus (soft delete).']);
    }

    // ── UNITS ───────────────────────────────────────────────────────────────
    public function indexUnits(Request $request)
    {
        $q = KoUnit::with(['koSpipUnit.koSpipType.koSpipCategory', 'koBrand'])->orderBy('created_at', 'desc');
        if ($s = $request->search) {
            $q->where(fn($qq) => $qq->where('call_sign', 'like', "%{$s}%")
                ->orWhere('identity_number', 'like', "%{$s}%")
                ->orWhere('serial_number', 'like', "%{$s}%")
                ->orWhere('model_unit', 'like', "%{$s}%")
                ->orWhereHas('koBrand', fn($b) => $b->where('name', 'like', "%{$s}%"))
                ->orWhereHas('koSpipUnit', fn($u) => $u->where('name', 'like', "%{$s}%")));
        }
        if ($request->filled('is_revoked')) $q->where('is_revoked', (bool) $request->is_revoked);
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function showUnit(string $id)
    {
        return $this->success(KoUnit::with(['koSpipUnit.koSpipType.koSpipCategory', 'koBrand', 'koProposals'])->findOrFail($id));
    }

    public function storeUnit(Request $request)
    {
        $validated = $request->validate([
            'ko_spip_unit_id' => 'nullable|uuid|exists:ko_spip_units,id',
            'call_sign'       => [
                'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('ko_units', 'call_sign')->where(fn($q) => $q->where('is_revoked', 0)),
            ],
            'identity_number' => 'nullable|string|max:255',
            'serial_number'   => 'required|string|max:255',
            'ko_brand_id'     => 'nullable|uuid|exists:ko_brands,id',
            'model_unit'      => 'nullable|string|max:255',
            'production_year' => 'required|integer|min:1900|max:2100',
        ]);
        return $this->success(KoUnit::create($validated), 201);
    }

    public function updateUnit(Request $request, string $id)
    {
        $unit = KoUnit::findOrFail($id);
        $validated = $request->validate([
            'ko_spip_unit_id' => 'nullable|uuid|exists:ko_spip_units,id',
            'call_sign'       => [
                'sometimes', 'required', 'string', 'max:255',
                \Illuminate\Validation\Rule::unique('ko_units', 'call_sign')->where(fn($q) => $q->where('is_revoked', 0))->ignore($unit->id),
            ],
            'identity_number' => 'nullable|string|max:255',
            'serial_number'   => 'sometimes|required|string|max:255',
            'ko_brand_id'     => 'nullable|uuid|exists:ko_brands,id',
            'model_unit'      => 'nullable|string|max:255',
            'production_year' => 'sometimes|required|integer|min:1900|max:2100',
        ]);
        $unit->update($validated);
        return $this->success($unit->fresh(['koSpipUnit.koSpipType.koSpipCategory', 'koBrand']));
    }

    public function destroyUnit(string $id)
    {
        KoUnit::findOrFail($id)->delete();
        return $this->success(['message' => 'Unit dihapus.']);
    }

    // ── REVOKE FLOW (parity aims RevokeRequest) ─────────────────────────────
    public function requestRevoke(Request $request, string $id)
    {
        $unit = KoUnit::findOrFail($id);
        $request->validate(['revoke_request_note' => 'nullable|string']);
        $unit->update([
            'revoke_requested_date' => now()->toDateString(),
            'revoke_request_note'   => $request->revoke_request_note,
            'revoke_status'         => 'Requested',
        ]);
        return $this->success($unit->fresh(), 200);
    }

    public function verifyRevoke(Request $request, string $id)
    {
        $unit = KoUnit::findOrFail($id);
        $request->validate(['action' => 'required|in:approve,reject']);
        if ($request->action === 'approve') {
            $unit->update([
                'is_revoked'    => true,
                'revoked_date'  => now()->toDateString(),
                'revoke_status' => 'Revoked',
            ]);
        } else {
            $unit->update(['revoke_status' => 'Rejected']);
        }
        return $this->success($unit->fresh());
    }

    // ── COMMISSIONING HEADERS/FIELDS (read, dikelola via seeder/master) ─────
    public function indexHeaders(Request $request)
    {
        $q = \Modules\Ko\Entities\KoCommissioningHeader::with('koCommissioningFields')->orderBy('number');
        if ($unit = $request->spip_unit_id) $q->where('ko_spip_unit_id', $unit);
        return $this->success($q->paginate($request->limit ?? 50));
    }
}
