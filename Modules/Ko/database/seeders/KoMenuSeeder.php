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
     *
     * Idempoten: menu di-updateOrInsert per slug (BUKAN delete-all) sehingga
     * re-seed tidak menciptakan orphan aims_permissions dan tidak menghapus
     * kustomisasi role non-sistem. Menu basi (slug tak dikenal) dibersihkan
     * beserta permission-nya.
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

        // Cermin sidebar newaims (Modules/KO/.../sidebar.blade.php): parent flat
        // untuk RBAC route + anak untuk navigasi presisi (tab/filter via query).
        // Sidebar hanya me-render top-level; anak dipakai sebagai sub-link.
        $menus = [
            ['name' => 'Dashboard',   'slug' => 'ko.dashboard',     'parent' => null, 'order' => 1, 'url' => '/ko/dashboard'],
            ['name' => 'Proposal',    'slug' => 'ko.proposals',     'parent' => null, 'order' => 2, 'url' => '/ko/proposals'],
            ['name' => 'Daftar KO',   'slug' => 'ko.proposals.list',      'parent' => 'ko.proposals', 'order' => 1, 'url' => '/ko/proposals'],
            ['name' => 'Returned',    'slug' => 'ko.proposals.returned',  'parent' => 'ko.proposals', 'order' => 2, 'url' => '/ko/proposals?status=Returned'],
            ['name' => 'Completed',   'slug' => 'ko.proposals.completed', 'parent' => 'ko.proposals', 'order' => 3, 'url' => '/ko/proposals?status=Completed'],
            ['name' => 'Komisioning', 'slug' => 'ko.commissionings','parent' => null, 'order' => 3, 'url' => '/ko/commissionings'],
            ['name' => 'In Progress', 'slug' => 'ko.commissionings.progress', 'parent' => 'ko.commissionings', 'order' => 1, 'url' => '/ko/commissionings?status=Commissioning in Progress'],
            ['name' => 'Returned',    'slug' => 'ko.commissionings.returned', 'parent' => 'ko.commissionings', 'order' => 2, 'url' => '/ko/commissionings?status=Commissioning Returned'],
            ['name' => 'Daftar',      'slug' => 'ko.commissionings.list',     'parent' => 'ko.commissionings', 'order' => 3, 'url' => '/ko/commissionings'],
            ['name' => 'Issue Report','slug' => 'ko.issues',        'parent' => null, 'order' => 4, 'url' => '/ko/issues'],
            ['name' => 'Open',        'slug' => 'ko.issues.open',   'parent' => 'ko.issues', 'order' => 1, 'url' => '/ko/issues?status=Open'],
            ['name' => 'Verifikasi Admin', 'slug' => 'ko.issues.admin', 'parent' => 'ko.issues', 'order' => 2, 'url' => '/ko/issues?status=Under Admin Verification'],
            ['name' => 'Verifikasi Koordinator', 'slug' => 'ko.issues.coordinator', 'parent' => 'ko.issues', 'order' => 3, 'url' => '/ko/issues?status=Under Coordinator Verification'],
            ['name' => 'Solved',      'slug' => 'ko.issues.solved', 'parent' => 'ko.issues', 'order' => 4, 'url' => '/ko/issues?status=Solved'],
            ['name' => 'Returned',    'slug' => 'ko.issues.returned', 'parent' => 'ko.issues', 'order' => 5, 'url' => '/ko/issues?status=Returned'],
            ['name' => 'Unit',        'slug' => 'ko.units',         'parent' => null, 'order' => 5, 'url' => '/ko/units'],
            ['name' => 'Daftar Unit', 'slug' => 'ko.units.list',    'parent' => 'ko.units', 'order' => 1, 'url' => '/ko/units'],
            ['name' => 'Demob Request', 'slug' => 'ko.units.demob', 'parent' => 'ko.units', 'order' => 2, 'url' => '/ko/units?tab=demob'],
            ['name' => 'Request QR',  'slug' => 'ko.qr-requests',   'parent' => null, 'order' => 6, 'url' => '/ko/qr-requests'],
            ['name' => 'Request',     'slug' => 'ko.qr-requests.request',  'parent' => 'ko.qr-requests', 'order' => 1, 'url' => '/ko/qr-requests?tab=request'],
            ['name' => 'Verifikasi',  'slug' => 'ko.qr-requests.verify',   'parent' => 'ko.qr-requests', 'order' => 2, 'url' => '/ko/qr-requests?tab=verify'],
            ['name' => 'Approved',    'slug' => 'ko.qr-requests.approved', 'parent' => 'ko.qr-requests', 'order' => 3, 'url' => '/ko/qr-requests?tab=approved'],
            ['name' => 'Master Library', 'slug' => 'ko.master',     'parent' => null, 'order' => 7, 'url' => '/ko/master'],
            ['name' => 'Kategori',    'slug' => 'ko.master.categories', 'parent' => 'ko.master', 'order' => 1, 'url' => '/ko/master?tab=categories'],
            ['name' => 'Tipe',        'slug' => 'ko.master.types',      'parent' => 'ko.master', 'order' => 2, 'url' => '/ko/master?tab=types'],
            ['name' => 'SPIP Unit',   'slug' => 'ko.master.spip-units',  'parent' => 'ko.master', 'order' => 3, 'url' => '/ko/master?tab=spip-units'],
            ['name' => 'Brand',       'slug' => 'ko.master.brands',      'parent' => 'ko.master', 'order' => 4, 'url' => '/ko/master?tab=brands'],
        ];
        $parentIds = [];
        $menuIds = [];
        foreach ($menus as $m) {
            $parentId = $m['parent'] ? ($parentIds[$m['parent']] ?? null) : null;
            $ex = DB::table('aims_menus')->where('module_id', $moduleId)->where('slug', $m['slug'])->first();
            if ($ex) {
                DB::table('aims_menus')->where('id', $ex->id)->update([
                    'parent_id'  => $parentId,
                    'order_by'   => $m['order'],
                    'name'       => $m['name'],
                    'updated_at' => $now,
                ]);
                $menuIds[] = $ex->id;
                $parentIds[$m['slug']] = $ex->id;
            } else {
                $id = DB::table('aims_menus')->insertGetId([
                    'module_id'  => $moduleId,
                    'parent_id'  => $parentId,
                    'order_by'   => $m['order'],
                    'name'       => $m['name'],
                    'slug'       => $m['slug'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $menuIds[] = $id;
                $parentIds[$m['slug']] = $id;
            }
        }

        // Bersihkan menu basi + permission yatimnya.
        $staleIds = DB::table('aims_menus')
            ->where('module_id', $moduleId)
            ->whereNotIn('id', $menuIds)
            ->pluck('id');
        if ($staleIds->isNotEmpty()) {
            DB::table('aims_permissions')->whereIn('menu_id', $staleIds)->delete();
            DB::table('aims_menus')->whereIn('id', $staleIds)->delete();
        }

        // Parity CSMS (CsmsMenuSeeder): sertakan System Admin non-sistem
        // dengan grant penuh agar akun admin umum tetap bisa membuka modul.
        $roles = [
            ['name' => 'KO Admin',    'slug' => 'ko_admin',     'is_system' => true],
            ['name' => 'KO Verifier', 'slug' => 'ko_verifier',  'is_system' => true],
            ['name' => 'KO Viewer',   'slug' => 'ko_viewer',    'is_system' => true],
            ['name' => 'System Admin','slug' => 'system_admin', 'is_system' => false],
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

        $full = ['ko_admin', 'ko_verifier', 'system_admin'];
        foreach ($full as $slug) {
            foreach ($menuIds as $menuId) {
                DB::table('aims_permissions')->updateOrInsert(
                    ['role_id' => $roleIds[$slug], 'menu_id' => $menuId],
                    ['can_view' => true, 'can_create' => true, 'can_edit' => true,
                     'can_delete' => $slug !== 'ko_verifier', 'can_approval' => true, 'updated_at' => $now]
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
