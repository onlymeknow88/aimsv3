<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Traits\SendsEmail;

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
    use SendsEmail;
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

        // Send Email Notifications
        if ($nextStatus === self::STATUS_ON_REVIEW_PJA) {
            $pja = DB::table('users')->where('id', $fl->pja_id)->first();
            if ($pja && !empty($pja->email)) {
                $creatorName = auth()->user()->name ?? 'User AIMS';
                $subject = '[AIMS] Penugasan Review Observasi Field Leadership';
                $body = "Halo,\n\n" .
                        "Sebuah observasi Field Leadership baru telah dikirimkan untuk direview oleh Anda sebagai PJA.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Dilaporkan oleh: {$creatorName}\n\n" .
                        "Silakan masuk ke sistem AIMS untuk melakukan review.";
                try {
                    $this->sendSimpleEmail($pja->email, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in submit PJA: ' . $e->getMessage());
                }
            }
        } else {
            $crsEmails = $this->getCrsEmails();
            if (!empty($crsEmails)) {
                $creatorName = auth()->user()->name ?? 'User AIMS';
                $subject = '[AIMS] Penugasan Tindak Lanjut Observasi Field Leadership';
                $body = "Halo,\n\n" .
                        "Sebuah observasi Field Leadership telah dikirimkan ke CRS untuk ditindaklanjuti/diverifikasi.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Dilaporkan oleh: {$creatorName}\n" .
                        "- Status: {$nextStatus}\n\n" .
                        "Silakan masuk ke sistem AIMS untuk menindaklanjuti.";
                try {
                    $this->sendSimpleEmail($crsEmails, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in submit CRS: ' . $e->getMessage());
                }
            }
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

        // Send Email to CRS
        $crsEmails = $this->getCrsEmails();
        if (!empty($crsEmails)) {
            $reviewerName = auth()->user()->name ?? 'PJA';
            $subject = '[AIMS] Review PJA Selesai - Observasi Field Leadership';
            $body = "Halo,\n\n" .
                    "Review PJA untuk observasi Field Leadership berikut telah selesai dilakukan.\n\n" .
                    "Detail Observasi:\n" .
                    "- Jenis: {$fl->type}\n" .
                    "- Tanggal: {$fl->date}\n" .
                    "- Detail Perusahaan: {$fl->detail_company}\n" .
                    "- Direview oleh: {$reviewerName}\n" .
                    "- Kesesuaian Area PJA: " . ($isAreaSuitable ? 'Sesuai' : 'Tidak Sesuai') . "\n" .
                    "- Alasan Perubahan (jika ada): " . ($request->input('pja_change_reason') ?: '-') . "\n" .
                    "- Status Baru: {$nextStatus}\n\n" .
                    "Silakan masuk ke sistem AIMS untuk menindaklanjuti.";
            try {
                $this->sendSimpleEmail($crsEmails, $subject, $body);
            } catch (\Throwable $e) {
                \Log::error('Mail error in pjaReview: ' . $e->getMessage());
            }
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

        // Send Email Notifications
        if ($request->action === 'approve' && $request->pja_id_new) {
            $newPja = DB::table('users')->where('id', $request->pja_id_new)->first();
            if ($newPja && !empty($newPja->email)) {
                $subject = '[AIMS] Penugasan PJA Baru - Observasi Field Leadership';
                $body = "Halo,\n\n" .
                        "Anda telah ditunjuk oleh CRS sebagai Penanggung Jawab Area (PJA) baru untuk observasi Field Leadership berikut.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n\n" .
                        "Silakan masuk ke sistem AIMS untuk menindaklanjuti perbaikan.";
                try {
                    $this->sendSimpleEmail($newPja->email, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in crsAction PJA: ' . $e->getMessage());
                }
            }
        } elseif ($request->action === 'reject') {
            $maker = DB::table('users')
                ->where('id', $fl->created_by)
                ->orWhere('employee_id', $fl->created_by)
                ->first();
            if ($maker && !empty($maker->email)) {
                $subject = '[AIMS] Observasi Tidak Ditindaklanjuti - Field Leadership';
                $body = "Halo,\n\n" .
                        "Observasi Field Leadership yang Anda laporkan telah diputuskan oleh CRS untuk tidak ditindaklanjuti.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Alasan: " . ($request->reason ?: '-') . "\n\n" .
                        "Silakan cek sistem AIMS untuk informasi lebih lanjut.";
                try {
                    $this->sendSimpleEmail($maker->email, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in crsAction Maker: ' . $e->getMessage());
                }
            }
        }

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

            // Send Email Notification on Approval (Closed)
            $maker = DB::table('users')->where('id', $fl->created_by)->orWhere('employee_id', $fl->created_by)->first();
            $pjaId = $fl->pja_id_new ?: $fl->pja_id;
            $pja = DB::table('users')->where('id', $pjaId)->first();
            $subject = '[AIMS] CLOSED - Observasi Field Leadership Selesai';
            $body = "Halo,\n\n" .
                    "Observasi Field Leadership berikut telah selesai diverifikasi oleh CRS dan berstatus CLOSED.\n\n" .
                    "Detail Observasi:\n" .
                    "- Jenis: {$fl->type}\n" .
                    "- Tanggal: {$fl->date}\n" .
                    "- Detail Perusahaan: {$fl->detail_company}\n\n" .
                    "Terima kasih atas kontribusi Anda.";

            if ($maker && !empty($maker->email)) {
                try { $this->sendSimpleEmail($maker->email, $subject, $body); } catch (\Throwable $e) {}
            }
            if ($pja && !empty($pja->email) && ($pja->email !== ($maker->email ?? ''))) {
                try { $this->sendSimpleEmail($pja->email, $subject, $body); } catch (\Throwable $e) {}
            }

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

            // Send Email Notification on Rejection (Return to PJA)
            $pjaId = $fl->pja_id_new ?: $fl->pja_id;
            $pja = DB::table('users')->where('id', $pjaId)->first();
            if ($pja && !empty($pja->email)) {
                $subject = '[AIMS] Perbaikan Ditolak - Observasi Field Leadership';
                $body = "Halo,\n\n" .
                        "Verifikasi perbaikan untuk observasi Field Leadership berikut ditolak oleh CRS dan dikembalikan ke PJA untuk perbaikan ulang.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Alasan Penolakan: " . ($reason ?: '-') . "\n\n" .
                        "Silakan masuk ke sistem AIMS untuk melakukan perbaikan ulang.";
                try { $this->sendSimpleEmail($pja->email, $subject, $body); } catch (\Throwable $e) {}
            }

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

        // Send Email Notification on Return
        if ($prevStatus === self::STATUS_OPEN) {
            $maker = DB::table('users')->where('id', $fl->created_by)->orWhere('employee_id', $fl->created_by)->first();
            if ($maker && !empty($maker->email)) {
                $subject = '[AIMS] Observasi Dikembalikan - Field Leadership';
                $body = "Halo,\n\n" .
                        "Observasi Field Leadership yang Anda laporkan telah dikembalikan untuk direvisi.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Catatan Pengembalian: {$comment}\n\n" .
                        "Silakan masuk ke sistem AIMS untuk merevisi dokumen.";
                try {
                    $this->sendSimpleEmail($maker->email, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in returnMaker: ' . $e->getMessage());
                }
            }
        } elseif ($prevStatus === self::STATUS_ON_REVIEW_PJA) {
            $pjaId = $fl->pja_id_new ?: $fl->pja_id;
            $pja = DB::table('users')->where('id', $pjaId)->first();
            if ($pja && !empty($pja->email)) {
                $subject = '[AIMS] Review Dikembalikan - Observasi Field Leadership';
                $body = "Halo,\n\n" .
                        "Review observasi Field Leadership berikut dikembalikan untuk dievaluasi ulang.\n\n" .
                        "Detail Observasi:\n" .
                        "- Jenis: {$fl->type}\n" .
                        "- Tanggal: {$fl->date}\n" .
                        "- Detail Perusahaan: {$fl->detail_company}\n" .
                        "- Catatan Pengembalian: {$comment}\n\n" .
                        "Silakan masuk ke sistem AIMS untuk meninjau kembali.";
                try {
                    $this->sendSimpleEmail($pja->email, $subject, $body);
                } catch (\Throwable $e) {
                    \Log::error('Mail error in returnPja: ' . $e->getMessage());
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

    private function getCrsEmails()
    {
        return DB::table('users as u')
            ->join('aims_user_roles as ur', 'u.id', '=', 'ur.user_id')
            ->join('aims_roles as r', 'ur.role_id', '=', 'r.id')
            ->join('aims_modules as m', 'r.module_id', '=', 'm.id')
            ->where('m.slug', 'field-leadership')
            ->whereIn('r.slug', ['super_admin', 'fls_admin'])
            ->whereNotNull('u.email')
            ->pluck('u.email')
            ->toArray();
    }
}
