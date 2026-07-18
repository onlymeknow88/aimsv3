<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Companies', [
            'companies' => Company::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_code' => 'required|string|max:50',
        ]);
        Company::create($data);
        return back();
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_code' => 'required|string|max:50',
        ]);
        Company::findOrFail($id)->update($data);
        return back();
    }

    public function destroy($id)
    {
        Company::findOrFail($id)->delete();
        return back();
    }
}
