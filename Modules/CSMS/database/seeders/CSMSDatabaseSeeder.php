<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;

class CSMSDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CATATAN: CsmsMenuSeeder SENGAJA tidak dipanggil di sini (terpisah).
        // Menu/role/permission dis seed mandiri agar module:seed tidak
        // menghapus kustomisasi permission backoffice (seeder me-recreate menu).
        // Jalankan manual: php artisan db:seed --class="Modules\CSMS\Database\Seeders\CsmsMenuSeeder"
        $this->call([
            CSMSMasterBiddingChecklistTableSeeder::class,
            CSMSDummySeeder::class,
            CsmsCertificateSeeder::class,
        ]);
    }
}
