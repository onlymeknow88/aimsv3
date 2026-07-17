<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Department;
use App\Models\Section;
use App\Models\User;
use App\Models\Employee;
use App\Models\AimsRole;
use App\Models\AreaLocation;
use App\Models\AreaManager;
use App\Models\BusinessEntity;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Business Entities
        $entities = [
            'Perusahaan Perseorangan',
            'Firma',
            'Koperasi',
            'Perseroan Komanditer (CV)',
            'Perseroan Terbatas (PT)',
            'Persero (Perseroan Terbatas Negara)',
            'Perusahaan Daerah',
            'Yayasan',
        ];

        foreach ($entities as $name) {
            BusinessEntity::create(['name' => $name]);
        }

        // 1. Seed Companies
        $maruwai = Company::create([
            'company_name' => 'PT Maruwai Coal',
            'document_code' => 'MAC',
            'address' => 'Jakarta, Indonesia',
            'email' => 'contact@maruwaicoal.co.id',
            'phone_number' => '021-5551234',
            'type' => 'Internal',
        ]);

        $lahai = Company::create([
            'company_name' => 'PT Lahai Coal',
            'document_code' => 'LHC',
            'address' => 'Balikpapan, Indonesia',
            'email' => 'contact@lahai.co.id',
            'phone_number' => '0542-5554321',
            'type' => 'Internal',
        ]);

        // 2. Seed Departments (Global)
        $hrd = Department::create([
            'name' => 'Human Resources Department',
            'code' => 'HRD',
            'document_code' => 'HRD-DEPT',
        ]);

        $hse = Department::create([
            'name' => 'Health, Safety, and Environment',
            'code' => 'HSE',
            'document_code' => 'HSE-DEPT',
        ]);

        $it = Department::create([
            'name' => 'Information Technology',
            'code' => 'IT',
            'document_code' => 'IT-DEPT',
        ]);

        // Fetch AimsRoles
        $makerRole = AimsRole::where('slug', 'maker')->first();
        $crsRole   = AimsRole::where('slug', 'approval_crs')->first();
        $pjaRole   = AimsRole::where('slug', 'approval_pja')->first();

        // 3. Seed Users & Employees
        // User 1: Maker
        $user1 = User::create([
            'name' => 'Aditya Maker',
            'email' => 'maker@aims.test',
            'password' => bcrypt('password'),
            'role' => 'viewer',
            'is_active' => true,
            'department_id' => $hse->id,
        ]);
        if ($makerRole) {
            $user1->documentRoles()->sync([$makerRole->id]);
        }
        Employee::create([
            'user_id' => $user1->id,
            'department_id' => $hse->id,
            'company_id' => $maruwai->id,
            'number' => 'EMP001',
            'id_number' => '3171012345678001',
            'name' => 'Aditya Maker',
            'date_of_birth' => '1990-05-15',
            'gender' => 'Laki-laki',
            'address' => 'Sunter, Jakarta Utara',
            'employee_status' => 'Active',
            'position' => 'Safety Specialist',
            'grade' => 'Grade 4',
        ]);

        // User 2: CRS
        $user2 = User::create([
            'name' => 'Budi CRS',
            'email' => 'crs@aims.test',
            'password' => bcrypt('password'),
            'role' => 'viewer',
            'is_active' => true,
            'department_id' => $hrd->id,
        ]);
        if ($crsRole) {
            $user2->documentRoles()->sync([$crsRole->id]);
        }
        Employee::create([
            'user_id' => $user2->id,
            'department_id' => $hrd->id,
            'company_id' => $maruwai->id,
            'number' => 'EMP002',
            'id_number' => '3171012345678002',
            'name' => 'Budi CRS',
            'date_of_birth' => '1988-11-20',
            'gender' => 'Laki-laki',
            'address' => 'Kelapa Gading, Jakarta Utara',
            'employee_status' => 'Active',
            'position' => 'HR Manager',
            'grade' => 'Grade 6',
        ]);

        // User 3: PJA
        $user3 = User::create([
            'name' => 'Chandra PJA',
            'email' => 'pja@aims.test',
            'password' => bcrypt('password'),
            'role' => 'viewer',
            'is_active' => true,
            'department_id' => $it->id,
        ]);
        if ($pjaRole) {
            $user3->documentRoles()->sync([$pjaRole->id]);
        }
        Employee::create([
            'user_id' => $user3->id,
            'department_id' => $it->id,
            'company_id' => $lahai->id,
            'number' => 'EMP003',
            'id_number' => '3171012345678003',
            'name' => 'Chandra PJA',
            'date_of_birth' => '1992-08-10',
            'gender' => 'Laki-laki',
            'address' => 'Klandasan, Balikpapan',
            'employee_status' => 'Inactive',
            'position' => 'IT Lead',
            'grade' => 'Grade 5',
        ]);

        // 4. Seed Area Locations & Area Managers
        $loc1 = AreaLocation::create(['name' => 'Office Building 1st Floor']);
        $loc2 = AreaLocation::create(['name' => 'Workshop A']);
        $loc3 = AreaLocation::create(['name' => 'Mining Area Block B']);

        $mgr1 = AreaManager::create(['user_id' => $user2->id]);
        $mgr2 = AreaManager::create(['user_id' => $user3->id]);

        // 5. Seed Sections
        $sec1 = Section::create([
            'department_id' => $hrd->id,
            'name' => 'Recruitment & Onboarding',
        ]);
        $sec1->areaLocations()->sync([$loc1->id]);
        $sec1->areaManagers()->sync([$mgr1->id]);

        $sec2 = Section::create([
            'department_id' => $hrd->id,
            'name' => 'Training & Development',
        ]);
        $sec2->areaLocations()->sync([$loc1->id]);
        $sec2->areaManagers()->sync([$mgr1->id]);

        $sec3 = Section::create([
            'department_id' => $hse->id,
            'name' => 'Safety Operations',
        ]);
        $sec3->areaLocations()->sync([$loc2->id]);
        $sec3->areaManagers()->sync([$mgr2->id]);

        $sec4 = Section::create([
            'department_id' => $hse->id,
            'name' => 'Environmental Management',
        ]);
        $sec4->areaLocations()->sync([$loc3->id]);
        $sec4->areaManagers()->sync([$mgr2->id]);

        $sec5 = Section::create([
            'department_id' => $it->id,
            'name' => 'Infrastructure & Support',
        ]);
        $sec5->areaLocations()->sync([$loc1->id]);
        $sec5->areaManagers()->sync([$mgr1->id]);
    }
}
