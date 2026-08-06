<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\BusinessEntity;
use App\Services\AdminActivityLogService;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        try {
            $limit = $request->query('limit', 10); // Default limit 10
            $search = $request->query('search', ''); // Default search kosong

            $query = BusinessEntity::query();

            if (!empty($search)) {
                $query->where('name', 'like', "%{$search}%");
            }

            $businessEntities = $query->paginate($limit);

            return ResponseFormatter::success($businessEntities, 'Business entities retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving business entities: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $businessEntity = BusinessEntity::findOrFail($id);
            return ResponseFormatter::success($businessEntity, 'Business entity retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving business entity: ' . $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $businessEntity = BusinessEntity::create($request->only(['name', 'description']));

            AdminActivityLogService::log(
                action: 'create',
                resource: 'BusinessEntity',
                resourceId: $businessEntity->id,
                description: "Membuat business entity '{$businessEntity->name}'",
                newData: $businessEntity->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($businessEntity, 'Business entity created successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error creating business entity: ' . $e->getMessage(), 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $businessEntity = BusinessEntity::findOrFail($id);
            $oldData = $businessEntity->toArray();

            $request->validate([
                'name' => 'required|string|max:255|unique:business_entities,name,' . $id,
            ]);

            $businessEntity->update($request->only(['name']));

            AdminActivityLogService::log(
                action: 'update',
                resource: 'BusinessEntity',
                resourceId: $businessEntity->id,
                description: "Memperbarui business entity '{$businessEntity->name}'",
                oldData: $oldData,
                newData: $businessEntity->fresh()->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($businessEntity, 'Business entity updated successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error updating business entity: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $businessEntity = BusinessEntity::findOrFail($id);
            $oldData = $businessEntity->toArray();
            $businessEntity->delete();

            AdminActivityLogService::log(
                action: 'delete',
                resource: 'BusinessEntity',
                resourceId: (string) $id,
                description: "Menghapus business entity '{$oldData['name']}'",
                oldData: $oldData,
                request: $request,
            );

            return ResponseFormatter::success(null, 'Business entity deleted successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error deleting business entity: ' . $e->getMessage(), 500);
        }
    }
}
