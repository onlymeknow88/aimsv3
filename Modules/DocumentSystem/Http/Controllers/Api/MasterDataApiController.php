<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AreaManager;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\DocumentSystem\Entities\Category;
use Modules\DocumentSystem\Entities\Mapping;
use Modules\DocumentSystem\Entities\Module;
use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\PtwDocument;

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
        $managers = AreaManager::query()
            ->with('user')
            ->get()
            ->map(function ($mgr) {
                return [
                    'id'    => $mgr->id,
                    'user_id' => $mgr->user_id,
                    'name'  => $mgr->user->name ?? 'Unknown',
                    'email' => $mgr->user->email ?? '',
                ];
            })
            ->unique('user_id')   // <- deduplikasi: satu user hanya muncul sekali
            ->map(function ($mgr) {
                // Kembalikan format tanpa user_id agar konsisten
                return [
                    'id'    => $mgr['id'],
                    'name'  => $mgr['name'],
                    'email' => $mgr['email'],
                ];
            })
            ->values();

        return ResponseFormatter::success($managers, 'PJs retrieved successfully');
    }

    /**
     * Fetch modules sorted sequentially with search and pagination support.
     */
    public function getModules(Request $request)
    {
        $search = $request->query('search');
        $query = Module::select('id', 'name', 'index', 'has_document_number')
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_modules.index, ".", 1) AS UNSIGNED) ASC')
            ->orderBy('index', 'asc');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('index', 'like', "%{$search}%");
            });
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $modules = $query->paginate($limit);
        } else {
            $modules = $query->get();
        }

        return ResponseFormatter::success($modules, 'Modules retrieved successfully');
    }

    /**
     * Store a newly created module.
     */
    public function storeModule(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'index' => 'nullable|string|max:50',
            'has_document_number' => 'boolean',
        ]);

        $module = Module::create([
            'name'  => $request->name,
            'index' => $request->index,
            'has_document_number' => $request->input('has_document_number', true),
        ]);

        return ResponseFormatter::success($module, 'Module created successfully');
    }

    /**
     * Update an existing module.
     */
    public function updateModule(Request $request, $id)
    {
        $module = Module::findOrFail($id);

        $request->validate([
            'name'  => 'required|string|max:255',
            'index' => 'nullable|string|max:50',
            'has_document_number' => 'boolean',
        ]);

        $module->update([
            'name'  => $request->name,
            'index' => $request->index,
            'has_document_number' => $request->input('has_document_number', true),
        ]);

        return ResponseFormatter::success($module, 'Module updated successfully');
    }

    /**
     * Delete a module.
     */
    public function deleteModule($id)
    {
        $module = Module::findOrFail($id);
        $module->delete();

        return ResponseFormatter::success(null, 'Module deleted successfully');
    }

    /**
     * Fetch categories with search and pagination support.
     */
    public function getCategories(Request $request)
    {
        $search = $request->query('search');
        $moduleId = $request->query('module_id');
        
        $query = Category::select('id', 'module_id', 'name', 'index')
            ->with('module:id,name')
            ->withCount('mappings')
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_categories.index, ".", 1) AS UNSIGNED) ASC')
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_categories.index, ".", 2) AS UNSIGNED) ASC')
            ->orderBy('index', 'asc');

        if ($moduleId) {
            $query->where('module_id', $moduleId);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('index', 'like', "%{$search}%")
                  ->orWhereHas('module', function ($mq) use ($search) {
                      $mq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $categories = $query->paginate($limit);
        } else {
            $categories = $query->get();
        }

        return ResponseFormatter::success($categories, 'Categories retrieved successfully');
    }

    /**
     * Store a newly created category.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:document_system_modules,id',
            'name'      => 'required|string|max:255',
            'index'     => 'required|string|max:50',
        ]);

        $category = Category::create([
            'module_id' => $request->module_id,
            'name'      => $request->name,
            'index'     => $request->index,
        ]);

        return ResponseFormatter::success($category, 'Category created successfully');
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'module_id' => 'required|exists:document_system_modules,id',
            'name'      => 'required|string|max:255',
            'index'     => 'required|string|max:50',
        ]);

        $category->update([
            'module_id' => $request->module_id,
            'name'      => $request->name,
            'index'     => $request->index,
        ]);

        return ResponseFormatter::success($category, 'Category updated successfully');
    }

    /**
     * Delete a category.
     */
    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return ResponseFormatter::success(null, 'Category deleted successfully');
    }

    /**
     * Fetch mappings with search and pagination support.
     */
    public function getMappings(Request $request)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');

        $query = Mapping::select('id', 'category_id', 'name', 'index')
            ->with(['category:id,module_id,name', 'category.module:id,name'])
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_mappings.index, ".", 1) AS UNSIGNED) ASC')
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_mappings.index, ".", 2) AS UNSIGNED) ASC')
            ->orderByRaw('CAST(SUBSTRING_INDEX(document_system_mappings.index, ".", 3) AS UNSIGNED) ASC')
            ->orderBy('index', 'asc');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('index', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                        ->orWhereHas('module', function ($mq) use ($search) {
                            $mq->where('name', 'like', "%{$search}%");
                        });
                  });
            });
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $mappings = $query->paginate($limit);
        } else {
            $mappings = $query->get();
        }

        return ResponseFormatter::success($mappings, 'Mappings retrieved successfully');
    }

    /**
     * Store a newly created mapping.
     */
    public function storeMapping(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:document_system_categories,id',
            'name'        => 'required|string|max:255',
            'index'       => 'required|string|max:50',
        ]);

        $mapping = Mapping::create([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'index'       => $request->index,
        ]);

        return ResponseFormatter::success($mapping, 'Mapping created successfully');
    }

    /**
     * Update an existing mapping.
     */
    public function updateMapping(Request $request, $id)
    {
        $mapping = Mapping::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:document_system_categories,id',
            'name'        => 'required|string|max:255',
            'index'       => 'required|string|max:50',
        ]);

        $mapping->update([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'index'       => $request->index,
        ]);

        return ResponseFormatter::success($mapping, 'Mapping updated successfully');
    }

    /**
     * Delete a mapping.
     */
    public function deleteMapping($id)
    {
        $mapping = Mapping::findOrFail($id);
        $mapping->delete();

        return ResponseFormatter::success(null, 'Mapping deleted successfully');
    }

    /**
     * Fetch employees filtered by company.
     */
    public function getEmployees(Request $request)
    {
        $companyId = $request->query('company_id');
        $query = \App\Models\Employee::with('user');
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        $employees = $query->get()->map(function ($emp) {
            return [
                'id' => $emp->user_id,
                'name' => $emp->name ?: ($emp->user->name ?? 'Unknown'),
                'email' => $emp->user->email ?? '',
            ];
        })->filter(fn($e) => !empty($e['email']))->values();

        return ResponseFormatter::success($employees, 'Employees retrieved successfully');
    }

    /**
     * Get dashboard stats and department trends.
     */
    public function getDashboardStats()
    {
        $stats = [
            'active_docs'   => Document::where('status', '5')->count(),
            'ongoing_docs'  => Document::where('status', '2')->count(),
            'draft_docs'    => Document::where('status', '1')->count(),
            'obsolete_docs' => Document::where('status', '6')->count(),
            'jsa_active'    => JsaDocument::where('status', '5')->count(),
            'ptw_active'    => PtwDocument::where('status', '5')->count(),
        ];

        // Fetch only departments that have at least one document in the system
        $activeDepartmentIds = Document::select('department_id')
            ->distinct()
            ->whereNotNull('department_id')
            ->pluck('department_id');

        $departments = Department::select('id', 'name')
            ->with('company:id,document_code')
            ->whereIn('id', $activeDepartmentIds)
            ->get();
            
        $departmentsData = [];

        foreach ($departments as $dept) {
            $docs = Document::where('department_id', $dept->id)->get();
            
            $totalArray = array_fill(0, 12, 0);
            $activeArray = array_fill(0, 12, 0);
            $expiredArray = array_fill(0, 12, 0);

            foreach ($docs as $doc) {
                if ($doc->doc_created) {
                    $month = intval(\Carbon\Carbon::parse($doc->doc_created)->format('m')) - 1;
                    if ($month >= 0 && $month < 12) {
                        $totalArray[$month]++;
                        if ($doc->status == '5') {
                            $activeArray[$month]++;
                        } elseif ($doc->status == '6') {
                            $expiredArray[$month]++;
                        }
                    }
                }
            }

            $departmentsData[] = [
                'name'               => $dept->name,
                'company_code'       => $dept->company->document_code ?? '',
                'total'              => array_values($totalArray),
                'active'             => array_values($activeArray),
                'expired'            => array_values($expiredArray),
            ];
        }

        return ResponseFormatter::success([
            'stats'       => $stats,
            'departments' => $departmentsData
        ], 'Dashboard statistics retrieved successfully');
    }
}
