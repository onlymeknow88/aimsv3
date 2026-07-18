<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessEntity;
use Inertia\Inertia;

class BusinessEntityController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/BusinessEntities', [
            'entities' => BusinessEntity::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
        ]);
        BusinessEntity::create($data);
        return back();
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
        ]);
        BusinessEntity::findOrFail($id)->update($data);
        return back();
    }

    public function destroy($id)
    {
        BusinessEntity::findOrFail($id)->delete();
        return back();
    }
}
