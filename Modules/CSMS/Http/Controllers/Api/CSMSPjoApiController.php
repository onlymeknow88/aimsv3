<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\CSMS\Entities\CsmsPjo;
use Modules\CSMS\Entities\CsmsPjoFile;

class CSMSPjoApiController extends CSMSBaseApiController
{
    // ── INDEX ─────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = min(100, max(1, (int) $request->query('limit', 10)));
        $status  = $request->query('status', '');

        $query = CsmsPjo::with(['company', 'files']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('number_pjo', 'like', "%{$search}%");
            });
        }

        if ($status) $query->where('status', $status);

        $query->orderBy('created_at', 'desc');

        $paginated = $query->paginate($perPage);

        // SAS URL tidak di-generate di index untuk menghindari N*M HTTP calls ke Azure.
        // blob_url akan di-generate on-demand saat user membuka detail atau preview file.

        return ResponseFormatter::success([
            'data'         => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page'    => $paginated->lastPage(),
            'total'        => $paginated->total(),
            'per_page'     => $paginated->perPage(),
        ], 'PJOs retrieved successfully');
    }

    // ── SHOW ──────────────────────────────────────────────────────────────────
    public function show(string $id)
    {
        $pjo = CsmsPjo::with(['company', 'ccow', 'files'])->find($id);

        if (!$pjo) {
            return ResponseFormatter::error('PJO not found', 404);
        }

        // Do NOT generate SAS URIs here — that causes N sequential Azure HTTP calls.
        // The frontend uses /preview and /download endpoints on demand instead.

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
            'criteria'        => 'nullable|string|max:255',
            'date_of_birth'   => 'nullable|date',
            'phone'           => 'nullable|string|max:50',
            'email'           => 'nullable|email|max:255',
            'date_submission' => 'nullable|date',
            'submission'      => 'nullable|string|max:255',
            // Validate typed files — all optional, max 20MB each
            'sertifikat_pop'             => 'nullable|file|max:20480',
            'sertifikat_pom'             => 'nullable|file|max:20480',
            'sertifikat_pou'             => 'nullable|file|max:20480',
            'sertifikat_ismkp'           => 'nullable|file|max:20480',
            'sertifikat_asmkp'           => 'nullable|file|max:20480',
            'cv'                         => 'nullable|file|max:20480',
            'surat_penunjukan'           => 'nullable|file|max:20480',
            'struktur_organisasi'        => 'nullable|file|max:20480',
            'persyaratan_administratif'  => 'nullable|file|max:20480',
            'surat_pernyataan'           => 'nullable|file|max:20480',
            'sertifikat_lainnya'         => 'nullable|array',
            'sertifikat_lainnya.*'       => 'nullable|file|max:20480',
        ]);

        // Typed file keys and their corresponding type labels
        $typedFileKeys = [
            'sertifikat_pop'             => 'sertifikat_pop',
            'sertifikat_pom'             => 'sertifikat_pom',
            'sertifikat_pou'             => 'sertifikat_pou',
            'sertifikat_ismkp'           => 'sertifikat_ismkp',
            'sertifikat_asmkp'           => 'sertifikat_asmkp',
            'cv'                         => 'cv',
            'surat_penunjukan'           => 'surat_penunjukan',
            'struktur_organisasi'        => 'struktur_organisasi',
            'persyaratan_administratif'  => 'persyaratan_administratif',
            'surat_pernyataan'           => 'surat_pernyataan',
        ];

        DB::beginTransaction();
        try {
            $pjo = CsmsPjo::create(array_merge($validated, [
                'status'     => self::STATUS_DRAFT,
                'created_by' => (string) auth()->id(),
            ]));

            // Upload single typed files
            foreach ($typedFileKeys as $key => $type) {
                if ($request->hasFile($key)) {
                    $this->uploadPjoFile($request->file($key), $pjo->id, $type);
                }
            }

            // Upload multiple sertifikat_lainnya files
            if ($request->hasFile('sertifikat_lainnya')) {
                $files = $request->file('sertifikat_lainnya');
                $filesArray = is_array($files) ? $files : [$files];
                foreach ($filesArray as $file) {
                    $this->uploadPjoFile($file, $pjo->id, 'sertifikat_lainnya');
                }
            }

            // Legacy generic files[] fallback
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadPjoFile($file, $pjo->id, 'other');
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

    // ── PREVIEW PJO FILE ─────────────────────────────────────────────────────
    public function previewFile(string $id)
    {
        $file = CsmsPjoFile::find($id);
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

    // ── DOWNLOAD PJO FILE ────────────────────────────────────────────────────
    public function downloadFile(string $id)
    {
        $file = CsmsPjoFile::find($id);
        if (!$file) abort(404, 'File tidak ditemukan.');

        $sas = GetBlobSasUri('aims-cntr', $file->file, 60);
        $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? null) : $sas;
        if ($url) return redirect($url);
        abort(404, 'File tidak ditemukan.');
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
