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
use Modules\DocumentSystem\Services\WatermarkService;

class DocumentApiController extends Controller
{
    /**
     * Get documents list.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $search = $request->query('search');

        $query = Document::with(['company', 'department', 'areaManager.user', 'owner', 'mapping.category.module', 'attachments'])
            ->latest();

        if ($status) {
            if (str_contains($status, ',')) {
                $query->whereIn('status', explode(',', $status));
            } else {
                $query->where('status', $status);
            }
        }

        // Only exclude obsolete documents if status 8 is not explicitly requested
        if ($status !== '8' && !str_contains($status ?? '', '8')) {
            $query->where('is_obsolate', false);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        // Column-wise searches
        if ($request->filled('filter_company')) {
            $comp = $request->query('filter_company');
            $query->whereHas('company', function ($q) use ($comp) {
                $q->where('company_name', 'like', "%{$comp}%")
                  ->orWhere('document_code', 'like', "%{$comp}%");
            });
        }

        if ($request->filled('filter_department')) {
            $dept = $request->query('filter_department');
            $query->whereHas('department', function ($q) use ($dept) {
                $q->where('name', 'like', "%{$dept}%")
                  ->orWhere('code', 'like', "%{$dept}%")
                  ->orWhere('document_code', 'like', "%{$dept}%");
            });
        }

        if ($request->filled('filter_pic')) {
            $pic = $request->query('filter_pic');
            $query->whereHas('owner', function ($q) use ($pic) {
                $q->where('name', 'like', "%{$pic}%");
            });
        }

        if ($request->filled('filter_module')) {
            $mod = $request->query('filter_module');
            $query->whereHas('mapping.category.module', function ($q) use ($mod) {
                $q->where('name', 'like', "%{$mod}%");
            });
        }

        if ($request->filled('filter_category')) {
            $cat = $request->query('filter_category');
            $query->whereHas('mapping.category', function ($q) use ($cat) {
                $q->where('name', 'like', "%{$cat}%");
            });
        }

        if ($request->filled('filter_mapping')) {
            $map = $request->query('filter_mapping');
            $query->whereHas('mapping', function ($q) use ($map) {
                $q->where('name', 'like', "%{$map}%");
            });
        }

        if ($request->filled('filter_document_level')) {
            $query->where('document_level', 'like', '%' . $request->query('filter_document_level') . '%');
        }

        if ($request->filled('filter_document_number')) {
            $query->where('document_number', 'like', '%' . $request->query('filter_document_number') . '%');
        }

        if ($request->filled('filter_title')) {
            $query->where('title', 'like', '%' . $request->query('filter_title') . '%');
        }

        if ($request->has('page') || $request->has('limit') || $request->query('paginate') === 'true') {
            $limit = $request->query('limit', 10);
            $documents = $query->paginate($limit);
        } else {
            $documents = $query->get();
        }

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
                        $resolvedEmail = $email;
                        $userId = null;

                        // Try resolving from AreaManager
                        $mgr = \App\Models\AreaManager::with('user')->find($email);
                        if ($mgr && $mgr->user) {
                            $resolvedEmail = $mgr->user->email;
                            $userId = $mgr->user_id;
                        } else {
                            // Try resolving from User
                            $usr = \App\Models\User::find($email);
                            if ($usr) {
                                $resolvedEmail = $usr->email;
                                $userId = $usr->id;
                            }
                        }

                        DB::table('document_system_invited_people')->insert([
                            'id' => Str::uuid()->toString(),
                            'document_id' => $doc->id,
                            'user_id' => $userId,
                            'email' => $resolvedEmail,
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
                        $resolvedEmail = $email;
                        $userId = null;

                        // Try resolving from AreaManager
                        $mgr = \App\Models\AreaManager::with('user')->find($email);
                        if ($mgr && $mgr->user) {
                            $resolvedEmail = $mgr->user->email;
                            $userId = $mgr->user_id;
                        } else {
                            // Try resolving from User
                            $usr = \App\Models\User::find($email);
                            if ($usr) {
                                $resolvedEmail = $usr->email;
                                $userId = $usr->id;
                            }
                        }

                        DB::table('document_system_invited_people')->insert([
                            'id' => Str::uuid()->toString(),
                            'document_id' => $doc->id,
                            'user_id' => $userId,
                            'email' => $resolvedEmail,
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
            // ── Level 2 (PJA / Final Approval) ───────────────────────────────
            // 1. Apply watermark BEFORE renaming so we use the original blob path
            $uncontrolledPath       = null;
            $uncontrolledBlobUrl    = null;
            $uncontrolledBlobRespon = null;
            try {
                // Query fresh from DB to avoid stale eager-loaded relation
                $latestAttachment = Attachment::where('document_id', $doc->id)
                    ->where('file_type', 'pdf')
                    ->latest()
                    ->first();

                if ($latestAttachment && $latestAttachment->path) {
                    $sas = GetBlobSasUri('aims-cntr', $latestAttachment->path);
                    $sasUrl = is_array($sas)
                        ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                        : $sas;

                    if ($sasUrl) {
                        // Use FINAL-{original_filename} for uncontrolled copy
                        $originalFileName = $latestAttachment->file_name ?? 'document.pdf';
                        // Strip any existing FINAL_ prefix to avoid duplication
                        $cleanFileName = preg_replace('/^FINAL[_-]/', '', $originalFileName);
                        $uncontrolledFileName = 'FINAL-' . $cleanFileName;

                        $watermarkService = app(WatermarkService::class);
                        $watermarkedTmp = $watermarkService->applyWatermark(
                            $sasUrl,
                            $uncontrolledFileName,
                            'review'
                        );

                        // Upload watermarked file to the 'uncontrolled' subfolder
                        $uploadResult = uploadToBlobStorage(
                            $uncontrolledFileName,
                            $watermarkedTmp,
                            'document-systems-files/uncontrolled'
                        );

                        \Log::info('Uncontrolled upload result', [
                            'doc_id'       => $doc->id,
                            'fileName'     => $uncontrolledFileName,
                            'uploadResult' => $uploadResult,
                        ]);

                        // Clean up temp file after upload
                        $watermarkService->cleanup($watermarkedTmp);

                        if ($uploadResult && !empty($uploadResult['fileBlobPathName'])) {
                            $uncontrolledPath       = $uploadResult['fileBlobPathName'];
                            $uncontrolledBlobUrl    = $uploadResult['fileBlobUrl'] ?? null;
                            $uncontrolledBlobRespon = json_encode($uploadResult['blobResponse'] ?? []);
                        } else {
                            \Log::error('Uncontrolled upload returned empty fileBlobPathName', [
                                'doc_id' => $doc->id,
                                'result' => $uploadResult,
                            ]);
                        }
                    }
                }
            } catch (\Exception $e) {
                // Non-fatal: log but continue with approval
                \Log::error('WatermarkService failed on final approval for doc ' . $doc->id . ': ' . $e->getMessage());
            }

            // 2. Rename attachments to FINAL_ in blob storage (after watermark)
            try {
                $docService = new DocumentSystemService();
                $docService->renameToBlobFinal($doc);
            } catch (\Exception $e) {
                \Log::error('Failed to rename blobs to FINAL_ on final approval: ' . $e->getMessage());
            }

            // 3. Update document status to ACTIVE and store uncontrolled path if generated
            $updatePayload = [
                'status'          => '5',
                'approved_by_pja' => $userId,
                'approved_at_pja' => now(),
            ];
            if ($uncontrolledPath) {
                $updatePayload['uncontrolled_file_path']    = $uncontrolledPath;
                $updatePayload['uncontrolled_blob_url']     = $uncontrolledBlobUrl ?? null;
                $updatePayload['uncontrolled_blob_respon']  = $uncontrolledBlobRespon ?? null;
            }
            $doc->update($updatePayload);
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
        $document = Document::with(['company', 'department', 'areaManager.user', 'owner', 'creator', 'mapping.category.module', 'attachments', 'invitedPeople', 'activities.user', 'activities.attachments', 'approvedByCrsUser', 'approvedByPjaUser'])
            ->findOrFail($id);

        // Dynamically resolve legacy UUIDs stored in email column
        foreach ($document->invitedPeople as $person) {
            if (!filter_var($person->email, FILTER_VALIDATE_EMAIL)) {
                $mgr = \App\Models\AreaManager::with('user')->find($person->email);
                if ($mgr && $mgr->user) {
                    $person->email = $mgr->user->email;
                    if (!$person->user_id) {
                        $person->user_id = $mgr->user_id;
                        $person->save();
                    }
                } else {
                    $usr = \App\Models\User::find($person->email);
                    if ($usr) {
                        $person->email = $usr->email;
                        if (!$person->user_id) {
                            $person->user_id = $usr->id;
                            $person->save();
                        }
                    }
                }
            }
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userRoles = $user ? \DB::table('aims_user_roles')
            ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
            ->where('aims_user_roles.user_id', $user->id)
            ->pluck('aims_roles.slug')
            ->toArray() : [];
        $isSuperAdmin = ($user && $user->role === 'super_admin') || in_array('super_admin', $userRoles) || in_array('system_admin', $userRoles);

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

    /**
     * Export safety documents to Excel with chronological revision dates.
     */
    public function export(Request $request)
    {
        $idsStr = $request->query('ids');
        $ids = $idsStr ? explode(',', $idsStr) : [];

        $query = Document::with(['company', 'department', 'owner']);
        if (!empty($ids)) {
            $query->whereIn('id', $ids);
        } else {
            // Default to active/expired documents
            $query->whereIn('status', ['5', '7'])->where('is_obsolate', false);
        }
        $docs = $query->get();

        $documents = [];
        $maxRevisionCol = 0;

        foreach ($docs as $doc) {
            // Find all revision history by tracing related_document_id back to revision 0
            $historyDocs = [];
            $current = $doc;
            while ($current) {
                $historyDocs[] = $current;
                if ($current->related_document_id) {
                    $current = Document::find($current->related_document_id);
                } else {
                    $current = null;
                }
            }

            // Sort by revision ascending to make sure they are in order: Rev 0, Rev 1, Rev 2...
            usort($historyDocs, function($a, $b) {
                return (int)$a->revision <=> (int)$b->revision;
            });

            // The creation date of the earliest revision (Rev 0) is the "Tanggal Pembuatan"
            $firstDocCreated = count($historyDocs) > 0 ? $historyDocs[0]->doc_created : $doc->doc_created;

            // Revision dates are for Rev 1, Rev 2, etc. (excluding Rev 0)
            $revisionDates = [];
            if (count($historyDocs) > 1) {
                for ($i = 1; $i < count($historyDocs); $i++) {
                    $revisionDates[] = $historyDocs[$i]->doc_created ? $historyDocs[$i]->doc_created->format('d/m/Y') : '';
                }
            }

            $maxRevisionCol = max($maxRevisionCol, count($revisionDates));

            $documents[] = [
                'id' => $doc->id,
                'title' => $doc->title,
                'document_number' => $doc->document_number,
                'win' => $doc->sop_add_win,
                'form' => $doc->sop_add_form,
                'pic' => $doc->owner ? $doc->owner->name : '-',
                'revision' => $doc->revision ?? 0,
                'first_doc_created' => $firstDocCreated ? $firstDocCreated->format('d/m/Y') : '-',
                'revision_date' => $revisionDates,
                'parent_document' => $doc->parent_document,
                'document_level' => $doc->document_level,
                'children' => [],
            ];
        }

        // Standard grouping/sorting logic matching aims export
        $doc_ts = collect($documents)->filter(function ($item) {
            return $item['document_level'] == 'TS';
        });
        $doc_mn = collect($documents)->filter(function ($item) {
            return $item['document_level'] == 'MN';
        })->all();
        $sop_doc = collect($documents)->filter(function ($item) {
            return $item['document_level'] == 'SOP';
        })->all();
        $doc_win = collect($documents)->filter(function ($item) {
            return $item['document_level'] == 'WIN';
        })->all();
        $doc_form = collect($documents)->filter(function ($item) {
            return $item['document_level'] == 'FORM';
        })->all();

        $sortedDocs = collect($doc_mn)
            ->merge($sop_doc)
            ->merge($doc_ts)
            ->merge($doc_win)
            ->merge($doc_form);

        $data = [];
        $children = collect($sortedDocs)->filter(function ($item) {
            return $item['parent_document'] != null;
        })->all();
        $parentDocs = collect($sortedDocs)->filter(function ($item) {
            return $item['parent_document'] == null;
        })->all();

        $combine = [];
        if (count($children) > 0) {
            $win_child = collect($children)->filter(function ($item) {
                return $item['win'] != null;
            });
            $form_child = collect($children)->filter(function ($item) {
                return $item['form'] != null;
            });
            $combine_child = collect($win_child)->merge($form_child);
            $combine = collect($parentDocs)->map(function ($item) use ($combine_child) {
                $id = $item['id'];
                $item['children'] = collect($combine_child)->filter(function ($i) use ($id) {
                    return $i['parent_document'] == $id;
                })->all();

                return $item;
            })->values();
        }

        if (count($combine) == 0) {
            $data = $parentDocs;
        } else {
            $data = $combine;
        }
        if (count($data) == 0) {
            $data = $children;
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \Modules\DocumentSystem\Exports\DocumentSystemExport($data, $maxRevisionCol),
            'Dokumen Induk - ' . date('Y-m-d') . '.xlsx'
        );
    }
}
