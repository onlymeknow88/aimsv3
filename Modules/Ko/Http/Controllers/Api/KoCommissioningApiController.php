<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Ko\Entities\KoCommissioning;
use Modules\Ko\Entities\KoCommissioningField;
use Modules\Ko\Entities\KoCommissioningItem;
use Modules\Ko\Entities\KoIssueReport;
use Modules\Ko\Entities\KoProposal;
use Modules\Ko\Enums\IssueReportStatus;
use Modules\Ko\Enums\KoStatus;

/**
 * Commissioning + verifikasi (admin/koordinator).
 * Parity aims: admin verify -> CoordinatorCommissioningVerification,
 * reject -> CommissioningReturned (+note).
 */
class KoCommissioningApiController extends KoBaseApiController
{
    public function index(Request $request)
    {
        $q = KoCommissioning::with(['koProposal.koUnit.koSpipUnit'])->orderBy('created_at', 'desc');
        if ($st = $request->status) $q->where('status', $st);
        if ($pid = $request->proposal_id) $q->where('ko_proposal_id', $pid);
        // Filter status proposal induk (parity newaims In Progress/Returned/Daftar).
        if ($ps = $request->proposal_status) {
            $pStatuses = array_values(array_filter(array_map('trim', explode(',', (string) $ps))));
            $q->whereHas('koProposal', fn($qq) => count($pStatuses) > 1
                ? $qq->whereIn('status', $pStatuses)
                : $qq->where('status', $pStatuses[0] ?? $ps));
        }
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function show(string $id)
    {
        return $this->success(KoCommissioning::with([
            'koProposal.koUnit', 'koCommissioningItems.koCommissioningField',
        ])->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ko_proposal_id' => 'required|uuid|exists:ko_proposals,id',
            'date'           => 'nullable|date',
            'commissioning_completion_date' => 'nullable|date',
            'smu_odo_meter'  => 'nullable|string|max:255',
            'engine_status'  => 'nullable|string|max:255',
            'expired_date'   => 'nullable|date',
            'status'         => 'nullable|string|max:255',
            'temporary_validity_period' => 'nullable|date',
            'items'          => 'nullable|array',
            'items.*.ko_commissioning_field_id' => 'required_with:items|integer|exists:ko_commissioning_fields,id',
            'items.*.condition' => 'nullable|string|max:255',
            'items.*.note'      => 'nullable|string',
        ]);

        $proposal = KoProposal::with('koUnit.koSpipUnit.koSpipType.koSpipCategory')
            ->findOrFail($validated['ko_proposal_id']);

        // Parity newaims CreateCommissioning: komisioning hanya dari tahap pengerjaan.
        if (!in_array($proposal->status, [
            KoStatus::Commissioning->value,
            KoStatus::Issue->value,
            KoStatus::CommissioningReturned->value,
        ])) {
            return $this->error('Komisioning hanya dapat dibuat dari proposal tahap Commissioning / Issue / Commissioning Returned.', 422);
        }

        DB::beginTransaction();
        try {
            $commissioning = KoCommissioning::create([
                ...collect($validated)->except('items', 'temporary_validity_period')->toArray(),
                'created_by' => (string) auth()->id(),
            ]);

            // Parity newaims: tiap item "Gagal" otomatis menjadi IssueReport Open.
            $hasFailed = false;
            foreach ($validated['items'] ?? [] as $item) {
                KoCommissioningItem::create([
                    'ko_commissioning_id'       => $commissioning->id,
                    'ko_commissioning_field_id' => $item['ko_commissioning_field_id'],
                    'condition'                 => $item['condition'] ?? null,
                    'note'                      => $item['note'] ?? null,
                ]);

                if (mb_strtolower(trim((string) ($item['condition'] ?? ''))) === 'gagal') {
                    $field = KoCommissioningField::find($item['ko_commissioning_field_id']);
                    KoIssueReport::create([
                        'ko_proposal_id'            => $proposal->id,
                        'ko_unit_id'                => $proposal->ko_unit_id,
                        'ko_commissioning_field_id' => $item['ko_commissioning_field_id'],
                        'note'                      => $item['note'] ?? null,
                        'hazard_code'               => $field->hazard_code ?? null,
                        'status'                    => IssueReportStatus::Open->value,
                    ]);
                    $hasFailed = true;
                }
            }

            // Parity newaims: hitung next_commissioning dari interval kategori SPIP
            // + nomor periode berikutnya. commissioning_count sendiri baru
            // increment saat coordinator approve (verify), bukan di sini.
            $interval = (int) ($proposal->koUnit?->koSpipUnit?->koSpipType?->koSpipCategory?->internal_interval_year ?? 1);
            $interval = $interval > 0 ? $interval : 1;
            $proposal->update(array_filter([
                'status' => $hasFailed
                    ? KoStatus::Issue->value
                    : KoStatus::CommissionerCommissioningVerification->value,
                'next_commissioning'  => now()->addYears($interval)->toDateString(),
                'commissioning_period' => (int) ($proposal->koUnit?->commissioning_count ?? 0) + 1,
                'temporary_validity_period' => $hasFailed
                    ? ($validated['temporary_validity_period'] ?? $proposal->temporary_validity_period)
                    : $proposal->temporary_validity_period,
            ], fn($v) => $v !== null));

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }

        $fresh = $proposal->fresh()->loadMissing('pjo');
        $this->notifyPjo($fresh, $hasFailed
            ? 'Hasil komisioning: ada temuan (PICA terbuka)'
            : 'Komisioning selesai, menunggu verifikasi commissioner');

        return $this->success($commissioning->load('koCommissioningItems'), 201);
    }

    /**
     * Verifikasi commissioning. stage: admin|coordinator, action: approve|return.
     */
    public function verify(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        $request->validate([
            'stage'  => 'required|in:admin,coordinator',
            'action' => 'required|in:approve,return',
            'note'   => 'nullable|string',
        ]);

        if ($request->stage === 'admin') {
            if ($request->action === 'approve') {
                $proposal->update(['status' => KoStatus::CoordinatorCommissioningVerification->value]);
                $message = 'Komisioning lolos verifikasi commissioner dan diteruskan ke verifikasi koordinator.';
            } else {
                $proposal->update([
                    'status' => KoStatus::CommissioningReturned->value,
                    'commissioning_reject_note' => $request->note,
                ]);
                $message = 'Komisioning dikembalikan commissioner: ' . ($request->note ?: 'periksa kembali hasil pemeriksaan.');
            }
        } else {
            if ($request->action === 'approve') {
                DB::transaction(function () use ($proposal) {
                    $proposal->update(['status' => KoStatus::Completed->value]);
                    if ($proposal->ko_unit_id) {
                        \Modules\Ko\Entities\KoUnit::where('id', $proposal->ko_unit_id)
                            ->increment('commissioning_count');
                    }
                });
                $proposal->refresh();
                $message = 'Komisioning selesai (Completed). Sertifikat/QR unit telah terbit.';
            } else {
                $proposal->update([
                    'status' => KoStatus::CommissioningReturned->value,
                    'commissioning_reject_note' => $request->note,
                ]);
                $message = 'Komisioning dikembalikan koordinator: ' . ($request->note ?: 'periksa kembali hasil pemeriksaan.');
            }
        }

        $fresh = $proposal->fresh()->loadMissing('pjo');
        $this->notifyPjo($fresh, $message);
        return $this->success($fresh);
    }
}
