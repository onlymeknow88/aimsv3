<?php

namespace Modules\FieldLeadership\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldLeadershipMenuSeeder extends Seeder
{
    /**
     * Seed aims_modules, aims_menus, aims_roles, dan aims_permissions untuk modul Field Leadership
     * persis sesuai daftar menu dari sidebar layout AIMS:
     *
     * 1. Dashboard                             (fls.dashboard)
     * 2. Field Leadership                      (fls.observations)
     * 3. Penanggung Jawab Area                 (fls.pja)
     *    - Request Review                      (fls.pja.request-review)
     *    - Draft                               (fls.pja.draft)
     * 4. Approval PJA                          (fls.approval-pja)
     * 5. Master Library                        (fls.master)
     *    - Limit Parameter                     (fls.master.limit-parameter)
     *    - Jenis KTA/TTA                       (fls.master.jenis-kta-tta)
     *    - Potensi Konsekuensi                 (fls.master.potensi-konsekuensi)
     */
    public function run(): void
    {
        $now = now();

        // 1. Ensure Module Field Leadership
        $existingModule = DB::table('aims_modules')->where('slug', 'field-leadership')->first();
        if ($existingModule) {
            $moduleId = $existingModule->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name'       => 'Field Leadership',
                'slug'       => 'field-leadership',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Hapus menu lama agar idempoten
        DB::table('aims_menus')->where('module_id', $moduleId)->delete();

        $menuIds = [];

        // 1. Dashboard
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 1,
            'name'      => 'Dashboard',
            'slug'      => 'fls.dashboard',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // 2. Field Leadership
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 2,
            'name'      => 'Field Leadership',
            'slug'      => 'fls.observations',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // 3. Penanggung Jawab Area (Parent)
        $pjaParentId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 3,
            'name'      => 'Penanggung Jawab Area',
            'slug'      => 'fls.pja',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);
        $menuIds[] = $pjaParentId;

        // Submenu Penanggung Jawab Area
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => $pjaParentId,
            'order_by'  => 1,
            'name'      => 'Request Review',
            'slug'      => 'fls.pja.request-review',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => $pjaParentId,
            'order_by'  => 2,
            'name'      => 'Draft',
            'slug'      => 'fls.pja.draft',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // 4. Approval PJA
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 4,
            'name'      => 'Approval PJA',
            'slug'      => 'fls.approval-pja',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // 5. Master Library (Parent)
        $masterParentId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 5,
            'name'      => 'Master Library',
            'slug'      => 'fls.master',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);
        $menuIds[] = $masterParentId;

        // Submenu Master Library
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => $masterParentId,
            'order_by'  => 1,
            'name'      => 'Limit Parameter',
            'slug'      => 'fls.master.limit-parameter',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => $masterParentId,
            'order_by'  => 2,
            'name'      => 'Jenis KTA/TTA',
            'slug'      => 'fls.master.jenis-kta-tta',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => $masterParentId,
            'order_by'  => 3,
            'name'      => 'Potensi Konsekuensi',
            'slug'      => 'fls.master.potensi-konsekuensi',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // 2. Seed Roles
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super_admin', 'is_system' => true],
            ['name' => 'Field Leadership Admin', 'slug' => 'fls_admin', 'is_system' => true],
            ['name' => 'PJA Reviewer', 'slug' => 'pja_reviewer', 'is_system' => true],
        ];

        $roleIds = [];
        foreach ($roles as $r) {
            $existingRole = DB::table('aims_roles')->where('module_id', $moduleId)->where('slug', $r['slug'])->first();
            if ($existingRole) {
                $roleIds[$r['slug']] = $existingRole->id;
            } else {
                $roleIds[$r['slug']] = DB::table('aims_roles')->insertGetId([
                    'module_id'  => $moduleId,
                    'name'       => $r['name'],
                    'slug'       => $r['slug'],
                    'is_system'  => $r['is_system'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        // 3. Seed Permissions (Full Grant)
        foreach ($roleIds as $roleSlug => $roleId) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleId, 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => true,
                        'can_edit'     => true,
                        'can_delete'   => true,
                        'can_approval' => true,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // 4. Assign User Roles
        $users = DB::table('users')->pluck('id');
        foreach ($users as $userId) {
            foreach ($roleIds as $roleId) {
                DB::table('aims_user_roles')->updateOrInsert(
                    ['user_id' => $userId, 'role_id' => $roleId],
                    []
                );
            }
        }

        // Clear permission cache
        \Cache::flush();

        $this->command->info('FieldLeadership menu and permissions seeded successfully matching sidebar layout exactly.');
    }
}
