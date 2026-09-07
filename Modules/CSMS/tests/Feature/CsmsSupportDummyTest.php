<?php

namespace Modules\CSMS\tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\CSMS\Entities\CsmsDictionary;
use Modules\CSMS\Entities\CsmsLetter;
use Modules\CSMS\Entities\CsmsMemoKtt;
use Tests\TestCase;

/**
 * TDD data pendukung CSMS (Memo KTT, Surat Edaran, Kamus) + Enum.
 *
 * ATURAN KERAS (lihat agent/pica_tdd_rules.md & agent/fl_tdd_rules.md):
 * - WAJIB DatabaseTransactions: tiap test rollback, DB dev tidak tersentuh.
 * - DILARANG RefreshDatabase / migrate:fresh / truncate di suite ini.
 * - DILARANG upload file (memicu uploadToBlobStorage asli ke Azure).
 */
class CsmsSupportDummyTest extends TestCase
{
    use DatabaseTransactions;

    private function admin(): User
    {
        $user = User::create([
            'name'      => 'TDD CSMS',
            'email'     => 'tdd-csms-'.Str::uuid().'@aims.test',
            'password'  => bcrypt('secret'),
            'role'      => 'super_admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);
        return $user;
    }

    // =====================================================================
    // MEMO KTT
    // =====================================================================

    public function test_memo_store_lalu_update_dan_delete(): void
    {
        $this->admin();
        $ccow = DB::table('companies')->first();
        $this->assertNotNull($ccow, 'Butuh 1 company di DB dev untuk uji memo.');
        $store = $this->postJson('/api/csms/memo-ktts', [
            'memo_number' => 'MEMO/TDD/001',
            'title'       => 'Memo TDD',
            'ccow_id'     => $ccow->id,
            'date'        => now()->toDateString(),
            'description' => 'Deskripsi TDD',
        ]);
        $store->assertStatus(201);
        $id = $store->json('result.id');
        $this->assertNotEmpty($id);

        $this->putJson("/api/csms/memo-ktts/{$id}", [
            'title'  => 'Memo TDD Revisi',
            'status' => 'Inactive',
        ])->assertOk();
        $memo = CsmsMemoKtt::find($id);
        $this->assertEquals('Memo TDD Revisi', $memo->title);
        $this->assertEquals('Inactive', $memo->status);

        $this->deleteJson("/api/csms/memo-ktts/{$id}")->assertOk();
        $this->assertNull(CsmsMemoKtt::find($id));
    }

    public function test_memo_update_404_bila_tidak_ada(): void
    {
        $this->admin();
        $this->putJson('/api/csms/memo-ktts/'.(string) Str::uuid(), ['title' => 'X'])
            ->assertStatus(404);
    }

    // =====================================================================
    // LETTER
    // =====================================================================

    public function test_letter_store_lalu_update_dan_delete(): void
    {
        $this->admin();
        $ccow = DB::table('companies')->first();
        $this->assertNotNull($ccow, 'Butuh 1 company di DB dev untuk uji letter.');
        $store = $this->postJson('/api/csms/letters', [
            'letter_number' => 'SE/TDD/001',
            'title'         => 'SE TDD 001',
            'ccow_id'       => $ccow->id,
            'date'          => now()->toDateString(),
            'description'   => 'Deskripsi TDD',
        ]);
        $store->assertStatus(201);
        $id = $store->json('result.id');

        $this->putJson("/api/csms/letters/{$id}", [
            'title'         => 'SE TDD 001 Rev',
            'status'        => 'Inactive',
            'date_inactive' => now()->toDateString(),
        ])->assertOk();
        $letter = CsmsLetter::find($id);
        $this->assertEquals('SE TDD 001 Rev', $letter->title);
        $this->assertEquals('Inactive', $letter->status);
        $this->assertEquals('SE/TDD/001', $letter->letter_number);
        $this->assertEquals($ccow->id, $letter->ccow_id);

        $res = $this->getJson('/api/csms/letters?search=SE%2FTDD%2F001');
        $res->assertOk();
        $this->assertEquals($ccow->company_name, $res->json('result.data.0.ccow_name'));

        $this->deleteJson("/api/csms/letters/{$id}")->assertOk();
        $this->assertNull(CsmsLetter::find($id));
    }

    public function test_letter_validasi_judul_wajib(): void
    {
        $this->admin();
        $this->postJson('/api/csms/letters', ['title' => ''])->assertStatus(422);
    }

    // =====================================================================
    // DICTIONARY
    // =====================================================================

    public function test_dictionary_store_lalu_update_dan_delete(): void
    {
        $this->admin();
        $store = $this->postJson('/api/csms/dictionaries', ['term' => 'TDD', 'definition' => 'Test Driven']);
        $store->assertStatus(201);
        $id = $store->json('result.id');

        $this->putJson("/api/csms/dictionaries/{$id}", ['definition' => 'Test Driven Development'])->assertOk();
        $this->assertEquals('Test Driven Development', CsmsDictionary::find($id)->definition);

        $this->deleteJson("/api/csms/dictionaries/{$id}")->assertOk();
        $this->assertNull(CsmsDictionary::find($id));
    }

    // =====================================================================
    // ENUM
    // =====================================================================

    public function test_service_criteria_hanya_menerima_nilai_enum(): void
    {
        $this->assertEquals('CONTRACTOR', \Modules\CSMS\Enums\ServiceCriteria::Contractor->value);
        $this->assertEquals('SUBCONTRACTOR', \Modules\CSMS\Enums\ServiceCriteria::SubContractor->value);
        $this->assertEquals('DRAFT', \Modules\CSMS\Enums\BiddingStatus::Draft->value);
    }

    public function test_bidding_store_menolak_service_criteria_invalid(): void
    {
        $this->admin();
        $res = $this->postJson('/api/csms/biddings', [
            'company_name'       => 'PT TDD',
            'address'            => 'Jl TDD',
            'company_site'       => 'Site TDD',
            'license_number'     => 'LIC-TDD',
            'service_criteria'   => 'ASAL',
            'business_entity_id' => 'xx',
        ]);

        $res->assertStatus(422);
        $res->assertJsonValidationErrors(['service_criteria']);
    }
}
