<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Ko\Entities\KoCommissioning;
use Modules\Ko\Entities\KoCommissioningItem;
use Modules\Ko\Entities\KoProposal;
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
            'items'          => 'nullable|array',
            'items.*.ko_commissioning_field_id' => 'required_with:items|integer|exists:ko_commissioning_fields,id',
            'items.*.condition' => 'nullable|string|max:255',
            'items.*.note'      => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $commissioning = KoCommissioning::create([
                ...collect($validated)->except('items')->toArray(),
                'created_by' => (string) auth()->id(),
            ]);
            foreach ($validated['items'] ?? [] as $item) {
                KoCommissioningItem::create([
                    'ko_commissioning_id'       => $commissioning->id,
                    'ko_commissioning_field_id' => $item['ko_commissioning_field_id'],
                    'condition'                 => $item['condition'] ?? null,
                    'note'                      => $item['note'] ?? null,
                ]);
            }
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }

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
            } else {
                $proposal->update([
                    'status' => KoStatus::CommissioningReturned->value,
                    'commissioning_reject_note' => $request->note,
                ]);
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
            } else {
                $proposal->update([
                    'status' => KoStatus::CommissioningReturned->value,
                    'commissioning_reject_note' => $request->note,
                ]);
            }
        }

        return $this->success($proposal->fresh());
    }
}
