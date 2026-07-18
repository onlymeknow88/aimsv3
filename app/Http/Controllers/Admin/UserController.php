<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Employee;
use App\Models\Company;
use App\Models\Department;
use App\Models\Section;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index');
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'company_id' => 'nullable|exists:companies,id',
            'department_id' => 'nullable|exists:departments,id',
            'section_id' => 'nullable|exists:sections,id',
            'role_ids' => 'nullable|array'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'user'
        ]);

        $employee = Employee::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'company_id' => $request->company_id,
            'department_id' => $request->department_id,
            'section_id' => $request->section_id,
        ]);

        if ($request->has('role_ids')) {
            $user->documentRoles()->sync($request->role_ids);
        }

        return back();
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'company_id' => 'nullable|exists:companies,id',
            'department_id' => 'nullable|exists:departments,id',
            'section_id' => 'nullable|exists:sections,id',
            'role_ids' => 'nullable|array'
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = bcrypt($request->password);
        }

        $user->update($userData);

        $employee = Employee::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $request->name,
                'company_id' => $request->company_id,
                'department_id' => $request->department_id,
                'section_id' => $request->section_id,
            ]
        );

        if ($request->has('role_ids')) {
            $user->documentRoles()->sync($request->role_ids);
        }

        return back();
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->employee) {
            $user->employee->delete();
        }
        $user->delete();
        return back();
    }
}
