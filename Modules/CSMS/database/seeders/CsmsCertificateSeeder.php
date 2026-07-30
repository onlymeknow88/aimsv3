<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Seeder for testing certificate_new.blade.php PDF generation.
 *
 * Post-Bidding ID: 2117fb77-5260-469a-915c-ba06a37911f4  (status: Approved)
 * PJO: diambil dari data Approved yang sudah ada, atau dibuat baru.
 *
 * Run: php artisan db:seed --class="Modules\CSMS\Database\Seeders\CsmsCertificateSeeder"
 */
class CsmsCertificateSeeder extends Seeder
{
    const BIDDING_ID = '2117fb77-5260-469a-915c-ba06a37911f4';

    public function run(): void
    {
        $makerId = DB::table('users')->where('email', 'fadjri.wivindi@alamtri.com')->value('id')
            ?? DB::table('users')->first()?->id;

        // ── 1. Resolve CCOW (Internal) ────────────────────────────────────────
        $ccow = DB::table('companies')->where('type', 'Internal')->first();
        if (!$ccow) {
            $this->command->error('No Internal company found. Run CSMSDummySeeder first.');
            return;
        }

        // ── 2. Resolve Contractor Company ────────────────────────────────────
        $contractor = DB::table('companies')->where('type', 'Contractor')->first();
        if (!$contractor) {
            $this->command->error('No Contractor company found. Run CSMSDummySeeder first.');
            return;
        }

        // ── 3. Resolve PJO Approved yang sudah ada ───────────────────────────
        $pjo = DB::table('csms_pjos')
            ->where('company_id', $contractor->id)
            ->where('status', 'Approved')
            ->first();

        if (!$pjo) {
            $pjoId = (string) Str::uuid();
            DB::table('csms_pjos')->insert([
                'id'              => $pjoId,
                'company_id'      => $contractor->id,
                'criteria'        => 'PJO',
                'ccow_id'         => $ccow->id,
                'submission'      => 'Baru',
                'number_pjo'      => 'PJO/CSMS/001/' . date('Y'),
                'name'            => 'Didit Pramudya',
                'competence'      => 'POU',
                'cert_number'     => 'xxxx/xx.0xx/DBT/2009',
                'cert_expiry'     => null,
                'date_of_birth'   => '1980-06-15',
                'phone'           => '0811-599-388',
                'email'           => 'didit.pramudya@saptaindra.co.id',
                'date_submission' => '2025-09-27',
                'date_approved'   => '2025-10-01',
                'comment'         => null,
                'status'          => 'Approved',
                'published'       => 'Published',
                'requested'       => null,
                'created_by'      => $makerId,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);

            $pjoFiles = [
                ['type' => 'sertifikat_pou',   'name' => 'Sertifikat POU - Didit Pramudya.pdf'],
                ['type' => 'cv',               'name' => 'CV - Didit Pramudya.pdf'],
                ['type' => 'surat_penunjukan', 'name' => 'Surat Penunjukan PJO.pdf'],
            ];
            foreach ($pjoFiles as $f) {
                DB::table('csms_pjo_files')->insert([
                    'id'         => (string) Str::uuid(),
                    'pjo_id'     => $pjoId,
                    'type'       => $f['type'],
                    'file'       => 'dummy_document.pdf',
                    'name'       => $f['name'],
                    'size'       => '102400',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $pjo = DB::table('csms_pjos')->where('id', $pjoId)->first();
            $this->command->info('PJO baru dibuat: ' . $pjoId);
        } else {
            $this->command->info('Menggunakan PJO yang sudah ada: ' . $pjo->id . ' (' . $pjo->name . ')');
            // Update cert fields pada PJO existing jika belum terisi
            DB::table('csms_pjos')->where('id', $pjo->id)->update([
                'competence'   => $pjo->competence   ?: 'POU',
                'cert_number'  => $pjo->cert_number  ?: 'xxxx/xx.0xx/DBT/2009',
                'updated_at'   => now(),
            ]);
            $pjo = DB::table('csms_pjos')->where('id', $pjo->id)->first();
        }

        // ── 4. Questionnaire JSON ─────────────────────────────────────────────
        $companySlug = Str::slug($contractor->company_name ?? 'contractor');
        $questionnaire = json_encode([
            'equipped_telephone'         => '021-7884-4848',
            'equipped_email'             => 'procurement@' . $companySlug . '.co.id',
            'equipped_name'              => $pjo->name ?? 'PJO',
            'nib_number'                 => '8120014821111',
            'iujp_number'                => '05/5/IUJP/PMDN/2023',
            'license_start_date'         => '2023-12-28',
            'license_end_date'           => '2028-12-28',
            'kbli_code'                  => '09900',
            'business_type'              => 'Aktivitas Penunjang Pertambangan dan Penggalian Lainnya',
            'business_fields'            => [
                [
                    'kbli'             => '09900',
                    'jenis_usaha'      => 'Aktivitas Penunjang Pertambangan dan Penggalian Lainnya',
                    'bidang_usaha'     => 'Penambangan',
                    'sub_bidang_list'  => [
                        'Pembukaan lahan',
                        'Pengupasan, pemuatan dan pemindahan tanah/batuan penutup',
                        'Pemberaian/pembongkaran tanah/batuan penutup dengan didahului peledakan',
                        'Penggalian batubara',
                    ],
                    'risiko'           => 'Tinggi',
                ],
                [
                    'kbli'             => '09900',
                    'jenis_usaha'      => 'Aktivitas Penunjang Pertambangan dan Penggalian Lainnya',
                    'bidang_usaha'     => 'Pengangkutan',
                    'sub_bidang_list'  => ['Menggunakan truk'],
                    'risiko'           => 'Tinggi',
                ],
                [
                    'kbli'             => '09900',
                    'jenis_usaha'      => 'Aktivitas Penunjang Pertambangan dan Penggalian Lainnya',
                    'bidang_usaha'     => 'Konstruksi Pertambangan',
                    'sub_bidang_list'  => [
                        'Jalan tambang',
                        'Fasilitas perbengkelan',
                        'Pemboran dan Peledakan',
                        'Sistem Penyaliran',
                    ],
                    'risiko'           => 'Tinggi',
                ],
                [
                    'kbli'             => '09900',
                    'jenis_usaha'      => 'Aktivitas Penunjang Pertambangan dan Penggalian Lainnya',
                    'bidang_usaha'     => 'Lingkungan Pertambangan',
                    'sub_bidang_list'  => ['Pengendalian erosi'],
                    'risiko'           => 'Tinggi',
                ],
            ],
            'pjo_competence'             => 'POU',
            'pjo_cert_number'            => 'xxxx/xx.0xx/DBT/2009',
            'pjo_cert_expiry'            => '-',
            'date_contract_period_start' => '2019-03-01',
            'date_contract_period_end'   => '2029-12-31',
            'activities_list'            => implode("\n", [
                'a. Pengupasan dan Pemindahan Top Soil dan Lapisan Tanah Penutup (Overburden)',
                'b. Penggalian Batubara (Coal getting)',
                'c. Pengangkutan Batubara',
                'd. Coal Handling',
                'e. Reject Coal Handling (Reject removal)',
            ]),
        ]);

        // ── 5. Post-Bidding Approved ──────────────────────────────────────────
        DB::table('biddings')->updateOrInsert(
            ['id' => self::BIDDING_ID],
            [
                'id'                 => self::BIDDING_ID,
                'maker_id'           => $makerId,
                'criteria'           => 'PostBidding',
                'classification'     => 'Kontraktor Utama',
                'ccow_id'            => $ccow->id,
                'company_id'         => $contractor->id,
                'pjo_id'             => $pjo->id,
                'parent_id'          => null,
                'grand_parent_id'    => null,
                'business_entity_id' => 1,
                'company_name'       => 'PT Saptaindra Sejati',
                'address'            => 'Graha Saptaindra JL. TB Simatupang Kav 18, Cilandak, Jakarta Selatan',
                'company_site'       => 'Site ' . ($ccow->company_name ?? $ccow->name),
                'license_number'     => 'LIC-CERT-' . self::BIDDING_ID,
                'service_criteria'   => 'High Risk Services',
                'person_in_charge'   => $pjo->name ?? 'PJO',
                'status'             => 'Approved',
                'requested'          => 'Approved',
                'published'          => 'Publish',
                'approved_by'        => $makerId,
                'ktt_name'           => 'Rahmad Taufik Siregar',
                'questionnaire'      => $questionnaire,
                'risk_category'      => 'Tinggi',
                'is_obsolate'        => false,
                'csms_doc_number'    => 'F-MAC-IMS-08-001',
                'date'               => '2025-09-27',
                'created_at'         => now(),
                'updated_at'         => now(),
            ]
        );
        $this->command->info('Post-Bidding seeded: ' . self::BIDDING_ID);

        // ── 6. Bidding Approved (appears in Bidding Active lists) ─────────────
        $biddingId = '1117fb77-5260-469a-915c-ba06a37911f1';
        $be = DB::table('business_entities')->first();
        DB::table('biddings')->updateOrInsert(
            ['id' => $biddingId],
            [
                'id'                 => $biddingId,
                'maker_id'           => $makerId,
                'criteria'           => 'Bidding',
                'classification'     => 'Kontraktor Utama',
                'ccow_id'            => $ccow->id,
                'company_id'         => $contractor->id,
                'pjo_id'             => $pjo->id,
                'parent_id'          => null,
                'grand_parent_id'    => null,
                'business_entity_id' => $be?->id ?? 1,
                'company_name'       => 'PT Saptaindra Sejati',
                'address'            => 'Graha Saptaindra JL. TB Simatupang Kav 18, Cilandak, Jakarta Selatan',
                'company_site'       => 'Site ' . ($ccow->company_name ?? $ccow->name),
                'license_number'     => 'LIC-B-CERT-' . $biddingId,
                'service_criteria'   => 'High Risk Services',
                'person_in_charge'   => $pjo->name ?? 'PJO',
                'status'             => 'Approved',
                'requested'          => 'Approved',
                'published'          => 'Publish',
                'approved_by'        => $makerId,
                'ktt_name'           => 'Rahmad Taufik Siregar',
                'questionnaire'      => $questionnaire,
                'risk_category'      => 'Tinggi',
                'is_obsolate'        => false,
                'csms_doc_number'    => 'F-MAC-IMS-08-002',
                'date'               => '2025-09-27',
                'created_at'         => now(),
                'updated_at'         => now(),
            ]
        );

        $this->command->info('Bidding seeded: ' . $biddingId);
        $this->command->info('PJO: ' . $pjo->id . ' (' . ($pjo->name ?? '-') . ')');
        $this->command->info('CCOW: ' . ($ccow->company_name ?? $ccow->name));
        $this->command->info('Contractor: ' . ($contractor->company_name ?? $contractor->name));
        $this->command->info('PDF: GET /api/csms/post-biddings/' . self::BIDDING_ID . '/generate-certificate');
    }
}
