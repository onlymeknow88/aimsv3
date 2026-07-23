<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CsmsMenuSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // 1. Inisialisasi aims_modules
        $existing = DB::table('aims_modules')->where('slug', 'csms')->first();
        if ($existing) {
            $moduleId = $existing->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name'       => 'Contractor Safety Management System',
                'slug'       => 'csms',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('aims_menus')->where('module_id', $moduleId)->delete();
        $menuIds = [];

        // 2. Dashboard
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 1,
            'name' => 'Dashboard', 'slug' => 'csms.dashboard',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 3. Bidding
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 2,
            'name' => 'Bidding', 'slug' => 'csms.bidding',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 4. Post Bidding (Parent)
        $postBiddingParentId = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 3,
            'name' => 'Post Bidding', 'slug' => 'csms.post-bidding',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $menuIds[] = $postBiddingParentId;

        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => $postBiddingParentId, 'order_by' => 1,
            'name' => 'Active', 'slug' => 'csms.post-bidding.active',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => $postBiddingParentId, 'order_by' => 2,
            'name' => 'Inactive', 'slug' => 'csms.post-bidding.inactive',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 5. Renewal
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 4,
            'name' => 'Renewal', 'slug' => 'csms.renewal',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 6. PICA
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 5,
            'name' => 'PICA', 'slug' => 'csms.pica',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 7. PJO (Parent)
        $pjoParentId = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 6,
            'name' => 'PJO', 'slug' => 'csms.pjo',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $menuIds[] = $pjoParentId;

        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => $pjoParentId, 'order_by' => 1,
            'name' => 'PJO Active', 'slug' => 'csms.pjo.active',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => $pjoParentId, 'order_by' => 2,
            'name' => 'PJO On Going', 'slug' => 'csms.pjo.ongoing',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => $pjoParentId, 'order_by' => 3,
            'name' => 'PJO Draft', 'slug' => 'csms.pjo.draft',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 8. Memo KTT
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 7,
            'name' => 'Memo KTT', 'slug' => 'csms.memo',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 9. Surat Edaran
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 8,
            'name' => 'Surat Edaran', 'slug' => 'csms.letter',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 10. Kamus CSMS
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 9,
            'name' => 'Kamus CSMS', 'slug' => 'csms.dictionary',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 11. Approval CSMS
        $menuIds[] = DB::table('aims_menus')->insertGetId([
            'module_id'  => $moduleId, 'parent_id' => null, 'order_by' => 10,
            'name' => 'Approval CSMS', 'slug' => 'csms.approval',
            'created_at' => $now, 'updated_at' => $now,
        ]);

        // 3. Roles
        $roles = [
            ['name' => 'CSMS Admin',    'slug' => 'csms_admin',         'is_system' => true],
            ['name' => 'OHS Reviewer',  'slug' => 'csms_ohs_reviewer',  'is_system' => true],
            ['name' => 'Dept Head OHS', 'slug' => 'csms_dhohs_reviewer','is_system' => true],
            ['name' => 'KTT Reviewer',  'slug' => 'csms_ktt_reviewer',  'is_system' => true],
            ['name' => 'CSMS Vendor',   'slug' => 'csms_vendor',        'is_system' => true],
        ];

        $roleIds = [];
        foreach ($roles as $r) {
            $ex = DB::table('aims_roles')->where('module_id', $moduleId)->where('slug', $r['slug'])->first();
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

        // 4. Permissions
        $privileged = ['csms_admin', 'csms_ohs_reviewer', 'csms_dhohs_reviewer', 'csms_ktt_reviewer'];
        foreach ($privileged as $slug) {
            if (!isset($roleIds[$slug])) continue;
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds[$slug], 'menu_id' => $menuId],
                    ['can_view'=>true,'can_create'=>true,'can_edit'=>true,'can_delete'=>true,'can_approval'=>true,'updated_at'=>$now]
                );
            }
        }

        if (isset($roleIds['csms_vendor'])) {
            foreach ($menuIds as $menuId) {
                $slug = DB::table('aims_menus')->where('id', $menuId)->value('slug');
                if ($slug === 'csms.approval') continue;
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds['csms_vendor'], 'menu_id' => $menuId],
                    ['can_view'=>true,'can_create'=>true,'can_edit'=>true,'can_delete'=>true,'can_approval'=>false,'updated_at'=>$now]
                );
            }
        }

        \Cache::flush();
        $this->command->info('CSMS menu and permissions seeded successfully.');
    }
}
