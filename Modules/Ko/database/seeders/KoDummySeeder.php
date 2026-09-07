<?php

namespace Modules\Ko\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Ko\Entities\KoBrand;
use Modules\Ko\Entities\KoUnit;

/**
 * Dummy unit operasi untuk dev (aman diulang: skip bila sudah ada).
 *   php artisan db:seed --class="Modules\Ko\Database\Seeders\KoDummySeeder"
 */
class KoDummySeeder extends Seeder
{
    public function run(): void
    {
        if (KoUnit::query()->exists()) {
            $this->command->info('KO units sudah ada, dilewati.');
            return;
        }

        $spipUnit = DB::table('ko_spip_units')->first();
        $categoryId = $spipUnit
            ? DB::table('ko_spip_types')->where('id', $spipUnit->ko_spip_type_id)->value('ko_spip_category_id')
            : DB::table('ko_spip_categories')->value('id');

        $brand = KoBrand::firstOrCreate(
            ['name' => 'Toyota'],
            ['id' => (string) Str::uuid(), 'ko_spip_category_id' => $categoryId]
        );

        $samples = [
            ['call_sign' => 'LV-001', 'identity_number' => 'B 1234 ABC', 'serial_number' => 'SN-LV-001', 'model_unit' => 'Hilux Double Cabin 4x4', 'production_year' => 2023],
            ['call_sign' => 'LV-002', 'identity_number' => 'B 5678 DEF', 'serial_number' => 'SN-LV-002', 'model_unit' => 'Hilux Single Cabin 4x2', 'production_year' => 2022],
            ['call_sign' => 'DT-001', 'identity_number' => 'B 9012 GHI', 'serial_number' => 'SN-DT-001', 'model_unit' => 'Dyna Dump Truck', 'production_year' => 2021],
        ];

        foreach ($samples as $s) {
            KoUnit::create($s + [
                'id'              => (string) Str::uuid(),
                'ko_spip_unit_id' => $spipUnit->id ?? null,
                'ko_brand_id'     => $brand->id,
            ]);
        }

        $this->command->info('KO dummy units dibuat: '.count($samples));
    }
}
