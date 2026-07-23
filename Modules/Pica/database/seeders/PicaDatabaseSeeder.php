<?php

namespace Modules\Pica\Database\Seeders;

use Illuminate\Database\Seeder;

class PicaDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            PicaMenuSeeder::class,
        ]);
    }
}
