<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DashboardPortalSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = DB::table('users')->where('role', 'admin')->value('id')
            ?? DB::table('users')->value('id');

        $this->seedProduction($adminId);
        $this->seedIncidentNotification($adminId);
        $this->seedSafetyPerformance($adminId);
        $this->seedHealthPerformance($adminId);
    }

    // ── Production ────────────────────────────────────────────────────────────

    private function seedProduction(?string $userId): void
    {
        // Delete the single test record inserted earlier
        DB::table('dashboard_production')->truncate();

        $years  = [2023, 2024, 2025, 2026];
        $months = range(1, 12);

        // Realistic base values per category (BCM / MT)
        $bases = [
            'coal_shiping'  => 1_800,
            'waste_removal' => 12_000,
            'coal_mining'   => 9_500,
            'coal_hauling'  => 8_200,
            'coal_barged'   => 1_600,
        ];

        $rows = [];
        foreach ($years as $year) {
            // Only seed up to current month for the current year
            $maxMonth = ($year === (int) date('Y')) ? (int) date('m') : 12;

            foreach ($months as $month) {
                if ($month > $maxMonth) continue;

                // Seasonal variation factor (lower in wet season Jan–Mar, peak Jun–Sep)
                $seasonal = match (true) {
                    $month <= 3          => 0.75,
                    $month <= 5          => 0.90,
                    $month <= 9          => 1.10,
                    $month <= 11         => 0.95,
                    default              => 0.80,
                };

                // Year-on-year growth ~5%
                $yoyFactor = 1 + ($year - 2023) * 0.05;

                $rows[] = [
                    'id'            => (string) Str::uuid(),
                    'user_id'       => $userId,
                    'visible'       => 'true',
                    'month'         => sprintf('%04d-%02d-01', $year, $month),
                    'coal_shiping'  => $this->jitter($bases['coal_shiping']  * $seasonal * $yoyFactor),
                    'waste_removal' => $this->jitter($bases['waste_removal'] * $seasonal * $yoyFactor),
                    'coal_mining'   => $this->jitter($bases['coal_mining']   * $seasonal * $yoyFactor),
                    'coal_hauling'  => $this->jitter($bases['coal_hauling']  * $seasonal * $yoyFactor),
                    'coal_barged'   => $this->jitter($bases['coal_barged']   * $seasonal * $yoyFactor),
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
        }

        // Insert in chunks to avoid max_allowed_packet issues
        foreach (array_chunk($rows, 50) as $chunk) {
            DB::table('dashboard_production')->insert($chunk);
        }

        $this->command->info('  Production seeded: ' . count($rows) . ' records across ' . count($years) . ' years.');
    }

    // ── Incident Notification ─────────────────────────────────────────────────

    private function seedIncidentNotification(?string $userId): void
    {
        DB::table('dashboard_incident_notification')->truncate();

        $cases = [
            ['case' => 'Tangan tergores benda tajam di area workshop',        'category' => 'Safety'],
            ['case' => 'Tumpahan oli di area jalan tambang',                  'category' => 'Environmental'],
            ['case' => 'Nyaris tertabrak forklift di area gudang',            'category' => 'Safety'],
            ['case' => 'Karyawan terpapar debu batubara tanpa APD',           'category' => 'Health'],
            ['case' => 'Belt conveyor berhenti mendadak saat operasi',        'category' => 'Operational'],
            ['case' => 'Kebocoran hydrolic pada excavator unit 12',           'category' => 'Operational'],
            ['case' => 'Piring jatuh dari meja makan di kantin',              'category' => 'Safety'],
            ['case' => 'Kabel listrik terkelupas di office area',             'category' => 'Security'],
            ['case' => 'Pot pecah tersenggol karyawan di lobby',              'category' => 'Safety'],
            ['case' => 'Air limbah merembes ke area sungai kecil',            'category' => 'Environmental'],
            ['case' => 'Meja rusak saat diangkat di ruang rapat',             'category' => 'Safety'],
            ['case' => 'Karyawan terpeleset di toilet akibat lantai basah',   'category' => 'Health'],
            ['case' => 'Asap tebal dari pembakaran sampah di camp',           'category' => 'Environmental'],
            ['case' => 'Helm keselamatan tidak dipakai di pit area',          'category' => 'Safety'],
            ['case' => 'Dump truck overload melewati jalan tambang',          'category' => 'Operational'],
            ['case' => 'Kebakaran kecil di area genset akibat korsleting',    'category' => 'Security'],
            ['case' => 'Karyawan jatuh dari tangga karena tidak ada railing', 'category' => 'Safety'],
            ['case' => 'Kebisingan mesin melebihi ambang batas NAB',          'category' => 'Health'],
            ['case' => 'Tumpahan bahan kimia B3 di gudang penyimpanan',       'category' => 'Environmental'],
            ['case' => 'Conveyor belt sobek sehingga produksi terhenti',      'category' => 'Operational'],
        ];

        $rows = [];
        $startDate = now()->subYears(2)->startOfYear();
        $endDate   = now();
        $current   = $startDate->copy();

        $idx = 0;
        while ($current->lte($endDate)) {
            // 1–3 incidents per month
            $count = rand(1, 3);
            for ($i = 0; $i < $count; $i++) {
                $caseData = $cases[$idx % count($cases)];
                $day      = rand(1, (int) $current->daysInMonth);

                $rows[] = [
                    'id'          => (string) Str::uuid(),
                    'user_id'     => $userId,
                    'slug'        => Str::slug($caseData['case']) . '-' . $current->format('Ym') . '-' . $i,
                    'date'        => $current->format('Y-m-') . sprintf('%02d', $day),
                    'case'        => $caseData['case'],
                    'category'    => $caseData['category'],
                    'description' => 'Kejadian ini dilaporkan oleh tim ' . $caseData['category'] . ' pada bulan '
                        . $current->format('F Y') . '. Tindakan perbaikan telah dilakukan sesuai prosedur.',
                    'visible'     => rand(0, 5) > 0 ? 'true' : 'false', // ~83% visible
                    'attc'        => null,
                    'url'         => null,
                    'blob_url'    => null,
                    'blob_response' => null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
                $idx++;
            }
            $current->addMonth();
        }

        foreach (array_chunk($rows, 50) as $chunk) {
            DB::table('dashboard_incident_notification')->insert($chunk);
        }

        $this->command->info('  Incident Notification seeded: ' . count($rows) . ' records.');
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    /** Apply ±10% random jitter and round to 2 decimal places. */
    private function jitter(float $base): float
    {
        $factor = 1 + (rand(-10, 10) / 100);
        return round($base * $factor, 2);
    }

    private function seedSafetyPerformance(?string $userId): void
    {
        DB::table('dashboard_safety_performance')->truncate();

        $rows  = [];
        $years = [2023, 2024, 2025, 2026];

        // Realistic base values — small decimals
        $bases = ['aifr' => 1.85, 'ainfr' => 4.20, 'lti_fr' => 0.42, 'lti_sr' => 12.50];

        foreach ($years as $year) {
            $maxMonth = ($year === (int) date('Y')) ? (int) date('m') : 12;
            for ($m = 1; $m <= $maxMonth; $m++) {
                $rows[] = [
                    'id'      => (string) \Illuminate\Support\Str::uuid(),
                    'user_id' => $userId,
                    'visible' => 'true',
                    'month'   => sprintf('%04d-%02d-01', $year, $m),
                    'aifr'    => round($bases['aifr']   * (1 + (rand(-15, 15) / 100)), 4),
                    'ainfr'   => round($bases['ainfr']  * (1 + (rand(-15, 15) / 100)), 4),
                    'lti_fr'  => round($bases['lti_fr'] * (1 + (rand(-20, 20) / 100)), 4),
                    'lti_sr'  => round($bases['lti_sr'] * (1 + (rand(-20, 20) / 100)), 4),
                    'created_at' => now(), 'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($rows, 50) as $chunk) DB::table('dashboard_safety_performance')->insert($chunk);
        $this->command->info('  Safety Performance seeded: ' . count($rows) . ' records.');
    }

    private function seedHealthPerformance(?string $userId): void
    {
        DB::table('dashboard_health_performance')->truncate();

        $rows  = [];
        $years = [2023, 2024, 2025, 2026];

        $bases = ['rkk' => 95.00, 'cmr' => 3.20, 'mmr' => 8.50, 'ssr' => 2.10, 'asr' => 1.80];

        foreach ($years as $year) {
            $maxMonth = ($year === (int) date('Y')) ? (int) date('m') : 12;
            for ($m = 1; $m <= $maxMonth; $m++) {
                $rows[] = [
                    'id'      => (string) \Illuminate\Support\Str::uuid(),
                    'user_id' => $userId,
                    'visible' => 'true',
                    'month'   => sprintf('%04d-%02d-01', $year, $m),
                    'rkk'     => round($bases['rkk'] * (1 + (rand(-5,  5)  / 100)), 4),
                    'cmr'     => round($bases['cmr'] * (1 + (rand(-15, 15) / 100)), 4),
                    'mmr'     => round($bases['mmr'] * (1 + (rand(-15, 15) / 100)), 4),
                    'ssr'     => round($bases['ssr'] * (1 + (rand(-20, 20) / 100)), 4),
                    'asr'     => round($bases['asr'] * (1 + (rand(-20, 20) / 100)), 4),
                    'created_at' => now(), 'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($rows, 50) as $chunk) DB::table('dashboard_health_performance')->insert($chunk);
        $this->command->info('  Health Performance seeded: ' . count($rows) . ' records.');
    }
}
