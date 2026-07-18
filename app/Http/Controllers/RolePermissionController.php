<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    /**
     * Tampilkan halaman Management Role & Permission (React-Inertia)
     */
    public function index(Request $request)
    {
        $modules = DB::table('aims_modules')->get();

        $selectedModuleId = $request->input('module_id');
        if (!$selectedModuleId && $modules->isNotEmpty()) {
            $selectedModuleId = $modules->first()->id;
        }

        $roles = [];
        $menus = [];
        $permissions = [];

        if ($selectedModuleId) {
            $roles = DB::table('aims_roles')
                ->where('module_id', $selectedModuleId)
                ->get();

            $menus = DB::table('aims_menus')
                ->where('module_id', $selectedModuleId)
                ->orderBy('order_by', 'asc')
                ->get();

            $permissions = DB::table('aims_permissions')
                ->whereIn('menu_id', $menus->pluck('id'))
                ->get();
        }

        return Inertia::render('Admin/RolePermission', [
            'modules' => $modules,
            'selectedModuleId' => (int) $selectedModuleId,
            'roles' => $roles,
            'menus' => $menus,
            'permissions' => $permissions
        ]);
    }

    /**
     * Simpan/Update permission matrix dari React UI
     */
    public function update(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'menu_id' => 'required',
            'field' => 'required|string|in:can_view,can_create,can_edit,can_delete,can_approval',
            'value' => 'required|boolean'
        ]);

        $exists = DB::table('aims_permissions')
            ->where('role_id', $request->role_id)
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($exists) {
            DB::table('aims_permissions')
                ->where('role_id', $request->role_id)
                ->where('menu_id', $request->menu_id)
                ->update([
                    $request->field => $request->value,
                    'updated_at' => now()
                ]);
        } else {
            DB::table('aims_permissions')->insert([
                'role_id' => $request->role_id,
                'menu_id' => $request->menu_id,
                'can_view' => $request->field === 'can_view' ? $request->value : false,
                'can_create' => $request->field === 'can_create' ? $request->value : false,
                'can_edit' => $request->field === 'can_edit' ? $request->value : false,
                'can_delete' => $request->field === 'can_delete' ? $request->value : false,
                'can_approval' => $request->field === 'can_approval' ? $request->value : false,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Clear cache module permission agar langsung terupdate
        \Illuminate\Support\Facades\Artisan::call('cache:clear');

        return response()->json(['success' => true]);
    }

    /**
     * Bulk update permissions from the React UI.
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'changes' => 'required|array',
            'changes.*.role_id' => 'required',
            'changes.*.menu_id' => 'required',
            'changes.*.field' => 'required|string',
            'changes.*.value' => 'required|boolean',
        ]);

        // Normalize and validate field names (allow potential delimiters from frontend)
        $allowedFields = ['can_view','can_create','can_edit','can_delete','can_approval'];
        $changes = $request->input('changes');
        foreach ($changes as $i => $change) {
            $raw = $change['field'] ?? '';
            // extract last segment after '::' only; do not split underscores (field names contain underscores)
            if (strpos($raw, '::') !== false) {
                $parts = explode('::', $raw);
                $field = end($parts);
            } else {
                $field = $raw;
            }
            if (! in_array($field, $allowedFields)) {
                return response()->json(['message' => "The selected changes.$i.field is invalid."], 422);
            }
            // replace with normalized field
            $changes[$i]['field'] = $field;
        }

        foreach ($changes as $change) {
            $exists = DB::table('aims_permissions')
                ->where('role_id', $change['role_id'])
                ->where('menu_id', $change['menu_id'])
                ->first();

            if ($exists) {
                DB::table('aims_permissions')
                    ->where('role_id', $change['role_id'])
                    ->where('menu_id', $change['menu_id'])
                    ->update([
                        $change['field'] => $change['value'],
                        'updated_at' => now()
                    ]);
            } else {
                DB::table('aims_permissions')->insert([
                    'role_id' => $change['role_id'],
                    'menu_id' => $change['menu_id'],
                    'can_view' => $change['field'] === 'can_view' ? $change['value'] : false,
                    'can_create' => $change['field'] === 'can_create' ? $change['value'] : false,
                    'can_edit' => $change['field'] === 'can_edit' ? $change['value'] : false,
                    'can_delete' => $change['field'] === 'can_delete' ? $change['value'] : false,
                    'can_approval' => $change['field'] === 'can_approval' ? $change['value'] : false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Clear cache after bulk update
        \Illuminate\Support\Facades\Artisan::call('cache:clear');

        return response()->json(['success' => true]);
    }

    /**
     * Simpan / Tambah Role Baru untuk Modul tertentu
     */
    public function storeRole(Request $request)
    {
        $request->validate([
            'module_id' => 'required',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255'
        ]);

        // Cek unique role slug dalam scope modul
        $exists = DB::table('aims_roles')
            ->where('module_id', $request->module_id)
            ->where('slug', $request->slug)
            ->exists();

        if ($exists) {
            return back()->withErrors(['slug' => 'Role slug already exists for this module.']);
        }

        DB::table('aims_roles')->insert([
            'module_id' => $request->module_id,
            'name' => $request->name,
            'slug' => $request->slug,
            'is_system' => false,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return back();
    }
}
