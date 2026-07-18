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
        return Inertia::render('Admin/Sections', [
            'sections' => Section::with('department')->latest()->get(),
            'departments' => Department::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'section_name' => 'required|string|max:255',
            'section_code' => 'required|string|max:50',
        ]);
        Section::create($data);
        return back();
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'section_name' => 'required|string|max:255',
            'section_code' => 'required|string|max:50',
        ]);
        Section::findOrFail($id)->update($data);
        return back();
    }

    public function destroy($id)
    {
        Section::findOrFail($id)->delete();
        return back();
    }
}
