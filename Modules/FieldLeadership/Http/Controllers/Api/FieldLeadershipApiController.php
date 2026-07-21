<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class FieldLeadershipApiController extends Controller
{
    // ── Status constants ──────────────────────────────────────────────────────
    const STATUS_OPEN              = 'Open';
    const STATUS_ON_REVIEW_PICA   = 'On Review PICA';
    const STATUS_ON_REVIEW_PJA    = 'On Review PJA';
    const STATUS_ON_REVIEW_APPROVAL = 'On Review Approval';
    const STATUS_OVERDUE          = 'Overdue';
    const STATUS_CLOSED           = 'Closed';

    const TYPES = [
        'Planned Task Observation',
        'Take Time Talk',
        'Hazard Report',
    ];

    // ── LIST observations ─────────────────────────────────────────────────────
    /**
     * GET /api/field-leadership/observations
     */
    public function index(Request $request)
    {
        $search     = $request->query('search', '');
        $page       = max(1, (int) $request->query('page', 1));
        $limit      = min(100, max(1, (int) $request->query('limit', 10)));
        $type       = $request->query('type', '');
        $status     = $request->query('status', '');
        $companyId  = $request->query('company_id', '');
        $dateFrom   = $request->query('date_from', '');
        $dateTo     = $request->query('date_to', '');

        $query = DB::table('field_leaderships as fl')
            ->leftJoin('companies as c',     'fl.company_id',   '=', 'c.id')
            ->leftJoin('departments as d',   'fl.department_id','=', 'd.id')
            ->leftJoin('employees as e',     'fl.created_by',   '=', 'e.id')
            ->select([
                'fl.id', 'fl.date', 'fl.type', 'fl.status', 'fl.job',
                'fl.detail_company', 'fl.detail_location', 'fl.visit_time',
                'fl.is_area_suitable', 'fl.created_at', 'fl.updated_at',
                'c.id as company_id',
                DB::raw('COALESCE(c.company_name, fl.detail_company) as company_name'),
                DB::raw('COALESCE(d.name, \'—\') as department_name'),
                DB::raw('COALESCE(e.name, \'—\') as created_by_name'),
            ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('fl.job', 'like', "%{$search}%")
                  ->orWhere('fl.detail_company', 'like', "%{$search}%")
                  ->orWhere('fl.detail_location', 'like', "%{$search}%")
                  ->orWhere('e.name', 'like', "%{$search}%");
            });
        }

        if ($type)      $query->where('fl.type', $type);
        if ($status)    $query->where('fl.status', $status);
        if ($companyId) $query->where('fl.company_id', $companyId);
        if ($dateFrom)  $query->where('fl.date', '>=', $dateFrom);
        if ($dateTo)    $query->where('fl.date', '<=', $dateTo);

        $query->orderBy('fl.date', 'desc')->orderBy('fl.created_at', 'desc');

        $total    = $query->count();
        $lastPage = max(1, (int) ceil($total / $limit));
        $offset   = ($page - 1) * $limit;

        $items = $query->offset($offset)->limit($limit)->get();

        return ResponseFormatter::success([
            'data'         => $items,
            'current_page' => $page,
            'last_page'    => $lastPage,
            'total'        => $total,
            'per_page'     => $limit,
        ], 'Observations retrieved successfully');
    }

    // ── SHOW single observation ───────────────────────────────────────────────
    /**
     * GET /api/field-leadership/observations/{id}
     */
    public function show(string $id)
    {
        $fl = DB::table('field_leaderships as fl')
            ->leftJoin('companies as c',       'fl.company_id',      '=', 'c.id')
            ->leftJoin('departments as d',     'fl.department_id',   '=', 'd.id')
            ->leftJoin('sections as s',        'fl.section_id',      '=', 's.id')
            ->leftJoin('area_locations as al', 'fl.area_location_id','=', 'al.id')
            ->leftJoin('employees as e',       'fl.created_by',      '=', 'e.id')
            ->leftJoin('users as pjo',         'fl.pjo_id',          '=', 'pjo.id')
            ->where('fl.id', $id)
            ->select([
                'fl.*',
                DB::raw('COALESCE(c.company_name, fl.detail_company) as company_name'),
                DB::raw('COALESCE(d.name, \'—\') as department_name'),
                DB::raw('COALESCE(s.name, \'—\') as section_name'),
                DB::raw('COALESCE(al.name, \'—\') as area_location_name'),
                DB::raw('COALESCE(e.name, \'—\') as created_by_name'),
                DB::raw('COALESCE(pjo.name, \'—\') as pjo_name'),
            ])
            ->first();

        if (!$fl) {
            return ResponseFormatter::error(null, 'Observation not found', 404);
        }

        // Load child data
        $members   = DB::table('field_leadership_members as m')
            ->leftJoin('employees as e', 'm.employee_id', '=', 'e.id')
            ->where('m.fl_id', $id)
            ->select(['m.*', DB::raw('COALESCE(e.name, \'—\') as employee_name')])
            ->get();

        $positives = DB::table('field_leadership_positives')
            ->where('fl_id', $id)->get();

        $questionPtos = DB::table('field_leadership_question_ptos')
            ->where('fl_id', $id)->get();

        $risks = DB::table('field_leadership_risks as r')
            ->leftJoin('field_leadership_categories as cat', 'r.category_id', '=', 'cat.id')
            ->leftJoin('field_leadership_kta_and_ttas as kta', 'r.type_id', '=', 'kta.id')
            ->leftJoin('field_leadership_potency_and_consequnces as pot', 'r.potency_id', '=', 'pot.id')
            ->where('r.fl_id', $id)
            ->select([
                'r.*',
                DB::raw('COALESCE(cat.name, \'—\') as category_name'),
                DB::raw('COALESCE(kta.name, \'—\') as kta_name'),
                DB::raw('COALESCE(pot.name, \'—\') as potency_name'),
            ])
            ->get();

        $activities = DB::table('field_leadership_activities')
            ->where('fl_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return ResponseFormatter::success([
            'observation'  => $fl,
            'members'      => $members,
            'positives'    => $positives,
            'question_ptos'=> $questionPtos,
            'risks'        => $risks,
            'activities'   => $activities,
        ], 'Observation retrieved successfully');
    }

    // ── STORE new observation ────────────────────────────────────────────────
    /**
     * POST /api/field-leadership/observations
     */
    public function store(Request $request)
    {
        $request->validate([
            'date'                    => 'required|date',
            'ccow_id'                 => 'nullable|uuid',
            'company_id'              => 'nullable|uuid',
            'detail_company'          => 'required|string|max:255',
            'department_id'           => 'nullable|uuid',
            'section_id'              => 'nullable|uuid',
            'area_location_id'        => 'nullable|uuid',
            'detail_location'         => 'nullable|string',
            'pja_id'                  => 'required|uuid',
            'pjo_id'                  => 'nullable|uuid',
            'type'                    => 'required|in:Planned Task Observation,Take Time Talk,Hazard Report',
            'job'                     => 'nullable|string',
            'visit_time'              => 'nullable|integer',
            'is_area_suitable'        => 'boolean',
            'personil_on_review'      => 'nullable|integer',
            'personil_on_review_name' => 'nullable|string|max:255',
            'publish'                 => 'nullable|in:Draft,Publish',
            // Members
            'members'                 => 'nullable|array',
            'members.*.type'          => 'required_with:members|string',
            'members.*.employee_id'   => 'required_with:members|uuid',
            // Positive conditions
            'positives'               => 'nullable|array',
            'positives.*.description' => 'required_with:positives|string',
            // Questions (PTO only)
            'questions'               => 'nullable|array',
            'questions.*.question'    => 'required_with:questions|string',
            'questions.*.answer'      => 'nullable|string',
            'questions.*.description' => 'nullable|string',
            // Risk conditions
            'risks'                   => 'nullable|array',
            'risks.*.description'     => 'required_with:risks|string',
            'risks.*.category_id'     => 'nullable|uuid',
            'risks.*.type_id'         => 'nullable|uuid',
            'risks.*.potency_id'      => 'nullable|uuid',
            'risks.*.due_date'        => 'required_with:risks|date',
            'risks.*.repaired'        => 'nullable|boolean',
            'risks.*.repair_action'   => 'nullable|string',
            'risks.*.type_action'     => 'nullable|string',
            'risks.*.supervisor'      => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $id     = (string) Str::uuid();
            $status = self::STATUS_OPEN;

            DB::table('field_leaderships')->insert([
                'id'                      => $id,
                'date'                    => $request->date,
                'ccow_id'                 => $request->ccow_id,
                'company_id'              => $request->company_id,
                'detail_company'          => $request->detail_company,
                'department_id'           => $request->department_id,
                'section_id'              => $request->section_id,
                'area_location_id'        => $request->area_location_id,
                'detail_location'         => $request->detail_location,
                'personil_on_review'      => $request->personil_on_review,
                'personil_on_review_name' => $request->personil_on_review_name,
                'pja_id'                  => $request->pja_id,
                'pjo_id'                  => $request->pjo_id,
                'type'                    => $request->type,
                'job'                     => $request->job,
                'visit_time'              => $request->visit_time,
                'is_area_suitable'        => $request->boolean('is_area_suitable', false),
                'status'                  => $status,
                'published'               => $request->input('publish', 'Draft'),
                'created_by'              => auth()->user()?->employee_id ?? (string) auth()->id(),
                'created_at'              => now(),
                'updated_at'              => now(),
            ]);

            // Questions (PTO only)
            if ($request->type === 'Planned Task Observation' && $request->filled('questions')) {
                foreach ($request->questions as $q) {
                    DB::table('field_leadership_question_ptos')->insert([
                        'id'          => (string) Str::uuid(),
                        'fl_id'       => $id,
                        'question'    => $q['question'],
                        'answer'      => $q['answer'] ?? '-',
                        'description' => $q['description'] ?? null,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // Members
            if ($request->filled('members')) {
                foreach ($request->members as $m) {
                    if (!empty($m['employee_id']) && !empty($m['type'])) {
                        DB::table('field_leadership_members')->insert([
                            'id'          => (string) Str::uuid(),
                            'fl_id'       => $id,
                            'type'        => $m['type'],
                            'employee_id' => $m['employee_id'],
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }
            }

            // Positive conditions (not for Hazard Report)
            if ($request->type !== 'Hazard Report' && $request->filled('positives')) {
                foreach ($request->positives as $p) {
                    if (!empty($p['description'])) {
                        DB::table('field_leadership_positives')->insert([
                            'id'          => (string) Str::uuid(),
                            'fl_id'       => $id,
                            'description' => $p['description'],
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }
            }

            // Risk conditions
            if ($request->filled('risks')) {
                foreach ($request->risks as $r) {
                    if (empty($r['description'])) continue;
                    DB::table('field_leadership_risks')->insert([
                        'id'           => (string) Str::uuid(),
                        'fl_id'        => $id,
                        'risk_condition'=> $r['description'],
                        'category_id'  => $r['category_id'] ?? null,
                        'type_id'      => $r['type_id'] ?? null,
                        'potency_id'   => $r['potency_id'] ?? null,
                        'repair_action'=> !empty($r['repaired']) ? ($r['repair_action'] ?? null) : null,
                        'due_date'     => $r['due_date'],
                        'type_action'  => !empty($r['repaired']) ? ($r['type_action'] ?? null) : null,
                        'supervisor'   => !empty($r['repaired']) ? ($r['supervisor'] ?? null) : null,
                        'status'       => $status,
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);
                }
            }

            // Activity log
            DB::table('field_leadership_activities')->insert([
                'id'          => (string) Str::uuid(),
                'fl_id'       => $id,
                'description' => 'Observasi dibuat',
                'user_id'     => (string) auth()->id(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            DB::commit();
            return ResponseFormatter::success(['id' => $id], 'Observation created successfully', 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error(null, 'Gagal menyimpan: ' . $e->getMessage(), 500);
        }
    }

    // ── UPDATE observation ───────────────────────────────────────────────────
    /**
     * PUT /api/field-leadership/observations/{id}
     */
    public function update(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) {
            return ResponseFormatter::error(null, 'Observation not found', 404);
        }

        $validated = $request->validate([
            'date'           => 'sometimes|date',
            'company_id'     => 'nullable|uuid',
            'detail_company' => 'sometimes|string|max:255',
            'department_id'  => 'nullable|uuid',
            'section_id'     => 'nullable|uuid',
            'area_location_id'=> 'nullable|uuid',
            'detail_location'=> 'nullable|string',
            'pja_id'         => 'sometimes|uuid',
            'pjo_id'         => 'sometimes|uuid',
            'type'           => 'sometimes|in:Planned Task Observation,Take Time Talk,Hazard Report',
            'job'            => 'nullable|string|max:255',
            'visit_time'     => 'nullable|integer',
            'is_area_suitable'=> 'boolean',
            'status'         => 'sometimes|in:Open,On Review PICA,On Review PJA,On Review Approval,Overdue,Closed',
        ]);

        DB::table('field_leaderships')->where('id', $id)->update(array_merge(
            $validated,
            ['updated_at' => now()]
        ));

        return ResponseFormatter::success(['id' => $id], 'Observation updated successfully');
    }

    // ── DELETE observations ──────────────────────────────────────────────────
    /**
     * DELETE /api/field-leadership/observations
     * Body: { ids: [uuid, ...] }
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return ResponseFormatter::error(null, 'No IDs provided', 422);
        }

        DB::table('field_leaderships')->whereIn('id', $ids)->delete();

        return ResponseFormatter::success(null, 'Observations deleted successfully');
    }

    // ── Master data for forms ────────────────────────────────────────────────
    /**
     * GET /api/field-leadership/master-data
     * Supports cascading filters: ?ccow_id=&department_id=&section_id=
     */
    public function masterData(Request $request)
    {
        $ccowId       = $request->query('ccow_id');
        $departmentId = $request->query('department_id');
        $sectionId    = $request->query('section_id');

        // CCOW = internal companies only
        $ccows = DB::table('companies')
            ->select('id', 'company_name as name', 'type')
            ->where('type', 'Internal')
            ->orderBy('company_name')
            ->get();

        // All companies
        $companies = DB::table('companies')
            ->select('id', 'company_name as name', 'type', 'document_code')
            ->orderBy('company_name')
            ->get();

        // Departments — filter by ccow if provided
        $deptQuery = DB::table('departments')->select('id', 'name', 'company_id');
        if ($ccowId) $deptQuery->where('company_id', $ccowId);
        $departments = $deptQuery->orderBy('name')->get();

        // Sections — filter by department if provided
        $sectionQuery = DB::table('sections')->select('id', 'name', 'department_id');
        if ($departmentId) $sectionQuery->where('department_id', $departmentId);
        $sections = $sectionQuery->orderBy('name')->get();

        // Area locations — filter by section if provided
        $areaQuery = DB::table('area_locations')->select('id', 'name', 'section_id');
        if ($sectionId) $areaQuery->where('section_id', $sectionId);
        $areaLocations = $areaQuery->orderBy('name')->get();

        // Area managers — filter by section if provided
        $pjaQuery = DB::table('area_managers as am')
            ->leftJoin('users as u', 'am.user_id', '=', 'u.id')
            ->select('am.id', DB::raw('COALESCE(u.name, \'—\') as name'), 'am.section_id');
        if ($sectionId) $pjaQuery->where('am.section_id', $sectionId);
        $areaManagers = $pjaQuery->orderBy('u.name')->get();

        // Users for PJO/KTT
        $users = DB::table('users')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Employees — internal
        $employeesInternal = DB::table('employees as e')
            ->leftJoin('users as u', 'e.user_id', '=', 'u.id')
            ->leftJoin('departments as d', 'u.department_id', '=', 'd.id')
            ->leftJoin('companies as c', 'd.company_id', '=', 'c.id')
            ->where('c.type', 'Internal')
            ->select('e.id', 'e.name')
            ->orderBy('e.name')
            ->get();

        // Employees — external (contractor / subcontractor)
        $employeesExternal = DB::table('employees as e')
            ->leftJoin('users as u', 'e.user_id', '=', 'u.id')
            ->leftJoin('departments as d', 'u.department_id', '=', 'd.id')
            ->leftJoin('companies as c', 'd.company_id', '=', 'c.id')
            ->whereIn('c.type', ['Contractor', 'SubContractor', 'Sub Contractor'])
            ->select('e.id', 'e.name')
            ->orderBy('e.name')
            ->get();

        // KTA & TTA
        $ktaTta = DB::table('field_leadership_kta_and_ttas')
            ->select('id', 'code', 'name', 'type')
            ->orderBy('type')->orderBy('code')
            ->get();

        // Categories
        $categories = DB::table('field_leadership_categories')
            ->whereIn('name', ['Kondisi Tidak Aman', 'Tindakan Tidak Aman'])
            ->select('id', 'name')
            ->get();

        // Potency
        $potencies = DB::table('field_leadership_potency_and_consequnces')
            ->select('id', 'code', 'name')
            ->orderBy('code')
            ->get();

        // Parameters
        $params = DB::table('field_leadership_parameters')->first();

        // PTO questions
        $questions = [
            ['key' => 'q1', 'text' => 'Apakah risiko yang ada di area Anda yang dapat membahayakan nyawa Anda?',            'has_answer' => true],
            ['key' => 'q2', 'text' => 'Apakah tersedia pengendalian penting tersedia untuk melindungi Anda?',               'has_answer' => true],
            ['key' => 'q3', 'text' => 'Bagaimana Anda mengetahui pengendalian penting tersebut efektif?',                   'has_answer' => false],
            ['key' => 'q4', 'text' => 'Apakah semua langkah kerja di dalam SOP/INK/JSA telah berkesesuaian dengan pekerjaan yang dilakukan?', 'has_answer' => true],
            ['key' => 'q5', 'text' => 'Pekerja memahami SOP/INK/JSA tersebut?',                                            'has_answer' => true],
            ['key' => 'q6', 'text' => 'Apakah ada opportunity untuk proses SOP/INK/JSA yang lebih efisien, produktif dan aman?', 'has_answer' => true],
        ];

        return ResponseFormatter::success([
            'ccows'              => $ccows,
            'companies'          => $companies,
            'departments'        => $departments,
            'sections'           => $sections,
            'area_locations'     => $areaLocations,
            'area_managers'      => $areaManagers,
            'users'              => $users,
            'employees_internal' => $employeesInternal,
            'employees_external' => $employeesExternal,
            'categories'         => $categories,
            'kta_tta'            => $ktaTta,
            'potencies'          => $potencies,
            'params'             => $params,
            'questions'          => $questions,
            'types'              => self::TYPES,
        ], 'Master data retrieved successfully');
    }
}
