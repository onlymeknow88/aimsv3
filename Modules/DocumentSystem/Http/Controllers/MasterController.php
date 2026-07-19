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
}

