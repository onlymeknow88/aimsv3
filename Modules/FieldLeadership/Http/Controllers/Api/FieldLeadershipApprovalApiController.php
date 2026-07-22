<?php

namespace Modules\FieldLeadership\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FieldLeadershipApprovalApiController extends Controller
{
    /**
     * Alur status approval:
     *
     * Open → (submit) → On Review PICA
     * On Review PICA → (approve) → On Review PJA
     * On Review PJA  → (approve) → On Review Approval
     * On Review Approval → (approve) → Closed
     *
     * Dari status apapun → (return) → kembali ke status sebelumnya / Open
     */
    private const NEXT_STATUS = [
        'Open'                => 'On Review PICA',
        'On Review PICA'      => 'On Review PJA',
        'On Review PJA'       => 'On Review Approval',
        'On Review Approval'  => 'Closed',
    ];

    private const PREV_STATUS = [
        'On Review PICA'      => 'Open',
        'On Review PJA'       => 'On Review PICA',
        'On Review Approval'  => 'On Review PJA',
        'Closed'              => 'On Review Approval',
    ];

    // ── Submit (Open → On Review PICA) ────────────────────────────────────────
    /**
     * POST /api/field-leadership/observations/{id}/submit
     */
    public function submit(string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();

        if (! $fl) {
            return ResponseFormatter::error(null, 'Observation not found', 404);
        }

        if ($fl->status !== 'Open') {
            return ResponseFormatter::error(
                null,
                "Dokumen harus berstatus 'Open' untuk dapat disubmit. Status saat ini: {$fl->status}",
                422
            );
        }

        DB::table('field_leaderships')->where('id', $id)->update([
            'status'     => 'On Review PICA',
            'requested'  => now(),
            'updated_at' => now(),
        ]);

        $this->logActivity($id, 'Dokumen disubmit untuk review PICA');

        return ResponseFormatter::success(
            ['id' => $id, 'status' => 'On Review PICA'],
            'Dokumen berhasil disubmit'
        );
    }

    // ── Approve (advance to next status) ─────────────────────────────────────
    /**
     * POST /api/field-leadership/observations/{id}/approve
     */
    public function approve(string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();

        if (! $fl) {
            return ResponseFormatter::error(null, 'Observation not found', 404);
        }

        $nextStatus = self::NEXT_STATUS[$fl->status] ?? null;

        if (! $nextStatus) {
            return ResponseFormatter::error(
                null,
                "Status '{$fl->status}' tidak dapat di-approve lebih lanjut.",
                422
            );
        }

        $updateData = [
            'status'     => $nextStatus,
            'updated_at' => now(),
        ];

        DB::table('field_leaderships')->where('id', $id)->update($updateData);

        // Jika semua risk conditions sudah closed, tandai semua saat observation ditutup
        if ($nextStatus === 'Closed') {
            DB::table('field_leadership_risks')
                ->where('fl_id', $id)
                ->whereNull('status')
                ->orWhere(function ($q) use ($id) {
                    $q->where('fl_id', $id)->where('status', '!=', 'Closed');
                })
                ->update(['status' => 'Closed', 'updated_at' => now()]);
        }

        $activityDesc = match ($nextStatus) {
            'On Review PICA'     => 'Disetujui — menunggu review PICA',
            'On Review PJA'      => 'Review PICA selesai — diteruskan ke PJA',
            'On Review Approval' => 'Review PJA selesai — menunggu approval akhir',
            'Closed'             => 'Disetujui oleh approver — Observation ditutup (Case Closed)',
            default              => "Status diubah ke {$nextStatus}",
        };

        $this->logActivity($id, $activityDesc);

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $nextStatus],
            "Berhasil disetujui. Status sekarang: {$nextStatus}"
        );
    }

    // ── Return with Comment (rollback to previous status) ────────────────────
    /**
     * POST /api/field-leadership/observations/{id}/return
     * Body: { comment: string }
     */
    public function returnWithComment(Request $request, string $id)
    {
        $fl = DB::table('field_leaderships')->where('id', $id)->first();

        if (! $fl) {
            return ResponseFormatter::error(null, 'Observation not found', 404);
        }

        $prevStatus = self::PREV_STATUS[$fl->status] ?? null;

        if (! $prevStatus) {
            return ResponseFormatter::error(
                null,
                "Status '{$fl->status}' tidak dapat dikembalikan.",
                422
            );
        }

        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        DB::table('field_leaderships')->where('id', $id)->update([
            'status'     => $prevStatus,
            'updated_at' => now(),
        ]);

        $comment = $request->input('comment');
        $this->logActivity($id, "Dokumen dikembalikan dari '{$fl->status}' ke '{$prevStatus}'. Catatan: {$comment}");

        return ResponseFormatter::success(
            ['id' => $id, 'status' => $prevStatus],
            "Dokumen dikembalikan. Status sekarang: {$prevStatus}"
        );
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