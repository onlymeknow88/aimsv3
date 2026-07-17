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
use Modules\DocumentSystem\Entities\Attachment;
use Modules\DocumentSystem\Services\DocumentSystemService;

class DocumentApiController extends Controller
{
    /**
     * Get documents list.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');

        $query = Document::with(['company', 'department', 'areaManager.user', 'owner', 'mapping.category.module', 'attachments'])
            ->where('is_obsolate', false)
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

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        \Log::info('Auth check in DocumentApiController@store:', [
            'request_user' => $request->user() ? $request->user()->id : null,
            'auth_user' => auth()->user() ? auth()->user()->id : null,
            'auth_admin' => auth('admin')->user() ? auth('admin')->user()->id : null,
            'auth_web' => auth('web')->user() ? auth('web')->user()->id : null,
            'userId_resolved' => $userId,
        ]);

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
                'user_id' => $userId,
                'created_by' => $userId,
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
                    if (! empty($email)) {
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
                $service = app(DocumentSystemService::class);
                foreach ($request->file('files') as $file) {
                    $uploadResult = $service->uploadAttachment($file);
                    if ($uploadResult) {
                        Attachment::create([
                            'document_id' => $doc->id,
                            'file_name' => $file->getClientOriginalName(),
                            'file_type' => strtolower($file->getClientOriginalExtension()),
                            'file_size' => $file->getSize(),
                            'path' => $uploadResult['fileBlobPathName'],
                            'blob_url' => $uploadResult['fileBlobUrl'],
                            'blob_respon' => json_encode($uploadResult['blobResponse']),
                            'status' => 1,
                        ]);
                    }
                }
            }

            DB::commit();

            return ResponseFormatter::success($doc, 'Document created successfully');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ResponseFormatter::error($e->getMessage(), 'Failed to create document', 500);
        }
    }

    /**
     * Update an existing safety document.
     */
    public function update(Request $request, $id)
    {
        $doc = Document::findOrFail($id);

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

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        DB::beginTransaction();
        try {
            $doc->update([
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
                'user_id' => $doc->user_id ?? $userId,
                'created_by' => $doc->created_by ?? $userId,
                'module_id' => $request->input('module_id'),
                'category_id' => $request->input('category_id'),
                'mapping_id' => $request->input('mapping_id'),
                'upload_type' => $request->input('upload_type'),
                'status' => $request->input('status', $doc->status),
                'doc_created' => $request->input('doc_created', $doc->doc_created),
            ]);

            // Save invited reviewers
            if ($request->has('invited_emails')) {
                DB::table('document_system_invited_people')->where('document_id', $doc->id)->delete();
                $invitedEmails = $request->input('invited_emails', []);
                foreach ($invitedEmails as $email) {
                    if (! empty($email)) {
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
                $service = app(DocumentSystemService::class);
                foreach ($request->file('files') as $file) {
                    $uploadResult = $service->uploadAttachment($file);
                    if ($uploadResult) {
                        Attachment::create([
                            'document_id' => $doc->id,
                            'file_name' => $file->getClientOriginalName(),
                            'file_type' => strtolower($file->getClientOriginalExtension()),
                            'file_size' => $file->getSize(),
                            'path' => $uploadResult['fileBlobPathName'],
                            'blob_url' => $uploadResult['fileBlobUrl'],
                            'blob_respon' => json_encode($uploadResult['blobResponse']),
                            'status' => 1,
                        ]);
                    }
                }
            }

            DB::commit();

            return ResponseFormatter::success($doc, 'Document updated successfully');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ResponseFormatter::error($e->getMessage(), 'Failed to update document', 500);
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
        $list = $query->select('id', 'prefix_code', 'sop_number', 'document_number', 'title')->get()->map(function ($doc) {
            return [
                'id'              => $doc->id,
                'full_code'       => "{$doc->prefix_code}{$doc->sop_number}",
                'document_number' => $doc->document_number,
                'sop_number'      => $doc->sop_number,
                'title'           => $doc->title,
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

    /**
     * Approve a document via API
     */
    public function approve(Request $request, string $id)
    {
        $request->validate([
            'level' => 'required|in:1,2',
            'notes' => 'nullable|string',
        ]);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc = Document::findOrFail($id);

        if ($request->level == 1) {
            $doc->update(['status' => '3', 'approved_by_crs' => $userId, 'approved_at_crs' => now()]);
        } else {
            $doc->update(['status' => '5', 'approved_by_pja' => $userId, 'approved_at_pja' => now()]); // Active

            // On final approval: rename all attachments with FINAL_ prefix on blob storage
            try {
                $service = new \Modules\DocumentSystem\Services\DocumentSystemService();
                $service->renameToBlobFinal($doc);
            } catch (\Exception $e) {
                \Log::error('Failed to rename blobs to FINAL_ on final approval: ' . $e->getMessage());
            }
        }

        // Log activity
        DB::table('document_system_activities')->insert([
            'id' => Str::uuid(),
            'document_id' => $doc->id,
            'user_id' => $userId,
            'activity' => "Dokumen disetujui (Level {$request->level}): {$request->notes}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return ResponseFormatter::success($doc, 'Dokumen berhasil disetujui.');
    }

    /**
     * Reject a document via API
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'reason' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'file',
        ]);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc = Document::findOrFail($id);

        // Kembalikan ke status ON_REVISION (4) atau ke DRAFT (2) tergantung kondisi
        // Jika sedang di tahap review (1), kembalikan ke DRAFT (2)
        // Jika sudah di tahap approval lanjut (3 atau 6), kembalikan ke ON_REVISION (4)
        $currentStatus = (int) $doc->status;
        $newStatus = in_array($currentStatus, [3, 6]) ? '4' : '2';

        DB::beginTransaction();
        try {
            $doc->update(['status' => $newStatus]);

            $activityId = Str::uuid()->toString();

            DB::table('document_system_activities')->insert([
                'id' => $activityId,
                'document_id' => $doc->id,
                'user_id' => $userId,
                'activity' => "Dokumen direturn: {$request->reason}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Handle uploaded evidence files
            if ($request->hasFile('files')) {
                $service = app(DocumentSystemService::class);
                foreach ($request->file('files') as $file) {
                    // Upload to blob storage in the 'revisions' or 'activities' subfolder
                    $uploadResult = $service->uploadAttachment($file, 'activities');
                    if ($uploadResult) {
                        DB::table('document_system_activities_attachments')->insert([
                            'id' => Str::uuid()->toString(),
                            'activity_id' => $activityId,
                            'name' => $file->getClientOriginalName(),
                            'file_type' => strtolower($file->getClientOriginalExtension()),
                            'file_size' => $file->getSize(),
                            'path' => $uploadResult['fileBlobPathName'],
                            'blob_url' => $uploadResult['fileBlobUrl'],
                            'blob_response' => json_encode($uploadResult['blobResponse']),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            DB::commit();

            return ResponseFormatter::success($doc, 'Dokumen berhasil dikembalikan ke draft.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error($e->getMessage(), 'Gagal memproses penolakan.', 500);
        }
    }

    /**
     * Show document details and approval privileges via API.
     */
    public function show(string $id)
    {
        $document = Document::with(['company', 'department', 'areaManager.user', 'owner', 'creator', 'mapping.category.module', 'attachments', 'invitedPeople', 'activities.user', 'activities.attachments'])
            ->findOrFail($id);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userRoles = $user ? \DB::table('aims_user_roles')
            ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
            ->where('aims_user_roles.user_id', $user->id)
            ->pluck('aims_roles.slug')
            ->toArray() : [];
        $isSuperAdmin = ($user && $user->role === 'super_admin') || in_array('super_admin', $userRoles);

        $canApproveL1 = $isSuperAdmin || in_array('approval_crs', $userRoles);
        $canApproveL2 = $isSuperAdmin || in_array('approval_pja', $userRoles);

        return ResponseFormatter::success([
            'document' => $document,
            'canApproveL1' => $canApproveL1,
            'canApproveL2' => $canApproveL2,
        ], 'Document retrieved successfully');
    }

    /**
     * Delete attachment via API.
     */
    public function deleteAttachment(string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $attachment->delete();

        return ResponseFormatter::success(null, 'Lampiran berhasil dihapus.');
    }

    /**
     * Delete (soft-delete or hard-delete) one or more documents.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'string',
        ]);

        $deleted = 0;
        foreach ($request->ids as $id) {
            $doc = Document::find($id);
            if ($doc) {
                // Also delete related attachments records
                \Modules\DocumentSystem\Entities\Attachment::where('document_id', $doc->id)->delete();
                $doc->delete();
                $deleted++;
            }
        }

        return ResponseFormatter::success(['deleted' => $deleted], "{$deleted} dokumen berhasil dihapus.");
    }
}
