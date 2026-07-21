<?php

namespace Modules\FieldLeadership\Database\Seeders;

use Illuminate\Database\Seeder;

class FieldLeadershipDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            FieldLeadershipMenuSeeder::class,
            FieldLeadershipDummySeeder::class,
        ]);
    }
}
