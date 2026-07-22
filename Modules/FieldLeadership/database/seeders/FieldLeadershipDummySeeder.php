<?php

namespace Modules\FieldLeadership\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FieldLeadershipDummySeeder extends Seeder
{
    /**
     * Run the database seeds for Field Leadership dummy data.
     */
    public function run(): void
    {
        $now = now();

        // 1. Seed Limit Parameters
        DB::table('field_leadership_parameters')->updateOrInsert(
            ['id' => '00000000-0000-0000-0000-000000000001'],
            [
                'max_item_member'             => 5,
                'max_item_positive_condition' => 5,
                'max_item_risk_condition'     => 5,
                'max_item_corrective_action'  => 5,
                'created_at'                  => $now,
                'updated_at'                  => $now,
            ]
        );

        // 2. Seed Master Categories (Kondisi Tidak Aman & Tindakan Tidak Aman)
        $catKtaId = (string) Str::uuid();
        $catTtaId = (string) Str::uuid();

        DB::table('field_leadership_categories')->updateOrInsert(
            ['name' => 'Kondisi Tidak Aman'],
            ['id' => $catKtaId, 'created_at' => $now, 'updated_at' => $now]
        );

        DB::table('field_leadership_categories')->updateOrInsert(
            ['name' => 'Tindakan Tidak Aman'],
            ['id' => $catTtaId, 'created_at' => $now, 'updated_at' => $now]
        );

        // Fetch category IDs in case they existed
        $catKtaId = DB::table('field_leadership_categories')->where('name', 'Kondisi Tidak Aman')->value('id');
        $catTtaId = DB::table('field_leadership_categories')->where('name', 'Tindakan Tidak Aman')->value('id');

        // 3. Seed Master Jenis KTA & TTA
        $ktaTypes = [
            ['code' => 'KTA-01', 'name' => 'Lantai Licin / Beroli', 'type' => 'KTA'],
            ['code' => 'KTA-02', 'name' => 'Penerangan Kurang Memadai', 'type' => 'KTA'],
            ['code' => 'KTA-03', 'name' => 'Kabel Listrik Terkelupas / Terbuka', 'type' => 'KTA'],
            ['code' => 'TTA-01', 'name' => 'Tidak Menggunakan APD Lengkap', 'type' => 'TTA'],
            ['code' => 'TTA-02', 'name' => 'Mengoperasikan Alat Tanpa Izin/KIM', 'type' => 'TTA'],
            ['code' => 'TTA-03', 'name' => 'Bekerja di Ketinggian Tanpa Harness', 'type' => 'TTA'],
        ];

        foreach ($ktaTypes as $item) {
            DB::table('field_leadership_kta_and_ttas')->updateOrInsert(
                ['code' => $item['code']],
                [
                    'id'         => (string) Str::uuid(),
                    'name'       => $item['name'],
                    'type'       => $item['type'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // 4. Seed Master Potensi / Konsekuensi
        $potencies = [
            ['code' => 'P-01', 'name' => 'Low Risk (Pertolongan Pertama)'],
            ['code' => 'P-02', 'name' => 'Medium Risk (Memerlukan Perawatan Medis)'],
            ['code' => 'P-03', 'name' => 'High Risk (Cacat / Fatality)'],
        ];

        foreach ($potencies as $item) {
            DB::table('field_leadership_potency_and_consequnces')->updateOrInsert(
                ['code' => $item['code']],
                [
                    'id'         => (string) Str::uuid(),
                    'name'       => $item['name'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // Fetch / Ensure Master Companies & Departments
        $companyId = DB::table('companies')->value('id');
        if (!$companyId) {
            $companyId = (string) Str::uuid();
            DB::table('companies')->insert([
                'id'           => $companyId,
                'company_name' => 'PT Adaro Indonesia',
                'created_at'   => $now,
                'updated_at'   => $now,
            ]);
        }

        $ccowId = DB::table('companies')->where('id', '!=', $companyId)->value('id') ?? $companyId;

        $departmentId = DB::table('departments')->value('id');
        if (!$departmentId) {
            $departmentId = (string) Str::uuid();
            DB::table('departments')->insert([
                'id'         => $departmentId,
                'name'       => 'HSE & Operation',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $sectionId = DB::table('sections')->value('id');
        if (!$sectionId) {
            $sectionId = (string) Str::uuid();
            DB::table('sections')->insert([
                'id'            => $sectionId,
                'department_id' => $departmentId,
                'name'          => 'Mining Safety Section',
                'created_at'    => $now,
                'updated_at'    => $now,
            ]);
        }

        $areaLocationId = DB::table('area_locations')->value('id');
        if (!$areaLocationId) {
            $areaLocationId = (string) Str::uuid();
            DB::table('area_locations')->insert([
                'id'         => $areaLocationId,
                'section_id' => $sectionId,
                'name'       => 'Pit West Area',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Fetch / Ensure User & Employee records for PJO and Creator links
        $user = DB::table('users')->first();
        if (!$user) {
            $userId = (string) Str::uuid();
            DB::table('users')->insert([
                'id'         => $userId,
                'name'       => 'Super Admin K3',
                'email'      => 'admin.k3@adaro.com',
                'password'   => bcrypt('password'),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        } else {
            $userId = $user->id;
        }

        $pjoUser = DB::table('users')->where('id', '!=', $userId)->first();
        if (!$pjoUser) {
            $pjoUserId = (string) Str::uuid();
            DB::table('users')->insert([
                'id'         => $pjoUserId,
                'name'       => 'Bambang Pratama (PJO)',
                'email'      => 'pjo.bambang@adaro.com',
                'password'   => bcrypt('password'),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        } else {
            $pjoUserId = $pjoUser->id;
        }

        $employee = DB::table('employees')->first();
        if (!$employee) {
            $employeeId = (string) Str::uuid();
            DB::table('employees')->insert([
                'id'         => $employeeId,
                'name'       => 'Agus Setiawan (HSE Officer)',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        } else {
            $employeeId = $employee->id;
        }

        $ktaTypeObj = DB::table('field_leadership_kta_and_ttas')->first();
        $potencyObj = DB::table('field_leadership_potency_and_consequnces')->first();

        $dummyPjaId = (string) Str::uuid();

        // 5. Seed Sample Dummy Field Leadership Observations across all workflow approval stages
        $dummyObservations = [
            [
                'id'                      => (string) Str::uuid(),
                'date'                    => now()->format('Y-m-d'),
                'ccow_id'                 => $ccowId,
                'company_id'              => $companyId,
                'department_id'           => $departmentId,
                'section_id'              => $sectionId,
                'area_location_id'        => $areaLocationId,
                'detail_company'          => 'PT Adaro Mining Services',
                'detail_location'         => 'Pit West 2 Block A',
                'pja_id'                  => $dummyPjaId,
                'pjo_id'                  => $pjoUserId,
                'type'                    => 'Planned Task Observation',
                'job'                     => 'Inspeksi Prosedur Bekerja di Ketinggian (SOP-K3-WAH)',
                'visit_time'              => 45,
                'is_area_suitable'        => true,
                'personil_on_review'      => 4,
                'personil_on_review_name' => 'Tim Maintenance Area A',
                'status'                  => 'Open',
                'published'               => 'Publish',
                'created_by'              => $employeeId,
                'created_at'              => now()->subDays(3),
                'updated_at'              => now()->subDays(3),
            ],
            [
                'id'                      => (string) Str::uuid(),
                'date'                    => now()->subDays(1)->format('Y-m-d'),
                'ccow_id'                 => $ccowId,
                'company_id'              => $companyId,
                'department_id'           => $departmentId,
                'section_id'              => $sectionId,
                'area_location_id'        => $areaLocationId,
                'detail_company'          => 'PT Adaro Mining Services',
                'detail_location'         => 'Workshop Hauling Road KM 12',
                'pja_id'                  => $dummyPjaId,
                'pjo_id'                  => $pjoUserId,
                'type'                    => 'Take Time Talk',
                'job'                     => 'Diskusi Keselamatan Pengoperasian Unit Dump Truck',
                'visit_time'              => 30,
                'is_area_suitable'        => true,
                'personil_on_review'      => 2,
                'personil_on_review_name' => 'Budi Santoso & Operator DT',
                'status'                  => 'On Review PJA',
                'published'               => 'Publish',
                'created_by'              => $employeeId,
                'created_at'              => now()->subDays(2),
                'updated_at'              => now()->subDays(2),
            ],
            [
                'id'                      => (string) Str::uuid(),
                'date'                    => now()->subDays(1)->format('Y-m-d'),
                'ccow_id'                 => $ccowId,
                'company_id'              => $companyId,
                'department_id'           => $departmentId,
                'section_id'              => $sectionId,
                'area_location_id'        => $areaLocationId,
                'detail_company'          => 'PT Bukit Asam Subcon',
                'detail_location'         => 'Area Disposal North Block',
                'pja_id'                  => $dummyPjaId,
                'pjo_id'                  => $pjoUserId,
                'type'                    => 'Planned Task Observation',
                'job'                     => 'Pemeriksaan Kelayakan Tanggul Disposal & Drainage',
                'visit_time'              => 60,
                'is_area_suitable'        => true,
                'personil_on_review'      => 3,
                'personil_on_review_name' => 'Tim Civil Disposal',
                'status'                  => 'On Review Approval',
                'published'               => 'Publish',
                'created_by'              => $employeeId,
                'created_at'              => now()->subDays(1),
                'updated_at'              => now()->subDays(1),
            ],
            [
                'id'                      => (string) Str::uuid(),
                'date'                    => now()->format('Y-m-d'),
                'ccow_id'                 => $ccowId,
                'company_id'              => $companyId,
                'department_id'           => $departmentId,
                'section_id'              => $sectionId,
                'area_location_id'        => $areaLocationId,
                'detail_company'          => 'PT Contractor Subcon Jaya',
                'detail_location'         => 'Stockpile Port Loading',
                'pja_id'                  => $dummyPjaId,
                'pjo_id'                  => $pjoUserId,
                'type'                    => 'Hazard Report',
                'job'                     => 'Pelaporan Ceceran Oli di Area Tangki Solar',
                'visit_time'              => 20,
                'is_area_suitable'        => false,
                'personil_on_review'      => 1,
                'personil_on_review_name' => 'Rahmat Hidayat',
                'status'                  => 'Closed',
                'published'               => 'Publish',
                'created_by'              => $employeeId,
                'created_at'              => now(),
                'updated_at'              => now(),
            ],
        ];

        foreach ($dummyObservations as $obs) {
            DB::table('field_leaderships')->updateOrInsert(
                ['id' => $obs['id']],
                $obs
            );

            // Add Questions for PTO
            if ($obs['type'] === 'Planned Task Observation') {
                DB::table('field_leadership_question_ptos')->insert([
                    [
                        'id'          => (string) Str::uuid(),
                        'fl_id'       => $obs['id'],
                        'question'    => 'Apakah pekerja memahami JSA/SOP pekerjaan?',
                        'answer'      => 'Ya',
                        'description' => 'Pekerja telah menguraikan bahaya utama dengan tepat.',
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ],
                    [
                        'id'          => (string) Str::uuid(),
                        'fl_id'       => $obs['id'],
                        'question'    => 'Apakah APD yang digunakan sesuai dengan standar?',
                        'answer'      => 'Ya',
                        'description' => 'Helm, rompi, dan sepatu safety dalam kondisi baik.',
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ]
                ]);
            }

            // Add Positives
            DB::table('field_leadership_positives')->insert([
                'id'          => (string) Str::uuid(),
                'fl_id'       => $obs['id'],
                'description' => 'Tim melakuakan housekeeping area kerja sebelum memulai aktifitas.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);

            // Add Risks
            DB::table('field_leadership_risks')->insert([
                'id'             => (string) Str::uuid(),
                'fl_id'          => $obs['id'],
                'risk_condition' => 'Terdapat genangan oli di dekat tangga akses platform kerja.',
                'category_id'    => $catKtaId,
                'type_id'        => $ktaTypeObj?->id,
                'potency_id'     => $potencyObj?->id,
                'repair_action'  => 'Langsung dibersihkan menggunakan oil absorbent pad dan ditabur pasir.',
                'due_date'       => now()->addDays(2)->format('Y-m-d'),
                'type_action'    => 'Eliminasi',
                'supervisor'     => 'Supriyadi (Foreman Maintenance)',
                'status'         => $obs['status'],
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);

            // Add Activity Log
            DB::table('field_leadership_activities')->insert([
                'id'          => (string) Str::uuid(),
                'fl_id'       => $obs['id'],
                'description' => 'Observasi berhasil disubmit sebagai ' . $obs['published'],
                'user_id'     => $userId,
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);
        }

        $this->command->info('FieldLeadership dummy data seeded successfully.');
    }
}
