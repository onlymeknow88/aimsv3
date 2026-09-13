<?php

namespace Modules\DocumentSystem\Database\Seeders;

use App\Models\AreaManager;
use App\Models\Company;
use App\Models\Department;
use App\Models\User;use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\DocumentSystem\Services\PtwService;

/**
 * Dummy PTW documents + people + activities.
 *
 * Run: php artisan db:seed --class=Modules\DocumentSystem\Database\Seeders\PtwDummySeeder
 * Skips when ptw_documents already has rows (no duplicate seeding).
 * No attachments are seeded (files live in blob storage).
 */
class PtwDummySeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('ptw_documents')->count() > 0) {
            $this->command->info('ptw_documents already has data, skipping PtwDummySeeder.');
            return;
        }

        $companies = Company::select('id', 'company_name')->limit(3)->get();
        $departments = Department::select('id', 'name')->limit(4)->get();
        $users = User::select('id', 'name', 'email')->limit(5)->get();

        if ($companies->isEmpty() || $departments->isEmpty() || $users->isEmpty()) {
            $this->command->error('Need at least 1 company, 1 department, and 1 user to seed PTW dummies.');
            return;
        }

        $service = app(PtwService::class);

        $dummies = [
            ['title' => 'Hot Work Pengelasan Conveyor CV-02', 'location' => 'Pit Timur - Transfer House 3', 'status' => '5', 'days_ago' => 45, 'inactive' => false],
            ['title' => 'Working at Height Penggantian Atap Workshop', 'location' => 'Workshop Utama - Blok B', 'status' => '5', 'days_ago' => 30, 'inactive' => false],
            ['title' => 'Confined Space Cleaning Tangki Solar T-05', 'location' => 'Fuel Station - Tangki T-05', 'status' => '5', 'days_ago' => 60, 'inactive' => true],
            ['title' => 'Electrical Maintenance Panel Genset 500 kVA', 'location' => 'Power House - Genset 2', 'status' => '2', 'days_ago' => 3, 'inactive' => false],
            ['title' => 'Hot Work Pemotongan Pipa Dewatering', 'location' => 'Sump Pit Barat - Pompa 4', 'status' => '2', 'days_ago' => 1, 'inactive' => false],
            ['title' => 'General Permit Mobilisasi Crane 50 Ton', 'location' => 'Laydown Area - Stockpile', 'status' => '1', 'days_ago' => 2, 'inactive' => false],
            ['title' => 'Working at Height Inspeksi Tower Lamp 30m', 'location' => 'Hauling Road KM 7 - TL 12', 'status' => '1', 'days_ago' => 0, 'inactive' => false],
            ['title' => 'Confined Space Inspeksi Septic Tank Camp', 'location' => 'Camp Mess - Blok C', 'status' => '1', 'days_ago' => 5, 'inactive' => false],
        ];

        foreach ($dummies as $i => $d) {
            $company = $companies[$i % $companies->count()];
            $dept = $departments[$i % $departments->count()];
            $pic = $users[$i % $users->count()];
            $reviewer = $users[($i + 1) % $users->count()];
            $docCreated = now()->subDays($d['days_ago'])->setTime(8, 0);

            // area_manager_id mengacu ke area_managers.id (konvensi modul Document),
            // sama seperti opsi pjs-by-department di form
            $areaManager = AreaManager::firstOrCreate(['user_id' => $reviewer->id]);

            $docId = (string) Str::uuid();
            DB::table('ptw_documents')->insert([
                'id' => $docId,
                'company_id' => $company->id,
                'department_id' => $dept->id,
                'user_id' => $pic->id,
                'area_manager_id' => $areaManager->id,
                'status' => $d['status'],
                'title' => $d['title'],
                'description' => '<p>Pekerjaan berisiko tinggi, wajib toolbox meeting, APD lengkap, dan pengawasan pengawas lapangan selama pekerjaan berlangsung.</p>',
                'document_number' => $service->buildDocumentNumber($company->id, $dept->id),
                'doc_created' => $docCreated,
                'inactive_at' => $d['inactive'] ? now()->subDays(5) : null,
                'detail_location' => $d['location'],
                'created_at' => $docCreated,
                'updated_at' => $docCreated,
            ]);

            // Invited people: 1 internal + 1 eksternal
            DB::table('ptw_document_people')->insert([
                [
                    'id' => (string) Str::uuid(),
                    'ptw_document_id' => $docId,
                    'user_id' => $reviewer->id,
                    'email' => $reviewer->email,
                    'role' => 'reviewer',
                    'status' => 'active',
                    'created_at' => $docCreated,
                    'updated_at' => $docCreated,
                ],
                [
                    'id' => (string) Str::uuid(),
                    'ptw_document_id' => $docId,
                    'user_id' => null,
                    'email' => 'kontraktor.lapangan@example.com',
                    'role' => 'pelaksana',
                    'status' => 'active',
                    'created_at' => $docCreated,
                    'updated_at' => $docCreated,
                ],
            ]);

            // Activity trail sesuai status
            $trail = [['Document Created', 'Dokumen PTW dibuat sebagai draft.']];
            if (in_array($d['status'], ['2', '5'])) {
                $trail[] = ['Submitted for Review', 'Dokumen dikirim untuk direview.'];
            }
            if ($d['status'] === '5') {
                $trail[] = ['Document Approved', 'Dokumen telah disetujui dan diaktifkan.'];
            }
            if ($d['inactive']) {
                $trail[] = ['Document Deactivated', 'PTW dinonaktifkan.'];
            }
            foreach ($trail as $j => [$activity, $notes]) {
                DB::table('ptw_document_activities')->insert([
                    'id' => (string) Str::uuid(),
                    'ptw_document_id' => $docId,
                    'user_id' => $j === 0 ? $pic->id : $reviewer->id,
                    'activity' => $activity,
                    'notes' => $notes,
                    'created_at' => $docCreated->copy()->addHours($j + 1),
                    'updated_at' => $docCreated->copy()->addHours($j + 1),
                ]);
            }
        }

        $this->command->info('Seeded ' . count($dummies) . ' dummy PTW documents.');
    }
}
