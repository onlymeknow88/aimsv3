<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Workflow Baru Field Leadership:
 *
 * Maker buat FL (Open)
 *   → submit()
 *     → is_immediate_action = true  → cek is_area_suitable
 *         → true  → On Review CRS (siap verifikasi perbaikan)
 *         → false → Pending CRS (CRS perlu ganti PJA)
 *     → is_immediate_action = false → On Review PJA (PJA review dulu)
 *
 * PJA review → pjaReview()
 *   → is_area_suitable = true  → On Review CRS
 *   → is_area_suitable = false → Pending CRS
 *
 * CRS aksi → crsAction()
 *   → approve → On Review CRS
 *   → reject  → Not Followed Up
 *
 * CRS verifikasi → crsVerify()
 *   → approve → Closed (FL + PICA closed)
 *   → reject  → On Review PJA (perbaikan ulang)
 *
 * Return with comment → returnWithComment() (rollback 1 step)
 */
class FieldLeadershipApprovalApiController extends Controller
{
    const STATUS_OPEN            = 'Open';
    const STATUS_ON_REVIEW_PJA   = 'On Review PJA';
    const STATUS_PENDING_CRS     = 'Pending CRS';
    const STATUS_ON_REVIEW_CRS   = 'On Review CRS';
    const STATUS_NOT_FOLLOWED_UP = 'Not Followed Up';
    const STATUS_CLOSED          = 'Closed';

    private const PREV_STATUS = [
        'On Review PJA'   => 'Open',
        'Pending CRS'     => 'On Review PJA',
        'On Review CRS'   => 'On Review PJA',
        'Not Followed Up' => 'On Review PJA',
    ];

    // ── 1. Submit (Open → tergantung is_immediate_action) ────────────────────
    /**
     * POST /api/field-leadership/{id}/submit
     */
    public function submit(string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) return ResponseFormatter::error('Observation not found', 404);

        if ($fl->status !== self::STATUS_OPEN) {
            return ResponseFormatter::error(
                "Dokumen harus berstatus 'Open' untuk disubmit. Status saat ini: {$fl->status}", 422
            );
        }

        if ($fl->is_immediate_action) {
            // Tindak lanjut langsung di tempat → cek area sesuai PJA
            $nextStatus = $fl->is_area_suitable
                ? self::STATUS_ON_REVIEW_CRS
                : self::STATUS_PENDING_CRS;
            $logMsg = $fl->is_area_suitable
                ? 'Tindak lanjut langsung — area sesuai PJA, diteruskan ke CRS untuk verifikasi'
                : 'Tindak lanjut langsung — area tidak sesuai PJA, dikirim ke CRS untuk ganti PJA';
        } else {
            // Belum ada tindak lanjut → kirim ke PJA review dulu
            $nextStatus = self::STATUS_ON_REVIEW_PJA;
            $logMsg     = 'Dokumen disubmit — dikirim ke PJA untuk review';
        }

        DB::table('field_leaderships')->where('id', $id)->update([
            'status'       => $nextStatus,
            'submitted_at' => now(),
            'updated_at'   => now(),
        ]);

        $this->logActivity($id, $logMsg);

        // Auto-create PICA jika FL langsung ke On Review CRS
        if ($nextStatus === self::STATUS_ON_REVIEW_CRS) {
            $this->createPicaDocumentsForFl($fl);
        }

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $nextStatus],
            "Dokumen berhasil disubmit. Status: {$nextStatus}"
        );
    }

    // ── 2. PJA Review (On Review PJA → Pending CRS / On Review CRS) ─────────
    /**
     * POST /api/field-leadership/{id}/pja-review
     * Body: { is_area_suitable: bool, pja_change_reason?: string }
     */
    public function pjaReview(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) return ResponseFormatter::error('Observation not found', 404);

        if ($fl->status !== self::STATUS_ON_REVIEW_PJA) {
            return ResponseFormatter::error(
                "Dokumen harus berstatus 'On Review PJA'. Status saat ini: {$fl->status}", 422
            );
        }

        $request->validate([
            'is_area_suitable'  => 'required|boolean',
            'pja_change_reason' => 'nullable|string|max:1000',
        ]);

        $isAreaSuitable = $request->boolean('is_area_suitable');
        $nextStatus     = $isAreaSuitable ? self::STATUS_ON_REVIEW_CRS : self::STATUS_PENDING_CRS;
        $logMsg         = $isAreaSuitable
            ? 'PJA menyatakan area sesuai — diteruskan ke CRS untuk verifikasi'
            : 'PJA menyatakan area tidak sesuai — dikirim ke CRS untuk pergantian PJA';

        DB::table('field_leaderships')->where('id', $id)->update([
            'is_area_suitable'  => $isAreaSuitable,
            'pja_change_reason' => $request->input('pja_change_reason'),
            'status'            => $nextStatus,
            'pja_reviewed_at'   => now(),
            'updated_at'        => now(),
        ]);

        $this->logActivity($id, $logMsg);

        // Auto-create PICA jika PJA menyatakan area sesuai → On Review CRS
        if ($nextStatus === self::STATUS_ON_REVIEW_CRS) {
            $fl = DB::table('field_leaderships')->where('id', $id)->first();
            $this->createPicaDocumentsForFl($fl);
        }

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $nextStatus],
            "Review PJA selesai. Status: {$nextStatus}"
        );
    }

    // ── 3. CRS Action (Pending CRS → On Review CRS / Not Followed Up) ───────
    /**
     * POST /api/field-leadership/{id}/crs-action
     * Body: { action: 'approve'|'reject', pja_id_new?: uuid, reason?: string }
     */
    public function crsAction(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) return ResponseFormatter::error('Observation not found', 404);

        if ($fl->status !== self::STATUS_PENDING_CRS) {
            return ResponseFormatter::error(
                "Dokumen harus berstatus 'Pending CRS'. Status saat ini: {$fl->status}", 422
            );
        }

        $request->validate([
            'action'     => 'required|in:approve,reject',
            'pja_id_new' => 'nullable|uuid',
            'reason'     => 'nullable|string|max:1000',
        ]);

        if ($request->action === 'approve') {
            $updateData = ['status' => self::STATUS_ON_REVIEW_CRS, 'updated_at' => now()];
            if ($request->pja_id_new) $updateData['pja_id_new'] = $request->pja_id_new;
            DB::table('field_leaderships')->where('id', $id)->update($updateData);
            $logMsg = $request->pja_id_new
                ? 'CRS mengganti PJA — diteruskan untuk verifikasi perbaikan'
                : 'CRS menyetujui — diteruskan untuk verifikasi perbaikan';
        } else {
            DB::table('field_leaderships')->where('id', $id)->update([
                'status'     => self::STATUS_NOT_FOLLOWED_UP,
                'updated_at' => now(),
            ]);
            $logMsg = 'CRS memutuskan perbaikan tidak ditindaklanjuti oleh PJA';
            if ($request->reason) $logMsg .= ". Alasan: {$request->reason}";
        }

        $this->logActivity($id, $logMsg);
        $newStatus = $request->action === 'approve' ? self::STATUS_ON_REVIEW_CRS : self::STATUS_NOT_FOLLOWED_UP;

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $newStatus],
            "Aksi CRS berhasil. Status: {$newStatus}"
        );
    }

    // ── 4. CRS Verify (On Review CRS → Closed / On Review PJA) ─────────────
    /**
     * POST /api/field-leadership/{id}/crs-verify
     * Body: { action: 'approve'|'reject', reason?: string }
     */
    public function crsVerify(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) return ResponseFormatter::error('Observation not found', 404);

        if ($fl->status !== self::STATUS_ON_REVIEW_CRS) {
            return ResponseFormatter::error(
                "Dokumen harus berstatus 'On Review CRS'. Status saat ini: {$fl->status}", 422
            );
        }

        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string|max:1000',
        ]);

        if ($request->action === 'approve') {
            DB::table('field_leaderships')->where('id', $id)->update([
                'status'          => self::STATUS_CLOSED,
                'crs_approved_at' => now(),
                'closed_at'       => now(),
                'updated_at'      => now(),
            ]);
            DB::table('field_leadership_risks')
                ->where('fl_id', $id)
                ->where('status', '!=', 'Closed')
                ->update(['status' => 'Closed', 'updated_at' => now()]);
            $this->logActivity($id, 'CRS memverifikasi perbaikan — Field Leadership CLOSED (Case Closed)');
            $this->closePicaDocumentsForFl($id);
            return ResponseFormatter::success(
                ['id' => $id, 'status' => self::STATUS_CLOSED],
                'Field Leadership ditutup. Case Closed.'
            );
        } else {
            $reason = $request->input('reason', '');
            DB::table('field_leaderships')->where('id', $id)->update([
                'status'     => self::STATUS_ON_REVIEW_PJA,
                'updated_at' => now(),
            ]);
            $logMsg = 'CRS menolak verifikasi — dikembalikan ke PJA untuk perbaikan ulang';
            if ($reason) $logMsg .= ". Alasan: {$reason}";
            $this->logActivity($id, $logMsg);
            return ResponseFormatter::success(
                ['id' => $id, 'status' => self::STATUS_ON_REVIEW_PJA],
                'Dikembalikan ke PJA untuk perbaikan ulang.'
            );
        }
    }

    // ── 5. Return with Comment (rollback 1 step) ─────────────────────────────
    /**
     * POST /api/field-leadership/{id}/return
     * Body: { comment: string, files?: File[] }
     */
    public function returnWithComment(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();
        if (!$fl) return ResponseFormatter::error('Observation not found', 404);

        $prevStatus = self::PREV_STATUS[$fl->status] ?? null;
        if (!$prevStatus) {
            return ResponseFormatter::error("Status '{$fl->status}' tidak dapat dikembalikan.", 422);
        }

        $request->validate([
            'comment' => 'required|string|max:1000',
            'files'   => 'nullable|array',
            'files.*' => 'file|max:20480',
        ]);

        DB::table('field_leaderships')->where('id', $id)->update([
            'status'     => $prevStatus,
            'updated_at' => now(),
        ]);

        $comment    = $request->input('comment');
        $activityId = (string) Str::uuid();

        DB::table('field_leadership_activities')->insert([
            'id'          => $activityId,
            'fl_id'       => $id,
            'description' => "Dokumen dikembalikan dari '{$fl->status}' ke '{$prevStatus}'. Catatan: {$comment}",
            'user_id'     => (string) auth()->id(),
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                try {
                    $originalName = $file->getClientOriginalName();
                    $ext          = strtolower($file->getClientOriginalExtension());
                    $size         = $file->getSize() >= 1048576
                        ? round($file->getSize() / 1048576, 2) . ' MB'
                        : round($file->getSize() / 1024, 2) . ' KB';
                    $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'field-leadership/activities');
                    DB::table('field_leadership_activity_files')->insert([
                        'id'             => (string) Str::uuid(),
                        'fl_activity_id' => $activityId,
                        'file'           => $uploadResult['fileBlobPathName'] ?? $originalName,
                        'blob_url'       => $uploadResult['fileBlobUrl'] ?? null,
                        'blob_response'  => $uploadResult['blobResponse'] ? json_encode($uploadResult['blobResponse']) : null,
                        'type_file'      => $ext,
                        'size'           => $size,
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);
                } catch (\Throwable $e) {
                    \Log::error('Failed to upload return activity file: ' . $e->getMessage());
                }
            }
        }

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $prevStatus],
            "Dokumen dikembalikan. Status: {$prevStatus}"
        );
    }

    // ── PICA integration ──────────────────────────────────────────────────────

    /**
     * Auto-create pica_documents untuk setiap risk FL yang memiliki repair_action & due_date.
     * Dipanggil saat FL masuk ke status On Review CRS.
     * Guard: skip jika PICA untuk risk tersebut sudah ada.
     */
    private function createPicaDocumentsForFl(object $fl): void
    {
        $risks = DB::table('field_leadership_risks')
            ->where('fl_id', $fl->id)
            ->whereNotNull('repair_action')
            ->whereNotNull('due_date')
            ->get();

        foreach ($risks as $risk) {
            // Guard: jangan double-create
            $exists = DB::table('pica_documents')
                ->where('source', 'Field Leadership')
                ->where('source_id', $risk->id)
                ->exists();
            if ($exists) continue;

            $identityId = $this->generatePicaIdentityId('Field Leadership');

            DB::table('pica_documents')->insert([
                'id'                     => (string) Str::uuid(),
                'identity_id'            => $identityId,
                'source'                 => 'Field Leadership',
                'source_id'              => $risk->id,
                'type'                   => $fl->type ?? null,
                'date'                   => $fl->date,
                'ccow_id'                => $fl->ccow_id ?? null,
                'company_id'             => $fl->company_id ?? null,
                'section_id'             => $fl->section_id ?? null,
                'location_id'            => $fl->area_location_id ?? null,
                'location_detail'        => $fl->detail_location ?? null,
                'company_detail'         => $fl->detail_company ?? null,
                'pja_id'                 => $fl->pja_id ?? null,
                'pjo_id'                 => $fl->pjo_id ?? null,
                'auditor'                => auth()->user()?->name,
                'non_compliance'         => $risk->risk_condition ?? null,
                'non_compliance_root_cause' => $fl->non_compliance_root ?? null,
                'corrective_action'      => $risk->repair_action,
                'target_settlement_date' => $risk->due_date,
                'status'                 => 'On Review CRS',
                'published'              => 'Publish',
                'requested'              => 'Requested CRS',
                'created_by'             => (string) auth()->id(),
                'created_at'             => now(),
                'updated_at'             => now(),
            ]);
        }
    }

    /**
     * Close semua pica_documents yang source_id-nya adalah risk dari FL ini.
     * Dipanggil saat CRS approve → FL Closed.
     */
    private function closePicaDocumentsForFl(string $flId): void
    {
        $riskIds = DB::table('field_leadership_risks')
            ->where('fl_id', $flId)
            ->pluck('id');

        if ($riskIds->isEmpty()) return;

        DB::table('pica_documents')
            ->where('source', 'Field Leadership')
            ->whereIn('source_id', $riskIds)
            ->where('status', '!=', 'Closed')
            ->update([
                'status'          => 'Closed',
                'settlement_date' => now()->toDateString(),
                'updated_at'      => now(),
            ]);
    }

    /**
     * Generate identity ID untuk PICA berdasarkan source.
     * Format: {PREFIX}{mmYYYY}-{PREFIX}{6digit}
     */
    private function generatePicaIdentityId(string $source): string
    {
        $prefixMap = [
            'Field Leadership' => 'FL',
            'Inspeksi KPLH'    => 'KP',
            'Audit'            => 'AU',
            'CSMS'             => 'CS',
            'Manual'           => 'MA',
        ];

        $code  = $prefixMap[$source] ?? 'PC';
        $date  = Carbon::now()->format('mY');
        $count = DB::table('pica_documents')->where('source', $source)->count();

        do {
            $count++;
            $identityId = $code . $date . '-' . $code . str_pad($count, 6, '0', STR_PAD_LEFT);
        } while (DB::table('pica_documents')->where('identity_id', $identityId)->exists());

        return $identityId;
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private function logActivity(string $flId, string $description): void
    {
        DB::table('field_leadership_activities')->insert([
            'id'          => (string) Str::uuid(),
            'fl_id'       => $flId,
            'description' => $description,
            'user_id'     => (string) auth()->id(),
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }
}
