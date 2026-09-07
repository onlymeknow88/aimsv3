<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\UserActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Modules\DocumentSystem\Entities\PtwDocument;
use Modules\DocumentSystem\Entities\PtwDocumentActivity;
use Modules\DocumentSystem\Entities\PtwDocumentPeople;
use Modules\DocumentSystem\Entities\PtwDocumentAttachment;
use Modules\DocumentSystem\Services\DocumentSystemService;
use Modules\DocumentSystem\Services\PtwService;

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

            $this->applyListingFilters($query, $request);

            $query->latest();

            if ($request->has('page') || $request->has('limit')) {
                $documents = $query->paginate($limit);
            } else {
                $documents = $query->get();
            }

            return ResponseFormatter::success($documents, 'PTW documents retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Terjadi kesalahan: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Apply shared listing filters (search, column filters, date ranges).
     * Used by index() and export() so both stay in sync.
     */
    private function applyListingFilters($query, Request $request): void
    {
        $search = $request->query('search', '');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        // Column-wise searches (mendukung UUID dari dropdown maupun ketikan bebas)
        if ($request->filled('filter_company')) {
            $comp = $request->query('filter_company');
            $query->whereHas('company', function ($q) use ($comp) {
                $q->where('id', $comp)
                  ->orWhere('company_name', 'like', "%{$comp}%")
                  ->orWhere('document_code', 'like', "%{$comp}%");
            });
        }

        if ($request->filled('filter_department')) {
            $dept = $request->query('filter_department');
            $query->whereHas('department', function ($q) use ($dept) {
                $q->where('id', $dept)
                  ->orWhere('name', 'like', "%{$dept}%")
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
                'pending' => '2',
                'pending review' => '2',
                'rejected' => '3',
                'active' => '5',
            ];
            $mappedStatus = $STATUS_MAP[strtolower($statusVal)] ?? null;
            if ($mappedStatus) {
                $query->where('status', $mappedStatus);
            } else {
                $query->where('status', 'like', '%' . $statusVal . '%');
            }
        }

        // Date range filters (ported from v2 Active listing: Active At / Inactive At)
        if ($request->filled('filter_start_date')) {
            $query->whereDate('doc_created', '>=', $request->query('filter_start_date'));
        }

        if ($request->filled('filter_end_date')) {
            $query->whereDate('doc_created', '<=', $request->query('filter_end_date'));
        }

        if ($request->filled('filter_inactive_start')) {
            $query->whereDate('inactive_at', '>=', $request->query('filter_inactive_start'));
        }

        if ($request->filled('filter_inactive_end')) {
            $query->whereDate('inactive_at', '<=', $request->query('filter_inactive_end'));
        }
    }

    /**
     * Store a newly created PTW.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'title'           => 'required|string|max:255|unique:ptw_documents,title',
            'document_number' => 'nullable|string|max:255|unique:ptw_documents,document_number',
            'location'    => 'nullable|string',
            'company_id'  => 'required',
            'department_id' => 'required',
            'area_manager_id' => 'nullable',
        ], [
            'title.unique'           => 'Judul PTW sudah digunakan, gunakan judul lain.',
            'document_number.unique' => 'Nomor dokumen sudah digunakan, gunakan nomor lain.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $documentNumber = $request->document_number;
        if (empty($documentNumber)) {
            $documentNumber = app(PtwService::class)->buildDocumentNumber($request->company_id, $request->department_id);
        }

        $doc = PtwDocument::create([
            'title'           => $request->title,
            'description'     => $request->description,
            'doc_created'     => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : now(),
            'inactive_at'     => null,
            'company_id'      => $request->company_id,
            'department_id'   => $request->department_id,
            'area_manager_id' => $request->area_manager_id ?: null,
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

        UserActivityLogService::log(
            module: 'document_system',
            action: 'create',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Membuat PTW baru '{$doc->document_number} - {$doc->title}'",
            newData: $doc->toArray(),
            request: $request,
        );

        return ResponseFormatter::success($doc, 'PTW berhasil dibuat.');
    }

    /**
     * Show PTW details.
     */
    public function show(string $id)
    {
        $document = PtwDocument::with(['company', 'department', 'user', 'areaManager.user', 'attachments', 'peoples.user', 'activities.user'])
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

        // Unique hanya dicek bila nilainya DIUBAH. Hasil revisi (replicate)
        // sengaja berbagi title/number dengan dokumen asalnya.
        $rules = [];
        if ($request->has('title')) {
            $rules['title'] = ['string', 'max:255'];
            if ($request->title !== $doc->title) {
                $rules['title'][] = Rule::unique('ptw_documents', 'title')->ignore($id);
            }
        }
        if ($request->has('document_number') && $request->document_number !== $doc->document_number) {
            $rules['document_number'] = ['nullable', 'string', 'max:255', Rule::unique('ptw_documents', 'document_number')->ignore($id)];
        }

        $validator = \Validator::make($request->all(), $rules, [
            'title.unique'           => 'Judul PTW sudah digunakan, gunakan judul lain.',
            'document_number.unique' => 'Nomor dokumen sudah digunakan, gunakan nomor lain.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $oldData = $doc->toArray();

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

        UserActivityLogService::log(
            module: 'document_system',
            action: 'update',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Memperbarui PTW '{$doc->document_number} - {$doc->title}'",
            oldData: $oldData,
            newData: $doc->fresh()->toArray(),
            request: $request,
        );

        return ResponseFormatter::success($doc, 'PTW berhasil diperbarui.');
    }

    /**
     * Destroy PTW details.
     */
    public function destroy(string $id)
    {
        $doc = PtwDocument::findOrFail($id);
        $oldData = $doc->toArray();
        PtwDocumentAttachment::where('ptw_document_id', $doc->id)->delete();
        $doc->delete();

        UserActivityLogService::log(
            module: 'document_system',
            action: 'delete',
            resource: 'PtwDocument',
            resourceId: (string) $id,
            description: "Menghapus PTW '{$oldData['document_number']} - {$oldData['title']}'",
            oldData: $oldData,
        );

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

        // Notify reviewers (invited people)
        $doc->load(['peoples', 'user']);
        $receivers = collect($doc->peoples)->pluck('email')->filter()->implode(';');
        if ($receivers) {
            $html = view('documentsystem::email_templates.document_system_review', [
                'title'      => $doc->title,
                'pic'        => $doc->user?->name ?? '-',
                'action_url' => url('document-systems/login'),
            ])->render();
            sendPowerAutomateEmail([
                'SendTo'        => $receivers,
                'Title'         => 'PTW Submitted for Review: ' . $doc->title,
                'MsgBody'       => $html,
                'AttchmentPath' => '',
                'AttchmentName' => '',
                'SendCC'        => '',
            ]);
        }

        UserActivityLogService::log(
            module: 'document_system',
            action: 'submit',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Mengirim PTW untuk direview '{$doc->document_number}'",
            oldData: ['status' => '1'],
            newData: $doc->fresh()->toArray(),
        );

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

        // Notify maker & invited people: PTW approved
        $doc->load(['peoples', 'user']);
        $receivers = collect($doc->peoples)->pluck('email')->filter()->implode(';');
        if ($receivers) {
            $html = view('documentsystem::email_templates.document_system_review', [
                'title'      => $doc->title,
                'pic'        => $doc->user?->name ?? '-',
                'action_url' => url('document-systems/login'),
            ])->render();
            sendPowerAutomateEmail([
                'SendTo'        => $receivers,
                'Title'         => 'PTW Disetujui & Aktif: ' . $doc->title,
                'MsgBody'       => $html,
                'AttchmentPath' => '',
                'AttchmentName' => '',
                'SendCC'        => '',
            ]);
        }

        UserActivityLogService::log(
            module: 'document_system',
            action: 'approve',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Menyetujui PTW '{$doc->document_number}'",
            oldData: ['status' => '2'],
            newData: $doc->fresh()->toArray(),
            request: $request,
        );

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

        // Notify maker: PTW rejected/returned
        $doc->load(['peoples', 'user']);
        $receivers = collect($doc->peoples)->pluck('email')->filter()->implode(';');
        if ($receivers) {
            $html = view('documentsystem::email_templates.document_system_review', [
                'title'      => $doc->title,
                'pic'        => $doc->user?->name ?? '-',
                'action_url' => url('document-systems/login'),
            ])->render();
            sendPowerAutomateEmail([
                'SendTo'        => $receivers,
                'Title'         => 'PTW Dikembalikan (Return): ' . $doc->title,
                'MsgBody'       => $html,
                'AttchmentPath' => '',
                'AttchmentName' => '',
                'SendCC'        => '',
            ]);
        }

        UserActivityLogService::log(
            module: 'document_system',
            action: 'reject',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Mengembalikan PTW ke draft: {$request->description}",
            oldData: ['status' => '2'],
            newData: $doc->fresh()->toArray(),
            request: $request,
        );

        return ResponseFormatter::success($doc, 'Dokumen dikembalikan ke draft.');
    }

    /**
     * Export PTW documents to Excel (ported from v2 PtwService::export).
     * Supports ?ids=a,b,c or the same filters as index().
     */
    public function export(Request $request)
    {
        try {
            $idsStr = $request->query('ids');
            $ids = $idsStr ? explode(',', $idsStr) : [];

            $query = PtwDocument::with(['company', 'department', 'user']);
            if (!empty($ids)) {
                $query->whereIn('id', $ids);
            } else {
                $this->applyListingFilters($query, $request);
            }

            $docs = $query->latest()->get();
            $rows = app(PtwService::class)->toExportRows($docs);

            return \Maatwebsite\Excel\Facades\Excel::download(
                new \Modules\DocumentSystem\Exports\PtwDocumentExport($rows),
                'PTW_Export_' . date('Y-m-d') . '.xlsx'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error('Terjadi kesalahan: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Bulk delete PTW documents (ported from v2 Active::submitDelete).
     */
    public function bulkDestroy(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ids = array_values($request->input('ids'));
        $deleted = 0;
        foreach ($ids as $id) {
            $doc = PtwDocument::find($id);
            if (!$doc) {
                continue;
            }
            PtwDocumentAttachment::where('ptw_document_id', $doc->id)->delete();
            $doc->delete();
            $deleted++;
        }

        UserActivityLogService::log(
            module: 'document_system',
            action: 'delete',
            resource: 'PtwDocument',
            resourceId: implode(',', $ids),
            description: "Menghapus {$deleted} PTW terpilih",
            request: $request,
        );

        return ResponseFormatter::success(['deleted' => $deleted], "{$deleted} PTW berhasil dihapus.");
    }

    /**
     * Mark an ACTIVE PTW as inactive (sets inactive_at, keeps status).
     * Ported from v2 PtwService::changeStatus inactive branch.
     */
    public function deactivate(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        if ((string) $doc->status !== PtwService::STATUS_ACTIVE) {
            return ResponseFormatter::error('Hanya PTW berstatus Active yang bisa dinonaktifkan.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $oldData = $doc->toArray();

        $doc->update(['inactive_at' => now()]);

        PtwDocumentActivity::create([
            'ptw_document_id' => $doc->id,
            'user_id'         => $user?->id,
            'activity'        => 'Document Deactivated',
            'notes'           => $request->input('notes', 'PTW dinonaktifkan.'),
        ]);

        UserActivityLogService::log(
            module: 'document_system',
            action: 'update',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Menonaktifkan PTW '{$doc->document_number}'",
            oldData: $oldData,
            newData: $doc->fresh()->toArray(),
            request: $request,
        );

        return ResponseFormatter::success($doc->fresh(), 'PTW berhasil dinonaktifkan.');
    }

    /**
     * Clear inactive_at on an ACTIVE PTW (reactivate).
     */
    public function reactivate(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        if ((string) $doc->status !== PtwService::STATUS_ACTIVE) {
            return ResponseFormatter::error('Hanya PTW berstatus Active yang bisa diaktifkan ulang.', 422);
        }

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $oldData = $doc->toArray();

        $doc->update(['inactive_at' => null]);

        PtwDocumentActivity::create([
            'ptw_document_id' => $doc->id,
            'user_id'         => $user?->id,
            'activity'        => 'Document Reactivated',
            'notes'           => $request->input('notes', 'PTW diaktifkan ulang.'),
        ]);

        UserActivityLogService::log(
            module: 'document_system',
            action: 'update',
            resource: 'PtwDocument',
            resourceId: $doc->id,
            description: "Mengaktifkan ulang PTW '{$doc->document_number}'",
            oldData: $oldData,
            newData: $doc->fresh()->toArray(),
            request: $request,
        );

        return ResponseFormatter::success($doc->fresh(), 'PTW berhasil diaktifkan ulang.');
    }

    /**
     * Delete attachment.
     */
    public function deleteAttachment(string $id)
    {
        $attachment = PtwDocumentAttachment::findOrFail($id);
        $oldData = $attachment->toArray();
        $attachment->delete();

        UserActivityLogService::log(
            module: 'document_system',
            action: 'delete',
            resource: 'PtwDocumentAttachment',
            resourceId: (string) $id,
            description: "Menghapus lampiran PTW '{$oldData['file_name']}'",
            oldData: $oldData,
        );

        return ResponseFormatter::success(null, 'Lampiran berhasil dihapus.');
    }
}
