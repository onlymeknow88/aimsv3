<?php

namespace Modules\FieldLeadership\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * TDD modul FieldLeadership dengan data dummy.
 *
 * ATURAN KERAS (lihat agent/fl_tdd_rules.md):
 * - WAJIB DatabaseTransactions: tiap test rollback, DB dev tidak tersentuh.
 * - DILARANG RefreshDatabase / migrate:fresh / truncate di suite ini.
 * - DILARANG upload file (memicu uploadToBlobStorage asli ke Azure).
 */
class FieldLeadershipApiDummyTest extends TestCase
{
    use DatabaseTransactions;

    private function user(string $role = 'super_admin'): User
    {
        $user = User::create([
            'name'      => 'TDD FL',
            'email'     => 'tdd-fl-'.Str::uuid().'@aims.test',
            'password'  => bcrypt('secret'),
            'role'      => $role,
            'is_active' => true,
        ]);
        $this->actingAs($user);
        return $user;
    }

    /** Jadikan user admin modul FL (untuk aksi CRS). */
    private function grantFlAdmin(User $user): void
    {
        $roleId = DB::table('aims_roles')
            ->join('aims_modules', 'aims_roles.module_id', '=', 'aims_modules.id')
            ->where('aims_modules.slug', 'field-leadership')
            ->where('aims_roles.slug', 'fls_admin')
            ->value('aims_roles.id');
        $this->assertNotNull($roleId, 'Role fls_admin belum di-seed. Jalankan: php artisan module:seed FieldLeadership');
        DB::table('aims_user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
    }

    /** Buat area manager untuk user (untuk aksi PJA). Mengembalikan pja_id. */
    private function makePja(User $user): string
    {
        $id = (string) Str::uuid();
        DB::table('area_managers')->insert([
            'id'         => $id,
            'user_id'    => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return $id;
    }

    private function payload(array $over = []): array
    {
        return array_merge([
            'date'           => now()->toDateString(),
            'detail_company' => 'PT Dummy TDD',
            'type'           => 'Hazard Report',
        ], $over);
    }

    private function createFl(User $maker, array $over = []): string
    {
        $pjaId = $over['pja_id'] ?? $this->makePja($maker);
        $res = $this->postJson('/api/field-leadership', $this->payload($over) + ['pja_id' => $pjaId]);
        $res->assertStatus(201);
        return $res->json('result.id');
    }

    // =====================================================================
    // STORE
    // =====================================================================

    public function test_store_membuat_fl_draft_default(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker);

        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        $this->assertEquals('Draft', $fl->status);
        $this->assertEquals('Draft', $fl->published);
    }

    public function test_store_validasi_field_wajib(): void
    {
        $this->user();
        $res = $this->postJson('/api/field-leadership', []);

        $res->assertStatus(422);
        $res->assertJsonValidationErrors(['date', 'detail_company', 'pja_id', 'type']);
    }

    public function test_store_publish_langsung_open_dan_menyimpan_risks(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker, [
            'publish' => 'Publish',
            'risks'   => [
                ['description' => 'Risiko dummy TDD', 'due_date' => now()->addDays(5)->toDateString(), 'repair_action' => 'Aksi dummy'],
            ],
        ]);

        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        $this->assertEquals('Open', $fl->status);
        $this->assertEquals(1, DB::table('field_leadership_risks')->where('fl_id', $id)->count());
    }

    public function test_show_memuat_observasi(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker);

        $res = $this->getJson('/api/field-leadership/'.$id);

        $res->assertOk();
        $this->assertEquals($id, $res->json('result.observation.id'));
    }

    // =====================================================================
    // APPROVAL
    // =====================================================================

    public function test_submit_open_menjadi_on_review_pja(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker, ['publish' => 'Publish']);

        $this->postJson("/api/field-leadership/{$id}/submit")->assertOk();

        $this->assertEquals('On Review PJA', DB::table('field_leaderships')->where('id', $id)->value('status'));
    }

    public function test_submit_ditolak_bila_bukan_pembuat(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker, ['publish' => 'Publish']);

        $this->user(); // user lain tanpa kaitan
        $this->postJson("/api/field-leadership/{$id}/submit")->assertStatus(403);
    }

    public function test_pja_review_menyetujui_menjadi_on_review_crs_dan_membuat_pica(): void
    {
        $maker = $this->user();
        $pjaUser = $this->user();
        $pjaId = $this->makePja($pjaUser);
        $id = $this->createFl($maker, [
            'publish' => 'Publish',
            'pja_id'  => $pjaId,
            'risks'   => [
                ['description' => 'Risiko PICA TDD', 'due_date' => now()->addDays(5)->toDateString(), 'repair_action' => 'Perbaiki TDD'],
            ],
        ]);
        $this->postJson("/api/field-leadership/{$id}/submit")->assertOk();

        $this->actingAs($pjaUser);
        $this->postJson("/api/field-leadership/{$id}/pja-review", ['is_area_suitable' => true])->assertOk();

        $this->assertEquals('On Review CRS', DB::table('field_leaderships')->where('id', $id)->value('status'));
        $riskId = DB::table('field_leadership_risks')->where('fl_id', $id)->value('id');
        $this->assertTrue(DB::table('pica_documents')
            ->where('source', 'Field Leadership')->where('source_id', $riskId)->exists());
    }

    public function test_pja_review_area_tidak_sesuai_menjadi_pending_crs(): void
    {
        $maker = $this->user();
        $pjaUser = $this->user();
        $pjaId = $this->makePja($pjaUser);
        $id = $this->createFl($maker, ['publish' => 'Publish', 'pja_id' => $pjaId]);
        $this->postJson("/api/field-leadership/{$id}/submit")->assertOk();

        $this->actingAs($pjaUser);
        $this->postJson("/api/field-leadership/{$id}/pja-review", ['is_area_suitable' => false])->assertOk();

        $this->assertEquals('Pending CRS', DB::table('field_leaderships')->where('id', $id)->value('status'));
    }

    public function test_crs_action_approve_menjadi_on_review_crs(): void
    {
        $maker = $this->user();
        $crs = $this->user();
        $this->grantFlAdmin($crs);
        $pjaId = $this->makePja($this->user());
        $id = $this->createFl($maker, ['publish' => 'Publish', 'pja_id' => $pjaId]);
        DB::table('field_leaderships')->where('id', $id)->update(['status' => 'Pending CRS']);

        $this->actingAs($crs);
        $this->postJson("/api/field-leadership/{$id}/crs-action", ['action' => 'approve'])->assertOk();

        $this->assertEquals('On Review CRS', DB::table('field_leaderships')->where('id', $id)->value('status'));
    }

    public function test_crs_verify_approve_closed_dan_menutup_pica_turunan(): void
    {
        $maker = $this->user();
        $crs = $this->user();
        $this->grantFlAdmin($crs);
        $pjaUser = $this->user();
        $pjaId = $this->makePja($pjaUser);
        $id = $this->createFl($maker, [
            'publish' => 'Publish',
            'pja_id'  => $pjaId,
            'risks'   => [
                ['description' => 'Risiko close TDD', 'due_date' => now()->addDays(5)->toDateString(), 'repair_action' => 'Aksi close'],
            ],
        ]);
        $this->postJson("/api/field-leadership/{$id}/submit")->assertOk();
        $this->actingAs($pjaUser);
        $this->postJson("/api/field-leadership/{$id}/pja-review", ['is_area_suitable' => true])->assertOk();

        $this->actingAs($crs);
        $this->postJson("/api/field-leadership/{$id}/crs-verify", ['action' => 'approve'])->assertOk();

        $this->assertEquals('Closed', DB::table('field_leaderships')->where('id', $id)->value('status'));
        $riskId = DB::table('field_leadership_risks')->where('fl_id', $id)->value('id');
        $this->assertEquals('Closed', DB::table('field_leadership_risks')->where('id', $riskId)->value('status'));
        $this->assertEquals('Closed', DB::table('pica_documents')
            ->where('source', 'Field Leadership')->where('source_id', $riskId)->value('status'));
    }

    public function test_crs_verify_reject_kembali_ke_pja(): void
    {
        $maker = $this->user();
        $crs = $this->user();
        $this->grantFlAdmin($crs);
        $id = $this->createFl($maker, ['publish' => 'Publish']);
        DB::table('field_leaderships')->where('id', $id)->update(['status' => 'On Review CRS']);

        $this->actingAs($crs);
        $this->postJson("/api/field-leadership/{$id}/crs-verify", ['action' => 'reject', 'reason' => 'Belum sesuai TDD'])->assertOk();

        $this->assertEquals('On Review PJA', DB::table('field_leaderships')->where('id', $id)->value('status'));
    }

    // =====================================================================
    // RISKS
    // =====================================================================

    public function test_risks_index_dan_update_status(): void
    {
        $maker = $this->user();
        $id = $this->createFl($maker, [
            'publish' => 'Publish',
            'risks'   => [
                ['description' => 'Risiko list TDD', 'due_date' => now()->addDays(5)->toDateString()],
            ],
        ]);
        $riskId = DB::table('field_leadership_risks')->where('fl_id', $id)->value('id');

        $this->getJson('/api/field-leadership/risks?limit=100')->assertOk();

        $this->putJson('/api/field-leadership/risks/'.$riskId, ['status' => 'Closed'])->assertOk();
        $this->assertEquals('Closed', DB::table('field_leadership_risks')->where('id', $riskId)->value('status'));
    }
}
