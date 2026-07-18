<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseFormatter;
use App\Models\AimsMenu;
use App\Models\AimsModule;
use Illuminate\Http\Request;

class AimsMenuController extends Controller
{
    /**
     * API: Ambil semua menu dengan relasi module & children (tree structure).
     */
    public function apiIndex(Request $request)
    {
        try {
            $moduleId = $request->query('module_id');

            $query = AimsMenu::with(['module', 'children'])
                ->whereNull('parent_id')
                ->orderBy('module_id')
                ->orderBy('order_by');

            if ($moduleId) {
                $query->where('module_id', $moduleId);
            }

            $menus = $query->get()->map(function ($menu) {
                return [
                    'id'          => $menu->id,
                    'module_id'   => $menu->module_id,
                    'module_name' => $menu->module?->name,
                    'parent_id'   => $menu->parent_id,
                    'order_by'    => $menu->order_by,
                    'name'        => $menu->name,
                    'slug'        => $menu->slug,
                    'children'    => $menu->children->map(function ($child) {
                        return [
                            'id'        => $child->id,
                            'module_id' => $child->module_id,
                            'parent_id' => $child->parent_id,
                            'order_by'  => $child->order_by,
                            'name'      => $child->name,
                            'slug'      => $child->slug,
                            'children'  => [],
                        ];
                    })->values(),
                ];
            });

            return ResponseFormatter::success($menus, 'Data menu berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal mengambil data menu: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Ambil flat list menu (untuk dropdown parent di form).
     */
    public function apiList(Request $request)
    {
        try {
            $moduleId = $request->query('module_id');

            $query = AimsMenu::with('module')->orderBy('module_id')->orderBy('order_by');

            if ($moduleId) {
                $query->where('module_id', $moduleId);
            }

            $menus = $query->get()->map(fn($m) => [
                'id'          => $m->id,
                'module_id'   => $m->module_id,
                'module_name' => $m->module?->name,
                'parent_id'   => $m->parent_id,
                'name'        => $m->name,
                'slug'        => $m->slug,
            ]);

            return ResponseFormatter::success($menus, 'Flat list menu berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Ambil semua modul (untuk dropdown module di form).
     */
    public function getModules()
    {
        try {
            $modules = AimsModule::orderBy('name')->get(['id', 'name', 'slug']);
            return ResponseFormatter::success($modules, 'Data modul berhasil diambil.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal mengambil modul: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Simpan menu baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:aims_modules,id',
            'parent_id' => 'nullable|exists:aims_menus,id',
            'order_by'  => 'nullable|integer|min:0',
            'name'      => 'required|string|max:255',
            'slug'      => 'required|string|max:255|unique:aims_menus,slug',
        ]);

        try {
            $menu = AimsMenu::create([
                'module_id' => $validated['module_id'],
                'parent_id' => $validated['parent_id'] ?? null,
                'order_by'  => $validated['order_by'] ?? 0,
                'name'      => $validated['name'],
                'slug'      => $validated['slug'],
            ]);

            $menu->load('module');

            return ResponseFormatter::success($menu, 'Menu berhasil dibuat.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal membuat menu: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update menu yang ada.
     */
    public function update(Request $request, $id)
    {
        $menu = AimsMenu::find($id);

        if (!$menu) {
            return ResponseFormatter::error('Menu tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'module_id' => 'required|exists:aims_modules,id',
            'parent_id' => 'nullable|exists:aims_menus,id',
            'order_by'  => 'nullable|integer|min:0',
            'name'      => 'required|string|max:255',
            'slug'      => 'required|string|max:255|unique:aims_menus,slug,' . $id,
        ]);

        // Pastikan parent tidak menunjuk ke dirinya sendiri
        if (!empty($validated['parent_id']) && $validated['parent_id'] == $id) {
            return ResponseFormatter::error('Menu tidak bisa menjadi parent dari dirinya sendiri.', 422);
        }

        try {
            $menu->update([
                'module_id' => $validated['module_id'],
                'parent_id' => $validated['parent_id'] ?? null,
                'order_by'  => $validated['order_by'] ?? 0,
                'name'      => $validated['name'],
                'slug'      => $validated['slug'],
            ]);

            $menu->load('module');

            return ResponseFormatter::success($menu, 'Menu berhasil diperbarui.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal memperbarui menu: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Hapus menu beserta children-nya.
     */
    public function destroy($id)
    {
        $menu = AimsMenu::with('children')->find($id);

        if (!$menu) {
            return ResponseFormatter::error('Menu tidak ditemukan.', 404);
        }

        try {
            // Hapus children terlebih dahulu agar tidak orphan
            $menu->children()->delete();
            $menu->delete();

            return ResponseFormatter::success(null, 'Menu berhasil dihapus.');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Gagal menghapus menu: ' . $e->getMessage(), 500);
        }
    }
}
