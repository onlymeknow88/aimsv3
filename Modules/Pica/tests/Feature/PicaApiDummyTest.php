<?php

namespace Modules\Pica\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Pica\Entities\PicaAuditor;
use Modules\Pica\Entities\PicaDocument;
use Tests\TestCase;

/**
 * TDD modul PICA dengan data dummy.
 *
 * ATURAN KERAS (lihat agent/pica_tdd_rules.md):
 * - WAJIB DatabaseTransactions: tiap test rollback, DB dev tidak tersentuh.
 * - DILARANG RefreshDatabase / migrate:fresh / truncate di suite ini.
 * - DILARANG upload file (memicu uploadToBlobStorage asli ke Azure).
 */
class PicaApiDummyTest extends TestCase
{
    use DatabaseTransactions;

    private function admin(): User
    {
        $user = User::create([
            'name'      => 'TDD Admin',
            'email'     => 'tdd-admin-'.Str::uuid().'@aims.test',
            'password'  => bcrypt('secret'),
            'role'      => 'super_admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);
        return $user;
    }

    private function payload(array $over = []): array
    {
        return array_merge([
            'source'                 => 'Manual',
            'non_compliance'         => 'Temuan dummy TDD',
            'corrective_action'      => 'Perbaikan dummy TDD',
            'target_settlement_date' => now()->addDays(7)->toDateString(),
        ], $over);
    }

    private function createDoc(User $admin, array $over = []): PicaDocument
    {
        $res = $this->postJson('/api/pica/documents', $this->payload($over));
        $res->assertCreated();
        return PicaDocument::findOrFail($res->json('result.id'));
    }

    // =====================================================================
    // STORE
    // =====================================================================

    public function test_store_membuat_dokumen_draft(): void
    {
        $this->admin();
        $res = $this->postJson('/api/pica/documents', $this->payload());

        $res->assertCreated();
        $this->assertEquals('Draft', $res->json('result.status'));
        $this->assertEquals('Draft', $res->json('result.published'));
        $this->assertNotEmpty($res->json('result.identity_id'));
    }

    public function test_store_validasi_field_wajib(): void
    {
        $this->admin();
        $res = $this->postJson('/api/pica/documents', []);

        $res->assertStatus(422);
        $res->assertJsonValidationErrors(['source', 'non_compliance', 'corrective_action', 'target_settlement_date']);
    }

    public function test_store_multi_auditor_tersimpan_dengan_nama_teresolve(): void
    {
        $admin = $this->admin();
        $res = $this->postJson('/api/pica/documents', $this->payload([
            'auditors' => [$admin->id, 'Nama Manual TDD'],
        ]));

        $res->assertCreated();
        $doc = PicaDocument::findOrFail($res->json('result.id'));
        $this->assertCount(2, $doc->auditors);
        $this->assertEquals($admin->id, $doc->auditors->firstWhere('name', $admin->name)->user_id);
        // kolom legacy ikut terisi nama (bukan id mentah)
        $this->assertStringContainsString($admin->name, $doc->auditor);
        $this->assertStringContainsString('Nama Manual TDD', $doc->auditor);
    }

    public function test_store_auditor_duplikat_ditolak_validasi(): void
    {
        $admin = $this->admin();
        $res = $this->postJson('/api/pica/documents', $this->payload([
            'auditors' => [$admin->id, $admin->id],
        ]));

        $res->assertStatus(422);
    }

    // =====================================================================
    // INDEX / SHOW
    // =====================================================================

    public function test_index_mendukung_filter_multi_status_koma(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin); // Draft
        $doc->update(['status' => 'On Review CRS', 'published' => 'Publish']);

        $res = $this->getJson('/api/pica/documents?published=Publish&status=Open,On Review PJA,On Review CRS,Overdue,Closed&limit=100');

        $res->assertOk();
        $ids = collect($res->json('result.data'))->pluck('id')->toArray();
        $this->assertContains($doc->id, $ids);
    }

    public function test_show_memuat_relasi_auditors(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin, ['auditors' => [$admin->id]]);

        $res = $this->getJson('/api/pica/documents/'.$doc->id);

        $res->assertOk();
        $this->assertCount(1, $res->json('result.auditors'));
        $this->assertEquals($admin->id, $res->json('result.auditors.0.user_id'));
    }

    public function test_master_data_memuat_email_user(): void
    {
        $this->admin();
        $res = $this->getJson('/api/pica/master-data');

        $res->assertOk();
        $this->assertNotEmpty($res->json('result.users'));
        $this->assertArrayHasKey('email', $res->json('result.users.0'));
    }

    // =====================================================================
    // UPDATE
    // =====================================================================

    public function test_update_menyinkronkan_auditor(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin, ['auditors' => [$admin->id]]);

        $res = $this->putJson('/api/pica/documents/'.$doc->id, $this->payload([
            'auditors' => ['Nama Baru TDD'],
        ]));

        $res->assertOk();
        $this->assertEquals(['Nama Baru TDD'], PicaAuditor::where('pica_id', $doc->id)->pluck('name')->toArray());
        $this->assertEquals('Nama Baru TDD', $doc->fresh()->auditor);
    }

    public function test_update_auditor_kosong_mengosongkan_string_legacy(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin, ['auditors' => [$admin->id]]);

        $this->putJson('/api/pica/documents/'.$doc->id, $this->payload(['auditors' => []]))->assertOk();

        $this->assertNull($doc->fresh()->auditor);
        $this->assertCount(0, PicaAuditor::where('pica_id', $doc->id)->get());
    }

    public function test_update_ditolak_bila_bukan_draft(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin);
        $doc->update(['status' => 'Open']);

        $this->putJson('/api/pica/documents/'.$doc->id, $this->payload())->assertStatus(422);
    }

    // =====================================================================
    // APPROVAL WORKFLOW
    // =====================================================================

    public function test_approval_full_flow_mencatat_aktivitas(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin);

        foreach (['submit', 'approve_pja', 'approve_crs'] as $action) {
            $this->postJson("/api/pica/documents/{$doc->id}/approval", ['action' => $action])->assertOk();
        }

        $doc->refresh();
        $this->assertEquals('Open', $doc->status);
        $this->assertEquals('Approved', $doc->requested);

        $descriptions = DB::table('pica_activities')->where('pica_id', $doc->id)->pluck('description')->toArray();
        $this->assertContains('Submit for Review', $descriptions);
        $this->assertContains('Approved by PJA', $descriptions);
        $this->assertContains('Approved by CRS', $descriptions);
    }

    public function test_close_menutup_risk_field_leadership_sumber(): void
    {
        $admin = $this->admin();
        $riskId = (string) Str::uuid();
        DB::table('field_leadership_risks')->insert([
            'id'             => $riskId,
            'risk_condition' => 'Risiko dummy TDD',
            'repair_action'  => 'Aksi dummy TDD',
            'due_date'       => now()->addDays(5)->toDateString(),
            'status'         => 'Open',
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        $doc = $this->createDoc($admin, ['source' => 'Field Leadership', 'source_id' => $riskId]);
        $doc->update(['status' => 'Open', 'requested' => 'Approved']);

        $this->postJson("/api/pica/documents/{$doc->id}/approval", ['action' => 'close'])->assertOk();

        $this->assertEquals('Closed', $doc->fresh()->status);
        $this->assertEquals('Closed', DB::table('field_leadership_risks')->where('id', $riskId)->value('status'));
    }

    // =====================================================================
    // DESTROY
    // =====================================================================

    public function test_destroy_menghapus_dokumen_dan_auditor(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin, ['auditors' => [$admin->id]]);

        $this->deleteJson('/api/pica/documents/'.$doc->id)->assertOk();

        $this->assertNull(PicaDocument::find($doc->id));
        $this->assertCount(0, PicaAuditor::where('pica_id', $doc->id)->get());
    }

    public function test_destroy_ditolak_bila_bukan_draft(): void
    {
        $admin = $this->admin();
        $doc = $this->createDoc($admin);
        $doc->update(['status' => 'Closed']);

        $this->deleteJson('/api/pica/documents/'.$doc->id)->assertStatus(422);
    }

    // =====================================================================
    // DASHBOARD
    // =====================================================================

    public function test_dashboard_stats_mengembalikan_struktur_bagan(): void
    {
        $this->admin();
        $res = $this->getJson('/api/pica/dashboard-stats');

        $res->assertOk();
        foreach (['Field Leadership', 'Inspeksi KPLH', 'Audit'] as $source) {
            $this->assertArrayHasKey($source, $res->json('result.charts'));
            foreach (['open', 'closed', 'overdue'] as $key) {
                $this->assertArrayHasKey($key, $res->json("result.charts.{$source}"));
            }
        }
    }
}
