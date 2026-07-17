<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AreaManager;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\Category;
use Modules\DocumentSystem\Entities\Mapping;
use Modules\DocumentSystem\Entities\Module;

class MasterDataApiController extends Controller
{
    /**
     * Fetch companies.
     */
    public function getCompanies()
    {
        return ResponseFormatter::success(Company::select('id', 'company_name', 'document_code')->get(), 'Companies retrieved successfully');
    }

    /**
     * Fetch departments.
     */
    public function getDepartments()
    {
        return ResponseFormatter::success(Department::select('id', 'name', 'document_code')->get(), 'Departments retrieved successfully');
    }

    /**
     * Fetch employee/area managers.
     */
    public function getPjs()
    {
        $query = AreaManager::query()->with('user');
        $managers = $query->get()->map(function ($mgr) {
            return [
                'id' => $mgr->id,
                'name' => $mgr->user->name ?? 'Unknown',
                'email' => $mgr->user->email ?? '',
            ];
        });

        return ResponseFormatter::success($managers, 'PJs retrieved successfully');
    }

    /**
     * Fetch modules sorted sequentially.
     */
    public function getModules()
    {
        return ResponseFormatter::success(
            Module::select('id', 'name', 'index')
                ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_modules.index, ".", 1) AS UNSIGNED) ASC')
                ->orderBy('index', 'asc')
                ->get(),
            'Modules retrieved successfully'
        );
    }

    /**
     * Fetch categories by module_id, sorted sequentially.
     */
    public function getCategories(Request $request)
    {
        $query = Category::query();
        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        return ResponseFormatter::success(
            $query->select('id', 'name', 'index')
                ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_categories.index, ".", 2) AS UNSIGNED) ASC')
                ->orderBy('index', 'asc')
                ->get(),
            'Categories retrieved successfully'
        );
    }

    /**
     * Fetch mappings by category_id, sorted sequentially.
     */
    public function getMappings(Request $request)
    {
        $query = Mapping::query();
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return ResponseFormatter::success(
            $query->select('id', 'name', 'index')
                ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_mappings.index, ".", 3) AS UNSIGNED) ASC')
                ->orderBy('index', 'asc')
                ->get(),
            'Mappings retrieved successfully'
        );
    }
}
