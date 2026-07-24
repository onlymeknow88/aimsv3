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
        $query = PicaDocument::with(['company', 'ccow', 'section', 'areaLocation', 'pja.user', 'pjo'])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('identity_id', 'like', '%' . $request->search . '%')
                      ->orWhere('auditor', 'like', '%' . $request->search . '%')
                      ->orWhereHas('company', fn($q) => $q->where('company_name', 'like', '%' . $request->search . '%'));
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $statuses = explode(',', $request->status);
                $q->whereIn('status', $statuses);
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
                'auditor'                  => $request->auditor,
                'non_compliance'           => $request->non_compliance,
                'non_compliance_root_cause' => $request->non_compliance_root_cause,
                'corrective_action'        => $request->corrective_action,
                'target_settlement_date'   => $request->target_settlement_date,
                'remarks'                  => $request->remarks,
                'status'                   => self::STATUS_DRAFT,
                'published'                => self::PUBLISHED_DRAFT,
                'created_by'               => auth()->id(),
            ]);

            // Handle file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storePicaFile($doc->id, $file, $doc->type);
                }
            }

            DB::commit();
            return $this->success($doc->fresh(), 201);
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
        ]);

        DB::beginTransaction();
        try {
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
                'auditor'                   => $request->auditor,
                'non_compliance'            => $request->non_compliance,
                'non_compliance_root_cause' => $request->non_compliance_root_cause,
                'corrective_action'         => $request->corrective_action,
                'target_settlement_date'    => $request->target_settlement_date,
                'remarks'                   => $request->remarks,
            ]);

            // Sync/Delete existing files that were removed
            $existingFileIds = $request->input('existing_files', []);
            PicaFile::where('pica_id', $doc->id)
                ->whereNotIn('id', $existingFileIds)
                ->delete();

            // Handle new file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storePicaFile($doc->id, $file, $doc->type);
                }
            }

            DB::commit();
            return $this->success($doc->fresh());
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
            $activityDesc = '';
            switch ($action) {
                case 'submit':
                    $doc->update([
                        'status'    => self::STATUS_ON_REVIEW_PJA,
                        'requested' => self::REQUESTED_PJA,
                        'published' => self::PUBLISHED_PUBLISH,
                    ]);
                    $activityDesc = self::STATUS_NEW_REQUEST;
                    break;

                case 'approve_pja':
                    $doc->update([
                        'status'    => self::STATUS_ON_REVIEW_CRS,
                        'requested' => self::REQUESTED_CRS,
                    ]);
                    $activityDesc = 'Approved by PJA';
                    break;

                case 'reject_pja':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_RETURN,
                    ]);
                    $activityDesc = 'Returned by PJA';
                    break;

                case 'approve_crs':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_APPROVED,
                    ]);
                    $activityDesc = 'Approved by CRS';
                    break;

                case 'reject_crs':
                    $doc->update([
                        'status'    => self::STATUS_OPEN,
                        'requested' => self::REQUESTED_RETURN,
                    ]);
                    $activityDesc = 'Returned by CRS';
                    break;

                case 'close':
                    $doc->update([
                        'status'          => self::STATUS_CLOSED,
                        'settlement_date' => now()->toDateString(),
                    ]);
                    $activityDesc = 'Closed';
                    // Update source document status if applicable
                    $this->closeSourceDocument($doc);
                    break;

                default:
                    DB::rollBack();
                    return $this->error("Action '{$action}' tidak dikenal.", 422);
            }

            // Create activity log for the action
            $comment = $request->input('comment');
            $fullDesc = $activityDesc;
            if ($comment) {
                $fullDesc .= "\nCatatan: " . $comment;
            }

            $activity = PicaActivity::create([
                'pica_id'     => $doc->id,
                'description' => $fullDesc,
                'user_id'     => (string) auth()->id(),
            ]);

            // Handle optional files uploaded during approval
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->storeActivityFile($activity->id, $file);
                }
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
        return $this->streamFileInline($file->file);
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
        return $this->streamFileInline($file->file);
    }

    public function downloadActivityFile(string $fileId)
    {
        $file = PicaActivityFile::findOrFail($fileId);
        $sas  = $this->resolveSasUrl($file->file);
        return redirect($sas);
    }

    private function streamFileInline(string $filePath)
    {
        $fileName = basename($filePath);
        $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $mimeType = match ($ext) {
            'pdf'         => 'application/pdf',
            'png'         => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif'         => 'image/gif',
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
                    'Content-Disposition' => 'inline; filename="' . $fileName . '"'
                ]);
            }
        }

        abort(404, 'Gagal memuat file.');
    }

    // =========================================================================
    // MASTER DATA
    // =========================================================================
    public function masterData()
    {
        $ccows     = \App\Models\Company::select('id', 'company_name')->where('type', 'Internal')->orderBy('company_name')->get();
        $companies = \App\Models\Company::select('id', 'company_name')->where('type', '!=', 'Internal')->orWhereNull('type')->orderBy('company_name')->get();
        $sections  = \App\Models\Section::select('id', 'name')->orderBy('name')->get();
        $locations = \App\Models\AreaLocation::select('id', 'name')->orderBy('name')->get();
        $users     = \App\Models\User::select('id', 'name')->orderBy('name')->get();
        $managers  = \App\Models\AreaManager::with(['user:id,name', 'areaLocations:id,name'])->get();

        return $this->success(compact('ccows', 'companies', 'sections', 'locations', 'users', 'managers'));
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
            'file'          => $uploadResult['fileBlobPathName'] ?? $fileName,
            'type'          => $type,
            'size'          => (string) $file->getSize(),
            'blob_url'      => $uploadResult['fileBlobUrl']      ?? null,
            'blob_response' => json_encode($uploadResult),
        ]);
    }

    private function storeActivityFile(string $activityId, $file): PicaActivityFile
    {
        $fileName     = time() . '_' . $file->getClientOriginalName();
        $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'pica-activity');

        return PicaActivityFile::create([
            'pica_activity_id' => $activityId,
            'file'             => $uploadResult['fileBlobPathName'] ?? $fileName,
            'type_file'        => $file->getClientOriginalExtension(),
            'size'             => (string) $file->getSize(),
            'blob_url'         => $uploadResult['fileBlobUrl']      ?? null,
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
            \Modules\FieldLeadership\Entities\FieldLeadershipRisk::where('id', $doc->source_id)
                ->update(['status' => 'Close']);
        }
    }
}