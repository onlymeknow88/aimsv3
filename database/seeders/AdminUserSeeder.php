<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'superadmin@aims.id'],
            [
                'name'      => 'Super Administrator',
                'password'  => bcrypt('Admin@123!'),
                'role'      => 'super_admin',
                'is_active' => true,
            ]
        );
    }
}
