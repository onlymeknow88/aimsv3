<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\PtwDocument;
use Modules\DocumentSystem\Entities\PtwDocumentActivity;
use Modules\DocumentSystem\Entities\PtwDocumentPeople;
use Modules\DocumentSystem\Entities\PtwDocumentAttachment;
use Modules\DocumentSystem\Services\DocumentSystemService;

class PtwController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $limit = $request->query('limit', 10);
            $search = $request->query('search', '');

            $query = PtwDocument::with(['company', 'department', 'user', 'attachments']);

            if ($search) {
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
                $query->whereHas('user', function ($q) use ($pic) {
                    $q->where('name', 'like', "%{$pic}%");
                });
            }

            if ($request->filled('filter_title')) {
                $query->where('title', 'like', '%' . $request->query('filter_title') . '%');
            }

            if ($request->filled('filter_document_number')) {
                $query->where('document_number', 'like', '%' . $request->query('filter_document_number') . '%');
            }

            if ($request->filled('filter_detail_location')) {
                $query->where('detail_location', 'like', '%' . $request->query('filter_detail_location') . '%');
            }

            if ($request->filled('filter_status')) {
                $statusVal = $request->query('filter_status');
                $STATUS_MAP = [
                    'draft' => '1',
                    'active' => '5',
                ];
                $mappedStatus = $STATUS_MAP[strtolower($statusVal)] ?? null;
                if ($mappedStatus) {
                    $query->where('status', $mappedStatus);
                } else {
                    $query->where('status', 'like', '%' . $statusVal . '%');
                }
            }

            $query->latest();

            if ($request->has('page') || $request->has('limit')) {
                $documents = $query->paginate($limit);
            } else {
                $documents = $query->get();
            }

            return ResponseFormatter::success($documents, 'PTW documents retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created PTW.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'location'    => 'nullable|string',
            'company_id'  => 'required',
            'department_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

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

            $prefix = "PTW-{$companyCode}-{$deptCode}-";
            $count = PtwDocument::where('document_number', 'like', "{$prefix}%")->count();
            $nextNum = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            $documentNumber = "{$prefix}{$nextNum}";
        }

        $doc = PtwDocument::create([
            'title'           => $request->title,
            'description'     => $request->description,
            'doc_created'     => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : now(),
            'company_id'      => $request->company_id,
            'department_id'   => $request->department_id,
            'status'          => $request->status ?? '1', // 1 = Draft
            'detail_location' => $request->location,
            'document_number' => $documentNumber,
            'user_id'         => $userId,
            'created_by'      => $userId,
        ]);

        if ($request->has('invited_emails')) {
            $invitedEmails = $request->input('invited_emails', []);
            foreach ($invitedEmails as $email) {
                if ($email) {
                    $userObj = \App\Models\User::where('email', $email)->first();
                    PtwDocumentPeople::create([
                        'ptw_document_id' => $doc->id,
                        'email' => $email,
                        'user_id' => $userObj ? $userObj->id : null,
                        'status' => 'active',
                    ]);
                }
            }
        }

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'ptw');
                if ($uploadResult) {
                    PtwDocumentAttachment::create([
                        'ptw_document_id' => $doc->id,
                        'file_name'       => $file->getClientOriginalName(),
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'file_size'       => $file->getSize(),
                        'mime_type'       => $file->getClientMimeType(),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'PTW berhasil dibuat.');
    }

    /**
     * Show PTW details.
     */
    public function show(string $id)
    {
        $document = PtwDocument::with(['company', 'department', 'user', 'areaManager', 'attachments', 'peoples.user', 'activities.user'])
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
        ], 'PTW document retrieved successfully');
    }

    /**
     * Update PTW details.
     */
    public function update(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc->update([
            'title'           => $request->title ?? $doc->title,
            'description'     => $request->description ?? $doc->description,
            'doc_created'     => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : $doc->doc_created,
            'company_id'      => $request->company_id ?? $doc->company_id,
            'department_id'   => $request->department_id ?? $doc->department_id,
            'area_manager_id' => $request->area_manager_id ?? $doc->area_manager_id,
            'status'          => $request->status ?? $doc->status,
            'detail_location' => $request->location ?? $doc->detail_location,
            'user_id'         => $doc->user_id ?? $userId,
        ]);

        if ($request->has('invited_emails')) {
            PtwDocumentPeople::where('ptw_document_id', $doc->id)->delete();
            $invitedEmails = $request->input('invited_emails', []);
            foreach ($invitedEmails as $email) {
                if ($email) {
                    $userObj = \App\Models\User::where('email', $email)->first();
                    PtwDocumentPeople::create([
                        'ptw_document_id' => $doc->id,
                        'email' => $email,
                        'user_id' => $userObj ? $userObj->id : null,
                        'status' => 'active',
                    ]);
                }
            }
        }

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'ptw');
                if ($uploadResult) {
                    PtwDocumentAttachment::create([
                        'ptw_document_id' => $doc->id,
                        'file_name'       => $file->getClientOriginalName(),
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'file_size'       => $file->getSize(),
                        'mime_type'       => $file->getClientMimeType(),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'PTW berhasil diperbarui.');
    }

    /**
     * Destroy PTW details.
     */
    public function destroy(string $id)
    {
        $doc = PtwDocument::findOrFail($id);
        PtwDocumentAttachment::where('ptw_document_id', $doc->id)->delete();
        $doc->delete();

        return ResponseFormatter::success(null, 'PTW berhasil dihapus.');
    }

    /**
     * Submit PTW for review (DRAFT → PENDING_REVIEW)
     */
    public function submitForReview(string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        if ((string)$doc->status !== '1') { // 1 = Draft
            return ResponseFormatter::error('Dokumen bukan berstatus Draft.', 422);
        }

        $validator = \Validator::make($doc->toArray(), [
            'title'           => 'required',
            'company_id'      => 'required',
            'department_id'   => 'required',
            'detail_location' => 'required',
        ], [
            'title.required'           => 'Judul PTW wajib diisi sebelum diajukan review.',
            'company_id.required'      => 'Perusahaan wajib dipilih sebelum diajukan review.',
            'department_id.required'   => 'Departemen wajib dipilih sebelum diajukan review.',
            'detail_location.required' => 'Detail Lokasi wajib diisi sebelum diajukan review.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => '2']); // 2 = Pending Review

        PtwDocumentActivity::create([
            'ptw_document_id' => $doc->id,
            'user_id'         => $user?->id,
            'activity'        => 'Submitted for Review',
            'notes'           => 'Dokumen dikirim untuk direview.',
        ]);

        return ResponseFormatter::success($doc, 'Dokumen berhasil dikirim untuk review.');
    }

    /**
     * Approve PTW (PENDING_REVIEW → ACTIVE)
     */
    public function approve(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        if ((string)$doc->status !== '2') { // 2 = Pending Review
            return ResponseFormatter::error('Dokumen bukan berstatus Pending Review.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => '5']); // 5 = Active

        PtwDocumentActivity::create([
            'ptw_document_id' => $doc->id,
            'user_id'         => $user?->id,
            'activity'        => 'Document Approved',
            'notes'           => $request->input('notes', 'Dokumen telah disetujui dan diaktifkan.'),
        ]);

        return ResponseFormatter::success($doc, 'Dokumen berhasil disetujui.');
    }

    /**
     * Reject PTW (PENDING_REVIEW → DRAFT)
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'description' => 'required|string|max:500',
        ]);

        $doc = PtwDocument::findOrFail($id);

        if ((string)$doc->status !== '2') { // 2 = Pending Review
            return ResponseFormatter::error('Dokumen bukan berstatus Pending Review.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();

        $doc->update(['status' => '1']); // 1 = Draft (Rejected back to draft)

        PtwDocumentActivity::create([
            'ptw_document_id' => $doc->id,
            'user_id'         => $user?->id,
            'activity'        => 'Document Rejected',
            'notes'           => $request->input('description'),
        ]);

        return ResponseFormatter::success($doc, 'Dokumen dikembalikan ke draft.');
    }

    /**
     * Delete attachment.
     */
    public function deleteAttachment(string $id)
    {
        $attachment = PtwDocumentAttachment::findOrFail($id);
        $attachment->delete();

        return ResponseFormatter::success(null, 'Lampiran berhasil dihapus.');
    }
}
