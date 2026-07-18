<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseFormatter;
use App\Models\User;
use App\Models\Employee;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * API: List all users with relations.
     */
    public function index()
    {
        try {
            $users = User::with([
                'employee.company',
                'employee.department',
                'documentRoles',
            ])->latest()->get()->map(fn($u) => [
                'id'             => $u->id,
                'name'           => $u->name,
                'email'          => $u->email,
                'role'           => $u->role,
                'is_active'      => $u->is_active,
                'created_at'     => $u->created_at,
                'employee'       => $u->employee ? [
                    'id'               => $u->employee->id,
                    'number'           => $u->employee->number,
                    'id_number'        => $u->employee->id_number,
                    'position'         => $u->employee->position,
                    'grade'            => $u->employee->grade,
                    'gender'           => $u->employee->gender,
                    'employee_status'  => $u->employee->employee_status,
                    'marital_status'   => $u->employee->marital_status,
                    'date_of_birth'    => $u->employee->date_of_birth,
                    'blood_type'       => $u->employee->blood_type,
                    'address'          => $u->employee->address,
                    'company_id'       => $u->employee->company_id,
                    'department_id'    => $u->employee->department_id,
                    'company'          => $u->employee->company ? ['id' => $u->employee->company->id, 'company_name' => $u->employee->company->company_name] : null,
                    'department'       => $u->employee->department ? ['id' => $u->employee->department->id, 'department_name' => $u->employee->department->department_name] : null,
                ] : null,
                'document_roles' => $u->documentRoles->map(fn($r) => ['id' => $r->id, 'name' => $r->name, 'module_id' => $r->module_id])->values(),
            ]);

            return ResponseFormatter::success($users, 'Data user berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Get master data for dropdowns.
     */
    public function masterData()
    {
        try {
            return ResponseFormatter::success([
                'companies'   => Company::orderBy('company_name')->get(['id', 'company_name']),
                'departments' => Department::orderBy('name')->get(['id', 'name', 'code', 'head_id']),
                'roles'       => DB::table('aims_roles')->get(),
                'modules'     => DB::table('aims_modules')->get(),
            ], 'Master data berhasil diambil.');
        } catch (\Exception $e) {
            \Log::error('Master Data Error: ' . $e->getMessage());
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Create user + employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:8',
            'role_ids'      => 'nullable|array',
            'role_ids.*'    => 'integer|exists:aims_roles,id',
            // Employee fields (optional)
            'with_employee'    => 'boolean',
            'company_id'       => 'nullable|exists:companies,id',
            'department_id'    => 'nullable|exists:departments,id',
            'emp_number'       => 'nullable|string|max:50',
            'emp_id_number'    => 'nullable|string|max:50',
            'emp_position'     => 'nullable|string|max:255',
            'emp_grade'        => 'nullable|string|max:100',
            'emp_gender'       => 'nullable|in:male,female',
            'emp_status'       => 'nullable|string|max:100',
            'emp_marital'      => 'nullable|string|max:100',
            'emp_dob'          => 'nullable|date',
            'emp_blood_type'   => 'nullable|string|max:5',
            'emp_address'      => 'nullable|string',
        ]);

        try {
            $user = DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name'     => $validated['name'],
                    'email'    => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role'     => 'user',
                ]);

                if (!empty($validated['with_employee'])) {
                    Employee::create([
                        'user_id'         => $user->id,
                        'name'            => $validated['name'],
                        'company_id'      => $validated['company_id'] ?? null,
                        'department_id'   => $validated['department_id'] ?? null,
                        'number'          => $validated['emp_number'] ?? null,
                        'id_number'       => $validated['emp_id_number'] ?? null,
                        'position'        => $validated['emp_position'] ?? null,
                        'grade'           => $validated['emp_grade'] ?? null,
                        'gender'          => $validated['emp_gender'] ?? null,
                        'employee_status' => $validated['emp_status'] ?? null,
                        'marital_status'  => $validated['emp_marital'] ?? null,
                        'date_of_birth'   => $validated['emp_dob'] ?? null,
                        'blood_type'      => $validated['emp_blood_type'] ?? null,
                        'address'         => $validated['emp_address'] ?? null,
                    ]);
                }

                if (!empty($validated['role_ids'])) {
                    $user->documentRoles()->sync($validated['role_ids']);
                }

                return $user;
            });

            return ResponseFormatter::success(['id' => $user->id], 'User berhasil dibuat.');
        } catch (\Exception $e) {
            \Log::error('User Store Error: ' . $e->getMessage());
            return ResponseFormatter::error('Gagal membuat user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update user + employee.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return ResponseFormatter::error('User tidak ditemukan.', 404);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email,' . $id,
            'password'      => 'nullable|string|min:8',
            'role_ids'      => 'nullable|array',
            'role_ids.*'    => 'integer|exists:aims_roles,id',
            'with_employee'    => 'boolean',
            'company_id'       => 'nullable|exists:companies,id',
            'department_id'    => 'nullable|exists:departments,id',
            'emp_number'       => 'nullable|string|max:50',
            'emp_id_number'    => 'nullable|string|max:50',
            'emp_position'     => 'nullable|string|max:255',
            'emp_grade'        => 'nullable|string|max:100',
            'emp_gender'       => 'nullable|in:male,female',
            'emp_status'       => 'nullable|string|max:100',
            'emp_marital'      => 'nullable|string|max:100',
            'emp_dob'          => 'nullable|date',
            'emp_blood_type'   => 'nullable|string|max:5',
            'emp_address'      => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($validated, $user) {
                $userData = ['name' => $validated['name'], 'email' => $validated['email']];
                if (!empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }
                $user->update($userData);

                if (!empty($validated['with_employee'])) {
                    Employee::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'name'            => $validated['name'],
                            'company_id'      => $validated['company_id'] ?? null,
                            'department_id'   => $validated['department_id'] ?? null,
                            'number'          => $validated['emp_number'] ?? null,
                            'id_number'       => $validated['emp_id_number'] ?? null,
                            'position'        => $validated['emp_position'] ?? null,
                            'grade'           => $validated['emp_grade'] ?? null,
                            'gender'          => $validated['emp_gender'] ?? null,
                            'employee_status' => $validated['emp_status'] ?? null,
                            'marital_status'  => $validated['emp_marital'] ?? null,
                            'date_of_birth'   => $validated['emp_dob'] ?? null,
                            'blood_type'      => $validated['emp_blood_type'] ?? null,
                            'address'         => $validated['emp_address'] ?? null,
                        ]
                    );
                } else {
                    // Kalau toggle "with_employee" dimatiin pas edit, hapus data employee lama
                    $user->employee?->delete();
                }

                $user->documentRoles()->sync($validated['role_ids'] ?? []);
            });

            return ResponseFormatter::success(['id' => $user->id], 'User berhasil diperbarui.');
        } catch (\Exception $e) {
            \Log::error('User Update Error: ' . $e->getMessage());
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete user + employee.
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return ResponseFormatter::error('User tidak ditemukan.', 404);

        try {
            DB::transaction(function () use ($user) {
                $user->employee?->delete();
                $user->delete();
            });
            return ResponseFormatter::success(null, 'User berhasil dihapus.');
        } catch (\Exception $e) {
            \Log::error('User Destroy Error: ' . $e->getMessage());
            return ResponseFormatter::error('Gagal menghapus: ' . $e->getMessage(), 500);
        }
    }
}
