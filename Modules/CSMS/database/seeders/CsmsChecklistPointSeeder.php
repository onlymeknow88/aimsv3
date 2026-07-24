<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsChecklist;
use Carbon\Carbon;

class CsmsChecklistPointSeeder extends Seeder
{
    /**
     * Seed csms_checklists dengan data dummy untuk point dan timestamps.
     *
     * Logic:
     * - Ambil semua Bidding yang ada
     * - Untuk setiap Bidding, buat 3-5 checklist records dengan point random
     * - Set created_at spread across 2024-2026
     */
    public function run(): void
    {
        $this->command->info('Seeding csms_checklists...');

        // Kategori point sesuai aims lama
        $points = [
            'BIDDING PROCESS',
            'PERPANJANGAN SERTIFIKASI CSMS',
            'POST KUALIFIKASI',
        ];

        // Ambil semua Bidding
        $biddings = Bidding::all();

        if ($biddings->isEmpty()) {
            $this->command->warn('No biddings found. Creating sample biddings first...');
            $this->createSampleBiddings();
            $biddings = Bidding::all();
        }

        $this->command->info("Found {$biddings->count()} biddings");

        $totalCreated = 0;

        foreach ($biddings as $bidding) {
            // Buat 3-5 checklist per bidding
            $checklistCount = rand(3, 5);

            for ($i = 0; $i < $checklistCount; $i++) {
                // Random point
                $point = $points[array_rand($points)];

                // Random date antara 2024-2026
                $year = rand(2024, 2026);
                $month = rand(1, 12);
                $day = rand(1, 28);
                $createdAt = Carbon::create($year, $month, $day)
                    ->addHours(rand(0, 23))
                    ->addMinutes(rand(0, 59));

                CsmsChecklist::create([
                    'bidding_id'     => $bidding->id,
                    'question_id'    => \DB::table('csms_master_data_checklists')->inRandomOrder()->value('id') ?? \Illuminate\Support\Str::uuid(),
                    'value'          => rand(0, 1) ? 'Yes' : 'No',
                    'comment'        => $this->generateComment(),
                    'point'          => $point,
                    'ordinal_number' => $i + 1,
                    'created_at'     => $createdAt,
                    'updated_at'     => $createdAt->copy()->addDays(rand(0, 30)),
                ]);

                $totalCreated++;
            }
        }

        $this->command->info("✓ Created {$totalCreated} checklist records");

        // Summary per point
        $this->command->info("\n=== Summary by Point ===");
        foreach ($points as $point) {
            $count = CsmsChecklist::where('point', $point)->count();
            $this->command->info("{$point}: {$count} records");
        }

        // Summary per year
        $this->command->info("\n=== Summary by Year ===");
        for ($year = 2024; $year <= 2026; $year++) {
            $count = CsmsChecklist::whereYear('created_at', $year)->count();
            $this->command->info("Year {$year}: {$count} records");
        }
    }

    private function createSampleBiddings(): void
    {
        $criteria = ['Bidding', 'Post Bidding', 'Renewal'];
        $statuses = ['Draft', 'On Review OHS', 'Approved', 'Inactive'];

        for ($i = 0; $i < 10; $i++) {
            Bidding::create([
                'criteria'              => $criteria[array_rand($criteria)],
                'status'                => $statuses[array_rand($statuses)],
                'requested'             => 'Approved',
                'business_entity_id'    => 1,
                'business_entity_name'  => 'Sample Company ' . ($i + 1),
                'contractor_name'       => 'Contractor ' . ($i + 1),
                'work_location'         => 'Location ' . ($i + 1),
                'work_description'      => 'Sample work description',
                'contract_value'        => rand(100000000, 1000000000),
                'contract_number'       => 'CTR-' . date('Y') . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'contract_start_date'   => Carbon::now()->subMonths(rand(1, 12)),
                'contract_end_date'     => Carbon::now()->addMonths(rand(6, 24)),
                'risk_category'         => ['Rendah', 'Menengah', 'Tinggi'][array_rand(['Rendah', 'Menengah', 'Tinggi'])],
                'classification'        => ['Kontraktor Utama', 'Kontraktor Langsung', 'Subkontraktor Tunggal'][array_rand(['Kontraktor Utama', 'Kontraktor Langsung', 'Subkontraktor Tunggal'])],
                'created_at'            => Carbon::now()->subMonths(rand(1, 24)),
            ]);
        }
        $this->command->info('✓ Created 10 sample biddings');
    }

    private function generateComment(): ?string
    {
        $comments = [
            'Sesuai standar',
            'Memenuhi persyaratan',
            'Perlu perbaikan minor',
            'Sudah lengkap',
            'Dokumentasi tersedia',
            null,
        ];
        return $comments[array_rand($comments)];
    }
}
