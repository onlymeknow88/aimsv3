<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\DocumentSystem\Entities\Document;

class DocumentApiController extends Controller
{
    /**
     * Get documents list.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        
        $query = Document::with(['company', 'department', 'owner', 'mapping.category.module', 'attachments'])
            ->latest();

        if ($status) {
            if (str_contains($status, ',')) {
                $query->whereIn('status', explode(',', $status));
            } else {
                $query->where('status', $status);
            }
        }

        $documents = $query->get();

        return ResponseFormatter::success($documents, 'Documents retrieved successfully');
    }

    /**
     * Store a newly created safety document.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'document_level' => 'required|string',
            'company_id' => 'required',
            'department_id' => 'required',
        ]);

        $companyId = $request->input('company_id');
        $departmentId = $request->input('department_id');
        $level = $request->input('document_level');

        $comp = Company::find($companyId);
        $companyCode = $comp ? ($comp->document_code ?: 'MAC') : 'MAC';

        $dept = Department::find($departmentId);
        $deptCode = $dept ? ($dept->document_code ?: $dept->code ?: 'MIS') : 'MIS';

        // Format prefix code
        if ($level === 'WIN') {
            $prefix = "WIN-{$companyCode}-{$deptCode}-";
            $sopNum = $request->input('sop_number', '');
            if ($sopNum) {
                $prefix = "WIN-{$companyCode}-{$deptCode}-{$sopNum}-";
            }
            $runningNumber = $request->input('sop_add_win', '001');
            $docNumber = "{$prefix}{$runningNumber}";
        } else {
            $prefix = "{$companyCode}-{$deptCode}-";
            $runningNumber = $request->input('sop_number', '001');
            $docNumber = "{$prefix}{$runningNumber}";
        }

        DB::beginTransaction();
        try {
            $doc = Document::create([
                'title' => $request->title,
                'document_level' => $level,
                'description' => $request->description,
                'prefix_code' => $prefix,
                'document_number' => $docNumber,
                'sop_number' => $request->input('sop_number'),
                'sop_add_win' => $request->input('sop_add_win'),
                'parent_document' => $request->input('parent_document'),
                'company_id' => $companyId,
                'department_id' => $departmentId,
                'area_manager_id' => $request->input('area_manager_id'),
                'module_id' => $request->input('module_id'),
                'category_id' => $request->input('category_id'),
                'mapping_id' => $request->input('mapping_id'),
                'upload_type' => $request->input('upload_type'),
                'status' => $request->input('status', '2'), // 2 = Draft, 1 = Waiting Review
                'revision' => '0',
                'doc_created' => $request->input('doc_created', now()),
            ]);

            // Save invited emails
            if ($request->has('invited_emails')) {
                $invitedEmails = $request->input('invited_emails', []);
                foreach ($invitedEmails as $email) {
                    if (!empty($email)) {
                        DB::table('document_system_invited_people')->insert([
                            'id' => Str::uuid()->toString(),
                            'document_id' => $doc->id,
                            'email' => $email,
                            'status' => 0, // Pending
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            // Save uploaded files attachment
            if ($request->hasFile('files')) {
                // Handle file attachments upload here...
            }

            DB::commit();
            return ResponseFormatter::success($doc, 'Document created successfully');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error($e->getMessage(), 'Failed to create document', 500);
        }
    }

    /**
     * Fetch active SOPs.
     */
    public function getActiveSops(Request $request)
    {
        $query = Document::query()->where('document_level', 'SOP')->where('status', '5'); // Approved/Active status
        if ($request->has('company_id') && $request->has('department_id')) {
            $dept = Department::find($request->department_id);
            if ($dept) {
                $query->where('department_id', $dept->id);
            }
        }
        $list = $query->select('id', 'prefix_code', 'sop_number', 'title')->get()->map(function ($doc) {
            return [
                'id' => $doc->id,
                'full_code' => "{$doc->prefix_code}{$doc->sop_number}",
                'title' => $doc->title
            ];
        });
        return ResponseFormatter::success($list, 'Active SOPs retrieved successfully');
    }

    /**
     * Generate next running document code.
     */
    public function generateNumber(Request $request)
    {
        $companyId = $request->query('company_id');
        $departmentId = $request->query('department_id');
        $level = $request->query('level', 'SOP');

        $companyCode = 'MAC';
        if ($companyId) {
            $comp = Company::find($companyId);
            if ($comp) {
                $companyCode = $comp->document_code ?: substr(strtoupper($comp->company_name), 0, 3);
            }
        }

        $deptCode = 'MIS';
        if ($departmentId) {
            $dept = Department::find($departmentId);
            if ($dept) {
                $deptCode = $dept->document_code ?: $dept->code ?: substr(strtoupper($dept->name), 0, 3);
            }
        }

        // Base prefix format: e.g. "MAC-MIS-"
        $prefix = "{$companyCode}-{$deptCode}-";

        if ($level === 'WIN') {
            $prefixCodeToSearch = "WIN-{$prefix}";
        } else {
            $prefixCodeToSearch = $prefix;
        }

        // Query check to find existing documents with this prefix under the level
        $count = DB::table('document_system_documents')
            ->where('prefix_code', 'like', "{$prefixCodeToSearch}%")
            ->count();

        $nextCode = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        return ResponseFormatter::success([
            'prefix' => $prefixCodeToSearch,
            'next_code' => $nextCode,
            'full_number' => "{$prefixCodeToSearch}{$nextCode}",
        ], 'Next sequence number generated successfully');
    }
}
