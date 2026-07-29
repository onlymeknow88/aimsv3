<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\Company;
use Modules\CSMS\Entities\CsmsChecklistAttachment;
use Modules\CSMS\Entities\CsmsPjoFile;
use Modules\CSMS\Entities\CsmsMemoKttFile;

/**
 * CSMSBaseApiController
 *
 * Shared constants and helper methods for all CSMS API controllers.
 */
abstract class CSMSBaseApiController extends Controller
{
    // ── Status constants ──────────────────────────────────────────────────────
    const STATUS_DRAFT           = 'Draft';
    const STATUS_ON_REVIEW_OHS   = 'On Review OHS';
    const STATUS_ON_REVIEW_DHOHS = 'On Review D/H OHS';
    const STATUS_ON_REVIEW_KTT   = 'On Review KTT';
    const STATUS_APPROVED        = 'Approved';
    const STATUS_OPEN            = 'Open';
    const STATUS_INACTIVE        = 'Inactive';
    const STATUS_OBSOLETE        = 'Obsolete';

    // ── Criteria constants ────────────────────────────────────────────────────
    const CRITERIA_BIDDING      = 'Bidding';
    const CRITERIA_POST_BIDDING = 'PostBidding';
    const CRITERIA_RENEWAL      = 'Renewal';
    const CRITERIA_INACTIVE     = 'Inactive';

    // ── Shared: upload checklist attachment ───────────────────────────────────
    protected function uploadChecklistFile($file, string $checklistId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/bidding');

            CsmsChecklistAttachment::create([
                'checklist_id'  => $checklistId,
                'file'          => $uploadResult['fileBlobPathName'] ?? $originalName,
                'name'          => $originalName,
                'type'          => $file->getMimeType(),
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload checklist file', [
                'checklist_id' => $checklistId,
                'error'        => $e->getMessage(),
            ]);
        }
    }

    // ── Shared: upload PostBidding checklist attachment ───────────────────────
    protected function uploadChecklistFilePostBidding($file, string $checklistId, string $postBiddingId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $path         = 'csms/post-bidding/attachments/' . $postBiddingId;
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);

            CsmsChecklistAttachment::create([
                'checklist_id'  => $checklistId,
                'file'          => $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName),
                'name'          => $originalName,
                'type'          => $file->getMimeType(),
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload post-bidding checklist file', [
                'checklist_id'    => $checklistId,
                'post_bidding_id' => $postBiddingId,
                'error'           => $e->getMessage(),
            ]);
        }
    }

    // ── Shared: upload PJO file ───────────────────────────────────────────────
    protected function uploadPjoFile($file, string $pjoId, string $type = 'other'): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/pjo');

            CsmsPjoFile::create([
                'pjo_id'        => $pjoId,
                'type'          => $type,
                'file'          => $uploadResult['fileBlobPathName'] ?? $originalName,
                'name'          => $originalName,
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload PJO file', ['pjo_id' => $pjoId, 'type' => $type, 'error' => $e->getMessage()]);
        }
    }

    // ── Shared: upload MemoKTT file ───────────────────────────────────────────
    protected function uploadMemoKttFile($file, string $memoId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/memo-ktt/' . $memoId);

            CsmsMemoKttFile::create([
                'memo_id'       => $memoId,
                'file'          => $uploadResult['fileBlobPathName'] ?? ('csms/memo-ktt/' . $memoId . '/' . $originalName),
                'name'          => $originalName,
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? $uploadResult['blobResponse'] : null,
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload Memo KTT file', ['memo_id' => $memoId, 'error' => $e->getMessage()]);
        }
    }

    // ── Shared: sync company status ───────────────────────────────────────────
    protected function syncToCompany(object $bidding): void
    {
        try {
            // If company_id exists, just update csms_status
            if ($bidding->company_id) {
                Company::where('id', $bidding->company_id)->update([
                    'csms_status' => 'Active',
                    'updated_at'  => now(),
                ]);
                return;
            }

            // Auto-create company if not yet registered (matches aimsv2 backoffice_sync)
            $questionnaire = [];
            if ($bidding->questionnaire) {
                $questionnaire = is_string($bidding->questionnaire)
                    ? (json_decode($bidding->questionnaire, true) ?? [])
                    : (array) $bidding->questionnaire;
            }

            $exists = Company::where('company_name', $bidding->company_name)->exists();
            if (!$exists) {
                Company::create([
                    'company_name'      => $bidding->company_name,
                    'document_code'     => $questionnaire['company_nickname'] ?? null,
                    'address'           => $bidding->address,
                    'email'             => $questionnaire['equipped_email'] ?? null,
                    'phone_number'      => $questionnaire['equipped_telephone'] ?? null,
                    'type'              => $bidding->service_criteria,
                    'parent_company_id' => $bidding->ccow_id,
                ]);
            }
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal sync company', ['bidding_id' => $bidding->id, 'error' => $e->getMessage()]);
        }
    }

    // ── Shared: format file size ──────────────────────────────────────────────
    protected function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024)    return round($bytes / 1024, 2)    . ' KB';
        return $bytes . ' B';
    }
}