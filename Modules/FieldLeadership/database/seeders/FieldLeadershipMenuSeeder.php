<?php

namespace Modules\FieldLeadership\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldLeadershipMenuSeeder extends Seeder
{
    /**
     * Seed aims_menus untuk module Field Leadership.
     *
     * Struktur menu:
     *   1. Dashboard
     *   2. Observasi (parent)
     *      2.1 Semua Observasi
     *      2.2 Planned Task Observation (PTO)
     *      2.3 Take Time Talk (TTT)
     *      2.4 Hazard Report (HR)
     *   3. Risk & Tindakan (parent)
     *      3.1 Risk Finding
     *      3.2 Corrective Action
     *   4. Master Data
     *   5. Settings
     */
    public function run(): void
    {
        $moduleId = DB::table('aims_modules')
            ->where('slug', 'field-leadership')
            ->value('id');

        if (!$moduleId) {
            $this->command->warn('Module field-leadership tidak ditemukan di aims_modules. Seeder dilewati.');
            return;
        }

        // Hapus menu lama agar seeder idempoten
        DB::table('aims_menus')->where('module_id', $moduleId)->delete();

        $now = now();

        // ── Level 1: parent menus ─────────────────────────────────────────────
        $dashboardId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 1,
            'name'      => 'Dashboard',
            'slug'      => 'fls.dashboard',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $observasiId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 2,
            'name'      => 'Observasi',
            'slug'      => 'fls.observasi',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $riskId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 3,
            'name'      => 'Risk & Tindakan',
            'slug'      => 'fls.risk',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $masterId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 4,
            'name'      => 'Master Data',
            'slug'      => 'fls.master',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        $settingsId = DB::table('aims_menus')->insertGetId([
            'module_id' => $moduleId,
            'parent_id' => null,
            'order_by'  => 5,
            'name'      => 'Settings',
            'slug'      => 'fls.settings',
            'created_at'=> $now,
            'updated_at'=> $now,
        ]);

        // ── Level 2: Observasi children ───────────────────────────────────────
        DB::table('aims_menus')->insert([
            [
                'module_id' => $moduleId,
                'parent_id' => $observasiId,
                'order_by'  => 1,
                'name'      => 'Semua Observasi',
                'slug'      => 'fls.observations',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
            [
                'module_id' => $moduleId,
                'parent_id' => $observasiId,
                'order_by'  => 2,
                'name'      => 'Planned Task Observation (PTO)',
                'slug'      => 'fls.pto',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
            [
                'module_id' => $moduleId,
                'parent_id' => $observasiId,
                'order_by'  => 3,
                'name'      => 'Take Time Talk (TTT)',
                'slug'      => 'fls.ttt',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
            [
                'module_id' => $moduleId,
                'parent_id' => $observasiId,
                'order_by'  => 4,
                'name'      => 'Hazard Report (HR)',
                'slug'      => 'fls.hr',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
        ]);

        // ── Level 2: Risk & Tindakan children ────────────────────────────────
        DB::table('aims_menus')->insert([
            [
                'module_id' => $moduleId,
                'parent_id' => $riskId,
                'order_by'  => 1,
                'name'      => 'Risk Finding',
                'slug'      => 'fls.risks',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
            [
                'module_id' => $moduleId,
                'parent_id' => $riskId,
                'order_by'  => 2,
                'name'      => 'Corrective Action',
                'slug'      => 'fls.corrective-actions',
                'created_at'=> $now,
                'updated_at'=> $now,
            ],
        ]);

        $this->command->info('FieldLeadership menu seeded successfully (' . DB::table('aims_menus')->where('module_id', $moduleId)->count() . ' menus).');
    }
}
