<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;
use App\Models\Department;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Section/Index', [
            'sections' => Section::with('department')->latest()->get(),
            'departments' => Department::all()
        ]);
    }

}
