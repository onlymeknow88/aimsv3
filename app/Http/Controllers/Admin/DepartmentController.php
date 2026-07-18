<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Company;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Departments', [
            'departments' => Department::with('company')->latest()->get(),
            'companies' => Company::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'department_name' => 'required|string|max:255',
            'department_code' => 'required|string|max:50',
        ]);
        Department::create($data);
        return back();
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'department_name' => 'required|string|max:255',
            'department_code' => 'required|string|max:50',
        ]);
        Department::findOrFail($id)->update($data);
        return back();
    }

    public function destroy($id)
    {
        Department::findOrFail($id)->delete();
        return back();
    }
}
