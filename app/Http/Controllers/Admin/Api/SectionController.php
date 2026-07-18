<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AreaLocation;
use App\Models\AreaManager;
use App\Models\Department;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SectionController extends Controller
{
    /**
     * API: List sections (paginated, searchable, dengan relasi department).
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');

            $query = Section::with([
                'department:id,name',
                'areaLocations:id,name',
                'areaManagers.user:id,name,email',
            ]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('department', function ($dq) use ($search) {
                            $dq->where('name', 'like', "%{$search}%");
                        });
                });
            }

            $sections = $query->orderBy('name')->paginate($limit);

            return ResponseFormatter::success($sections, 'Sections retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Master data untuk dropdown department di form section.
     */
    public function masterData()
    {
        try {
            return ResponseFormatter::success([
                'departments' => Department::orderBy('name')->get(['id', 'name']),
                'area_locations' => AreaLocation::orderBy('name')->get(['id', 'name']),
                'area_managers' => AreaManager::with(['user:id,name,email', 'areaLocations:id,name'])
                    ->get(['id', 'user_id'])
                    ->sortBy(fn($manager) => $manager->user?->name)
                    ->values(),
                'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            ], 'Master data berhasil diambil.');
        } catch (\Exception $e) {
            \Log::error('Section Master Data Error: ' . $e->getMessage());
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    public function storeAreaLocation(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('area_locations', 'name')->whereNull('deleted_at'),
            ],
        ]);

        dd($validated);

        try {
            $location = AreaLocation::create($validated);

            return ResponseFormatter::success($location, 'Area location berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat area location: ' . $e->getMessage(), 500);
        }
    }

    public function updateAreaLocation(Request $request, $id)
    {
        $location = AreaLocation::find($id);
        if (!$location) {
            return ResponseFormatter::error('Area location tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('area_locations', 'name')->ignore($id)->whereNull('deleted_at'),
            ],
        ]);

        try {
            $location->update($validated);

            return ResponseFormatter::success($location, 'Area location berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui area location: ' . $e->getMessage(), 500);
        }
    }

    public function storeAreaManager(Request $request)
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
            ],
            'area_location_ids' => 'nullable|array',
            'area_location_ids.*' => 'exists:area_locations,id',
        ]);


        try {

            $manager = DB::transaction(function () use ($validated) {

                $manager = AreaManager::create([
                    'user_id' => $validated['user_id'],
                ]);

                $manager->areaLocations()->sync(
                    $validated['area_location_ids'] ?? []
                );

                return $manager;
            });

            $manager->load([
                'user:id,name,email',
                'areaLocations:id,name',
            ]);

            return ResponseFormatter::success(
                $manager,
                'Area manager berhasil dibuat.'
            );
        } catch (\Throwable $e) {

            return ResponseFormatter::error(
                $e->getMessage(),
                500
            );
        }
    }

    public function updateAreaManager(Request $request, $id)
    {
        $manager = AreaManager::findOrFail($id);

        $validated = $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
            ],
            'area_location_ids' => 'nullable|array',
            'area_location_ids.*' => 'exists:area_locations,id',
        ]);

        DB::transaction(function () use ($manager, $validated) {

            $manager->update([
                'user_id' => $validated['user_id'],
            ]);

            $manager->areaLocations()->sync(
                $validated['area_location_ids'] ?? []
            );
        });

        $manager->load([
            'user:id,name,email',
            'areaLocations:id,name',
        ]);

        return ResponseFormatter::success(
            $manager,
            'Area manager berhasil diperbarui.'
        );
    }

    /**
     * API: Create a new section.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'area_location_ids' => 'nullable|array',
            'area_location_ids.*' => 'exists:area_locations,id',
            'area_manager_ids' => 'nullable|array',
            'area_manager_ids.*' => 'exists:area_managers,id',
        ]);

        $this->validateManagerLocationLocks(
            $validated['area_manager_ids'] ?? [],
            $validated['area_location_ids'] ?? []
        );

        try {
            $section = Section::create([
                'name' => $validated['name'],
                'department_id' => $validated['department_id'],
            ]);
            $section->areaLocations()->sync($validated['area_location_ids'] ?? []);
            $section->areaManagers()->sync($validated['area_manager_ids'] ?? []);
            $section->load(['department:id,name', 'areaLocations:id,name', 'areaManagers.user:id,name,email']);

            return ResponseFormatter::success($section, 'Section berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat section: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update an existing section.
     */
    public function update(Request $request, $id)
    {
        $section = Section::find($id);
        if (!$section) {
            return ResponseFormatter::error('Section tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'area_location_ids' => 'nullable|array',
            'area_location_ids.*' => 'exists:area_locations,id',
            'area_manager_ids' => 'nullable|array',
            'area_manager_ids.*' => 'exists:area_managers,id',
        ]);

        $this->validateManagerLocationLocks(
            $validated['area_manager_ids'] ?? [],
            $validated['area_location_ids'] ?? []
        );

        try {
            $section->update([
                'name' => $validated['name'],
                'department_id' => $validated['department_id'],
            ]);
            $section->areaLocations()->sync($validated['area_location_ids'] ?? []);
            $section->areaManagers()->sync($validated['area_manager_ids'] ?? []);
            $section->load(['department:id,name', 'areaLocations:id,name', 'areaManagers.user:id,name,email']);

            return ResponseFormatter::success($section, 'Section berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui section: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete (soft delete) a section.
     */
    public function destroy($id)
    {
        $section = Section::find($id);
        if (!$section) {
            return ResponseFormatter::error('Section tidak ditemukan.', 404);
        }

        try {
            $section->delete(); // soft delete karena tabel punya deleted_at

            return ResponseFormatter::success(null, 'Section berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus section: ' . $e->getMessage(), 500);
        }
    }

    private function validateManagerLocationLocks(array $managerIds, array $locationIds)
    {
        if (empty($managerIds)) {
            return;
        }

        $selectedLocationIds = collect($locationIds)->map(fn($id) => (string) $id);

        $invalidManagers = AreaManager::with('areaLocations:id')
            ->whereIn('id', $managerIds)
            ->get()
            ->filter(function ($manager) use ($selectedLocationIds) {

                $managerLocations = $manager->areaLocations
                    ->pluck('id')
                    ->map(fn($id) => (string)$id);

                // Manager tidak punya lokasi sama sekali
                if ($managerLocations->isEmpty()) {
                    return true;
                }

                // Minimal ada 1 lokasi yang sama
                return $managerLocations
                    ->intersect($selectedLocationIds)
                    ->isEmpty();
            });

        if ($invalidManagers->isNotEmpty()) {

            throw ValidationException::withMessages([
                'area_manager_ids' =>
                'Area Manager tidak memiliki Area Location yang sesuai.'
            ]);
        }
    }

    public function destroyAreaManager($id)
    {
        $manager = AreaManager::findOrFail($id);

        DB::transaction(function () use ($manager) {

            // hapus semua relasi lokasi
            $manager->areaLocations()->detach();

            // hapus relasi section
            $manager->sections()->detach();

            // soft delete manager
            $manager->delete();
        });

        return ResponseFormatter::success(
            null,
            'Area Manager berhasil dihapus.'
        );
    }
    public function destroyAreaLocation($id)
    {
        $location = AreaLocation::findOrFail($id);

        if (
            $location->sections()->exists() ||
            $location->areaManagers()->exists()
        ) {
            return ResponseFormatter::error(
                'Area Location masih digunakan oleh Section atau Area Manager.',
                422
            );
        }

        $location->delete();

        return ResponseFormatter::success(
            null,
            'Area Location berhasil dihapus.'
        );
    }
}
