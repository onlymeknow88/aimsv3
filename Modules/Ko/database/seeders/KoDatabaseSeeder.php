<?php

namespace Modules\Ko\Database\Seeders;

use Illuminate\Database\Seeder;

class KODatabaseSeeder extends Seeder
{
    /**
     * CATATAN: KoMenuSeeder SENGAJA terpisah (pola CSMS) — jalankan mandiri:
     * php artisan db:seed --class="Modules\Ko\Database\Seeders\KoMenuSeeder"
     */
    public function run(): void
    {
        // Master SPIP diisi via backoffice / import; tidak ada dummy otomatis.
    }
}
