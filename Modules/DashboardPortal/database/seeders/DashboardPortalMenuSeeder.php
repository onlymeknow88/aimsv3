<?php

namespace Modules\DashboardPortal\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DashboardPortalMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seed aims_modules, aims_menus, aims_roles, aims_permissions untuk modul Dashboard Portal.
     */
    public function run(): void
    {
        $now = now();

        // 1. Ensure aims_modules entry for dashboard-portal
        $existingModule = DB::table('aims_modules')->where('slug', 'dashboard-portal')->first();
        if ($existingModule) {
            $moduleId = $existingModule->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name'       => 'Dashboard Portal',
                'slug'       => 'dashboard-portal',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 2. Clean old menus for dashboard-portal
        DB::table('aims_menus')->where('module_id', $moduleId)->delete();

        $menuIds = [];

        // 3. Seed aims_menus
        // 1. Dashboard
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 1,
            'name'       => 'Dashboard',
            'slug'       => 'dashboard-portal.dashboard',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 2. Slideshow
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 2,
            'name'       => 'SlideShow',
            'slug'       => 'dashboard-portal.slideshow',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 3. Banner
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 3,
            'name'       => 'Banner',
            'slug'       => 'dashboard-portal.banner',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 4. General KPI
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 4,
            'name'       => 'General KPI',
            'slug'       => 'dashboard-portal.general',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 5. News & Update
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 5,
            'name'       => 'News & Update',
            'slug'       => 'dashboard-portal.news-and-update',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 4. Seed aims_roles
        $roles = [
            ['name' => 'Dashboard Portal Admin',  'slug' => 'dashboard_portal_admin',  'is_system' => true],
            ['name' => 'Dashboard Portal Viewer', 'slug' => 'dashboard_portal_viewer', 'is_system' => true],
            ['name' => 'System Admin',            'slug' => 'system_admin',            'is_system' => false],
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
        $fullAccessRoles = ['dashboard_portal_admin', 'system_admin'];
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
        if (isset($roleIds['dashboard_portal_viewer'])) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['dashboard_portal_viewer'], 'menu_id' => $menuId],
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

        $this->command->info('Dashboard Portal menus, roles, and permissions seeded successfully!');
    }
}
