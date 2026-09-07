<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Modules\Ko\Entities\KoIssueReport;
use Modules\Ko\Entities\KoIssueReportAttachment;
use Modules\Ko\Enums\IssueReportStatus;

/**
 * Issue Report + verifikasi admin/koordinator + solve/return.
 * Parity aims IssueReportStatus: Open -> Under Admin Verification
 * -> Under Coordinator Verification -> Solved / Returned.
 */
class KoIssueApiController extends KoBaseApiController
{
    public function index(Request $request)
    {
        $q = KoIssueReport::with(['koProposal', 'koUnit.koBrand', 'attachments'])->withCount('attachments')->orderBy('created_at', 'desc');
        if ($st = $request->status) $q->where('status', $st);
        if ($pid = $request->proposal_id) $q->where('ko_proposal_id', $pid);
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ko_proposal_id' => 'nullable|uuid|exists:ko_proposals,id',
            'ko_unit_id'     => 'nullable|uuid|exists:ko_units,id',
            'ko_commissioning_field_id' => 'nullable|integer|exists:ko_commissioning_fields,id',
            'note'           => 'nullable|string|max:255',
            'hazard_code'    => 'nullable|string|max:255',
        ]);
        // File fisik via endpoint attachments agar tanpa blob asli di test inti.
        $validated['status'] = IssueReportStatus::Open->value;
        return $this->success(KoIssueReport::create($validated), 201);
    }

    public function update(Request $request, string $id)
    {
        $issue = KoIssueReport::findOrFail($id);
        if (in_array($issue->status, [IssueReportStatus::Solved->value])) {
            return $this->error('Issue yang sudah Solved tidak dapat diedit.', 422);
        }
        $issue->update($request->validate([
            'note'        => 'nullable|string|max:255',
            'hazard_code' => 'nullable|string|max:255',
        ]));
        return $this->success($issue->fresh());
    }

    /**
     * Verifikasi: stage admin|coordinator + solve + return.
     * action: submit|approve|solve|return
     */
    public function verify(Request $request, string $id)
    {
        $issue = KoIssueReport::findOrFail($id);
        $request->validate([
            'action'  => 'required|in:submit,approve,solve,return',
            'message' => 'nullable|string|max:255',
        ]);

        $map = [
            'submit'  => IssueReportStatus::AdminVerification->value,
            'approve' => IssueReportStatus::CoordinatorVerification->value,
            'solve'   => IssueReportStatus::Solved->value,
            'return'  => IssueReportStatus::Returned->value,
        ];
        $issue->update([
            'status'           => $map[$request->action],
            'returned_message' => $request->action === 'return' ? $request->message : $issue->returned_message,
        ]);

        if ($request->hasFile('files')) {
            foreach ((array) $request->file('files') as $file) {
                if (!$file || !$file->isValid()) continue;
                $this->uploadIssueFile($file, $issue->id, $issue->ko_proposal_id);
            }
        }

        return $this->success($issue->fresh()->load('attachments'));
    }

    public function storeAttachment(Request $request, string $id)
    {
        $issue = KoIssueReport::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
        ]);

        // Upload fisik ke blob bila ada file (parity aims IssueReport.php).
        if ($request->hasFile('files')) {
            $uploaded = [];
            foreach ((array) $request->file('files') as $file) {
                if (!$file || !$file->isValid()) continue;
                $uploaded[] = $this->uploadIssueFile($file, $issue->id, $issue->ko_proposal_id);
            }
            return $this->success($uploaded, 201);
        }

        $attachment = KoIssueReportAttachment::create([
            ...$validated,
            'ko_issue_report_id' => $issue->id,
        ]);
        return $this->success($attachment, 201);
    }

    /**
     * Preview lampiran issue via blob SAS atau storage lokal (parity FieldLeadership).
     */
    public function previewAttachment(string $id)
    {
        $file = KoIssueReportAttachment::findOrFail($id);
        $filePath = $file->attachment;
        $fileName = $file->name ?: basename($filePath);
        $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $mimeType = match($ext) {
            'pdf'        => 'application/pdf',
            'png'        => 'image/png',
            'jpg','jpeg' => 'image/jpeg',
            default      => 'application/octet-stream',
        };

        if ($file->blob_url && filter_var($file->blob_url, FILTER_VALIDATE_URL)) {
            $parsedUrl = parse_url($file->blob_url);
            $urlPath = ltrim($parsedUrl['path'] ?? '', '/');
            $parts = explode('/', $urlPath, 2);
            $container = $parts[0] ?? 'aims-cntr';
            $filePath = urldecode(preg_replace('/\/+/', '/', $parts[1] ?? $filePath));
        } else {
            $container = 'aims-cntr';
        }

        $sas = GetBlobSasUri($container, $filePath, 60);
        $url = is_array($sas)
            ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
            : $sas;

        if (!$url && $file->blob_url && filter_var($file->blob_url, FILTER_VALIDATE_URL)) {
            $url = $file->blob_url;
        }

        if ($url) {
            $contents = @file_get_contents($url);
            if ($contents !== false) {
                return response($contents, 200, [
                    'Content-Type'        => $mimeType,
                    'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
                    'Cache-Control'       => 'private, max-age=300',
                ]);
            }
        }

        $localPath = \Illuminate\Support\Facades\Storage::disk('public')->path($filePath);
        if (file_exists($localPath)) {
            return response()->file($localPath, [
                'Content-Type'        => $mimeType,
                'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
            ]);
        }

        abort(404, 'File tidak dapat diakses.');
    }

    /**
     * Download lampiran issue via blob SAS redirect atau storage lokal.
     */
    public function downloadAttachment(string $id)
    {
        $file = KoIssueReportAttachment::findOrFail($id);
        $filePath = $file->attachment;
        $fileName = $file->name ?: basename($filePath);

        if ($file->blob_url && filter_var($file->blob_url, FILTER_VALIDATE_URL)) {
            $parsedUrl = parse_url($file->blob_url);
            $urlPath = ltrim($parsedUrl['path'] ?? '', '/');
            $parts = explode('/', $urlPath, 2);
            $container = $parts[0] ?? 'aims-cntr';
            $filePath = urldecode(preg_replace('/\/+/', '/', $parts[1] ?? $filePath));
        } else {
            $container = 'aims-cntr';
        }

        $sas = GetBlobSasUri($container, $filePath, 60);
        $url = is_array($sas)
            ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
            : $sas;

        if (!$url && $file->blob_url && filter_var($file->blob_url, FILTER_VALIDATE_URL)) {
            $url = $file->blob_url;
        }

        if ($url) return redirect($url);

        $localPath = \Illuminate\Support\Facades\Storage::disk('public')->path($filePath);
        if (file_exists($localPath)) return response()->download($localPath, $fileName);

        abort(404, 'File tidak ditemukan.');
    }
}
