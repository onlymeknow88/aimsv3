<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Company;
use App\Models\Department;
use App\Models\Section;
use App\Models\BusinessEntity;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => User::count(),
            'roles' => DB::table('aims_roles')->count(),
            'companies' => Company::count(),
            'departments' => Department::count(),
            'sections' => Section::count(),
            'entities' => BusinessEntity::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
