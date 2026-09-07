<?php

namespace Modules\Ko\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Modules\Ko\Entities\KoIssueReportAttachment;
use Modules\Ko\Entities\KoQrRequestFile;

class KoBaseApiController extends Controller
{
    protected function success($data, int $code = 200, ?string $message = null)
    {
        return ResponseFormatter::success($data, $message, $code);
    }

    protected function error(string $message, int $code = 400)
    {
        return ResponseFormatter::error($message, $code);
    }

    protected function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024)    return round($bytes / 1024, 2)    . ' KB';
        return $bytes . ' B';
    }

    /**
     * Upload lampiran issue ke blob (parity aims: ko/commissioning-attachment/{proposalId}).
     * Kolom attachment/blob_url/blob_response/size/name/type sudah ada — tanpa migrasi baru.
     */
    protected function uploadIssueFile($file, string $issueId, ?string $proposalId = null): KoIssueReportAttachment
    {
        $originalName = $file->getClientOriginalName();
        $path = 'ko/commissioning-attachment/' . ($proposalId ?? $issueId);
        $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);

        return KoIssueReportAttachment::create([
            'ko_issue_report_id' => $issueId,
            'attachment'  => $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName),
            'blob_url'    => $uploadResult['fileBlobUrl'] ?? null,
            'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
            'size'        => $this->formatFileSize($file->getSize()),
            'name'        => $originalName,
            'type'        => $file->getClientOriginalExtension(),
        ]);
    }

    /**
     * Upload berkas QR request ke blob (parity aims: ko/qr-request-attachment/{proposalId}).
     */
    protected function uploadQrFile($file, string $proposalId): KoQrRequestFile
    {
        $originalName = $file->getClientOriginalName();
        $path = 'ko/qr-request-attachment/' . $proposalId;
        $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);

        return KoQrRequestFile::create([
            'ko_proposal_id' => $proposalId,
            'attachment'  => $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName),
            'blob_url'    => $uploadResult['fileBlobUrl'] ?? null,
            'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
            'size'        => $this->formatFileSize($file->getSize()),
            'name'        => $originalName,
            'type'        => $file->getClientOriginalExtension(),
        ]);
    }

    /**
     * Upload satu dokumen lampiran proposal ke blob (parity aims AddAttachment:
     * ko/attachment/{proposalId}/{field}, nilai = blob URL).
     */
    protected function uploadProposalAttachmentFile($file, string $proposalId, string $field): string
    {
        $originalName = $file->getClientOriginalName();
        $path = 'ko/attachment/' . $proposalId . '/' . $field;
        $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);

        return $uploadResult['fileBlobUrl'] ?? ($path . '/' . $originalName);
    }
}
