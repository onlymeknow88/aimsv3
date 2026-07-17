<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionApiController extends Controller
{
    /**
     * Update roles permission matrix settings.
     */
    public function updatePermissions(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'menu_id' => 'required',
            'field' => 'required|string',
            'value' => 'required|boolean',
        ]);

        $roleId = $request->role_id;
        $menuId = $request->menu_id;
        $field = $request->field;
        $value = $request->value;

        // Ensure record exists, then update
        $exists = DB::table('aims_permissions')
            ->where('role_id', $roleId)
            ->where('menu_id', $menuId)
            ->first();

        if ($exists) {
            DB::table('aims_permissions')
                ->where('role_id', $roleId)
                ->where('menu_id', $menuId)
                ->update([
                    $field => $value,
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('aims_permissions')->insert([
                'role_id' => $roleId,
                'menu_id' => $menuId,
                'can_view' => $field === 'can_view' ? $value : false,
                'can_create' => $field === 'can_create' ? $value : false,
                'can_edit' => $field === 'can_edit' ? $value : false,
                'can_delete' => $field === 'can_delete' ? $value : false,
                'can_approval' => $field === 'can_approval' ? $value : false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return ResponseFormatter::success(null, 'Permissions updated successfully');
    }
}
