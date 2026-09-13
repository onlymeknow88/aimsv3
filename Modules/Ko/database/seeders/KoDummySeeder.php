<?php

namespace Modules\Ko\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Ko\Entities\KoAttachment;
use Modules\Ko\Entities\KoBrand;
use Modules\Ko\Entities\KoCommissioning;
use Modules\Ko\Entities\KoCommissioningField;
use Modules\Ko\Entities\KoCommissioningItem;
use Modules\Ko\Entities\KoIssueReport;
use Modules\Ko\Entities\KoProposal;
use Modules\Ko\Entities\KoUnit;
use Modules\Ko\Enums\IssueReportStatus;
use Modules\Ko\Enums\KoStatus;

/**
 * Dummy modul KO mencakup SEMUA status workflow (aman diulang: skip bila
 * sudah ada proposal bernomor DUMMY-*).
 *
 *   php artisan db:seed --class="Modules\Ko\Database\Seeders\KoDummySeeder"
 *
 * Cakupan:
 * - KoStatus (10): Draft, Returned, Admin/Coordinator Proposal Verification,
 *   Commissioning, Issue, Commissioner/Coordinator Commissioning Verification,
 *   Commissioning Returned, Completed.
 * - IssueReportStatus (5): Open, Returned, Under Admin/Coordinator
 *   Verification, Solved.
 * - Temporary QR: Coordinator Verification, Approved, Rejected.
 * - Revoke unit: Requested, Revoked, Rejected.
 */
class KoDummySeeder extends Seeder
{
    public function run(): void
    {
        if (KoProposal::where('number', 'like', 'DUMMY-%')->exists()) {
            $this->command->info('KO dummy sudah ada, dilewati.');
            return;
        }

        $company = DB::table('companies')->select('id')->first();
        $user = DB::table('users')->select('id', 'email')->first();
        $spipUnit = DB::table('ko_spip_units')->select('id')->first();
        $brand = KoBrand::select('id')->first();
        $field = KoCommissioningField::select('id', 'hazard_code')->first();

        if (!$company || !$user || !$spipUnit) {
            $this->command->error('Butuh minimal 1 company, 1 user, 1 spip unit.');
            return;
        }

        DB::transaction(function () use ($company, $user, $spipUnit, $brand, $field) {
            $areas = ['Lampunut', 'Haju', 'Tuhup'];
            $i = 0;
            $makeUnit = function (string $callSign) use ($spipUnit, $brand) {
                return KoUnit::create([
                    'ko_spip_unit_id' => $spipUnit->id,
                    'ko_brand_id'     => $brand?->id,
                    'call_sign'       => $callSign,
                    'identity_number' => 'DUMMY ' . $callSign,
                    'serial_number'   => 'SN-' . $callSign,
                    'model_unit'      => 'Unit Dummy Seeder',
                    'production_year' => 2023,
                ]);
            };
            $makeProposal = function (string $number, KoUnit $unit, string $status, array $over = []) use ($company, $user, $areas, &$i) {
                $proposal = KoProposal::create(array_merge([
                    'number'          => $number,
                    'ccow_id'         => $company->id,
                    'area'            => $areas[$i++ % 3],
                    'ko_unit_id'      => $unit->id,
                    'company_id'      => $company->id,
                    'applicant_email' => $user->email,
                    'pjo_id'          => $user->id,
                    'status'          => $status,
                ], $over));
                KoAttachment::create(['ko_proposal_id' => $proposal->id, 'stnk' => 'DUMMY-STNK']);
                return $proposal;
            };
            // Komisioning lulus (semua item Baik) untuk proposal tahap verifikasi/selesai.
            $makeCommissioning = function (KoProposal $proposal, bool $failed = false) use ($field) {
                $comm = KoCommissioning::create([
                    'ko_proposal_id'              => $proposal->id,
                    'date'                        => now()->subDays(7)->toDateString(),
                    'commissioning_completion_date' => now()->subDays(5)->toDateString(),
                    'smu_odo_meter'               => '1000',
                    'engine_status'               => 'Baik',
                    'created_by'                  => 'Dummy Seeder',
                ]);
                if ($field) {
                    KoCommissioningItem::create([
                        'ko_commissioning_id'       => $comm->id,
                        'ko_commissioning_field_id' => $field->id,
                        'condition'                 => $failed ? 'Gagal' : 'Baik',
                        'note'                      => $failed ? 'Temuan dummy seeder' : null,
                    ]);
                }
                return $comm;
            };

            // 1-5. Tahap proposal awal.
            $p1 = $makeProposal('DUMMY-001', $makeUnit('DUMMY-LV-01'), KoStatus::Draft->value);
            $p2 = $makeProposal('DUMMY-002', $makeUnit('DUMMY-LV-02'), KoStatus::Returned->value, [
                'proposal_reject_note' => 'STNK kurang jelas (dummy)',
            ]);
            $p3 = $makeProposal('DUMMY-003', $makeUnit('DUMMY-LV-03'), KoStatus::AdminProposalVerification->value);
            $p4 = $makeProposal('DUMMY-004', $makeUnit('DUMMY-LV-04'), KoStatus::CoordinatorProposalVerification->value, [
                'admin_proposal_verified'       => true,
                'internal_komisioning_schedule' => now()->addMonth()->toDateString(),
            ]);
            $p5 = $makeProposal('DUMMY-005', $makeUnit('DUMMY-LV-05'), KoStatus::Commissioning->value, [
                'admin_proposal_verified' => true,
            ]);

            // 6. Issue: proposal + IssueReport Open + QR menunggu verifikasi.
            $p6 = $makeProposal('DUMMY-006', $makeUnit('DUMMY-LV-06'), KoStatus::Issue->value, [
                'admin_proposal_verified'   => true,
                'temporary_validity_period' => now()->addDays(14)->toDateString(),
                'temporary_qr_status'       => 'Coordinator Verification',
            ]);
            KoIssueReport::create([
                'ko_proposal_id'            => $p6->id,
                'ko_unit_id'                => $p6->ko_unit_id,
                'ko_commissioning_field_id' => $field?->id,
                'note'                      => 'Rem kurang pakem (dummy)',
                'hazard_code'               => $field?->hazard_code ?? 'B',
                'status'                    => IssueReportStatus::Open->value,
            ]);

            // 7-9. Tahap verifikasi komisioning.
            $p7 = $makeProposal('DUMMY-007', $makeUnit('DUMMY-LV-07'), KoStatus::CommissionerCommissioningVerification->value, [
                'admin_proposal_verified' => true,
                'next_commissioning'      => now()->addYear()->toDateString(),
                'commissioning_period'    => 1,
            ]);
            $makeCommissioning($p7);
            $p8 = $makeProposal('DUMMY-008', $makeUnit('DUMMY-LV-08'), KoStatus::CoordinatorCommissioningVerification->value, [
                'admin_proposal_verified' => true,
                'next_commissioning'      => now()->addYear()->toDateString(),
                'commissioning_period'    => 1,
            ]);
            $makeCommissioning($p8);
            $p9 = $makeProposal('DUMMY-009', $makeUnit('DUMMY-LV-09'), KoStatus::CommissioningReturned->value, [
                'admin_proposal_verified'   => true,
                'commissioning_reject_note' => 'Foto odometer buram (dummy)',
                'temporary_validity_period' => now()->addDays(7)->toDateString(),
                'temporary_qr_status'       => 'Rejected',
                'temporary_qr_reject_note'  => 'Masa berlaku diajukan ulang (dummy)',
            ]);
            $makeCommissioning($p9, failed: true);

            // 10. Completed + QR Approved.
            $u10 = $makeUnit('DUMMY-LV-10');
            $u10->update(['commissioning_count' => 1]);
            $p10 = $makeProposal('DUMMY-010', $u10, KoStatus::Completed->value, [
                'admin_proposal_verified'   => true,
                'next_commissioning'        => now()->addYear()->toDateString(),
                'commissioning_period'      => 1,
                'temporary_qr_status'       => 'Approved',
            ]);
            $makeCommissioning($p10);

            // Issue Report 4 status lain (nempel di proposal Commissioning DUMMY-005).
            $issueSeeds = [
                [IssueReportStatus::Returned->value, ['returned_message' => 'Bukti foto kurang (dummy)']],
                [IssueReportStatus::AdminVerification->value, []],
                [IssueReportStatus::CoordinatorVerification->value, []],
                [IssueReportStatus::Solved->value, []],
            ];
            foreach ($issueSeeds as [$status, $extra]) {
                KoIssueReport::create(array_merge([
                    'ko_proposal_id'            => $p5->id,
                    'ko_unit_id'                => $p5->ko_unit_id,
                    'ko_commissioning_field_id' => $field?->id,
                    'note'                      => "Temuan {$status} (dummy)",
                    'hazard_code'               => $field?->hazard_code ?? 'B',
                    'status'                    => $status,
                ], $extra));
            }

            // Revoke unit 3 status.
            KoUnit::create([
                'ko_spip_unit_id'     => $spipUnit->id,
                'ko_brand_id'         => $brand?->id,
                'call_sign'           => 'DUMMY-RVQ-01',
                'serial_number'       => 'SN-DUMMY-RVQ-01',
                'production_year'     => 2020,
                'revoke_requested_date' => now()->subDays(2)->toDateString(),
                'revoke_request_note' => 'Unit rusak berat (dummy)',
                'revoke_status'       => 'Requested',
            ]);
            KoUnit::create([
                'ko_spip_unit_id'     => $spipUnit->id,
                'ko_brand_id'         => $brand?->id,
                'call_sign'           => 'DUMMY-RVQ-02',
                'serial_number'       => 'SN-DUMMY-RVQ-02',
                'production_year'     => 2019,
                'is_revoked'          => true,
                'revoked_date'        => now()->subDay()->toDateString(),
                'revoke_requested_date' => now()->subDays(5)->toDateString(),
                'revoke_request_note' => 'Habis masa pakai (dummy)',
                'revoke_status'       => 'Revoked',
            ]);
            KoUnit::create([
                'ko_spip_unit_id'     => $spipUnit->id,
                'ko_brand_id'         => $brand?->id,
                'call_sign'           => 'DUMMY-RVQ-03',
                'serial_number'       => 'SN-DUMMY-RVQ-03',
                'production_year'     => 2021,
                'revoke_requested_date' => now()->subDays(3)->toDateString(),
                'revoke_request_note' => 'Pengajuan batal (dummy)',
                'revoke_status'       => 'Rejected',
            ]);
        });

        $this->command->info('KO dummy semua status dibuat: 10 proposal, 5 issue, 3 revoke unit.');
    }
}
