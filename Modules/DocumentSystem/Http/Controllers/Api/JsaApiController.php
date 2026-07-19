<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\JsaDocumentActivity;
use Modules\DocumentSystem\Entities\JsaDocumentPeople;
use Modules\DocumentSystem\Entities\JsaDocumentAttachment;
use Modules\DocumentSystem\Services\DocumentSystemService;

class JsaApiController extends Controller
{
    /**
     * List all JSA documents
     */
    public function index(Request $request)
    {
        $query = JsaDocument::with(['activities', 'people', 'attachments', 'company', 'department', 'user', 'creator'])
            ->where('is_obsolate', false);

        if ($request->boolean('is_obsolete', false)) {
            // Obsolete archive
            $query = JsaDocument::with(['activities', 'people', 'attachments', 'company', 'department', 'user', 'creator'])
                ->where('is_obsolate', true);
        } elseif ($request->boolean('is_draft', false)) {
            // Draft only
            $query->where('status', JsaDocument::DRAFT);
        } elseif ($request->has('status')) {
            // Specific status filter (e.g. status=2 for Pending Review)
            $query->where('status', $request->status);
        } else {
            // Default: Active JSA — all non-draft, non-obsolete
            $query->where('status', '!=', JsaDocument::DRAFT);
        }

        $documents = $query->latest()->get();

        return ResponseFormatter::success($documents, 'JSA documents retrieved successfully');
    }

    /**
     * Store new JSA document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'work_type'   => 'required|string',
            'location'    => 'required|string',
            'company_id'  => 'required',
        ]);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $documentNumber = $request->document_number;
        if (empty($documentNumber)) {
            $companyCode = 'MAC';
            if ($request->company_id) {
                $comp = \App\Models\Company::find($request->company_id);
                if ($comp) {
                    $companyCode = $comp->document_code ?: substr(strtoupper($comp->company_name), 0, 3);
                }
            }

            $deptCode = 'MIS';
            if ($request->department_id) {
                $dept = \App\Models\Department::find($request->department_id);
                if ($dept) {
                    $deptCode = $dept->document_code ?: $dept->code ?: substr(strtoupper($dept->name), 0, 3);
                }
            }

            $prefix = "JSA-{$companyCode}-{$deptCode}-";
            $count = JsaDocument::where('document_number', 'like', "{$prefix}%")->count();
            $nextNum = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            $documentNumber = "{$prefix}{$nextNum}";
        }

        $doc = JsaDocument::create([
            'title'           => $request->title,
            'description'     => $request->description,
            'doc_created'     => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : now(),
            'company_id'      => $request->company_id,
            'department_id'   => $request->department_id,
            'status'          => $request->status ?? '1', // 1 = Draft
            'detail_location' => $request->location,
            'document_number' => $documentNumber,
            'revision'        => $request->revision ?? '0',
            'user_id'         => $userId,
            'created_by'      => $userId,
            'area_manager_id' => $request->area_manager_id,
        ]);

        if ($request->has('invited_emails')) {
            $invitedEmails = $request->input('invited_emails', []);
            foreach ($invitedEmails as $email) {
                if ($email) {
                    $userObj = \App\Models\User::where('email', $email)->first();
                    JsaDocumentPeople::create([
                        'document_id' => $doc->id,
                        'email' => $email,
                        'user_id' => $userObj ? $userObj->id : null,
                        'type' => 1,
                        'is_notify_email' => true,
                    ]);
                }
            }
        }

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'jsa');
                if ($uploadResult) {
                    JsaDocumentAttachment::create([
                        'jsa_document_id' => $doc->id,
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'blob_url'        => $uploadResult['fileBlobUrl'],
                        'blob_respon'     => json_encode($uploadResult['blobResponse']),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'JSA berhasil dibuat.');
    }

    /**
     * Update JSA document
     */
    public function update(Request $request, string $id)
    {
        $doc = JsaDocument::findOrFail($id);

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc->update([
            'title'           => $request->title ?? $doc->title,
            'description'     => $request->description ?? $doc->description,
            'doc_created'     => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : $doc->doc_created,
            'company_id'      => $request->company_id ?? $doc->company_id,
            'department_id'   => $request->department_id ?? $doc->department_id,
            'status'          => $request->status ?? $doc->status,
            'detail_location' => $request->location ?? $doc->detail_location,
            'revision'        => $request->revision ?? $doc->revision,
            'user_id'         => $doc->user_id ?? $userId,
            'created_by'      => $doc->created_by ?? $userId,
            'area_manager_id' => $request->area_manager_id ?? $doc->area_manager_id,
        ]);

        if ($request->has('invited_emails')) {
            JsaDocumentPeople::where('document_id', $doc->id)->delete();
            $invitedEmails = $request->input('invited_emails', []);
            foreach ($invitedEmails as $email) {
                if ($email) {
                    $userObj = \App\Models\User::where('email', $email)->first();
                    JsaDocumentPeople::create([
                        'document_id' => $doc->id,
                        'email' => $email,
                        'user_id' => $userObj ? $userObj->id : null,
                        'type' => 1,
                        'is_notify_email' => true,
                    ]);
                }
            }
        }

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'jsa');
                if ($uploadResult) {
                    JsaDocumentAttachment::create([
                        'jsa_document_id' => $doc->id,
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'blob_url'        => $uploadResult['fileBlobUrl'],
                        'blob_respon'     => json_encode($uploadResult['blobResponse']),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'JSA berhasil diperbarui.');
    }

    /**
     * Delete JSA document
     */
    public function destroy(string $id)
    {
        $doc = JsaDocument::findOrFail($id);
        
        // Also delete related attachments records
        JsaDocumentAttachment::where('jsa_document_id', $doc->id)->delete();
        
        $doc->delete();

        return ResponseFormatter::success(null, 'JSA berhasil dihapus.');
    }

    /**
     * Delete JSA attachment
     */
    public function deleteAttachment(string $id)
    {
        $attachment = JsaDocumentAttachment::findOrFail($id);
        $attachment->delete();

        return ResponseFormatter::success(null, 'Lampiran JSA berhasil dihapus.');
    }

    /**
     * Show JSA document details
     */
    public function show(string $id)
    {
        $document = JsaDocument::with(['company', 'department', 'user', 'creator', 'parent', 'attachments', 'people.user', 'activities.user'])
            ->findOrFail($id);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userRoles = $user ? \DB::table('aims_user_roles')
            ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
            ->where('aims_user_roles.user_id', $user->id)
            ->pluck('aims_roles.slug')
            ->toArray() : [];
        $isSuperAdmin = ($user && $user->role === 'super_admin') || in_array('super_admin', $userRoles) || in_array('system_admin', $userRoles);

        $canApprove = $isSuperAdmin || in_array('approval_crs', $userRoles) || in_array('approval_pja', $userRoles);

        return ResponseFormatter::success([
            'document' => $document,
            'canApprove' => $canApprove,
        ], 'JSA document retrieved successfully');
    }

    /**
     * Submit JSA for review (DRAFT → PENDING_REVIEW)
     */
    public function submitForReview(string $id)
    {
        $doc = JsaDocument::findOrFail($id);

        if ((string)$doc->status !== JsaDocument::DRAFT) {
            return ResponseFormatter::error('Dokumen bukan berstatus Draft.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => JsaDocument::PENDING_REVIEW]);

        JsaDocumentActivity::create([
            'document_id'     => $doc->id,
            'user_id'         => $user?->id,
            'status_document' => 'Submitted for Review',
            'description'     => 'Dokumen dikirim untuk direview.',
        ]);

        return ResponseFormatter::success($doc, 'Dokumen berhasil dikirim untuk review.');
    }

    /**
     * Approve JSA (PENDING_REVIEW → ACTIVE)
     */
    public function approve(Request $request, string $id)
    {
        $doc = JsaDocument::findOrFail($id);

        if ((string)$doc->status !== JsaDocument::PENDING_REVIEW) {
            return ResponseFormatter::error('Dokumen bukan berstatus Pending Review.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => JsaDocument::ACTIVE]);

        JsaDocumentActivity::create([
            'document_id'     => $doc->id,
            'user_id'         => $user?->id,
            'status_document' => 'Document Approved',
            'description'     => $request->input('notes', 'Dokumen telah disetujui dan diaktifkan.'),
        ]);

        return ResponseFormatter::success($doc, 'Dokumen berhasil disetujui.');
    }

    /**
     * Reject JSA (PENDING_REVIEW → DRAFT)
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'description' => 'required|string|max:500',
            'files'       => 'nullable|array',
            'files.*'     => 'file',
        ], [
            'description.required' => 'Alasan penolakan wajib diisi.',
        ]);

        $doc = JsaDocument::findOrFail($id);

        if ((string)$doc->status !== JsaDocument::PENDING_REVIEW) {
            return ResponseFormatter::error('Dokumen bukan berstatus Pending Review.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => JsaDocument::DRAFT]);

        $uploadedAttachments = [];
        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'jsa_activities');
                if ($uploadResult) {
                    $uploadedAttachments[] = [
                        'id'        => \Illuminate\Support\Str::uuid()->toString(),
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => strtolower($file->getClientOriginalExtension()),
                        'file_size' => $file->getSize(),
                        'path'      => $uploadResult['fileBlobPathName'],
                        'blob_url'  => $uploadResult['blobUrl'] ?? null,
                    ];
                }
            }
        }

        JsaDocumentActivity::create([
            'document_id'     => $doc->id,
            'user_id'         => $user?->id,
            'status_document' => 'Document Rejected',
            'description'     => $request->input('description'),
            'attachments'     => $uploadedAttachments,
        ]);

        return ResponseFormatter::success($doc, 'Dokumen dikembalikan ke draft.');
    }
}

