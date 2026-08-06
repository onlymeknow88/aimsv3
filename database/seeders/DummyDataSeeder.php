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

        // 2. Seed Departments & Heads (PICs) from the provided list
        $departmentPICs = [
            ['code' => 'MIM', 'dept' => 'Management Improvement', 'pic' => 'Sujatmiko Agung Nugroho'],
            ['code' => 'IMS', 'dept' => 'Integrated Management System', 'pic' => 'Mustolih'],
            ['code' => 'GED', 'dept' => 'Geology Development', 'pic' => 'Nurul Ikhsan'],
            ['code' => 'GFO', 'dept' => 'Geology Field Operation', 'pic' => 'Nana Kuryana'],
            ['code' => 'MTS', 'dept' => 'Mine Technical Support', 'pic' => 'Niko Dharminto'],
            ['code' => 'STS', 'dept' => 'Site Technical Services', 'pic' => 'Rahmad Taufik Siregar'],
            ['code' => 'LMF', 'dept' => 'Land Management & Forestry', 'pic' => 'Michael A. Nurwibowo'],
            ['code' => 'MPO', 'dept' => 'Mining Production', 'pic' => 'Rahmad Taufik Siregar'],
            ['code' => 'DNB', 'dept' => 'Drill and Blast', 'pic' => 'Rahmad Taufik Siregar'],
            ['code' => 'CPP', 'dept' => 'Coal Handling & Processsing Plant', 'pic' => 'Budi Prakoso'],
            ['code' => 'TNT', 'dept' => 'Technical Training', 'pic' => 'Kusumo Reksomukti'],
            ['code' => 'CHM', 'dept' => 'Coal Hauling & Road Maintenance', 'pic' => 'Ivan Kurniawan'],
            ['code' => 'CBL', 'dept' => 'Coal Processing & Barge Loading', 'pic' => 'Yuhardono Hardin'],
            ['code' => 'CUC', 'dept' => 'Coal Barging Upper Cycle', 'pic' => 'Yuhardono Hardin'],
            ['code' => 'QAC', 'dept' => 'Quality Assurance & Control', 'pic' => 'Noor Achmadi Surya Kesuma'],
            ['code' => 'MTN', 'dept' => 'Maintenance', 'pic' => 'Noor Achmadi Surya Kesuma'],
            ['code' => 'LOG', 'dept' => 'Logistic', 'pic' => 'Tri Harsono'],
            ['code' => 'GAM', 'dept' => 'General Affair Management', 'pic' => 'Yudi Rizki Irawan Prawirohardjo'],
            ['code' => 'ENV', 'dept' => 'Environmental Operation', 'pic' => 'Boorliant Satryana Wisnu'],
            ['code' => 'OHS', 'dept' => 'Occupational Health & Safety', 'pic' => 'Mustolih'],
            ['code' => 'IHH', 'dept' => 'Industrial Healt & Hygiene', 'pic' => 'Mustolih'],
            ['code' => 'MKT', 'dept' => 'Marketing', 'pic' => null],
            ['code' => 'IBL', 'dept' => 'Inbound Logistics', 'pic' => 'Noor Achmadi Surya Kesuma'],
            ['code' => 'HRM', 'dept' => 'Human Resources Management', 'pic' => null],
            ['code' => 'FIN', 'dept' => 'Finance & Accounting', 'pic' => null],
            ['code' => 'MIS', 'dept' => 'Management Information System', 'pic' => null],
            ['code' => 'PRC', 'dept' => 'Procurement', 'pic' => null],
            ['code' => 'MMT', 'dept' => 'Material Management', 'pic' => 'Azzikri Ijazah'],
            ['code' => 'CSR', 'dept' => 'Corporate Social Responsibility', 'pic' => 'Sri Armiaty Jarkasi'],
            ['code' => 'CMR', 'dept' => 'Community Relation', 'pic' => 'Bustanul Muhadisin'],
            ['code' => 'GOV', 'dept' => 'Government and Relation', 'pic' => 'Erisnandar'],
            ['code' => 'PMO', 'dept' => 'Project Management Officer', 'pic' => 'Yudho Winarko'],
        ];

        // Gather all unique PIC names
        $pics = [];
        foreach ($departmentPICs as $item) {
            if ($item['pic']) {
                $pics[] = $item['pic'];
            }
        }
        $uniquePics = array_unique($pics);

        // Seed PIC Users & Employees
        $userMap = [];
        foreach ($uniquePics as $name) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', str_replace(' ', '', $name)));
            $email = "{$slug}@aims.test";

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt('password'),
                'role' => 'viewer',
                'is_active' => true,
            ]);

            Employee::create([
                'user_id' => $user->id,
                'company_id' => $maruwai->id,
                'number' => 'EMP' . rand(100000, 999999),
                'id_number' => '31710' . rand(10000000000, 99999999999),
                'name' => $name,
                'date_of_birth' => '1985-01-01',
                'gender' => 'Laki-laki',
                'employee_status' => 'Active',
                'position' => 'Department Head',
                'grade' => 'Grade 6',
            ]);

            $userMap[$name] = $user;
        }

        // Seed Departments
        $deptMap = [];
        foreach ($departmentPICs as $item) {
            $picName = $item['pic'];
            $headId = $picName && isset($userMap[$picName]) ? $userMap[$picName]->id : null;
            $code = $item['code'];

            $dept = Department::create([
                'name' => $item['dept'],
                'code' => $code . '-DEPT',
                'document_code' => $code,
                'head_id' => $headId,
            ]);

            $deptMap[$item['dept']] = $dept;

            if ($picName && isset($userMap[$picName])) {
                $u = $userMap[$picName];
                if (!$u->department_id) {
                    $u->update(['department_id' => $dept->id]);
                    $u->employee?->update(['department_id' => $dept->id]);
                }
            }
        }
    }
}
