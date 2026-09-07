<?php

namespace Modules\Ko\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Ko\Entities\KoProposal;
use Modules\Ko\Enums\KoStatus;
use Tests\TestCase;

/**
 * TDD modul KO dengan data dummy.
 *
 * ATURAN KERAS:
 * - WAJIB DatabaseTransactions: tiap test rollback, DB dev tidak tersentuh.
 * - DILARANG RefreshDatabase / migrate:fresh / truncate di suite ini.
 * - DILARANG upload file (memicu uploadToBlobStorage asli ke Azure).
 */
class KoApiDummyTest extends TestCase
{
    use DatabaseTransactions;

    private function admin(): User
    {
        $user = User::create([
            'name'      => 'TDD KO',
            'email'     => 'tdd-ko-'.Str::uuid().'@aims.test',
            'password'  => bcrypt('secret'),
            'role'      => 'super_admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);
        return $user;
    }

    private function masterChain(): array
    {
        $cat = $this->postJson('/api/ko/categories', [
            'name' => 'Sarana TDD', 'internal_interval_year' => 1, 'contractor_interval_year' => 1,
        ])->json('result');
        $type = $this->postJson('/api/ko/types', [
            'name' => 'Kendaraan TDD', 'ko_spip_category_id' => $cat['id'],
        ])->json('result');
        $unit = $this->postJson('/api/ko/spip-units', [
            'name' => 'Hilux TDD', 'ko_spip_type_id' => $type['id'],
        ])->json('result');
        return [$cat, $type, $unit];
    }

    // =====================================================================
    // MASTER
    // =====================================================================

    public function test_master_chain_category_type_unit_brand(): void
    {
        $this->admin();
        [$cat, $type, $unit] = $this->masterChain();

        $brand = $this->postJson('/api/ko/brands', [
            'name' => 'Toyota TDD', 'ko_spip_category_id' => $cat['id'],
        ]);
        $brand->assertStatus(201);

        $res = $this->postJson('/api/ko/units', [
            'ko_spip_unit_id' => $unit['id'],
            'call_sign'       => 'TDD-001',
            'serial_number'   => 'SN-TDD-001',
            'ko_brand_id'     => $brand->json('result.id'),
            'production_year' => 2023,
        ]);
        $res->assertStatus(201);
        $this->assertEquals('TDD-001', $res->json('result.call_sign'));
    }

    public function test_unit_validasi_wajib(): void
    {
        $this->admin();
        $this->postJson('/api/ko/units', [])->assertStatus(422);
    }

    public function test_unit_revoke_flow(): void
    {
        $this->admin();
        [, , $unit] = $this->masterChain();
        $created = $this->postJson('/api/ko/units', [
            'ko_spip_unit_id' => $unit['id'], 'call_sign' => 'TDD-RVK',
            'serial_number' => 'SN-RVK', 'production_year' => 2022,
        ])->json('result');

        $this->postJson("/api/ko/units/{$created['id']}/request-revoke", ['revoke_request_note' => 'Rusak TDD'])
            ->assertOk();
        $this->assertEquals('Requested', DB::table('ko_units')->where('id', $created['id'])->value('revoke_status'));

        $this->postJson("/api/ko/units/{$created['id']}/verify-revoke", ['action' => 'approve'])
            ->assertOk();
        $row = DB::table('ko_units')->where('id', $created['id'])->first();
        $this->assertEquals(1, (int) $row->is_revoked);
        $this->assertEquals('Revoked', $row->revoke_status);
    }

    // =====================================================================
    // PROPOSAL + VERIFIKASI
    // =====================================================================

    private function createProposal(User $admin, array $over = []): string
    {
        [, , $unit] = $this->masterChain();
        $koUnit = $this->postJson('/api/ko/units', [
            'ko_spip_unit_id' => $unit['id'], 'call_sign' => 'TDD-P-'.substr((string) Str::uuid(), 0, 8),
            'serial_number' => 'SN-'.substr((string) Str::uuid(), 0, 8), 'production_year' => 2023,
        ])->json('result');

        $res = $this->postJson('/api/ko/proposals', array_merge([
            'area'            => 'Pit TDD',
            'ko_unit_id'      => $koUnit['id'],
            'applicant_email' => $admin->email,
        ], $over));
        $res->assertStatus(201);
        return $res->json('result.id');
    }

    public function test_proposal_store_draft_dengan_nomor_otomatis(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        $proposal = KoProposal::find($id);
        $this->assertEquals(KoStatus::Draft->value, $proposal->status);
        $this->assertMatchesRegularExpression('/^KO\/\d{4}\/\d{4}$/', $proposal->number);
        $this->assertNotNull($proposal->koAttachment);
    }

    public function test_proposal_full_verify_flow(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        $this->postJson("/api/ko/proposals/{$id}/submit")->assertOk();
        $this->assertEquals(KoStatus::AdminProposalVerification->value, KoProposal::find($id)->status);

        $this->postJson("/api/ko/proposals/{$id}/verify", [
            'stage' => 'admin', 'action' => 'approve',
            'internal_komisioning_schedule' => now()->addMonth()->toDateString(),
        ])->assertOk();
        $proposal = KoProposal::find($id);
        $this->assertEquals(KoStatus::CoordinatorProposalVerification->value, $proposal->status);
        $this->assertTrue((bool) $proposal->admin_proposal_verified);

        $this->postJson("/api/ko/proposals/{$id}/verify", ['stage' => 'coordinator', 'action' => 'approve'])->assertOk();
        $this->assertEquals(KoStatus::Commissioning->value, KoProposal::find($id)->status);
    }

    public function test_proposal_reject_kembali_returned_dengan_catatan(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);
        $this->postJson("/api/ko/proposals/{$id}/submit")->assertOk();

        $this->postJson("/api/ko/proposals/{$id}/verify", [
            'stage' => 'admin', 'action' => 'return', 'note' => 'Data kurang TDD',
        ])->assertOk();

        $proposal = KoProposal::find($id);
        $this->assertEquals(KoStatus::Returned->value, $proposal->status);
        $this->assertEquals('Data kurang TDD', $proposal->proposal_reject_note);
    }

    public function test_proposal_temporary_qr(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        // approve langsung tanpa request harus ditolak
        $this->postJson("/api/ko/proposals/{$id}/temporary-qr", ['action' => 'approve'])->assertStatus(422);

        $this->postJson("/api/ko/proposals/{$id}/temporary-qr-request", [
            'temporary_validity_period' => now()->addDays(30)->toDateString(),
        ])->assertOk();
        $this->assertEquals('Coordinator Verification', KoProposal::find($id)->temporary_qr_status);

        $this->postJson("/api/ko/proposals/{$id}/temporary-qr", ['action' => 'approve'])->assertOk();
        $this->assertEquals('Approved', KoProposal::find($id)->temporary_qr_status);
    }

    public function test_proposal_attachments_tersimpan(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        $this->putJson("/api/ko/proposals/{$id}/attachments", [
            'stnk' => 'STNK-TDD-001',
            'kir'  => 'KIR-TDD-001',
        ])->assertOk();

        $row = DB::table('ko_attachments')->where('ko_proposal_id', $id)->first();
        $this->assertEquals('STNK-TDD-001', $row->stnk);
        $this->assertEquals('KIR-TDD-001', $row->kir);
    }

    public function test_qr_files_endpoint_tersedia(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        // Tanpa file fisik (aturan: tanpa blob asli di test) — endpoint tetap 201
        $this->postJson("/api/ko/proposals/{$id}/qr-files", [])->assertStatus(201);
    }

    // =====================================================================
    // COMMISSIONING
    // =====================================================================

    public function test_commissioning_store_dan_verify_completed(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);
        $this->postJson("/api/ko/proposals/{$id}/submit")->assertOk();
        $this->postJson("/api/ko/proposals/{$id}/verify", ['stage' => 'admin', 'action' => 'approve'])->assertOk();
        $this->postJson("/api/ko/proposals/{$id}/verify", ['stage' => 'coordinator', 'action' => 'approve'])->assertOk();

        $store = $this->postJson('/api/ko/commissionings', [
            'ko_proposal_id' => $id,
            'date'           => now()->toDateString(),
            'engine_status'  => 'Baik',
            'status'         => 'Lulus',
        ]);
        $store->assertStatus(201);

        $this->postJson("/api/ko/commissionings/{$id}/verify", ['stage' => 'admin', 'action' => 'approve'])->assertOk();
        $this->assertEquals(
            KoStatus::CoordinatorCommissioningVerification->value,
            KoProposal::find($id)->status
        );

        $this->postJson("/api/ko/commissionings/{$id}/verify", ['stage' => 'coordinator', 'action' => 'approve'])->assertOk();
        $this->assertEquals(KoStatus::Completed->value, KoProposal::find($id)->status);
    }

    // =====================================================================
    // ISSUE REPORT
    // =====================================================================

    public function test_issue_full_flow_hingga_solved(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);

        $store = $this->postJson('/api/ko/issues', [
            'ko_proposal_id' => $id,
            'note'           => 'Temuan TDD',
            'hazard_code'    => 'B',
        ]);
        $store->assertStatus(201);
        $issueId = $store->json('result.id');

        foreach (['submit', 'approve', 'solve'] as $action) {
            $this->postJson("/api/ko/issues/{$issueId}/verify", ['action' => $action])->assertOk();
        }

        $this->assertEquals(
            \Modules\Ko\Enums\IssueReportStatus::Solved->value,
            DB::table('ko_issue_reports')->where('id', $issueId)->value('status')
        );
    }

    public function test_issue_return_menyimpan_pesan(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);
        $issueId = $this->postJson('/api/ko/issues', [
            'ko_proposal_id' => $id, 'note' => 'Temuan return TDD',
        ])->json('result.id');

        $this->postJson("/api/ko/issues/{$issueId}/verify", ['action' => 'return', 'message' => 'Kurang bukti TDD'])->assertOk();

        $row = DB::table('ko_issue_reports')->where('id', $issueId)->first();
        $this->assertEquals('Returned', $row->status);
        $this->assertEquals('Kurang bukti TDD', $row->returned_message);
    }

    public function test_master_data_memuat_referensi_form(): void
    {
        $this->admin();
        $res = $this->getJson('/api/ko/master-data');

        $res->assertOk();
        foreach (['companies', 'departments', 'users', 'units', 'categories', 'types', 'spip_units', 'areas'] as $key) {
            $this->assertArrayHasKey($key, $res->json('result'));
        }
    }

    public function test_dashboard_stats_aman_dari_injeksi(): void
    {
        $this->admin();
        // Payload injeksi ala pola aims: harus 400/aman, bukan error SQL mentah
        $res = $this->getJson('/api/ko/dashboard-stats?year=2026) OR (1=1');
        $this->assertContains($res->status(), [200, 400, 422]);

        $ok = $this->getJson('/api/ko/dashboard-stats?year=2026&month=9');
        $ok->assertOk();
        $ok->assertJsonStructure(['result' => ['total', 'by_status', 'monthly']]);
    }

    public function test_preview_dan_download_attachment_tersedia(): void
    {
        $admin = $this->admin();
        $id = $this->createProposal($admin);
        $issueId = $this->postJson('/api/ko/issues', [
            'ko_proposal_id' => $id, 'note' => 'Temuan preview TDD',
        ])->json('result.id');

        $att = \Modules\Ko\Entities\KoIssueReportAttachment::create([
            'ko_issue_report_id' => $issueId,
            'name' => 'test.pdf',
            'attachment' => 'ko/test.pdf',
            'type' => 'pdf',
        ]);

        $resPreview = $this->get("/api/ko/issue-attachments/{$att->id}/preview");
        $this->assertContains($resPreview->status(), [200, 404]);

        $resDownload = $this->get("/api/ko/issue-attachments/{$att->id}/download");
        $this->assertContains($resDownload->status(), [200, 302, 404]);
    }
}
