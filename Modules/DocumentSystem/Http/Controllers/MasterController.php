<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\DocumentSystem\Entities\Module;
use Modules\DocumentSystem\Entities\Category;
use Modules\DocumentSystem\Entities\Mapping;
use Illuminate\Support\Facades\DB;

class MasterController extends Controller
{
    /**
     * Master settings: roles, menus, permissions, taxonomy
     */
    public function index()
    {
        $roles       = DB::table('aims_roles')->get();
        $menus       = DB::table('aims_menus')->where('module_id',
            DB::table('aims_modules')->where('name', 'Document System')->value('id')
        )->get();
        $permissions = DB::table('aims_permissions')
            ->whereIn('menu_id', $menus->pluck('id'))
            ->get();
        $taxonomy    = Module::with(['categories.mappings'])->get();

        return Inertia::render('DocumentSystem/Master/Index', [
            'roles'       => $roles,
            'menus'       => $menus,
            'permissions' => $permissions,
            'taxonomy'    => $taxonomy,
        ]);
    }

    /**
     * Update permission matrix entry
     */
    public function updatePermission(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'menu_id' => 'required',
            'field'   => 'required|string',
            'value'   => 'required|boolean',
        ]);

        $exists = DB::table('aims_permissions')
            ->where('role_id', $request->role_id)
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($exists) {
            DB::table('aims_permissions')
                ->where('role_id', $request->role_id)
                ->where('menu_id', $request->menu_id)
                ->update([$request->field => $request->value, 'updated_at' => now()]);
        } else {
            DB::table('aims_permissions')->insert([
                'role_id'      => $request->role_id,
                'menu_id'      => $request->menu_id,
                'can_view'     => $request->field === 'can_view' ? $request->value : false,
                'can_create'   => $request->field === 'can_create' ? $request->value : false,
                'can_edit'     => $request->field === 'can_edit' ? $request->value : false,
                'can_delete'   => $request->field === 'can_delete' ? $request->value : false,
                'can_approval' => $request->field === 'can_approval' ? $request->value : false,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }
}

