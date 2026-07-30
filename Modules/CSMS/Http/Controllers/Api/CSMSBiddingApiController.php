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
use Modules\CSMS\Entities\CsmsPica;
use Barryvdh\DomPDF\Facade\Pdf;

class CSMSBiddingApiController extends CSMSBaseApiController
{
    // ── INDEX ─────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $search   = $request->query('search', '');
        $perPage  = min(100, max(1, (int) $request->query('limit', 10)));
        $status   = $request->query('status', '');
        $criteria = $request->query('criteria', self::CRITERIA_BIDDING);

        $query = Bidding::with(['maker', 'ccow', 'parent', 'businessEntity'])
            ->where('criteria', $criteria);

        // Only exclude obsolete records when not explicitly querying for them
        if ($status !== 'Obsolete' && $status !== 'Obsolate') {
            $query->where('is_obsolate', false);
        } else {
            $query->where('is_obsolate', true);
        }

        // Permission checks
        $user = auth()->user();
        if ($criteria === self::CRITERIA_BIDDING) {
            if ($status === 'Ongoing') {
                if ($user && !$user->can('CSMS - Bidding View On Going')) {
                    $query->where('maker_id', $user->id);
                }
            } else {
                if ($user && !$user->can('CSMS - Bidding View')) {
                    $query->where('maker_id', $user->id);
                }
            }
        } elseif ($criteria === self::CRITERIA_POST_BIDDING || $criteria === self::CRITERIA_INACTIVE) {
            if ($user && !$user->can('CSMS - Postbidding View')) {
                $query->where('maker_id', $user->id);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%")
                  ->orWhere('csms_doc_number', 'like', "%{$search}%");
            });
        }

        if ($status === 'Ongoing' || $status === 'On Going') {
            $query->whereIn('status', [self::STATUS_ON_REVIEW_OHS, self::STATUS_ON_REVIEW_DHOHS, self::STATUS_ON_REVIEW_KTT])
                  ->where('published', 'Publish');
        } elseif ($status === 'Active' || $status === 'Approved') {
            $query->where('status', self::STATUS_APPROVED)
                  ->where('requested', self::STATUS_APPROVED)
                  ->where('published', 'Publish');
        } elseif ($status === 'Draft') {
            $query->where('status', self::STATUS_DRAFT)
                  ->where('requested', self::STATUS_DRAFT)
                  ->where('published', 'Draft');
        } elseif ($status) {
            $query->where('status', $status);
        }

        $query->orderBy('created_at', 'desc');

        $paginated = $query->paginate($perPage);

        return ResponseFormatter::success([
            'data'         => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
            'total'        => $paginated->total(),
            'per_page'     => $paginated->perPage(),
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
                $checklist->crtiteria          = $checklist->question?->crtiteria;
                $checklist->legal_base         = $checklist->question?->legal_base;
                $checklist->note               = $checklist->question?->note;
                $checklist->checklist_criteria = $checklist->question?->criteria;

                // Do NOT generate SAS URIs here — that would require one Azure HTTP call
                // per attachment, making the page load slow. The frontend falls back to
                // /api/csms/checklist-attachments/{id}/preview|download on demand.

                // Unload question relation to keep response clean
                $checklist->unsetRelation('question');

                return $checklist;
            });

        if ($bidding->questionnaire) {
            $quest = is_string($bidding->questionnaire)
                ? json_decode($bidding->questionnaire, true)
                : $bidding->questionnaire;

            // Expose the file path and name only — SAS URI is generated on demand
            // via /export-questionnaire when the user actually requests the file.
            if (isset($quest['questionnaire_file']) && $quest['questionnaire_file']) {
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

        $csmsDocNumber = $validated['csms_doc_number'] ?? null;
        if ($criteria === self::CRITERIA_POST_BIDDING && !$csmsDocNumber) {
            $count_bidding = Bidding::count();
            $ccow = \App\Models\Company::find($validated['ccow_id'] ?? null);
            $ccowDocCode = $ccow ? ($ccow->document_code ?? '') : '';
            $companyNickname = strtoupper($questionnaireArray['company_nickname'] ?? '');
            $docDate = !empty($validated['date']) ? \Carbon\Carbon::parse($validated['date']) : now();
            $csmsDocNumber = sprintf("%04d", ($count_bidding + 1)) . '-CSMS-' . $ccowDocCode . '-' . $companyNickname . '-' . $docDate->format('m/y');
        }

        DB::beginTransaction();
        try {
            $bidding = new Bidding([
                'maker_id'           => (string) auth()->id(),
                'criteria'           => $criteria,
                'status'             => self::STATUS_DRAFT,
                'requested'          => self::STATUS_DRAFT,
                'published'          => 'Draft',
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
                'csms_doc_number'    => $csmsDocNumber,
                'questionnaire'      => $questionnaireArray,
                'is_obsolate'        => false,
            ]);
            $bidding->id = $id;
            $bidding->save();

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

                $checklist = new CsmsChecklist([
                    'bidding_id'     => $id,
                    'question_id'    => $mc->id,
                    'value'          => $userInput ? $userInput['value']   : null,
                    'comment'        => $userInput ? $userInput['comment'] : null,
                    'point'          => $mc->point ?? null,
                    'ordinal_number' => $mc->ordinal_number,
                ]);
                $checklist->id = $checklistId;
                $checklist->save();

                $files = $userInput ? $request->file("checklists.{$userInput['file_index']}.new_files") : null;
                if ($files) {
                    $filesArray = is_array($files) ? $files : [$files];
                    foreach ($filesArray as $file) {
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
            $files = $request->file("checklists.{$idx}.new_files");
            if ($files) {
                $filesArray = is_array($files) ? $files : [$files];
                foreach ($filesArray as $file) {
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

        if ($action === 'submit') {
            $updateData['published'] = 'Publish';
        } elseif ($action === 'reject') {
            $updateData['published'] = 'Draft';
        }

        if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED) {
            $updateData['approved_by'] = (string) auth()->id();
            $updateData['ktt_name']    = auth()->user()?->name;
        }

        DB::beginTransaction();
        try {
            $bidding->update($updateData);

            // Ketika Renewal di-approve final (KTT approve), nonaktifkan parent PostBidding
            if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED
                && $bidding->criteria === self::CRITERIA_RENEWAL) {
                $parent = Bidding::find($bidding->parent_id);
                if ($parent) {
                    $parent->update([
                        'status'      => self::STATUS_INACTIVE,
                        'requested'   => self::STATUS_APPROVED,
                        'revision'    => ($parent->revision ?? 0) + 1,
                        'is_obsolate' => true,
                    ]);
                }
            }

            // Sync ke company saat PostBidding di-approve final
            if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED
                && $bidding->criteria === self::CRITERIA_POST_BIDDING) {
                $this->syncToCompany($bidding);
            }

            // Auto-create PICA records saat KTT approve PostBidding atau Renewal
            // dan ada checklist bernilai Tidak/N/A
            if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED
                && in_array($bidding->criteria, [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL])) {

                $problematicChecklists = CsmsChecklist::with('question')
                    ->where('bidding_id', $bidding->id)
                    ->whereIn('value', ['Tidak', 'N/A'])
                    ->get();

                foreach ($problematicChecklists as $checklist) {
                    // Hindari duplikat jika approval di-retry
                    $exists = CsmsPica::where('bidding_id', $bidding->id)
                        ->where('checklist_id', $checklist->id)
                        ->exists();

                    if (!$exists) {
                        // crtiteria bisa kosong di row, fallback ke question relation
                        $description = $checklist->crtiteria
                            ?? $checklist->question?->crtiteria
                            ?? $checklist->point
                            ?? $checklist->question?->point
                            ?? 'Temuan checklist';

                        CsmsPica::create([
                            'bidding_id'   => $bidding->id,
                            'checklist_id' => $checklist->id,
                            'description'  => $description,
                            'status'       => self::STATUS_OPEN,
                            'pic'          => null,
                            'due_date'     => now()->addDays(30)->toDateString(),
                        ]);
                    }
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal memproses approval: ' . $e->getMessage(), 500);
        }

        return ResponseFormatter::success(['status' => $nextStatus], 'Approval processed successfully');
    }

    // ── RENEW (Buat Renewal dari PostBidding) ──────────────────────────────────
    public function renew(string $id)
    {
        $parent = Bidding::find($id);

        if (!$parent) {
            return ResponseFormatter::error('Data tidak ditemukan', 404);
        }
        if ($parent->criteria !== self::CRITERIA_POST_BIDDING) {
            return ResponseFormatter::error('Hanya Post Bidding yang dapat diperpanjang', 422);
        }
        if ($parent->status !== self::STATUS_APPROVED) {
            return ResponseFormatter::error('Hanya Post Bidding berstatus Approved yang dapat diperpanjang', 422);
        }

        // Cek apakah sudah ada Renewal yang sedang berjalan untuk PostBidding ini
        $existingRenewal = Bidding::where('parent_id', $id)
            ->where('criteria', self::CRITERIA_RENEWAL)
            ->whereNotIn('status', [self::STATUS_APPROVED, self::STATUS_INACTIVE])
            ->first();

        if ($existingRenewal) {
            return ResponseFormatter::error('Sudah ada Renewal yang sedang diproses untuk data ini', 422);
        }

        DB::beginTransaction();
        try {
            $newId   = (string) Str::uuid();
            $renewal = $parent->replicate();
            $renewal->id            = $newId;
            $renewal->maker_id      = (string) auth()->id();
            $renewal->criteria      = self::CRITERIA_RENEWAL;
            $renewal->parent_id     = $parent->id;
            $renewal->grand_parent_id = $parent->grand_parent_id ?? $parent->parent_id;
            $renewal->status        = self::STATUS_DRAFT;
            $renewal->requested     = self::STATUS_DRAFT;
            $renewal->published     = 'Draft';
            $renewal->is_obsolate   = false;
            $renewal->date          = now()->toDateString();
            $renewal->created_at    = now();
            $renewal->updated_at    = now();
            $renewal->save();

            // Salin checklist dari PostBidding ke Renewal (reset value & comment)
            $checklists = CsmsChecklist::where('bidding_id', $parent->id)
                ->orderBy('ordinal_number')
                ->get();

            foreach ($checklists as $cl) {
                $newCl             = $cl->replicate();
                $newCl->id         = (string) Str::uuid();
                $newCl->bidding_id = $newId;
                $newCl->value      = null;
                $newCl->comment    = null;
                $newCl->save();
            }

            DB::commit();
            return ResponseFormatter::success(
                ['id' => $newId],
                'Pengajuan perpanjangan CSMS berhasil dibuat',
                201
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal membuat perpanjangan: ' . $e->getMessage(), 500);
        }
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

    // ── SYNC COMPANY (Manual trigger from PostBidding detail) ─────────────────
    public function syncCompany(string $id)
    {
        $bidding = Bidding::find($id);

        if (!$bidding) {
            return ResponseFormatter::error('Data tidak ditemukan', 404);
        }
        if ($bidding->criteria !== self::CRITERIA_POST_BIDDING) {
            return ResponseFormatter::error('Hanya PostBidding yang dapat disinkronkan', 422);
        }
        if ($bidding->status !== self::STATUS_APPROVED || $bidding->requested !== self::STATUS_APPROVED) {
            return ResponseFormatter::error('PostBidding harus sudah Approved untuk disinkronkan', 422);
        }

        try {
            $this->syncToCompany($bidding);
            return ResponseFormatter::success(null, 'Sinkronisasi ke backoffice berhasil');
        } catch (\Throwable $e) {
            return ResponseFormatter::error('Gagal sinkronisasi: ' . $e->getMessage(), 500);
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

    // ── OBSOLETE ───────────────────────────────────────────────────────────────
    public function obsolete(string $id)
    {
        $bidding = Bidding::find($id);
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);

        if (!in_array($bidding->criteria, [self::CRITERIA_POST_BIDDING, self::CRITERIA_RENEWAL, self::CRITERIA_BIDDING])) {
            return ResponseFormatter::error('Data ini tidak dapat di-obsolete', 422);
        }

        DB::beginTransaction();
        try {
            $bidding->update([
                'is_obsolate' => true,
                'status'      => self::STATUS_OBSOLETE,
            ]);

            DB::commit();
            return ResponseFormatter::success(null, 'Bidding berhasil di-obsolete');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal obsolete bidding: ' . $e->getMessage(), 500);
        }
    }

    // ── STORE POST BIDDING ─────────────────────────────────────────────────────
    public function storePostBidding(Request $request)
    {
        $validated = $request->validate([
            'bidding_id'     => 'required|uuid',
            'classification' => 'required|string',
            'risk_category'  => 'required|in:Rendah,Menengah,Tinggi',
            'questionnaire'  => 'required',
            // 'questionnaire_file' => 'nullable|file|max:20480',
            'published'      => 'required|in:Draft,Publish',
            'status'         => 'required|in:Draft,On Review OHS',
        ]);

        DB::beginTransaction();
        try {
            // 1. Find parent bidding
            $parentBidding = Bidding::find($validated['bidding_id']);
            if (!$parentBidding) {
                return ResponseFormatter::error('Bidding not found', 404);
            }

            // 2. Replicate parent bidding
            $postBidding = $parentBidding->replicate();
            $postBidding->id = (string) Str::uuid();
            $postBidding->parent_id = $parentBidding->id;
            $postBidding->criteria = self::CRITERIA_POST_BIDDING;
            $postBidding->classification = $validated['classification'];
            $postBidding->risk_category = $validated['risk_category'];

            // 3. Set status fields
            $published = $validated['published'];
            $status = $validated['status'];
            $postBidding->published = $published;
            $postBidding->status = $status;
            $postBidding->requested = ($published === 'Draft')
                ? self::STATUS_DRAFT
                : 'Requested OHS';

            // 4. Handle questionnaire
            $questionnaireArray = is_string($validated['questionnaire'])
                ? (json_decode($validated['questionnaire'], true) ?? [])
                : $validated['questionnaire'];

            // if ($request->hasFile('questionnaire_file')) {
            //     $file = $request->file('questionnaire_file');
            //     $originalName = $file->getClientOriginalName();
            //     $path = 'csms/post-bidding/questionnaire/' . $postBidding->id;
            //     $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
            //     $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName']
            //         ?? ($path . '/' . $originalName);
            // }
            $postBidding->questionnaire = json_encode($questionnaireArray);

            // 5. Generate document number
            $count = Bidding::count();
            $ccow = \App\Models\Company::find($postBidding->ccow_id);
            $docCode = $ccow ? ($ccow->document_code ?? '') : '';
            $nickname = strtoupper($questionnaireArray['company_nickname'] ?? '');
            $docDate = \Carbon\Carbon::parse($postBidding->date);
            $postBidding->csms_doc_number = sprintf(
                "%04d-CSMS-%s-%s-%s",
                $count + 1,
                $docCode,
                $nickname,
                $docDate->format('m/y')
            );

            $postBidding->save();

            // 6. Create checklists based on risk category
            $masterChecklistsQuery = CsmsMasterDataChecklist::where('point', 'POST KUALIFIKASI');

            if ($validated['risk_category'] === 'Rendah') {
                $masterChecklistsQuery->whereIn('ordinal_number', [1, 2, 3, 4, 8, 17, 18, 25, 27]);
            } elseif ($validated['risk_category'] === 'Menengah') {
                $masterChecklistsQuery->whereIn('ordinal_number', [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    19, 20, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34
                ]);
            }
            // else Tinggi: get all

            $masterChecklists = $masterChecklistsQuery->orderBy('ordinal_number')->get();

            // 7. Map checklist inputs
            $checklistsInput = $request->input('checklists', []);
            if (is_string($checklistsInput)) {
                $checklistsInput = json_decode($checklistsInput, true) ?? [];
            }

            $checklistMap = [];
            foreach ($checklistsInput as $idx => $cl) {
                if (!empty($cl['question_id'])) {
                    $checklistMap[$cl['question_id']] = [
                        'value'      => $cl['value'] ?? null,
                        'comment'    => $cl['comment'] ?? null,
                        'file_index' => $idx,
                    ];
                }
            }

            // 8. Create checklists with full data
            foreach ($masterChecklists as $mc) {
                $checklistId = (string) Str::uuid();
                $userInput = $checklistMap[$mc->id] ?? null;

                $checklist = new CsmsChecklist([
                    'bidding_id'     => $postBidding->id,
                    'question_id'    => $mc->id,
                    'value'          => $userInput ? $userInput['value'] : null,
                    'comment'        => $userInput ? $userInput['comment'] : null,
                    'point'          => $mc->point,
                    'sub_point'      => $mc->sub_point,
                    'crtiteria'      => $mc->crtiteria,
                    'legal_base'     => $mc->legal_base,
                    'note'           => $mc->note,
                    'ordinal_number' => $mc->ordinal_number,
                ]);
                $checklist->id = $checklistId;
                $checklist->save();

                // 9. Upload checklist attachments to correct path
                $files = $userInput ? $request->file("checklists.{$userInput['file_index']}.new_files") : null;
                if ($files) {
                    $filesArray = is_array($files) ? $files : [$files];
                    foreach ($filesArray as $file) {
                        $this->uploadChecklistFilePostBidding($file, $checklistId, $postBidding->id);
                    }
                }
            }

            DB::commit();
            return ResponseFormatter::success([
                'id' => $postBidding->id
            ], 'Post Bidding created successfully', 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menyimpan: ' . $e->getMessage(), 500);
        }
    }

    // ── EXPORT QUESTIONNAIRE ───────────────────────────────────────────────────
    public function exportQuestionnaire(string $id)
    {
        try {
            $bidding = Bidding::with(['ccow', 'parent', 'businessEntity'])->find($id);
            if (!$bidding) {
                return ResponseFormatter::error('Bidding not found', 404);
            }

            $questionnaire = is_string($bidding->questionnaire)
                ? json_decode($bidding->questionnaire, true)
                : $bidding->questionnaire;

            if (!$questionnaire) {
                return ResponseFormatter::error('Questionnaire data not found', 404);
            }

            // Prepare data for PDF
            $count = Bidding::count();
            $date = \Carbon\Carbon::parse($bidding->date);

            $data = [
                'document_rev'     => '1.0',
                'document_date'    => $date->format('d F Y'),
                'date'             => $date->format('d F Y'),
                'criteria'         => $bidding->criteria,
                'ccow'             => $bidding->ccow->company_name ?? '-',
                'company_name'     => $bidding->company_name,
                'company_parent'   => $bidding->parent->company_name ?? '-',
                'business_entity'  => $bidding->businessEntity->name ?? '-',
                'address'          => $bidding->address,
                'license_number'   => $bidding->license_number,
                'service_criteria' => $bidding->service_criteria,
                'document_number'  => $bidding->csms_doc_number,
            ];

            $data = array_merge($data, $questionnaire);

            $pdf = Pdf::loadView('csms::pdf.questionnaire', $data);
            $fileName = 'Questionnaire-' . $bidding->company_name . '-' . $date->format('Y-m-d') . '.pdf';

            return $pdf->download($fileName);
        } catch (\Throwable $e) {
            return ResponseFormatter::error('Gagal export questionnaire: ' . $e->getMessage(), 500);
        }
    }

    // ── GENERATE CERTIFICATE ───────────────────────────────────────────────────
    public function generateCertificate(string $id)
    {
        try {
            $now = \Carbon\Carbon::now();

            // Get count for sequential number (reset yearly)
            $count = Bidding::whereIn('criteria', ['PostBidding', 'Renewal', 'Inactive'])
                ->whereIn('status', ['Approved'])
                ->whereIn('requested', ['Approved'])
                ->where('published', 'Publish')
                ->whereYear('created_at', $now->year)
                ->count();

            // Find bidding with relationships
            $bidding = Bidding::with(['ccow', 'businessEntity', 'pjo'])->find($id);

            if (!$bidding) {
                return ResponseFormatter::error('Bidding not found', 404);
            }

            // Validate status - only Approved PostBidding can generate certificate
            if ($bidding->criteria !== 'PostBidding' ||
                $bidding->status !== 'Approved' ||
                $bidding->requested !== 'Approved' ||
                $bidding->published !== 'Publish') {
                return ResponseFormatter::error('Certificate hanya dapat digenerate untuk PostBidding yang sudah Approved', 422);
            }

            // Generate document number
            $docCode = $bidding->ccow->document_code ?? 'XXX';
            $docNumber = sprintf(
                'F-%s-IMS-%s-%03d',
                $docCode,
                $now->format('y'),
                $count + 1
            );

            // Generate QR Code using bacon/bacon-qr-code
            $qrText = sprintf(
                "APLIKASI ALAMTRI INTEGRATED MANAGEMENT SYSTEM (AIMS)\n\n\n" .
                "menyatakan bahwa:\n\n" .
                "Pemenuhan CSMS %s, adalah CCOW dari PT %s dinyatakan benar dan tercatat di sistem kami.",
                $bidding->company_name,
                $bidding->ccow->company_name ?? ''
            );

            $renderer = new \BaconQrCode\Renderer\ImageRenderer(
                new \BaconQrCode\Renderer\RendererStyle\RendererStyle(70),
                new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
            );
            $writer = new \BaconQrCode\Writer($renderer);
            $qrCodeSvg = $writer->writeString($qrText);
            $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);

            // Extract questionnaire fields (stored as JSON)
            $q = is_array($bidding->questionnaire)
                ? $bidding->questionnaire
                : (json_decode($bidding->questionnaire ?? '{}', true) ?? []);

            $pjo = $bidding->pjo;

            // Build PJO phone+email string
            $pjoPhoneEmail = implode(' / ', array_filter([
                $pjo->phone ?? null,
                $pjo->email ?? null,
            ])) ?: '-';

            // Build company phone+email from questionnaire equipped contact
            $companyPhoneEmail = implode(' / ', array_filter([
                $q['equipped_telephone'] ?? null,
                $q['equipped_email'] ?? null,
            ])) ?: '-';

            // Contract period from questionnaire
            $contractStart = !empty($q['date_contract_period_start'])
                ? \Carbon\Carbon::parse($q['date_contract_period_start'])->format('d-m-Y')
                : '-';
            $contractEnd = !empty($q['date_contract_period_end'])
                ? \Carbon\Carbon::parse($q['date_contract_period_end'])->format('d-m-Y')
                : '-';

            // Prepare certificate data — mapped for certificate_new.blade.php
            $data = [
                // ── Header ──────────────────────────────────────────────────
                'document_number'   => $docNumber,
                'document_date'     => $now->format('d F Y'),
                'document_date_end' => $now->copy()->addYears(3)->format('d F Y'),

                // ── Konsideran ───────────────────────────────────────────────
                'company_name'              => $bidding->company_name,
                'application_letter_number' => $bidding->csms_doc_number ?? '-',
                'application_letter_date'   => $bidding->date?->format('d F Y') ?? '-',
                'procedure_number'          => 'MAC-IMS-08',

                // ── 1. Profil Perusahaan ─────────────────────────────────────
                'company_address'     => $bidding->address ?? '-',
                'company_phone_email' => $companyPhoneEmail,

                // ── 2. Profil PJO ────────────────────────────────────────────
                'pjo_name'        => $pjo->name ?? '-',
                'pjo_competence'  => $pjo->competence ?? ($q['equipped_position'] ?? '-'),
                'pjo_cert_number' => $pjo->cert_number ?? ($pjo->number_pjo ?? '-'),
                'pjo_cert_expiry' => !empty($pjo->cert_expiry)
                    ? \Carbon\Carbon::parse($pjo->cert_expiry)->format('d F Y')
                    : ($pjo?->date_approved?->format('d F Y') ?? '-'),
                'pjo_phone_email' => $pjoPhoneEmail,

                // ── 3. Bidang Usaha ──────────────────────────────────────────
                'nib_number'         => $q['nib_number'] ?? ($bidding->license_number ?? '-'),
                'iujp_number'        => $q['iujp_number'] ?? '-',
                'license_start_date' => !empty($q['license_start_date'])
                    ? \Carbon\Carbon::parse($q['license_start_date'])->format('d-m-Y')
                    : $contractStart,
                'license_end_date'   => !empty($q['license_end_date'])
                    ? \Carbon\Carbon::parse($q['license_end_date'])->format('d-m-Y')
                    : $contractEnd,
                'business_fields'    => !empty($q['business_fields']) ? $q['business_fields'] : [
                    [
                        'kbli'        => $q['kbli_code'] ?? '-',
                        'jenis_usaha' => $q['business_type'] ?? ($bidding->businessEntity->name ?? '-'),
                        'bidang_usaha'=> $q['scope_of_business'] ?? ($bidding->service_criteria ?? '-'),
                        'sub_bidang'  => '-',
                        'risiko'      => $bidding->risk_category ?? '-',
                    ],
                ],

                // ── 4. Kegiatan Mitra Kerja ──────────────────────────────────
                'company_category'        => $bidding->classification ?? 'Kontraktor Utama',
                'contract_level'          => 'PJP Tingkat 1',
                'owner_dept'              => 'Mining Engineering Dept',
                'contractor_name'         => $bidding->company_name,
                'sub_contractor'          => '-',
                'sub_sub_contractor'      => '-',
                'sub_sub_sub_contractor'  => '-',
                'owner_contract_info'     => $contractStart . ' – ' . $contractEnd,
                'activities_list'         => $q['activities_list'] ?? ($q['scope_of_business'] ?? ($bidding->service_criteria ?? '-')),
                'validity_period'         => '3 (tiga) tahun',

                // ── Tanda Tangan ─────────────────────────────────────────────
                'issuing_company' => $bidding->ccow->company_name ?? 'PT MARUWAI COAL',
                'ktt_name'        => $bidding->ktt_name ?? 'M. Safrudin Sulaiman',
                'ktt_position'    => 'Kepala Teknik Tambang',
                'qrcode'          => $qrCodeBase64,
            ];

            // Generate PDF
            ini_set('memory_limit', '1024M');

            $pdf = Pdf::loadView('csms::pdf.certificate_new', ['data' => $data])
                ->setPaper('A4', 'portrait')
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isRemoteEnabled', false)
                ->setOption('chunkSize', 2048);

            $filename = sprintf(
                'Sertifikat-CSMS-%s-%s.pdf',
                str_replace(' ', '-', $bidding->company_name),
                $now->format('Y-m-d')
            );

            return $pdf->stream($filename);

        } catch (\Throwable $e) {
            \Log::error('CSMS Certificate generation failed', [
                'bidding_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return ResponseFormatter::error('Gagal generate certificate: ' . $e->getMessage(), 500);
        }
    }

    // ── UPDATE RENEWAL ─────────────────────────────────────────────────────────
    public function updateRenewal(Request $request, string $id)
    {
        $validated = $request->validate([
            'questionnaire'      => 'required',
            'questionnaire_file' => 'nullable|file|max:20480',
            'published'          => 'required|in:Draft,Publish',
            'status'             => 'required|in:Draft,On Review OHS',
        ]);

        DB::beginTransaction();
        try {
            $renewal = Bidding::find($id);
            if (!$renewal) {
                return ResponseFormatter::error('Renewal not found', 404);
            }
            if ($renewal->criteria !== self::CRITERIA_RENEWAL) {
                return ResponseFormatter::error('Bukan data Renewal', 422);
            }

            // Parse questionnaire
            $questionnaireArray = is_string($validated['questionnaire'])
                ? (json_decode($validated['questionnaire'], true) ?? [])
                : $validated['questionnaire'];

            // Handle questionnaire file upload
            if ($request->hasFile('questionnaire_file')) {
                $file = $request->file('questionnaire_file');
                $originalName = $file->getClientOriginalName();
                $path = 'csms/renewal/questionnaire/' . $renewal->id;
                $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
                $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName']
                    ?? ($path . '/' . $originalName);
            }

            // Set status
            $published = $validated['published'];
            $status    = $validated['status'];
            $renewal->published = $published;
            $renewal->status    = $status;
            $renewal->requested = ($published === 'Draft') ? self::STATUS_DRAFT : 'Requested OHS';
            $renewal->questionnaire = json_encode($questionnaireArray);
            $renewal->save();

            // Handle checklists
            $checklistsInput = $request->input('checklists', []);
            if (is_string($checklistsInput)) {
                $checklistsInput = json_decode($checklistsInput, true) ?? [];
            }

            foreach ($checklistsInput as $idx => $cl) {
                if (empty($cl['checklist_id'])) continue;

                $checklist = CsmsChecklist::find($cl['checklist_id']);
                if (!$checklist || $checklist->bidding_id !== $renewal->id) continue;

                $checklist->value   = $cl['value'] ?? null;
                $checklist->comment = $cl['comment'] ?? null;
                $checklist->save();

                // Upload new files
                $files = $request->file("checklists.{$idx}.new_files");
                if ($files) {
                    $filesArray = is_array($files) ? $files : [$files];
                    foreach ($filesArray as $file) {
                        $this->uploadChecklistFilePostBidding($file, $checklist->id, $renewal->id);
                    }
                }
            }

            DB::commit();
            return ResponseFormatter::success(
                ['id' => $renewal->id],
                'Renewal berhasil disimpan'
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menyimpan renewal: ' . $e->getMessage(), 500);
        }
    }
}
