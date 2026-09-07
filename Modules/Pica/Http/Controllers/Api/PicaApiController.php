<?php

namespace Modules\Pica\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Modules\Pica\Entities\PicaActivity;
use Modules\Pica\Entities\PicaActivityFile;
use Modules\Pica\Entities\PicaDocument;
use Modules\Pica\Entities\PicaFile;

class PicaApiController extends PicaBaseApiController
{
    // =========================================================================
    // LIST
    // =========================================================================
    public function index(Request $request)
    {
        $query = PicaDocument::with(['company', 'ccow', 'section', 'areaLocation', 'pja.user', 'pjo', 'auditors.user'])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('identity_id', 'like', '%' . $request->search . '%')
                      ->orWhere('auditor', 'like', '%' . $request->search . '%')
                      ->orWhereHas('auditors', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
                      ->orWhereHas('company', fn($q) => $q->where('company_name', 'like', '%' . $request->search . '%'));
                });
            })
            ->when($request->status, function ($q) use ($request) {
                // Frontend kirim multi-status comma-separated
                // ("Open,On Review PJA,On Review CRS,Overdue,Closed") -> whereIn
                $statuses = array_values(array_filter(array_map('trim', explode(',', (string) $request->status))));
                if (count($statuses) > 1) {
                    $q->whereIn('status', $statuses);
                } elseif (count($statuses) === 1) {
                    $q->where('status', $statuses[0]);
                }
            })
            ->when($request->source, fn($q) => $q->where('source', $request->source))
            ->when($request->published, fn($q) => $q->where('published', $request->published))
            ->when($request->requested, fn($q) => $q->where('requested', $request->requested))
            ->when($request->date_from && $request->date_to,
                fn($q) => $q->whereBetween('date', [$request->date_from, $request->date_to]))
            ->when($request->target_from && $request->target_to,
                fn($q) => $q->whereBetween('target_settlement_date', [$request->target_from, $request->target_to]))
            ->when($request->settlement_from && $request->settlement_to,
                fn($q) => $q->whereBetween('settlement_date', [$request->settlement_from, $request->settlement_to]))
            ->orderBy('created_at', 'desc');

        $limit = min((int) ($request->limit ?? 10), 100);
        $data  = $query->paginate($limit);

        return $this->success($data);
    }

    // =========================================================================
    // SHOW
    // =========================================================================
    public function show(string $id)
    {
        $doc = PicaDocument::with([
            'company', 'ccow', 'section', 'areaLocation',
            'pja.user', 'pjo', 'createdBy',
            'picaFiles',
            'activities.user',
            'activities.files',
            'auditors.user',
        ])->findOrFail($id);

        return $this->success($doc);
    }

    // =========================================================================
    // STORE
    // =========================================================================
    public function store(Request $request)
    {
        $request->validate([
            'source'                 => 'required|string',
            'non_compliance'         => 'required|string',
            'corrective_action'      => 'required|string',
            'target_settlement_date' => 'required|date',
            'auditors'               => 'nullable|array',
            'auditors.*'             => 'nullable|string|distinct',
        ]);

        DB::beginTransaction();
        try {
            $doc = PicaDocument::create([
                'identity_id'              => $this->generateIdentityId($request->source),
                'source'                   => $request->source,
                'source_id'                => $request->source_id,
                'type'                     => $request->type,
                'date'                     => $request->date,
                'ccow_id'                  => $request->ccow_id,
                'company_id'               => $request->company_id,
                'section_id'               => $request->section_id,
                'location_id'              => $request->location_id,
                'location_detail'          => $request->location_detail,
                'company_detail'           => $request->company_detail,
                'pja_id'                   => $request->pja_id,
                'pjo_id'                   => $request->pjo_id,
                'auditor'                  => $request->auditor ?? ($request->auditors ? implode(', ', $request->auditors) : null),
                'non_compliance'           => $request->non_compliance,
                'non_compliance_root_cause' => $request->non_compliance_root_cause,
                'corrective_action'        => $request->corrective_action,
                'target_settlement_date'   => $request->target_settlement_date,
                'remarks'                  => $request->remarks,
                'status'                   => self::STATUS_DRAFT,
                'published'                => self::PUBLISHED_DRAFT,
                'created_by'               => auth()->id(),
            ]);

            // Multi auditor (aims compatibility)
            // Dedupe agar tidak ada auditor ganda per dokumen
            $auditorInputs = array_values(array_unique(array_filter((array) $request->input('auditors', []))));
            if (!empty($auditorInputs)) {
                $auditorNames = [];
                foreach ($auditorInputs as $aud) {
                    if (!$aud) continue;
                    $user = \App\Models\User::where('id', $aud)->orWhere('name', $aud)->orWhere('email', $aud)->first();
                    $name = $user?->name ?? $aud;
                    $auditorNames[] = $name;
                    \Modules\Pica\Entities\PicaAuditor::create([
                        'pica_id' => $doc->id,
                        'user_id' => $user?->id,
                        'name'    => $name,
                    ]);
                }
                // Samakan kolom legacy dengan hasil resolve (nama user, bukan id mentah)
                $doc->update(['auditor' => implode(', ', $auditorNames)]);
            } elseif ($request->auditor) {
                $user = \App\Models\User::where('name', $request->auditor)->orWhere('email', $request->auditor)->first();
                \Modules\Pica\Entities\PicaAuditor::create([
                    'pica_id' => $doc->id,
                    'user_id' => $user?->id,
                    'name'    => $request->auditor,
                ]);
            }

            // Handle file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storePicaFile($doc->id, $file, $doc->type);
                }
            }

            DB::commit();
            return $this->success($doc->load('auditors'), 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    // =========================================================================
    // UPDATE (Draft only)
    // =========================================================================
    public function update(Request $request, string $id)
    {
        $doc = PicaDocument::findOrFail($id);

        if ($doc->status !== self::STATUS_DRAFT) {
            return $this->error('Hanya dokumen Draft yang dapat diedit.', 422);
        }

        $request->validate([
            'source'                 => 'required|string',
            'non_compliance'         => 'required|string',
            'corrective_action'      => 'required|string',
            'target_settlement_date' => 'required|date',
            'auditors'               => 'nullable|array',
            'auditors.*'             => 'nullable|string|distinct',
        ]);

        DB::beginTransaction();
        try {
            // Sync multi auditors dulu agar string legacy konsisten dengan hasil resolve
            $auditorNames = null;
            if ($request->has('auditors')) {
                \Modules\Pica\Entities\PicaAuditor::where('pica_id', $doc->id)->delete();
                $auditorNames = [];
                if (is_array($request->auditors)) {
                    foreach (array_values(array_unique(array_filter($request->auditors))) as $aud) {
                        if (!$aud) continue;
                        $user = \App\Models\User::where('id', $aud)->orWhere('name', $aud)->orWhere('email', $aud)->first();
                        $name = $user?->name ?? $aud;
                        $auditorNames[] = $name;
                        \Modules\Pica\Entities\PicaAuditor::create([
                            'pica_id' => $doc->id,
                            'user_id' => $user?->id,
                            'name'    => $name,
                        ]);
                    }
                }
            }
            $auditorStr = $request->auditor ?? ($auditorNames !== null ? (empty($auditorNames) ? null : implode(', ', $auditorNames)) : $doc->auditor);
            $doc->update([
                'source'                    => $request->source,
                'source_id'                 => $request->source_id,
                'type'                      => $request->type,
                'date'                      => $request->date,
                'ccow_id'                   => $request->ccow_id,
                'company_id'                => $request->company_id,
                'section_id'                => $request->section_id,
                'location_id'               => $request->location_id,
                'location_detail'           => $request->location_detail,
                'company_detail'            => $request->company_detail,
                'pja_id'                    => $request->pja_id,
                'pjo_id'                    => $request->pjo_id,
                'auditor'                   => $auditorStr,
                'non_compliance'            => $request->non_compliance,
                'non_compliance_root_cause' => $request->non_compliance_root_cause,
                'corrective_action'         => $request->corrective_action,
                'target_settlement_date'    => $request->target_settlement_date,
                'remarks'                   => $request->remarks,
            ]);

            // Handle new file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storePicaFile($doc->id, $file, $doc->type);
                }
            }

            DB::commit();
            return $this->success($doc->fresh(['auditors.user']));
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    // =========================================================================
    // DESTROY (Draft only)
    // =========================================================================
    public function destroy(string $id)
    {
        $doc = PicaDocument::findOrFail($id);

        if ($doc->status !== self::STATUS_DRAFT) {
            return $this->error('Hanya dokumen Draft yang dapat dihapus.', 422);
        }

        DB::beginTransaction();
        try {
            foreach ($doc->picaFiles as $file) {
                $file->delete();
            }
            foreach ($doc->activities as $activity) {
                foreach ($activity->files as $actFile) {
                    $actFile->delete();
                }
                $activity->delete();
            }
            // Hapus auditor eksplisit (jangan hanya andalkan FK cascade)
            \Modules\Pica\Entities\PicaAuditor::where('pica_id', $doc->id)->delete();
            $doc->delete();

            DB::commit();
            return $this->success(['message' => 'Dokumen berhasil dihapus.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    // =========================================================================
    // APPROVAL
    // =========================================================================
    public function approval(Request $request, string $id)
    {
        $request->validate(['action' => 'required|string']);

        $doc    = PicaDocument::findOrFail($id);
        $action = $request->action;

        DB::beginTransaction();
        try {
            switch ($action) {
                case 'submit':
                    $doc->update([
                        'status'    => self::STATUS_ON_REVIEW_PJA,
                        'requested' => self::REQUESTED_PJA,
                        'published' => self::PUBLISHED_PUBLISH,
                    ]);
                    // Auto-create New Request activity
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Submit for Review',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    break;

                case 'approve_pja':
                    $doc->update([
                        'status'    => self::STATUS_ON_REVIEW_CRS,
                        'requested' => self::REQUESTED_CRS,
                    ]);
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Approved by PJA',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    break;

                case 'reject_pja':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_RETURN,
                    ]);
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Rejected by PJA (Return Document)',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    break;

                case 'approve_crs':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_APPROVED,
                    ]);
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Approved by CRS',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    break;

                case 'reject_crs':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_RETURN,
                    ]);
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Rejected by CRS (Return Document)',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    break;

                case 'close':
                    $doc->update([
                        'status'          => self::STATUS_CLOSED,
                        'settlement_date' => now()->toDateString(),
                    ]);
                    PicaActivity::create([
                        'pica_id'     => $doc->id,
                        'description' => 'Closed',
                        'user_id'     => (string) auth()->id(),
                    ]);
                    // Update source document status if applicable
                    $this->closeSourceDocument($doc);
                    break;

                default:
                    DB::rollBack();
                    return $this->error("Action '{$action}' tidak dikenal.", 422);
            }

            DB::commit();
            return $this->success($doc->fresh());
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    // =========================================================================
    // ACTIVITIES
    // =========================================================================
    public function storeActivity(Request $request, string $id)
    {
        $request->validate(['description' => 'required|string']);

        $doc = PicaDocument::findOrFail($id);

        DB::beginTransaction();
        try {
            $activity = PicaActivity::create([
                'pica_id'     => $doc->id,
                'description' => $request->description,
                'user_id'     => (string) auth()->id(),
            ]);

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storeActivityFile($activity->id, $file);
                }
            }

            DB::commit();
            return $this->success($activity->load('user', 'files'), 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    public function destroyActivity(string $activityId)
    {
        $activity = PicaActivity::findOrFail($activityId);

        DB::beginTransaction();
        try {
            foreach ($activity->files as $file) {
                $file->delete();
            }
            $activity->delete();
            DB::commit();
            return $this->success(['message' => 'Activity berhasil dihapus.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }
    }

    // =========================================================================
    // FILES — SAS on-demand preview & download
    // =========================================================================
    public function previewFile(string $fileId)
    {
        $file = PicaFile::findOrFail($fileId);
        $sas  = $this->resolveSasUrl($file->file);
        return $this->success(['url' => $sas, 'name' => $file->name]);
    }

    public function downloadFile(string $fileId)
    {
        $file = PicaFile::findOrFail($fileId);
        $sas  = $this->resolveSasUrl($file->file);
        return redirect($sas);
    }

    public function previewActivityFile(string $fileId)
    {
        $file = PicaActivityFile::findOrFail($fileId);
        $sas  = $this->resolveSasUrl($file->file);
        return $this->success(['url' => $sas, 'name' => $file->name]);
    }

    public function downloadActivityFile(string $fileId)
    {
        $file = PicaActivityFile::findOrFail($fileId);
        $sas  = $this->resolveSasUrl($file->file);
        return redirect($sas);
    }

    // =========================================================================
    // MASTER DATA
    // =========================================================================
    public function masterData()
    {
        $companies = \App\Models\Company::select('id', 'company_name')->orderBy('company_name')->get();
        $sections  = \App\Models\Section::select('id', 'name')->orderBy('name')->get();
        $locations = \App\Models\AreaLocation::select('id', 'name')->orderBy('name')->get();
        // email dibutuhkan frontend Create.jsx: "{u.name} ({u.email})"
        $users     = \App\Models\User::select('id', 'name', 'email')->orderBy('name')->get();
        $managers  = \App\Models\AreaManager::with('user:id,name')->get();

        return $this->success(compact('companies', 'sections', 'locations', 'users', 'managers'));
    }

    // =========================================================================
    // DASHBOARD STATS
    // =========================================================================
    public function dashboardStats()
    {
        $sources = [
            self::SOURCE_FIELD_LEADERSHIP,
            self::SOURCE_INSPEKSI_KPLH,
            self::SOURCE_AUDIT,
        ];

        $charts = [];
        foreach ($sources as $source) {
            $charts[$source] = [
                'open'    => PicaDocument::where('source', $source)->where('status', self::STATUS_OPEN)->count(),
                'closed'  => PicaDocument::where('source', $source)->where('status', self::STATUS_CLOSED)->count(),
                'overdue' => PicaDocument::where('source', $source)->where('status', self::STATUS_OVERDUE)->count(),
            ];
        }

        $summary = [
            'total_open'    => PicaDocument::where('status', self::STATUS_OPEN)->count(),
            'total_overdue' => PicaDocument::where('status', self::STATUS_OVERDUE)->count(),
            'total_closed'  => PicaDocument::where('status', self::STATUS_CLOSED)->count(),
            'total_draft'   => PicaDocument::where('published', self::PUBLISHED_DRAFT)->count(),
            'last_update'   => PicaDocument::latest()->value('updated_at'),
        ];

        return $this->success(compact('summary', 'charts'));
    }

    // =========================================================================
    // Private helpers
    // =========================================================================
    private function storePicaFile(string $docId, $file, ?string $type): PicaFile
    {
        $fileName     = time() . '_' . $file->getClientOriginalName();
        $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'pica');

        return PicaFile::create([
            'pica_id'       => $docId,
            'file'          => $uploadResult['blobName']   ?? $fileName,
            'type'          => $type,
            'size'          => (string) $file->getSize(),
            'blob_url'      => $uploadResult['blobUriSas'] ?? null,
            'blob_response' => json_encode($uploadResult),
        ]);
    }

    private function storeActivityFile(string $activityId, $file): PicaActivityFile
    {
        $fileName     = time() . '_' . $file->getClientOriginalName();
        $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'pica-activity');

        return PicaActivityFile::create([
            'pica_activity_id' => $activityId,
            'file'             => $uploadResult['blobName']   ?? $fileName,
            'type_file'        => $file->getClientOriginalExtension(),
            'size'             => (string) $file->getSize(),
            'blob_url'         => $uploadResult['blobUriSas'] ?? null,
            'blob_response'    => json_encode($uploadResult),
        ]);
    }

    private function resolveSasUrl(string $blobName): string
    {
        $sas = GetBlobSasUri('aims-cntr', $blobName);
        if (is_array($sas)) {
            return $sas['blobUriSas'] ?? $blobName;
        }
        return $sas ?: $blobName;
    }

    private function closeSourceDocument(PicaDocument $doc): void
    {
        if ($doc->source === self::SOURCE_FIELD_LEADERSHIP && $doc->source_id) {
            // FL module tanpa Eloquent model di aimsv3 -> query-builder.
            // source_id PICA = field_leadership_risks.id (bukan field_leaderships.id).
            DB::table('field_leadership_risks')
                ->where('id', $doc->source_id)
                ->update(['status' => 'Closed', 'updated_at' => now()]);
        }
    }
}