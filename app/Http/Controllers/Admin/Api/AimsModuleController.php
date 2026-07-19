<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AimsModule;
use Illuminate\Http\Request;

class AimsModuleController extends Controller
{
    /**
     * API: List AIMS modules (paginated, searchable).
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');

            $query = AimsModule::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%");
                });
            }

            $modules = $query->orderBy('name')->paginate($limit);

            return ResponseFormatter::success($modules, 'AIMS modules retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Create a new module.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:aims_modules,name',
            'slug' => 'required|string|max:255|unique:aims_modules,slug',
        ]);

        try {
            $module = AimsModule::create($validated);

            return ResponseFormatter::success($module, 'AIMS module berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat module: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update an existing module.
     */
    public function update(Request $request, $id)
    {
        $module = AimsModule::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:aims_modules,name,' . $module->id,
            'slug' => 'required|string|max:255|unique:aims_modules,slug,' . $module->id,
        ]);

        try {
            $module->update($validated);

            return ResponseFormatter::success($module, 'AIMS module berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui module: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete a module.
     */
    public function destroy($id)
    {
        try {
            $module = AimsModule::findOrFail($id);
            $module->delete();

            return ResponseFormatter::success(null, 'AIMS module berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus module: ' . $e->getMessage(), 500);
        }
    }
}
