<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsChecklist;
use Modules\CSMS\Entities\CsmsChecklistAttachment;
use Modules\CSMS\Entities\CsmsMasterDataChecklist;

class CSMSBiddingApiController extends CSMSBaseApiController
{
    // ── INDEX ─────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $search   = $request->query('search', '');
        $page     = max(1, (int) $request->query('page', 1));
        $limit    = min(100, max(1, (int) $request->query('limit', 10)));
        $status   = $request->query('status', '');
        $criteria = $request->query('criteria', self::CRITERIA_BIDDING);

        $query = Bidding::with(['maker', 'ccow'])
            ->where('criteria', $criteria)
            ->where('is_obsolate', false);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%")
                  ->orWhere('csms_doc_number', 'like', "%{$search}%");
            });
        }

        if ($status) $query->where('status', $status);

        $query->orderBy('created_at', 'desc');

        $total    = $query->count();
        $lastPage = max(1, (int) ceil($total / $limit));
        $items    = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        return ResponseFormatter::success([
            'data'         => $items,
            'current_page' => $page,
            'last_page'    => $lastPage,
            'total'        => $total,
            'per_page'     => $limit,
        ], 'Biddings retrieved successfully');
    }

    // ── SHOW ──────────────────────────────────────────────────────────────────
    public function show(string $id)
    {
        $bidding = Bidding::with(['maker', 'ccow', 'parent', 'businessEntity'])->find($id);

        if (!$bidding) {
            return ResponseFormatter::error('Bidding not found', 404);
        }

        $checklists = CsmsChecklist::with(['attachments', 'question'])
            ->where('bidding_id', $id)
            ->orderBy('ordinal_number')
            ->get()
            ->map(function ($checklist) {
                // Map properties from the question relationship to match expected output schema
                $checklist->point              = $checklist->question?->point;
                $checklist->sub_point          = $checklist->question?->sub_point;
                $checklist->crtiteria           = $checklist->question?->crtiteria;
                $checklist->legal_base         = $checklist->question?->legal_base;
                $checklist->note               = $checklist->question?->note;
                $checklist->checklist_criteria = $checklist->question?->criteria;

                $checklist->attachments->map(function ($att) {
                    if ($att->file) {
                        $sas = GetBlobSasUri('aims-cntr', $att->file, 60);
                        $att->blob_url = is_array($sas)
                            ? ($sas['blobUriSas'] ?? $att->blob_url)
                            : ($sas ?: $att->blob_url);
                    }
                    return $att;
                });
                return $checklist;
            });

        if ($bidding->questionnaire) {
            $quest = is_string($bidding->questionnaire)
                ? json_decode($bidding->questionnaire, true)
                : $bidding->questionnaire;

            if (isset($quest['questionnaire_file']) && $quest['questionnaire_file']) {
                $sas = GetBlobSasUri('aims-cntr', $quest['questionnaire_file'], 60);
                $quest['questionnaire_file_url']  = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $quest['questionnaire_file'])
                    : ($sas ?: $quest['questionnaire_file']);
                $quest['questionnaire_file_name'] = basename($quest['questionnaire_file']);
            }
            $bidding->questionnaire = is_string($bidding->questionnaire)
                ? json_encode($quest)
                : $quest;
        }

        return ResponseFormatter::success([
            'bidding'    => $bidding,
            'checklists' => $checklists,
        ], 'Bidding retrieved successfully');
    }

    // ── STORE ─────────────────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name'       => 'required|string|max:255',
            'address'            => 'required|string|max:255',
            'company_site'       => 'required|string|max:255',
            'license_number'     => 'required|string|max:255',
            'service_criteria'   => 'required|string|max:255',
            'business_entity_id' => 'required',
            'classification'     => 'nullable|string|max:255',
            'person_in_charge'   => 'nullable|string|max:255',
            'date'               => 'nullable|date',
            'ccow_id'            => 'nullable|uuid',
            'company_id'         => 'nullable|uuid',
            'parent_id'          => 'nullable|uuid',
            'criteria'           => 'nullable|string',
            'risk_category'      => 'nullable|string',
            'csms_doc_number'    => 'nullable|string|max:255',
            'questionnaire'      => 'nullable',
            'questionnaire_file' => 'nullable|file|max:20480',
        ]);

        $criteria     = $validated['criteria'] ?? self::CRITERIA_BIDDING;
        $riskCategory = $validated['risk_category'] ?? null;

        $questionnaireArray = [];
        if (isset($validated['questionnaire'])) {
            $questionnaireArray = is_string($validated['questionnaire'])
                ? (json_decode($validated['questionnaire'], true) ?? [])
                : $validated['questionnaire'];
        }

        $id = (string) Str::uuid();

        if ($request->hasFile('questionnaire_file')) {
            $file         = $request->file('questionnaire_file');
            $originalName = $file->getClientOriginalName();
            $path         = 'csms/post-bidding/questionnaire/' . $id;
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
            $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName);
        }

        DB::beginTransaction();
        try {
            $bidding = Bidding::create([
                'id'                 => $id,
                'maker_id'           => (string) auth()->id(),
                'criteria'           => $criteria,
                'status'             => self::STATUS_DRAFT,
                'requested'          => self::STATUS_DRAFT,
                'company_name'       => $validated['company_name'],
                'address'            => $validated['address'],
                'company_site'       => $validated['company_site'],
                'license_number'     => $validated['license_number'],
                'service_criteria'   => $validated['service_criteria'],
                'business_entity_id' => $validated['business_entity_id'],
                'classification'     => $validated['classification'] ?? null,
                'person_in_charge'   => $validated['person_in_charge'] ?? null,
                'date'               => $validated['date'] ?? null,
                'ccow_id'            => $validated['ccow_id'] ?? null,
                'company_id'         => $validated['company_id'] ?? null,
                'parent_id'          => $validated['parent_id'] ?? null,
                'risk_category'      => $riskCategory,
                'csms_doc_number'    => $validated['csms_doc_number'] ?? null,
                'questionnaire'      => $questionnaireArray,
                'is_obsolate'        => false,
            ]);

            // Salin checklist dari master template
            $masterChecklistsQuery = CsmsMasterDataChecklist::where('criteria', $criteria);

            if ($criteria === 'PostBidding' && $riskCategory) {
                if ($riskCategory === 'Rendah') {
                    $masterChecklistsQuery->whereIn('ordinal_number', [1, 2, 3, 4, 8, 17, 18, 25, 27]);
                } elseif ($riskCategory === 'Menengah') {
                    $masterChecklistsQuery->whereIn('ordinal_number', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34]);
                }
            }

            $masterChecklists = $masterChecklistsQuery->orderBy('ordinal_number')->get();

            $checklistsInput = $request->input('checklists', []);
            if (is_string($checklistsInput)) {
                $checklistsInput = json_decode($checklistsInput, true) ?? [];
            }

            $checklistMap = [];
            foreach ($checklistsInput as $idx => $cl) {
                if (!empty($cl['id'])) {
                    $checklistMap[$cl['id']] = [
                        'value'      => $cl['value']   ?? null,
                        'comment'    => $cl['comment'] ?? null,
                        'file_index' => $idx,
                    ];
                }
            }

            foreach ($masterChecklists as $mc) {
                $checklistId = (string) Str::uuid();
                $userInput   = $checklistMap[$mc->id] ?? null;

                CsmsChecklist::create([
                    'id'             => $checklistId,
                    'bidding_id'     => $id,
                    'question_id'    => $mc->id,
                    'value'          => $userInput ? $userInput['value']   : null,
                    'comment'        => $userInput ? $userInput['comment'] : null,
                    'ordinal_number' => $mc->ordinal_number,
                ]);

                if ($userInput && $request->hasFile("checklists.{$userInput['file_index']}.new_files")) {
                    foreach ($request->file("checklists.{$userInput['file_index']}.new_files") as $file) {
                        $this->uploadChecklistFile($file, $checklistId);
                    }
                }
            }

            DB::commit();
            return ResponseFormatter::success(['id' => $id], 'Bidding created successfully', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menyimpan: ' . $e->getMessage(), 500);
        }
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    public function update(Request $request, string $id)
    {
        $bidding = Bidding::find($id);
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);
        if ($bidding->status !== self::STATUS_DRAFT) {
            return ResponseFormatter::error('Hanya data Draft yang dapat diedit', 422);
        }

        $validated = $request->validate([
            'company_name'       => 'sometimes|string|max:255',
            'address'            => 'sometimes|string|max:255',
            'company_site'       => 'sometimes|string|max:255',
            'license_number'     => 'sometimes|string|max:255',
            'service_criteria'   => 'sometimes|string|max:255',
            'classification'     => 'nullable|string|max:255',
            'person_in_charge'   => 'nullable|string|max:255',
            'date'               => 'nullable|date',
            'ccow_id'            => 'nullable|uuid',
            'company_id'         => 'nullable|uuid',
            'parent_id'          => 'nullable|uuid',
            'business_entity_id' => 'nullable',
            'risk_category'      => 'nullable|string',
            'csms_doc_number'    => 'nullable|string|max:255',
            'questionnaire'      => 'nullable',
            'questionnaire_file' => 'nullable|file|max:20480',
        ]);

        $questionnaireArray = [];
        if (isset($validated['questionnaire'])) {
            $questionnaireArray = is_string($validated['questionnaire'])
                ? (json_decode($validated['questionnaire'], true) ?? [])
                : $validated['questionnaire'];
        } else {
            $existing = $bidding->questionnaire;
            if ($existing) {
                $questionnaireArray = is_string($existing)
                    ? (json_decode($existing, true) ?? [])
                    : $existing;
            }
        }

        if ($request->hasFile('questionnaire_file')) {
            $file         = $request->file('questionnaire_file');
            $originalName = $file->getClientOriginalName();
            $path         = 'csms/post-bidding/questionnaire/' . $id;
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
            $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName);
        }

        unset($validated['questionnaire_file']);
        $validated['questionnaire'] = $questionnaireArray;

        $bidding->update($validated);

        $checklistsInput = $request->input('checklists', []);
        if (is_string($checklistsInput)) {
            $checklistsInput = json_decode($checklistsInput, true) ?? [];
        }

        foreach ($checklistsInput as $idx => $cl) {
            if (empty($cl['id'])) continue;
            CsmsChecklist::where('id', $cl['id'])->update([
                'value'   => $cl['value']   ?? null,
                'comment' => $cl['comment'] ?? null,
            ]);
            if ($request->hasFile("checklists.{$idx}.new_files")) {
                foreach ($request->file("checklists.{$idx}.new_files") as $file) {
                    $this->uploadChecklistFile($file, $cl['id']);
                }
            }
        }

        return ResponseFormatter::success(['id' => $id], 'Bidding updated successfully');
    }

    // ── DESTROY ───────────────────────────────────────────────────────────────
    public function destroy(string $id)
    {
        $bidding = Bidding::find($id);
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);
        if ($bidding->status !== self::STATUS_DRAFT) {
            return ResponseFormatter::error('Hanya data Draft yang dapat dihapus', 422);
        }
        $bidding->delete();
        return ResponseFormatter::success(null, 'Bidding deleted successfully');
    }

    // ── BULK DESTROY ──────────────────────────────────────────────────────────
    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return ResponseFormatter::error('Pilih data yang ingin dihapus terlebih dahulu', 422);
        }

        $draftIds = Bidding::whereIn('id', $ids)
            ->where('status', self::STATUS_DRAFT)
            ->pluck('id')
            ->toArray();

        if (empty($draftIds)) {
            return ResponseFormatter::error('Hanya data dengan status Draft yang dapat dihapus', 422);
        }

        Bidding::whereIn('id', $draftIds)->delete();

        $deleted  = count($draftIds);
        $selected = count($ids);

        if ($deleted < $selected) {
            return ResponseFormatter::success(
                ['deleted_ids' => $draftIds],
                "Berhasil menghapus {$deleted} data Draft. Data non-Draft tidak dihapus."
            );
        }

        return ResponseFormatter::success(['deleted_ids' => $draftIds], 'Semua data terpilih berhasil dihapus');
    }

    // ── APPROVED LIST (for PostBidding create form) ───────────────────────────
    public function approved()
    {
        $biddings = Bidding::where('criteria', self::CRITERIA_BIDDING)
            ->where('status', self::STATUS_APPROVED)
            ->select(['id', 'company_name', 'license_number', 'address', 'company_site',
                      'service_criteria', 'classification', 'ccow_id',
                      'business_entity_id', 'company_id', 'parent_id', 'person_in_charge', 'csms_doc_number'])
            ->get();

        return ResponseFormatter::success($biddings, 'Approved biddings fetched successfully');
    }

    // ── PROCESS APPROVAL ─────────────────────────────────────────────────────
    public function processApproval(Request $request, string $id)
    {
        $bidding = Bidding::find($id);
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);

        $action = $request->input('action'); // submit | approve | reject

        if ($action === 'submit') {
            $nextStatus    = self::STATUS_ON_REVIEW_OHS;
            $nextRequested = 'Requested OHS';
        } elseif ($action === 'approve') {
            [$nextStatus, $nextRequested] = match ($bidding->status) {
                self::STATUS_ON_REVIEW_OHS   => [self::STATUS_ON_REVIEW_DHOHS, 'Requested D/H OHS'],
                self::STATUS_ON_REVIEW_DHOHS => [self::STATUS_ON_REVIEW_KTT,   'Requested KTT'],
                self::STATUS_ON_REVIEW_KTT   => [self::STATUS_APPROVED,        'Approved'],
                default                       => [null, null],
            };
        } elseif ($action === 'reject') {
            $nextStatus    = self::STATUS_DRAFT;
            $nextRequested = 'Rejected';
        } else {
            return ResponseFormatter::error('Action tidak valid', 422);
        }

        if (!$nextStatus) {
            return ResponseFormatter::error('Status tidak valid untuk approval', 422);
        }

        $updateData = [
            'status'    => $nextStatus,
            'requested' => $nextRequested,
        ];

        if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED) {
            $updateData['approved_by'] = (string) auth()->id();
            $updateData['ktt_name']    = auth()->user()?->name;
        }

        $bidding->update($updateData);

        if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED
            && $bidding->criteria === self::CRITERIA_POST_BIDDING) {
            $this->syncToCompany($bidding);
        }

        return ResponseFormatter::success(['status' => $nextStatus], 'Approval processed successfully');
    }

    // ── RENEW (Buat Renewal dari PostBidding) ──────────────────────────────────
    public function renew(string $id)
    {
        $source = DB::table('biddings')->where('id', $id)->first();

        if (!$source) {
            return ResponseFormatter::error('Data tidak ditemukan', 404);
        }
        if ($source->criteria !== self::CRITERIA_POST_BIDDING) {
            return ResponseFormatter::error('Hanya Post Bidding yang dapat diperpanjang', 422);
        }
        if ($source->status !== self::STATUS_APPROVED) {
            return ResponseFormatter::error('Hanya Post Bidding berstatus Approved yang dapat diperpanjang', 422);
        }

        // Cek apakah sudah ada Renewal yang sedang berjalan untuk PostBidding ini
        $existingRenewal = DB::table('biddings')
            ->where('parent_id', $id)
            ->where('criteria', self::CRITERIA_RENEWAL)
            ->whereNotIn('status', [self::STATUS_APPROVED, self::STATUS_INACTIVE])
            ->first();

        if ($existingRenewal) {
            return ResponseFormatter::error('Sudah ada Renewal yang sedang diproses untuk data ini', 422);
        }

        $newId = (string) Str::uuid();

        DB::table('biddings')->insert([
            'id'                 => $newId,
            'maker_id'           => (string) auth()->id(),
            'criteria'           => self::CRITERIA_RENEWAL,
            'status'             => self::STATUS_ON_REVIEW_OHS,
            'requested'          => 'Requested OHS',
            'parent_id'          => $id,
            'company_name'       => $source->company_name,
            'address'            => $source->address,
            'company_site'       => $source->company_site,
            'license_number'     => $source->license_number,
            'service_criteria'   => $source->service_criteria,
            'classification'     => $source->classification,
            'business_entity_id' => $source->business_entity_id,
            'person_in_charge'   => $source->person_in_charge,
            'risk_category'      => $source->risk_category,
            'questionnaire'      => $source->questionnaire,
            'ccow_id'            => $source->ccow_id,
            'company_id'         => $source->company_id,
            'grand_parent_id'    => $source->grand_parent_id ?? $source->parent_id,
            'date'               => now()->toDateString(),
            'is_obsolate'        => false,
            'created_at'         => now(),
            'updated_at'         => now(),
        ]);

        // Salin checklist dari PostBidding ke Renewal
        $sourceChecklists = DB::table('csms_checklists')
            ->where('bidding_id', $id)
            ->orderBy('ordinal_number')
            ->get();

        foreach ($sourceChecklists as $cl) {
            DB::table('csms_checklists')->insert([
                'id'             => (string) Str::uuid(),
                'bidding_id'     => $newId,
                'question_id'    => $cl->question_id,
                'value'          => null,
                'comment'        => null,
                'ordinal_number' => $cl->ordinal_number,
            ]);
        }

        return ResponseFormatter::success(
            ['id' => $newId],
            'Pengajuan perpanjangan CSMS berhasil dibuat',
            201
        );
    }

    // ── PREVIEW CHECKLIST FILE ────────────────────────────────────────────────
    public function previewChecklistFile(string $id)
    {
        $file = CsmsChecklistAttachment::find($id);
        if (!$file) abort(404, 'File tidak ditemukan.');

        $filePath = $file->file;
        $fileName = basename($filePath);
        $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $mimeType = match ($ext) {
            'pdf'         => 'application/pdf',
            'png'         => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            default       => 'application/octet-stream',
        };

        $sas = GetBlobSasUri('aims-cntr', $filePath, 60);
        $url = is_array($sas)
            ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? null)
            : $sas;

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
        abort(404, 'File tidak dapat diakses.');
    }

    // ── DOWNLOAD CHECKLIST FILE ───────────────────────────────────────────────
    public function downloadChecklistFile(string $id)
    {
        $file = CsmsChecklistAttachment::find($id);
        if (!$file) abort(404, 'File tidak ditemukan.');

        $sas = GetBlobSasUri('aims-cntr', $file->file, 60);
        $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? null) : $sas;
        if ($url) return redirect($url);
        abort(404, 'File tidak ditemukan.');
    }

    // ── INITIATE RENEWAL ──────────────────────────────────────────────────────
    public function renew(string $id)
    {
        $parent = Bidding::find($id);
        if (!$parent) return ResponseFormatter::error('PostBidding not found', 404);
        if ($parent->status !== self::STATUS_APPROVED) {
            return ResponseFormatter::error('Hanya PostBidding yang Approved yang dapat diperpanjang', 422);
        }

        DB::beginTransaction();
        try {
            $newId = (string) Str::uuid();
            $renewal = $parent->replicate();
            $renewal->id = $newId;
            $renewal->criteria = self::CRITERIA_RENEWAL;
            $renewal->parent_id = $parent->id;
            $renewal->status = self::STATUS_ON_REVIEW_OHS;
            $renewal->requested = 'Requested OHS';
            $renewal->published = false;
            $renewal->is_obsolate = false;
            $renewal->created_at = now();
            $renewal->updated_at = now();
            $renewal->save();

            // Replicate checklists
            $checklists = CsmsChecklist::where('bidding_id', $parent->id)->get();
            foreach ($checklists as $cl) {
                $newCl = $cl->replicate();
                $newCl->id = (string) Str::uuid();
                $newCl->bidding_id = $newId;
                $newCl->save();

                // Replicate attachments
                $attachments = CsmsChecklistAttachment::where('checklist_id', $cl->id)->get();
                foreach ($attachments as $att) {
                    $newAtt = $att->replicate();
                    $newAtt->id = (string) Str::uuid();
                    $newAtt->checklist_id = $newCl->id;
                    $newAtt->save();
                }
            }

            DB::commit();
            return ResponseFormatter::success(['id' => $newId], 'Renewal created successfully');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal membuat perpanjangan: ' . $e->getMessage(), 500);
        }
    }

    // ── DEACTIVATE (INACTIVE) ──────────────────────────────────────────────────
    public function deactivate(string $id)
    {
        $bidding = Bidding::find($id);
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);

        DB::beginTransaction();
        try {
            $bidding->update([
                'criteria'  => 'Inactive',
                'status'    => self::STATUS_INACTIVE,
                'requested' => 'Approved',
            ]);

            DB::commit();
            return ResponseFormatter::success(null, 'Bidding deactivated successfully');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menonaktifkan bidding: ' . $e->getMessage(), 500);
        }
    }
}
