<?php

namespace Modules\Ko\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KoMenuSeeder extends Seeder
{
    /**
     * Seed aims_modules, aims_menus, aims_roles, aims_permissions modul KO.
     * TERPISAH dari KODatabaseSeeder (pola CSMS): jalankan mandiri agar
     * re-seed data tidak me-reset kustomisasi permission backoffice.
     *
     *   php artisan db:seed --class="Modules\Ko\Database\Seeders\KoMenuSeeder"
     */
    public function run(): void
    {
        $now = now();

        $existing = DB::table('aims_modules')->where('slug', 'ko')->first();
        $moduleId = $existing
            ? $existing->id
            : DB::table('aims_modules')->insertGetId([
                'name'       => 'Keselamatan Operasi',
                'slug'       => 'ko',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        DB::table('aims_menus')->where('module_id', $moduleId)->delete();
        $menuIds = [];

        $menus = [
            ['name' => 'Dashboard',   'slug' => 'ko.dashboard',     'parent' => null, 'order' => 1],
            ['name' => 'Proposal',    'slug' => 'ko.proposals',     'parent' => null, 'order' => 2],
            ['name' => 'Komisioning', 'slug' => 'ko.commissionings','parent' => null, 'order' => 3],
            ['name' => 'Issue Report','slug' => 'ko.issues',        'parent' => null, 'order' => 4],
            ['name' => 'Unit',        'slug' => 'ko.units',         'parent' => null, 'order' => 5],
            ['name' => 'Request QR',  'slug' => 'ko.qr-requests',   'parent' => null, 'order' => 6],
            ['name' => 'Master Library', 'slug' => 'ko.master',     'parent' => null, 'order' => 7],
        ];
        foreach ($menus as $m) {
            $menuIds[] = DB::table('aims_menus')->insertGetId([
                'module_id'  => $moduleId,
                'parent_id'  => null,
                'order_by'   => $m['order'],
                'name'       => $m['name'],
                'slug'       => $m['slug'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $roles = [
            ['name' => 'KO Admin',   'slug' => 'ko_admin',   'is_system' => true],
            ['name' => 'KO Verifier','slug' => 'ko_verifier','is_system' => true],
            ['name' => 'KO Viewer',  'slug' => 'ko_viewer',  'is_system' => true],
        ];
        $roleIds = [];
        foreach ($roles as $r) {
            $ex = DB::table('aims_roles')->where('module_id', $moduleId)->where('slug', $r['slug'])->first();
            $roleIds[$r['slug']] = $ex
                ? $ex->id
                : DB::table('aims_roles')->insertGetId([
                    'module_id'  => $moduleId,
                    'name'       => $r['name'],
                    'slug'       => $r['slug'],
                    'is_system'  => $r['is_system'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
        }

        foreach (['ko_admin', 'ko_verifier'] as $slug) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds[$slug], 'menu_id' => $menuId],
                    ['can_view' => true, 'can_create' => true, 'can_edit' => true,
                     'can_delete' => $slug === 'ko_admin', 'can_approval' => true, 'updated_at' => $now]
                );
            }
        }
        foreach ($menuIds as $menuId) {
            DB::table('aims_permissions')->updateOrInsert(
                ['role_id' => $roleIds['ko_viewer'], 'menu_id' => $menuId],
                ['can_view' => true, 'can_create' => false, 'can_edit' => false,
                 'can_delete' => false, 'can_approval' => false, 'updated_at' => $now]
            );
        }

        \Cache::flush();
        $this->command->info('KO menu and permissions seeded successfully.');
    }
}
