<?php
 
namespace App\Http\Controllers\Admin\Api;
 
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
 
class RolePermissionController extends Controller
{
    /**
     * API: Get Role & Permission matrix data
     */
    public function index(Request $request)
    {
        try {
            $modules = DB::table('aims_modules')->get();
 
            $selectedModuleId = $request->query('module_id');
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
 
            return ResponseFormatter::success([
                'modules' => $modules,
                'selectedModuleId' => (int) $selectedModuleId,
                'roles' => $roles,
                'menus' => $menus,
                'permissions' => $permissions
            ], 'Data role permission berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal mengambil data: ' . $e->getMessage(), 500);
        }
    }
 
    /**
     * API: Update permission matrix
     */
    public function update(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'menu_id' => 'required',
            'field' => 'required|string|in:can_view,can_create,can_edit,can_delete,can_approval',
            'value' => 'required|boolean'
        ]);
 
        try {
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
 
            Artisan::call('cache:clear');
 
            return ResponseFormatter::success(null, 'Permission berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui permission: ' . $e->getMessage(), 500);
        }
    }
 
    /**
     * API: Bulk update permissions
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
 
        try {
            $allowedFields = ['can_view','can_create','can_edit','can_delete','can_approval'];
            $changes = $request->input('changes');
 
            foreach ($changes as $i => $change) {
                $raw = $change['field'] ?? '';
                if (strpos($raw, '::') !== false) {
                    $parts = explode('::', $raw);
                    $field = end($parts);
                } else {
                    $field = $raw;
                }
                if (!in_array($field, $allowedFields)) {
                    return ResponseFormatter::error("The selected changes.{$i}.field is invalid.", 422);
                }
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
 
            Artisan::call('cache:clear');
 
            return ResponseFormatter::success(null, 'Bulk permissions berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui permissions: ' . $e->getMessage(), 500);
        }
    }
 
    /**
     * API: Store a new role
     */
    public function storeRole(Request $request)
    {
        $request->validate([
            'module_id' => 'required',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255'
        ]);
 
        try {
            $exists = DB::table('aims_roles')
                ->where('module_id', $request->module_id)
                ->where('slug', $request->slug)
                ->exists();
 
            if ($exists) {
                return ResponseFormatter::error('Role slug already exists for this module.', 422);
            }
 
            $roleId = DB::table('aims_roles')->insertGetId([
                'module_id' => $request->module_id,
                'name' => $request->name,
                'slug' => $request->slug,
                'is_system' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);
 
            $role = DB::table('aims_roles')->where('id', $roleId)->first();
 
            return ResponseFormatter::success($role, 'Role berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat role: ' . $e->getMessage(), 500);
        }
    }
 
    /**
     * API: Update an existing role
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'module_id' => 'required',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255'
        ]);
 
        try {
            $role = DB::table('aims_roles')->where('id', $id)->first();
            if (!$role) {
                return ResponseFormatter::error('Role tidak ditemukan.', 404);
            }
 
            $exists = DB::table('aims_roles')
                ->where('module_id', $request->module_id)
                ->where('slug', $request->slug)
                ->where('id', '!=', $id)
                ->exists();
 
            if ($exists) {
                return ResponseFormatter::error('Role slug already exists for this module.', 422);
            }
 
            DB::table('aims_roles')
                ->where('id', $id)
                ->update([
                    'module_id' => $request->module_id,
                    'name' => $request->name,
                    'slug' => $request->slug,
                    'updated_at' => now()
                ]);
 
            Artisan::call('cache:clear');
 
            $updatedRole = DB::table('aims_roles')->where('id', $id)->first();
 
            return ResponseFormatter::success($updatedRole, 'Role berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui role: ' . $e->getMessage(), 500);
        }
    }
 
    /**
     * API: Delete a role
     */
    public function destroyRole($id)
    {
        try {
            $role = DB::table('aims_roles')->where('id', $id)->first();
            if (!$role) {
                return ResponseFormatter::error('Role tidak ditemukan.', 404);
            }
 
            DB::table('aims_permissions')->where('role_id', $id)->delete();
            DB::table('aims_roles')->where('id', $id)->delete();
 
            Artisan::call('cache:clear');
 
            return ResponseFormatter::success(null, 'Role berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus role: ' . $e->getMessage(), 500);
        }
    }
}
