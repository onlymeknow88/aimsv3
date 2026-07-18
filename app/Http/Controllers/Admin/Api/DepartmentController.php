<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * API: List departments (paginated, searchable).
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);   // Default limit 10
            $search = $request->query('search', '');  // Default search kosong

            $query = Department::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('document_code', 'like', "%{$search}%");
                });
            }

            $departments = $query->orderBy('name')->paginate($limit);

            return ResponseFormatter::success($departments, 'Departments retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Create a new department.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255|unique:departments,name',
            'code'          => 'nullable|string|max:50|unique:departments,code',
            'document_code' => 'nullable|string|max:50|unique:departments,document_code',
            'head_id'       => 'nullable|exists:users,id',
        ]);

        try {
            $department = Department::create($validated);

            return ResponseFormatter::success($department, 'Department berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat department: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update an existing department.
     */
    public function update(Request $request, $id)
    {
        $department = Department::find($id);
        if (!$department) {
            return ResponseFormatter::error('Department tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255|unique:departments,name,' . $id,
            'code'          => 'nullable|string|max:50|unique:departments,code,' . $id,
            'document_code' => 'nullable|string|max:50|unique:departments,document_code,' . $id,
            'head_id'       => 'nullable|exists:users,id',
        ]);

        try {
            $department->update($validated);

            return ResponseFormatter::success($department, 'Department berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui department: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete a department.
     */
    public function destroy($id)
    {
        $department = Department::find($id);
        if (!$department) {
            return ResponseFormatter::error('Department tidak ditemukan.', 404);
        }

        try {
            $department->delete();

            return ResponseFormatter::success(null, 'Department berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus department: ' . $e->getMessage(), 500);
        }
    }
}
