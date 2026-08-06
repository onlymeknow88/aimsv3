<?php

namespace Modules\Coe\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoeMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seed aims_modules, aims_menus, aims_roles, aims_permissions untuk modul Center of Excellence (CoE).
     */
    public function run(): void
    {
        $now = now();

        // 1. Ensure aims_modules entry for CoE
        $existingModule = DB::table('aims_modules')->where('slug', 'calender-of-event-coe')->first();
        if ($existingModule) {
            $moduleId = $existingModule->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name'       => 'Calendar of Event (CoE)',
                'slug'       => 'calender-of-event-coe',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 2. Clean old menus for CoE
        DB::table('aims_menus')->where('module_id', $moduleId)->delete();

        $menuIds = [];

        // 3. Seed aims_menus
        // 1. Event Calendar
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 1,
            'name'       => 'Event Calendar',
            'slug'       => 'calender-of-event-coe.calendar',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 2. Dashboard
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 2,
            'name'       => 'Dashboard',
            'slug'       => 'calender-of-event-coe.dashboard',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 3. Event List
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 3,
            'name'       => 'Event List',
            'slug'       => 'calender-of-event-coe.list',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 4. Master Data (Parent)
        $masterParentId = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 4,
            'name'       => 'Master Data',
            'slug'       => 'calender-of-event-coe.master',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $menuIds[] = $masterParentId;

        // 5. Categories (Child of Master Data)
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => $masterParentId,
            'order_by'   => 1,
            'name'       => 'Categories',
            'slug'       => 'calender-of-event-coe.categories',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 4. Seed aims_roles
        $roles = [
            ['name' => 'CoE Admin',  'slug' => 'coe_admin',  'is_system' => true],
            ['name' => 'CoE Viewer', 'slug' => 'coe_viewer', 'is_system' => true],
            ['name' => 'System Admin', 'slug' => 'system_admin', 'is_system' => false],
        ];

        $roleIds = [];
        foreach ($roles as $r) {
            $existingRole = DB::table('aims_roles')
                ->where('module_id', $moduleId)
                ->where('slug', $r['slug'])
                ->first();

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

        // 5. Seed aims_permissions
        // Admin & System Admin — full access
        $fullAccessRoles = ['coe_admin', 'system_admin'];
        foreach ($fullAccessRoles as $roleSlug) {
            if (!isset($roleIds[$roleSlug])) continue;
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds[$roleSlug], 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => true,
                        'can_edit'     => true,
                        'can_delete'   => true,
                        'can_approval' => true,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // Viewer — view only
        if (isset($roleIds['coe_viewer'])) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['coe_viewer'], 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => false,
                        'can_edit'     => false,
                        'can_delete'   => false,
                        'can_approval' => false,
                        'created_at'   => $now,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        $this->command->info('Center of Excellence (CoE) menus, roles, and permissions seeded successfully!');
    }
}
