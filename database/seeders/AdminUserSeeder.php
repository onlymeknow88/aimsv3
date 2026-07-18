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
            ['email' => env('SUPERADMIN_EMAIL', 'superadmin@aims.id')],
            [
                'name'      => env('SUPERADMIN_NAME', 'Super Administrator'),
                'password'  => bcrypt(env('SUPERADMIN_PASSWORD', 'Admin@123!')),
                'role'      => 'super_admin',
                'is_active' => true,
            ]
        );
    }
}
