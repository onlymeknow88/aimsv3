<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CSMSApiController extends Controller
{
    const STATUS_DRAFT           = 'Draft';
    const STATUS_ON_REVIEW_OHS   = 'On Review OHS';
    const STATUS_ON_REVIEW_DHOHS = 'On Review D/H OHS';
    const STATUS_ON_REVIEW_KTT   = 'On Review KTT';
    const STATUS_APPROVED        = 'Approved';
    const STATUS_INACTIVE        = 'Inactive';
    const STATUS_OBSOLETE        = 'Obsolete';

    const CRITERIA_BIDDING      = 'Bidding';
    const CRITERIA_POST_BIDDING = 'PostBidding';
    const CRITERIA_RENEWAL      = 'Renewal';
    const CRITERIA_INACTIVE     = 'Inactive';

    // ── INDEX BIDDINGS ────────────────────────────────────────────────────────
    public function indexBiddings(Request $request)
    {
        $search   = $request->query('search', '');
        $page     = max(1, (int) $request->query('page', 1));
        $limit    = min(100, max(1, (int) $request->query('limit', 10)));
        $status   = $request->query('status', '');
        $criteria = $request->query('criteria', self::CRITERIA_BIDDING);

        $query = DB::table('biddings as b')
            ->leftJoin('users as u', 'b.maker_id', '=', 'u.id')
            ->leftJoin('companies as ccow', 'b.ccow_id', '=', 'ccow.id')
            ->select([
                'b.id', 'b.criteria', 'b.status', 'b.requested',
                'b.company_name', 'b.license_number', 'b.service_criteria',
                'b.classification', 'b.risk_category', 'b.csms_doc_number',
                'b.date', 'b.is_obsolate', 'b.created_at', 'b.updated_at',
                DB::raw('COALESCE(u.name, "-") as maker_name'),
                'ccow.company_name as ccow_name',
            ])
            ->where('b.criteria', $criteria)
            ->where('b.is_obsolate', false);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('b.company_name', 'like', "%{$search}%")
                  ->orWhere('b.license_number', 'like', "%{$search}%")
                  ->orWhere('b.csms_doc_number', 'like', "%{$search}%");
            });
        }

        if ($status) $query->where('b.status', $status);

        $query->orderBy('b.created_at', 'desc');

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

    // ── SHOW BIDDING ──────────────────────────────────────────────────────────
    public function showBidding(string $id)
    {
        $bidding = DB::table('biddings as b')
            ->leftJoin('users as u', 'b.maker_id', '=', 'u.id')
            ->leftJoin('companies as ccow', 'b.ccow_id', '=', 'ccow.id')
            ->leftJoin('companies as parent', 'b.parent_id', '=', 'parent.id')
            ->leftJoin('business_entities as be', 'b.business_entity_id', '=', 'be.id')
            ->where('b.id', $id)
            ->select([
                'b.*',
                DB::raw('COALESCE(u.name, "-") as maker_name'),
                'ccow.company_name as ccow_name',
                'parent.company_name as parent_name',
                'be.name as business_entity_name'
            ])
            ->first();

        if (!$bidding) {
            return ResponseFormatter::error('Bidding not found', 404);
        }

        $checklists = DB::table('csms_checklists as c')
            ->leftJoin('csms_master_data_checklists as m', 'c.question_id', '=', 'm.id')
            ->where('c.bidding_id', $id)
            ->orderBy('c.ordinal_number')
            ->select(['c.*', 'm.point', 'm.sub_point', 'm.crtiteria', 'm.legal_base', 'm.note', 'm.criteria as checklist_criteria'])
            ->get();

        $checklists = $checklists->map(function ($checklist) {
            $attachments = DB::table('csms_checklist_attachments')
                ->where('checklist_id', $checklist->id)
                ->get()
                ->map(function ($att) {
                    if ($att->file) {
                        $sas = GetBlobSasUri('aims-cntr', $att->file);
                        $att->blob_url = is_array($sas)
                            ? ($sas['blobUriSas'] ?? $att->blob_url)
                            : ($sas ?: $att->blob_url);
                    }
                    return $att;
                });
            $checklist->attachments = $attachments;
            return $checklist;
        });

        if ($bidding->questionnaire) {
            $quest = is_string($bidding->questionnaire) ? json_decode($bidding->questionnaire, true) : $bidding->questionnaire;
            if (isset($quest['questionnaire_file']) && $quest['questionnaire_file']) {
                $sas = GetBlobSasUri('aims-cntr', $quest['questionnaire_file']);
                $quest['questionnaire_file_url'] = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $quest['questionnaire_file'])
                    : ($sas ?: $quest['questionnaire_file']);
                $quest['questionnaire_file_name'] = basename($quest['questionnaire_file']);
            }
            $bidding->questionnaire = is_string($bidding->questionnaire) ? json_encode($quest) : $quest;
        }

        return ResponseFormatter::success([
            'bidding'    => $bidding,
            'checklists' => $checklists,
        ], 'Bidding retrieved successfully');
    }

    // ── STORE BIDDING ─────────────────────────────────────────────────────────
    public function storeBidding(Request $request)
    {
        $validated = $request->validate([
            'company_name'       => 'required|string|max:255',
            'address'            => 'required|string|max:255',
            'company_site'       => 'required|string|max:255',
            'license_number'     => 'required|string|max:255',
            'service_criteria'   => 'required|string|max:255',
            'business_entity_id' => 'required|integer',
            'classification'     => 'nullable|string|max:255',
            'person_in_charge'   => 'nullable|string|max:255',
            'date'               => 'nullable|date',
            'ccow_id'            => 'nullable|uuid',
            'company_id'         => 'nullable|uuid',
            'parent_id'          => 'nullable|uuid',
            'criteria'           => 'nullable|string',
            'risk_category'      => 'nullable|string',
            'questionnaire'      => 'nullable',
            'questionnaire_file' => 'nullable|file|max:20480',
        ]);

        $criteria = $validated['criteria'] ?? self::CRITERIA_BIDDING;
        $riskCategory = $validated['risk_category'] ?? null;
        
        $questionnaireArray = [];
        if (isset($validated['questionnaire'])) {
            $questionnaireArray = is_string($validated['questionnaire']) 
                ? (json_decode($validated['questionnaire'], true) ?? []) 
                : $validated['questionnaire'];
        }

        $id = (string) Str::uuid();

        if ($request->hasFile('questionnaire_file')) {
            $file = $request->file('questionnaire_file');
            $originalName = $file->getClientOriginalName();
            $path = 'csms/post-bidding/questionnaire/' . $id;
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
            $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName);
        }

        $questionnaireData = json_encode($questionnaireArray);

        DB::beginTransaction();
        try {

            DB::table('biddings')->insert([
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
                'questionnaire'      => $questionnaireData,
                'is_obsolate'        => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            // Salin template checklist dari master ke csms_checklists
            $masterChecklistsQuery = DB::table('csms_master_data_checklists')
                ->where('criteria', $criteria);

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
                        'value' => $cl['value'] ?? null,
                        'comment' => $cl['comment'] ?? null,
                        'file_index' => $idx
                    ];
                }
            }

            foreach ($masterChecklists as $mc) {
                $checklistId = (string) Str::uuid();
                $userInput = $checklistMap[$mc->id] ?? null;

                DB::table('csms_checklists')->insert([
                    'id'             => $checklistId,
                    'bidding_id'     => $id,
                    'question_id'    => $mc->id,
                    'value'          => $userInput ? $userInput['value'] : null,
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

    // ── UPDATE BIDDING ────────────────────────────────────────────────────────
    public function updateBidding(Request $request, string $id)
    {
        $bidding = DB::table('biddings')->where('id', $id)->first();
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
            'business_entity_id' => 'nullable|integer',
            'risk_category'      => 'nullable|string',
            'questionnaire'      => 'nullable',
            'questionnaire_file' => 'nullable|file|max:20480',
        ]);

        $questionnaireArray = [];
        if (isset($validated['questionnaire'])) {
            $questionnaireArray = is_string($validated['questionnaire']) 
                ? (json_decode($validated['questionnaire'], true) ?? []) 
                : $validated['questionnaire'];
        } else {
            $existing = DB::table('biddings')->where('id', $id)->value('questionnaire');
            if ($existing) {
                $questionnaireArray = is_string($existing) ? (json_decode($existing, true) ?? []) : $existing;
            }
        }

        if ($request->hasFile('questionnaire_file')) {
            $file = $request->file('questionnaire_file');
            $originalName = $file->getClientOriginalName();
            $path = 'csms/post-bidding/questionnaire/' . $id;
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), $path);
            $questionnaireArray['questionnaire_file'] = $uploadResult['fileBlobPathName'] ?? ($path . '/' . $originalName);
        }

        // Remove questionnaire_file from direct fields since it's saved inside questionnaire column
        unset($validated['questionnaire_file']);
        $validated['questionnaire'] = json_encode($questionnaireArray);

        DB::table('biddings')->where('id', $id)->update(array_merge($validated, ['updated_at' => now()]));

        $checklistsInput = $request->input('checklists', []);
        if (is_string($checklistsInput)) {
            $checklistsInput = json_decode($checklistsInput, true) ?? [];
        }

        if (!empty($checklistsInput)) {
            foreach ($checklistsInput as $idx => $cl) {
                if (empty($cl['id'])) continue;
                DB::table('csms_checklists')->where('id', $cl['id'])->update([
                    'value'   => $cl['value'] ?? null,
                    'comment' => $cl['comment'] ?? null,
                ]);

                if ($request->hasFile("checklists.{$idx}.new_files")) {
                    foreach ($request->file("checklists.{$idx}.new_files") as $file) {
                        $this->uploadChecklistFile($file, $cl['id']);
                    }
                }
            }
        }

        return ResponseFormatter::success(['id' => $id], 'Bidding updated successfully');
    }

    // ── DESTROY BIDDING ───────────────────────────────────────────────────────
    public function destroyBidding(string $id)
    {
        $bidding = DB::table('biddings')->where('id', $id)->first();
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);
        if ($bidding->status !== self::STATUS_DRAFT) {
            return ResponseFormatter::error('Hanya data Draft yang dapat dihapus', 422);
        }
        DB::table('biddings')->where('id', $id)->delete();
        return ResponseFormatter::success(null, 'Bidding deleted successfully');
    }

    public function bulkDestroyBiddings(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return ResponseFormatter::error('Pilih data yang ingin dihapus terlebih dahulu', 422);
        }

        $draftBiddings = DB::table('biddings')
            ->whereIn('id', $ids)
            ->where('status', self::STATUS_DRAFT)
            ->pluck('id')
            ->toArray();

        if (empty($draftBiddings)) {
            return ResponseFormatter::error('Hanya data dengan status Draft yang dapat dihapus', 422);
        }

        DB::table('biddings')->whereIn('id', $draftBiddings)->delete();
        
        $countDeleted = count($draftBiddings);
        $countSelected = count($ids);
        
        if ($countDeleted < $countSelected) {
            return ResponseFormatter::success(
                ['deleted_ids' => $draftBiddings], 
                "Berhasil menghapus {$countDeleted} data Draft. Data non-Draft tidak dihapus."
            );
        }

        return ResponseFormatter::success(['deleted_ids' => $draftBiddings], 'Semua data terpilih berhasil dihapus');
    }

    public function getApprovedBiddings()
    {
        $biddings = DB::table('biddings')
            ->where('criteria', 'Bidding')
            ->where('status', 'Approved')
            ->select(['id', 'company_name', 'license_number', 'address', 'company_site', 'service_criteria', 'classification', 'ccow_id', 'business_entity_id', 'company_id', 'parent_id', 'person_in_charge'])
            ->get();
        return ResponseFormatter::success($biddings, 'Approved biddings fetched successfully');
    }

    // ── INDEX POST-BIDDINGS ───────────────────────────────────────────────────
    public function indexPostBiddings(Request $request)
    {
        $request->merge(['criteria' => self::CRITERIA_POST_BIDDING]);
        return $this->indexBiddings($request);
    }

    public function showPostBidding(string $id)
    {
        return $this->showBidding($id);
    }

    // ── INDEX RENEWALS ────────────────────────────────────────────────────────
    public function indexRenewals(Request $request)
    {
        $request->merge(['criteria' => self::CRITERIA_RENEWAL]);
        return $this->indexBiddings($request);
    }

    // ── PROCESS APPROVAL ─────────────────────────────────────────────────────
    public function processApproval(Request $request, string $id)
    {
        $bidding = DB::table('biddings')->where('id', $id)->first();
        if (!$bidding) return ResponseFormatter::error('Bidding not found', 404);

        $action  = $request->input('action'); // approve | reject | submit
        $comment = $request->input('comment', '');

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
            'status'     => $nextStatus,
            'requested'  => $nextRequested,
            'updated_at' => now(),
        ];

        if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED) {
            $updateData['approved_by'] = (string) auth()->id();
            $updateData['ktt_name']    = auth()->user()?->name;
        }

        DB::table('biddings')->where('id', $id)->update($updateData);

        // Sync ke companies jika final approve PostBidding
        if ($action === 'approve' && $nextStatus === self::STATUS_APPROVED
            && $bidding->criteria === self::CRITERIA_POST_BIDDING) {
            $this->syncToCompany($bidding);
        }

        return ResponseFormatter::success(['status' => $nextStatus], 'Approval processed successfully');
    }

    // ── INDEX PJOS ────────────────────────────────────────────────────────────
    public function indexPjos(Request $request)
    {
        $search = $request->query('search', '');
        $page   = max(1, (int) $request->query('page', 1));
        $limit  = min(100, max(1, (int) $request->query('limit', 10)));
        $status = $request->query('status', '');

        $query = DB::table('csms_pjos as p')
            ->leftJoin('companies as c', 'p.company_id', '=', 'c.id')
            ->select([
                'p.*',
                DB::raw('COALESCE(c.company_name, "-") as company_name_resolved'),
            ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('p.name', 'like', "%{$search}%")
                  ->orWhere('p.number_pjo', 'like', "%{$search}%");
            });
        }

        if ($status) $query->where('p.status', $status);

        $query->orderBy('p.created_at', 'desc');
        $total    = $query->count();
        $lastPage = max(1, (int) ceil($total / $limit));
        $items    = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        $items = $items->map(function ($pjo) {
            $pjo->files = DB::table('csms_pjo_files')
                ->where('pjo_id', $pjo->id)
                ->get()
                ->map(function ($f) {
                    if ($f->file) {
                        $sas = GetBlobSasUri('aims-cntr', $f->file);
                        $f->blob_url = is_array($sas)
                            ? ($sas['blobUriSas'] ?? $f->blob_url)
                            : ($sas ?: $f->blob_url);
                    }
                    return $f;
                });
            return $pjo;
        });

        return ResponseFormatter::success([
            'data'         => $items,
            'current_page' => $page,
            'last_page'    => $lastPage,
            'total'        => $total,
            'per_page'     => $limit,
        ], 'PJOs retrieved successfully');
    }

    // ── SHOW PJO ──────────────────────────────────────────────────────────────
    public function showPjo(string $id)
    {
        $pjo = DB::table('csms_pjos as p')
            ->leftJoin('companies as c', 'p.company_id', '=', 'c.id')
            ->leftJoin('companies as ccow', 'p.ccow_id', '=', 'ccow.id')
            ->where('p.id', $id)
            ->select([
                'p.*',
                DB::raw('COALESCE(c.company_name, "-") as company_name_resolved'),
                'ccow.company_name as ccow_name',
            ])
            ->first();

        if (!$pjo) {
            return ResponseFormatter::error('PJO not found', 404);
        }

        $files = DB::table('csms_pjo_files')
            ->where('pjo_id', $id)
            ->get()
            ->map(function ($f) {
                if ($f->file) {
                    $sas = GetBlobSasUri('aims-cntr', $f->file);
                    $f->blob_url = is_array($sas)
                        ? ($sas['blobUriSas'] ?? $f->blob_url)
                        : ($sas ?: $f->blob_url);
                }
                return $f;
            });

        return ResponseFormatter::success([
            'pjo'   => $pjo,
            'files' => $files,
        ], 'PJO retrieved successfully');
    }

    // ── STORE PJO ─────────────────────────────────────────────────────────────
    public function storePjo(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'number_pjo'      => 'required|string|max:255',
            'company_id'      => 'nullable|uuid',
            'ccow_id'         => 'nullable|uuid',
            'date_of_birth'   => 'nullable|date',
            'phone'           => 'nullable|string|max:50',
            'email'           => 'nullable|email|max:255',
            'date_submission' => 'nullable|date',
        ]);

        DB::beginTransaction();
        try {
            $id = (string) Str::uuid();
            DB::table('csms_pjos')->insert(array_merge($validated, [
                'id'         => $id,
                'status'     => 'Draft',
                'created_by' => (string) auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadPjoFile($file, $id);
                }
            }

            DB::commit();
            return ResponseFormatter::success(['id' => $id], 'PJO created successfully', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menyimpan PJO: ' . $e->getMessage(), 500);
        }
    }

    // ── UPDATE PJO ────────────────────────────────────────────────────────────
    public function updatePjo(Request $request, string $id)
    {
        $pjo = DB::table('csms_pjos')->where('id', $id)->first();
        if (!$pjo) return ResponseFormatter::error('PJO not found', 404);

        $validated = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'number_pjo'      => 'sometimes|string|max:255',
            'phone'           => 'nullable|string|max:50',
            'email'           => 'nullable|email|max:255',
            'date_submission' => 'nullable|date',
            'date_approved'   => 'nullable|date',
            'status'          => 'sometimes|string|max:50',
            'comment'         => 'nullable|string',
            'company_id'      => 'nullable|uuid',
            'ccow_id'         => 'nullable|uuid',
            'date_of_birth'   => 'nullable|date',
            'submission'      => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            DB::table('csms_pjos')->where('id', $id)->update(array_merge($validated, ['updated_at' => now()]));

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadPjoFile($file, $id);
                }
            }

            DB::commit();
            return ResponseFormatter::success(['id' => $id], 'PJO updated successfully');
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal memperbarui PJO: ' . $e->getMessage(), 500);
        }
    }

    // ── DESTROY PJO ───────────────────────────────────────────────────────────
    public function destroyPjo(string $id)
    {
        $pjo = DB::table('csms_pjos')->where('id', $id)->first();
        if (!$pjo) return ResponseFormatter::error('PJO not found', 404);
        DB::table('csms_pjos')->where('id', $id)->delete();
        return ResponseFormatter::success(null, 'PJO deleted successfully');
    }

    // ── MASTER DATA ───────────────────────────────────────────────────────────
    public function masterData(Request $request)
    {
        $companies        = DB::table('companies as c')
            ->leftJoin('users as u', 'c.user_id', '=', 'u.id')
            ->select('c.id', 'c.company_name as name', 'c.type', 'c.user_id', 'u.name as user_name')
            ->orderBy('c.company_name')
            ->get();
        $masterChecklists = DB::table('csms_master_data_checklists')->orderBy('ordinal_number')->get();

        $serviceCriterias = [
            'CONTRACTOR',
            'SUBCONTRACTOR',
        ];

        $classifications = [
            'Kontraktor Utama',
            'Kontraktor Langsung',
            'Subkontraktor Tunggal',
            'Kontraktor Bersama',
        ];

        $businessEntities = DB::table('business_entities')->select('id', 'name')->orderBy('name')->get();

        return ResponseFormatter::success([
            'companies'         => $companies,
            'master_checklists' => $masterChecklists,
            'service_criterias' => $serviceCriterias,
            'classifications'   => $classifications,
            'business_entities' => $businessEntities,
        ], 'Master data retrieved successfully');
    }

    // ── PREVIEW CHECKLIST FILE ────────────────────────────────────────────────
    public function previewChecklistFile(string $id)
    {
        $file = DB::table('csms_checklist_attachments')->where('id', $id)->first();
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

        $sas = GetBlobSasUri('aims-cntr', $filePath);
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
        $file = DB::table('csms_checklist_attachments')->where('id', $id)->first();
        if (!$file) abort(404, 'File tidak ditemukan.');

        $sas = GetBlobSasUri('aims-cntr', $file->file);
        $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? null) : $sas;
        if ($url) return redirect($url);
        abort(404, 'File tidak ditemukan.');
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────
    private function uploadChecklistFile($file, string $checklistId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/bidding');

            DB::table('csms_checklist_attachments')->insert([
                'id'            => (string) Str::uuid(),
                'checklist_id'  => $checklistId,
                'file'          => $uploadResult['fileBlobPathName'] ?? $originalName,
                'name'          => $originalName,
                'type'          => $file->getMimeType(),
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload checklist file', [
                'checklist_id' => $checklistId,
                'error'        => $e->getMessage(),
            ]);
        }
    }

    private function uploadPjoFile($file, string $pjoId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/pjo');

            DB::table('csms_pjo_files')->insert([
                'id'            => (string) Str::uuid(),
                'pjo_id'        => $pjoId,
                'file'          => $uploadResult['fileBlobPathName'] ?? $originalName,
                'name'          => $originalName,
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload PJO file', ['pjo_id' => $pjoId, 'error' => $e->getMessage()]);
        }
    }

    private function syncToCompany(object $bidding): void
    {
        try {
            if ($bidding->company_id) {
                DB::table('companies')->where('id', $bidding->company_id)->update([
                    'csms_status' => 'Active',
                    'updated_at'  => now(),
                ]);
            }
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal sync company', ['bidding_id' => $bidding->id, 'error' => $e->getMessage()]);
        }
    }

    private function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024)    return round($bytes / 1024, 2)    . ' KB';
        return $bytes . ' B';
    }

    // ── MEMO KTT ──────────────────────────────────────────────────────────────
    public function indexMemoKtts(Request $request)
    {
        $q = DB::table('csms_memo_ktts as m')
            ->leftJoin('companies as c', 'm.ccow_id', '=', 'c.id')
            ->leftJoin('users as u', 'm.ktt_id', '=', 'u.id')
            ->select([
                'm.*',
                'c.company_name as ccow_name',
                'u.name as ktt_name',
                DB::raw('(select count(*) from csms_memo_ktt_files where csms_memo_ktt_files.memo_id = m.id) as files_count')
            ])
            ->orderBy('m.created_at', 'desc');

        if ($s = $request->search) {
            $q->where(function ($query) use ($s) {
                $query->where('m.memo_number', 'like', "%{$s}%")
                      ->orWhere('m.title', 'like', "%{$s}%");
            });
        }

        $data = $q->paginate($request->limit ?? 10);

        foreach ($data->items() as $item) {
            $files = DB::table('csms_memo_ktt_files')->where('memo_id', $item->id)->get();
            foreach ($files as $file) {
                if ($file->file) {
                    $sas = GetBlobSasUri('aims-cntr', $file->file);
                    $file->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $file->blob_url) : $sas;
                }
            }
            $item->files = $files;
        }

        return ResponseFormatter::success($data);
    }

    public function storeMemoKtt(Request $request)
    {
        $request->validate([
            'memo_number' => 'required|string|max:100',
            'title'       => 'required|string|max:255',
            'ccow_id'     => 'required|string',
            'date'        => 'required|date',
            'description' => 'nullable|string',
            'status'      => 'nullable|string',
        ]);

        $id = (string) Str::uuid();
        $company = DB::table('companies')->where('id', $request->ccow_id)->first();
        $kttId = $company?->user_id ?? $request->ktt_id;

        DB::beginTransaction();
        try {
            DB::table('csms_memo_ktts')->insert([
                'id'          => $id,
                'ccow_id'     => $request->ccow_id,
                'ktt_id'      => $kttId,
                'memo_number' => $request->memo_number,
                'title'       => $request->title,
                'date'        => $request->date,
                'description' => $request->description,
                'status'      => $request->status ?? 'Active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadMemoKttFile($file, $id);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('CSMS: gagal store Memo KTT', ['error' => $e->getMessage()]);
            return ResponseFormatter::error('Gagal menyimpan data Memo KTT: ' . $e->getMessage(), 500);
        }

        $memo = DB::table('csms_memo_ktts as m')
            ->leftJoin('companies as c', 'm.ccow_id', '=', 'c.id')
            ->leftJoin('users as u', 'm.ktt_id', '=', 'u.id')
            ->select(['m.*', 'c.company_name as ccow_name', 'u.name as ktt_name'])
            ->where('m.id', $id)
            ->first();

        return ResponseFormatter::success($memo, 'Memo KTT berhasil dibuat.', 201);
    }

    private function uploadMemoKttFile($file, string $memoId): void
    {
        try {
            $originalName = $file->getClientOriginalName();
            $size         = $this->formatFileSize($file->getSize());
            $uploadResult = uploadToBlobStorage($originalName, $file->getRealPath(), 'csms/memo-ktt/' . $memoId);

            DB::table('csms_memo_ktt_files')->insert([
                'id'            => (string) Str::uuid(),
                'memo_id'       => $memoId,
                'file'          => $uploadResult['fileBlobPathName'] ?? ('csms/memo-ktt/' . $memoId . '/' . $originalName),
                'name'          => $originalName,
                'size'          => $size,
                'blob_url'      => $uploadResult['fileBlobUrl'] ?? null,
                'blob_response' => isset($uploadResult['blobResponse']) ? json_encode($uploadResult['blobResponse']) : null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        } catch (\Throwable $e) {
            \Log::error('CSMS: gagal upload Memo KTT file', ['memo_id' => $memoId, 'error' => $e->getMessage()]);
        }
    }

    // ── LETTERS ───────────────────────────────────────────────────────────────
    public function indexLetters(Request $request)
    {
        $q = DB::table('csms_letters')->orderBy('created_at', 'desc');
        if ($s = $request->search) $q->where('title', 'like', "%{$s}%");
        $data = $q->paginate($request->limit ?? 10);
        return ResponseFormatter::success($data);
    }

    public function storeLetter(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $id = (string) Str::uuid();
        DB::table('csms_letters')->insert([
            'id'         => $id,
            'title'      => $request->title,
            'status'     => $request->status ?? 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return ResponseFormatter::success(DB::table('csms_letters')->find($id), 'Surat Edaran berhasil dibuat.', 201);
    }

    // ── DICTIONARIES ──────────────────────────────────────────────────────────
    public function indexDictionaries(Request $request)
    {
        $q = DB::table('csms_dictionaries')->orderBy('term');
        if ($s = $request->search) $q->where('term', 'like', "%{$s}%")->orWhere('definition', 'like', "%{$s}%");
        $data = $q->paginate($request->limit ?? 10);
        return ResponseFormatter::success($data);
    }

    public function storeDictionary(Request $request)
    {
        $request->validate(['term' => 'required|string|max:255', 'definition' => 'required|string']);
        $id = (string) Str::uuid();
        DB::table('csms_dictionaries')->insert([
            'id'         => $id,
            'term'       => $request->term,
            'definition' => $request->definition,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return ResponseFormatter::success(DB::table('csms_dictionaries')->find($id), 'Istilah berhasil ditambahkan.', 201);
    }

    // ── PICA ──────────────────────────────────────────────────────────────────
    public function indexPicas(Request $request)
    {
        $q = DB::table('csms_picas')
            ->leftJoin('csms_biddings', 'csms_picas.bidding_id', '=', 'csms_biddings.id')
            ->select('csms_picas.*', 'csms_biddings.company_name')
            ->orderBy('csms_picas.created_at', 'desc');
        if ($s = $request->search) $q->where('csms_picas.description', 'like', "%{$s}%");
        if ($st = $request->status) $q->where('csms_picas.status', $st);
        $data = $q->paginate($request->limit ?? 10);
        return ResponseFormatter::success($data);
    }

}
