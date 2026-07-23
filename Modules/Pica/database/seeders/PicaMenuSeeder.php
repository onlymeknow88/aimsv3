<?php

namespace Modules\Pica\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PicaMenuSeeder extends Seeder
{
    /**
     * Seed aims_modules, aims_menus, aims_roles, aims_permissions untuk modul PICA.
     *
     * Menu:
     *   1. Dashboard              (pica.dashboard)
     *   2. Active Document        (pica.active-document)
     *   3. Draft                  (pica.draft)
     *   4. Return Document        (pica.return-document)
     *   5. Review CRS             (pica.review-crs)
     *
     * Roles:
     *   - PICA Admin             (pica_admin)         — full access
     *   - PICA Viewer            (pica_viewer)        — view only
     *   - OHS Reviewer           (pica_ohs_reviewer)  — approve PJA
     *   - CRS Reviewer           (pica_crs_reviewer)  — approve CRS
     *   - System Admin           (system_admin)       — full access
     */
    public function run(): void
    {
        $now = now();

        // ----------------------------------------------------------------
        // 1. aims_modules
        // ----------------------------------------------------------------
        $existing = DB::table('aims_modules')->where('slug', 'pica')->first();
        if ($existing) {
            $moduleId = $existing->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name'       => 'PICA — Problem Identification & Corrective Action',
                'slug'       => 'pica',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Hapus menu lama agar idempoten
        DB::table('aims_menus')->where('module_id', $moduleId)->delete();

        $menuIds = [];

        // ----------------------------------------------------------------
        // 2. aims_menus
        // ----------------------------------------------------------------

        // 1. Dashboard
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 1,
            'name'       => 'Dashboard',
            'slug'       => 'pica.dashboard',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 2. Active Document
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 2,
            'name'       => 'Active Document',
            'slug'       => 'pica.active-document',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 3. Draft
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 3,
            'name'       => 'Draft',
            'slug'       => 'pica.draft',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 4. Return Document
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 4,
            'name'       => 'Return Document',
            'slug'       => 'pica.return-document',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 5. Review CRS
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId,
            'parent_id'  => null,
            'order_by'   => 5,
            'name'       => 'Review CRS',
            'slug'       => 'pica.review-crs',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // ----------------------------------------------------------------
        // 3. aims_roles
        // ----------------------------------------------------------------
        $roles = [
            ['name' => 'PICA Admin',     'slug' => 'pica_admin',        'is_system' => true],
            ['name' => 'PICA Viewer',    'slug' => 'pica_viewer',       'is_system' => true],
            ['name' => 'OHS Reviewer',   'slug' => 'pica_ohs_reviewer', 'is_system' => true],
            ['name' => 'CRS Reviewer',   'slug' => 'pica_crs_reviewer', 'is_system' => true],
            ['name' => 'System Admin',   'slug' => 'system_admin',      'is_system' => false],
        ];

        $roleIds = [];
        foreach ($roles as $r) {
            $ex = DB::table('aims_roles')
                ->where('module_id', $moduleId)
                ->where('slug', $r['slug'])
                ->first();
            if ($ex) {
                $roleIds[$r['slug']] = $ex->id;
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

        // ----------------------------------------------------------------
        // 4. aims_permissions
        // ----------------------------------------------------------------

        // Ambil menu id per slug untuk kontrol granular
        $menuBySlug = DB::table('aims_menus')
            ->where('module_id', $moduleId)
            ->pluck('id', 'slug');

        // PICA Admin & System Admin — full access semua menu
        $fullAccessRoles = ['pica_admin', 'system_admin'];
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
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // PICA Viewer — view only semua menu
        if (isset($roleIds['pica_viewer'])) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['pica_viewer'], 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => false,
                        'can_edit'     => false,
                        'can_delete'   => false,
                        'can_approval' => false,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // OHS Reviewer — full access kecuali Review CRS
        if (isset($roleIds['pica_ohs_reviewer'])) {
            foreach ($menuIds as $menuId) {
                $slug = DB::table('aims_menus')->where('id', $menuId)->value('slug');
                if ($slug === 'pica.review-crs') continue;
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['pica_ohs_reviewer'], 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => true,
                        'can_edit'     => true,
                        'can_delete'   => false,
                        'can_approval' => true,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // CRS Reviewer — hanya Dashboard & Review CRS
        if (isset($roleIds['pica_crs_reviewer'])) {
            $crsMenus = [
                $menuBySlug['pica.dashboard']    ?? null,
                $menuBySlug['pica.review-crs']   ?? null,
            ];
            foreach (array_filter($crsMenus) as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['pica_crs_reviewer'], 'menu_id' => $menuId],
                    [
                        'can_view'     => true,
                        'can_create'   => false,
                        'can_edit'     => false,
                        'can_delete'   => false,
                        'can_approval' => true,
                        'updated_at'   => $now,
                    ]
                );
            }
        }

        // ----------------------------------------------------------------
        // 5. Assign semua user existing ke pica_admin role
        // ----------------------------------------------------------------
        if (isset($roleIds['pica_admin'])) {
            $users = DB::table('users')->pluck('id');
            foreach ($users as $userId) {
                DB::table('aims_user_roles')->updateOrInsert(
                    ['user_id' => $userId, 'role_id' => $roleIds['pica_admin']],
                    []
                );
            }
        }

        \Cache::flush();
        $this->command->info('PICA menu and permissions seeded successfully.');
    }
}
