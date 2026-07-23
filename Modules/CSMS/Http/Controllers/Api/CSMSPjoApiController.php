<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\CSMS\Entities\CsmsPjo;

class CSMSPjoApiController extends CSMSBaseApiController
{
    // ── INDEX ─────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $page   = max(1, (int) $request->query('page', 1));
        $limit  = min(100, max(1, (int) $request->query('limit', 10)));
        $status = $request->query('status', '');

        $query = CsmsPjo::with(['company', 'files']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('number_pjo', 'like', "%{$search}%");
            });
        }

        if ($status) $query->where('status', $status);

        $query->orderBy('created_at', 'desc');
        $total    = $query->count();
        $lastPage = max(1, (int) ceil($total / $limit));
        $items    = $query->offset(($page - 1) * $limit)->limit($limit)->get();

        $items = $items->map(function ($pjo) {
            $pjo->files->map(function ($f) {
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

    // ── SHOW ──────────────────────────────────────────────────────────────────
    public function show(string $id)
    {
        $pjo = CsmsPjo::with(['company', 'ccow', 'files'])->find($id);

        if (!$pjo) {
            return ResponseFormatter::error('PJO not found', 404);
        }

        $pjo->files->map(function ($f) {
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
            'files' => $pjo->files,
        ], 'PJO retrieved successfully');
    }

    // ── STORE ─────────────────────────────────────────────────────────────────
    public function store(Request $request)
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
            $pjo = CsmsPjo::create(array_merge($validated, [
                'status'     => self::STATUS_DRAFT,
                'created_by' => (string) auth()->id(),
            ]));

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadPjoFile($file, $pjo->id);
                }
            }

            DB::commit();
            return ResponseFormatter::success(['id' => $pjo->id], 'PJO created successfully', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return ResponseFormatter::error('Gagal menyimpan PJO: ' . $e->getMessage(), 500);
        }
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    public function update(Request $request, string $id)
    {
        $pjo = CsmsPjo::find($id);
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
            $pjo->update($validated);

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

    // ── DESTROY ───────────────────────────────────────────────────────────────
    public function destroy(string $id)
    {
        $pjo = CsmsPjo::find($id);
        if (!$pjo) return ResponseFormatter::error('PJO not found', 404);
        $pjo->delete();
        return ResponseFormatter::success(null, 'PJO deleted successfully');
    }
}