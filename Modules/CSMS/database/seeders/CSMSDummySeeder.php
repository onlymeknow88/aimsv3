<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CSMSDummySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure master companies exist
        $companies = [
            [
                'id' => (string) Str::uuid(),
                'company_name' => 'PT Adaro Indonesia (Internal CCOW)',
                'type' => 'Internal',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'company_name' => 'PT SIS (External Contractor)',
                'type' => 'Contractor',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'company_name' => 'PT Buma (Sub-Contractor)',
                'type' => 'Sub-Contractor',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($companies as $comp) {
            if (!DB::table('companies')->where('company_name', $comp['company_name'])->exists()) {
                DB::table('companies')->insert($comp);
            }
        }

        $ccowCompany = DB::table('companies')->where('type', 'Internal')->first();
        $contractorCompany = DB::table('companies')->where('type', 'Contractor')->first();

        // 2. Ensure business entities exist
        $entities = [
            ['id' => (string) Str::uuid(), 'name' => 'Perseroan Terbatas (PT)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'name' => 'Commanditaire Vennootschap (CV)', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'name' => 'Koperasi', 'created_at' => now(), 'updated_at' => now()]
        ];

        foreach ($entities as $ent) {
            if (!DB::table('business_entities')->where('name', $ent['name'])->exists()) {
                DB::table('business_entities')->insert($ent);
            }
        }

        $be = DB::table('business_entities')->first();

        // 3. Clear existing biddings for clean start if requested (optional, here we just insert)
        $makerId = DB::table('users')->first()?->id;

        $dummyBiddings = [
            // Bidding approvals
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'Bidding',
                'status' => 'On Review OHS',
                'requested' => 'Requested OHS',
                'company_name' => 'PT Kalimantan Prima Persada',
                'license_number' => 'LIC-B-OHS-001',
                'address' => 'Jl. Jenderal Sudirman No. 10',
                'company_site' => 'Site Adaro Wara',
                'classification' => 'Kontraktor',
                'service_criteria' => 'High Risk Services',
                'risk_category' => 'High',
                'csms_doc_number' => 'DOC-CSMS-KPP-001',
                'person_in_charge' => 'Budi Santoso',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'Bidding',
                'status' => 'On Review D/H OHS',
                'requested' => 'Requested D/H OHS',
                'company_name' => 'PT United Tractors Tbk',
                'license_number' => 'LIC-B-DHOHS-002',
                'address' => 'Kawasan Industri Pulo Gadung',
                'company_site' => 'Site Adaro Tutupan',
                'classification' => 'Kontraktor',
                'service_criteria' => 'Medium Risk Services',
                'risk_category' => 'Medium',
                'csms_doc_number' => 'DOC-CSMS-UT-002',
                'person_in_charge' => 'Aris Wijaya',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'Bidding',
                'status' => 'On Review KTT',
                'requested' => 'Requested KTT',
                'company_name' => 'PT Pamapersada Nusantara',
                'license_number' => 'LIC-B-KTT-003',
                'address' => 'Jl. Pulo Kambing II',
                'company_site' => 'Site Adaro Balangan',
                'classification' => 'Kontraktor',
                'service_criteria' => 'High Risk Services',
                'risk_category' => 'High',
                'csms_doc_number' => 'DOC-CSMS-PAMA-003',
                'person_in_charge' => 'Rahmat Hidayat',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Post-Bidding approvals
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'PostBidding',
                'status' => 'On Review OHS',
                'requested' => 'Requested OHS',
                'company_name' => 'PT Hexindo Adiperkasa Tbk',
                'license_number' => 'LIC-PB-OHS-004',
                'address' => 'Kawasan Industri MM2100',
                'company_site' => 'Site Adaro Wara',
                'classification' => 'Sub-Kontraktor',
                'parent_id' => $contractorCompany?->id,
                'company_id' => $contractorCompany?->id,
                'service_criteria' => 'Low Risk Services',
                'risk_category' => 'Low',
                'csms_doc_number' => 'DOC-CSMS-HEXA-004',
                'person_in_charge' => 'Dani Setiawan',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'PostBidding',
                'status' => 'On Review D/H OHS',
                'requested' => 'Requested D/H OHS',
                'company_name' => 'PT Trakindo Utama',
                'license_number' => 'LIC-PB-DHOHS-005',
                'address' => 'Jl. Cilandak KKO',
                'company_site' => 'Site Adaro Tutupan',
                'classification' => 'Kontraktor',
                'service_criteria' => 'High Risk Services',
                'risk_category' => 'High',
                'csms_doc_number' => 'DOC-CSMS-TRAK-005',
                'person_in_charge' => 'Gerry Alamsyah',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => (string) Str::uuid(),
                'criteria' => 'PostBidding',
                'status' => 'On Review KTT',
                'requested' => 'Requested KTT',
                'company_name' => 'PT Madhani Talatah Nusantara',
                'license_number' => 'LIC-PB-KTT-006',
                'address' => 'Kebayoran Baru, Jakarta Selatan',
                'company_site' => 'Site Adaro Balangan',
                'classification' => 'Kontraktor',
                'service_criteria' => 'High Risk Services',
                'risk_category' => 'High',
                'csms_doc_number' => 'DOC-CSMS-MTN-006',
                'person_in_charge' => 'Rian Prabowo',
                'date' => now()->toDateString(),
                'ccow_id' => $ccowCompany?->id,
                'business_entity_id' => $be?->id,
                'maker_id' => $makerId,
                'is_obsolate' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        // Clear existing dummy biddings to force a fresh seed with checklists
        $licenseNumbers = collect($dummyBiddings)->pluck('license_number')->toArray();
        DB::table('biddings')->whereIn('license_number', $licenseNumbers)->delete();

        $seededBiddings = [];
        foreach ($dummyBiddings as $bid) {
            if (!DB::table('biddings')->where('license_number', $bid['license_number'])->exists()) {
                DB::table('biddings')->insert($bid);
                $seededBiddings[] = $bid;

                $masterChecklists = DB::table('csms_master_data_checklists')
                    ->where('criteria', $bid['criteria'])
                    ->get();

                foreach ($masterChecklists as $mc) {
                    DB::table('csms_checklists')->insert([
                        'id' => (string) Str::uuid(),
                        'bidding_id' => $bid['id'],
                        'question_id' => $mc->id,
                        'value' => collect(['Ya', 'Tidak', 'N/A'])->random(),
                        'comment' => 'Catatan uji coba seeder.',
                        'ordinal_number' => null,
                    ]);
                }
            } else {
                $seededBiddings[] = (array) DB::table('biddings')->where('license_number', $bid['license_number'])->first();
            }
        }

        // 4. Seed PJO (Penanggung Jawab Operasional)
        DB::table('csms_pjo_files')->truncate();
        DB::table('csms_pjos')->delete();

        foreach ($companies as $index => $comp) {
            $companyDb = DB::table('companies')->where('company_name', $comp['company_name'])->first();
            if (!$companyDb) continue;

            $statuses = ['Draft', 'On Review Evaluator', 'Approved'];
            foreach ($statuses as $status) {
                $pjoId = (string) Str::uuid();
                DB::table('csms_pjos')->insert([
                    'id' => $pjoId,
                    'company_id' => $companyDb->id,
                    'criteria' => 'PJO',
                    'ccow_id' => $ccowCompany?->id,
                    'submission' => collect(['Baru', 'Perpanjangan'])->random(),
                    'number_pjo' => 'PJO/CSMS/' . rand(100, 999) . '/' . date('Y'),
                    'name' => 'PJO User ' . rand(1, 100),
                    'date_of_birth' => '1990-01-01',
                    'phone' => '08123456789' . rand(0, 9),
                    'email' => 'pjo.user' . rand(1, 100) . '@gmail.com',
                    'date_submission' => now()->toDateString(),
                    'date_approved' => $status === 'Approved' ? now()->toDateString() : null,
                    'status' => $status,
                    'published' => 'Published',
                    'requested' => $status === 'On Review Evaluator' ? 'Requested Evaluator' : null,
                    'created_by' => $makerId,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // PJO Files
                DB::table('csms_pjo_files')->insert([
                    'id' => (string) Str::uuid(),
                    'pjo_id' => $pjoId,
                    'file' => 'dummy_document.pdf',
                    'name' => 'SK PJO / Sertifikat Kompetensi',
                    'size' => '102400',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // 5. Seed Memo KTT
        DB::table('csms_memo_ktt_files')->truncate();
        DB::table('csms_memo_ktts')->delete();

        for ($i = 1; $i <= 5; $i++) {
            $memoId = (string) Str::uuid();
            DB::table('csms_memo_ktts')->insert([
                'id' => $memoId,
                'ccow_id' => $ccowCompany?->id,
                'ktt_id' => $makerId,
                'memo_number' => 'MEMO/KTT/' . date('Y') . '/00' . $i,
                'title' => 'Memo KTT Kepatuhan CSMS Tahap ' . $i,
                'date' => now()->toDateString(),
                'description' => 'Ini adalah deskripsi dummy untuk memo KTT yang berisi instruksi keselamatan kerja.',
                'status' => collect(['Draft', 'Published'])->random(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::table('csms_memo_ktt_files')->insert([
                'id' => (string) Str::uuid(),
                'memo_id' => $memoId,
                'file' => 'dummy_memo_' . $i . '.pdf',
                'name' => 'Dokumen Memo KTT Tahap ' . $i . '.pdf',
                'size' => '204800',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 6. Seed Surat Edaran (Letters)
        DB::table('csms_letter_files')->truncate();
        DB::table('csms_letters')->delete();

        for ($i = 1; $i <= 5; $i++) {
            $letterId = (string) Str::uuid();
            DB::table('csms_letters')->insert([
                'id' => $letterId,
                'title' => 'Surat Edaran Sosialisasi CSMS Versi ' . $i . '.0',
                'status' => collect(['Draft', 'Published'])->random(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::table('csms_letter_files')->insert([
                'id' => (string) Str::uuid(),
                'letter_id' => $letterId,
                'file' => 'surat_edaran_' . $i . '.pdf',
                'name' => 'Dokumen Surat Edaran V' . $i . '.pdf',
                'size' => '153600',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 7. Seed Kamus CSMS (Dictionaries)
        DB::table('csms_dictionaries')->delete();
        $dictionaries = [
            ['id' => (string) Str::uuid(), 'term' => 'CSMS', 'definition' => 'Contractor Safety Management System adalah sistem terstruktur untuk mengelola aspek K3LL kontraktor.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'term' => 'KTT', 'definition' => 'Kepala Teknik Tambang adalah seseorang yang memimpin dan bertanggung jawab atas terlaksananya serta ditaatinya peraturan perundang-undangan K3 di area tambang.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'term' => 'PJO', 'definition' => 'Penanggung Jawab Operasional adalah orang yang menduduki jabatan tertinggi dalam struktur organisasi perusahaan jasa pertambangan di site.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => (string) Str::uuid(), 'term' => 'PICA', 'definition' => 'Problem Identification and Corrective Action adalah metode penyelesaian masalah untuk mencari akar penyebab dan tindakan perbaikan.', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('csms_dictionaries')->insert($dictionaries);

        // 8. Seed PICA
        DB::table('csms_picas')->delete();
        foreach ($seededBiddings as $bid) {
            DB::table('csms_picas')->insert([
                'id' => (string) Str::uuid(),
                'bidding_id' => $bid['id'],
                'description' => 'Temuan hasil review CSMS: Mohon melengkapi sertifikasi kompetensi PJO dan hasil inspeksi peralatan kerja untuk perusahaan ' . $bid['company_name'] . '.',
                'status' => collect(['Open', 'Closed'])->random(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
