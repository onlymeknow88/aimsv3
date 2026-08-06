<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AimsModule;
use App\Services\AdminActivityLogService;
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

            AdminActivityLogService::log(
                action: 'create',
                resource: 'AimsModule',
                resourceId: $module->id,
                description: "Membuat AIMS module baru '{$module->name}'",
                newData: $module->toArray(),
                request: $request,
            );

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

        $oldData = $module->toArray();

        try {
            $module->update($validated);

            AdminActivityLogService::log(
                action: 'update',
                resource: 'AimsModule',
                resourceId: $module->id,
                description: "Memperbarui AIMS module '{$module->name}'",
                oldData: $oldData,
                newData: $module->fresh()->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($module, 'AIMS module berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui module: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete a module.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $module = AimsModule::findOrFail($id);
            $oldData = $module->toArray();
            $module->delete();

            AdminActivityLogService::log(
                action: 'delete',
                resource: 'AimsModule',
                resourceId: (string) $id,
                description: "Menghapus AIMS module '{$oldData['name']}'",
                oldData: $oldData,
                request: $request,
            );

            return ResponseFormatter::success(null, 'AIMS module berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus module: ' . $e->getMessage(), 500);
        }
    }
}
