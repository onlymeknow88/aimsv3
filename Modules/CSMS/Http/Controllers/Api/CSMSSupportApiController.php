<?php

namespace Modules\CSMS\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\CSMS\Entities\CsmsMasterDataChecklist;
use Modules\CSMS\Entities\CsmsMemoKtt;
use Modules\CSMS\Entities\CsmsMemoKttFile;
use Modules\CSMS\Entities\CsmsLetter;
use Modules\CSMS\Entities\CsmsDictionary;
use Modules\CSMS\Entities\CsmsPica;
use App\Models\Company;
use App\Models\BusinessEntity;

class CSMSSupportApiController extends CSMSBaseApiController
{
    // ── MASTER DATA ───────────────────────────────────────────────────────────
    public function masterData()
    {
        $companies = Company::with('manager')
            ->orderBy('company_name')
            ->get()
            ->map(function ($c) {
                return (object) [
                    'id'        => $c->id,
                    'name'      => $c->company_name,
                    'type'      => $c->type,
                    'user_id'   => $c->user_id,
                    'user_name' => $c->manager?->name ?? '-',
                ];
            });

        $masterChecklists = CsmsMasterDataChecklist::orderBy('ordinal_number')->get();

        $businessEntities = BusinessEntity::select('id', 'name')
            ->orderBy('name')
            ->get();

        return ResponseFormatter::success([
            'companies'         => $companies,
            'master_checklists' => $masterChecklists,
            'service_criterias' => ['CONTRACTOR', 'SUBCONTRACTOR'],
            'classifications'   => [
                'Kontraktor Utama',
                'Kontraktor Langsung',
                'Subkontraktor Tunggal',
                'Kontraktor Bersama',
            ],
            'business_entities' => $businessEntities,
        ], 'Master data retrieved successfully');
    }

    // ── MEMO KTT — INDEX ─────────────────────────────────────────────────────
    public function indexMemoKtts(Request $request)
    {
        $q = CsmsMemoKtt::query()
            ->from('csms_memo_ktts as m')
            ->leftJoin('companies as c', 'm.ccow_id', '=', 'c.id')
            ->leftJoin('users as u', 'm.ktt_id', '=', 'u.id')
            ->select([
                'm.*',
                'c.company_name as ccow_name',
                'u.name as ktt_name',
                DB::raw('(SELECT COUNT(*) FROM csms_memo_ktt_files WHERE csms_memo_ktt_files.memo_id = m.id) as files_count'),
            ])
            ->orderBy('m.created_at', 'desc');

        if ($s = $request->search) {
            $q->where(function ($query) use ($s) {
                $query->where('m.memo_number', 'like', "%{$s}%")
                      ->orWhere('m.title', 'like', "%{$s}%");
            });
        }

        $data = $q->paginate($request->limit ?? 10);

        // Attach files tanpa generate SAS — SAS di-generate on-demand via endpoint preview/download
        foreach ($data->items() as $item) {
            $item->files = CsmsMemoKttFile::where('memo_id', $item->id)
                ->select(['id', 'memo_id', 'name', 'size', 'file'])
                ->get();
        }

        return ResponseFormatter::success($data);
    }

    // ── MEMO KTT — STORE ─────────────────────────────────────────────────────
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

        $company = Company::find($request->ccow_id);
        $kttId   = $company?->user_id ?? $request->ktt_id;

        DB::beginTransaction();
        try {
            $memo = CsmsMemoKtt::create([
                'ccow_id'     => $request->ccow_id,
                'ktt_id'      => $kttId,
                'memo_number' => $request->memo_number,
                'title'       => $request->title,
                'date'        => $request->date,
                'description' => $request->description,
                'status'      => $request->status ?? 'Active',
            ]);

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $this->uploadMemoKttFile($file, $memo->id);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('CSMS: gagal store Memo KTT', ['error' => $e->getMessage()]);
            return ResponseFormatter::error('Gagal menyimpan Memo KTT: ' . $e->getMessage(), 500);
        }

        $memoUpdated = CsmsMemoKtt::query()
            ->from('csms_memo_ktts as m')
            ->leftJoin('companies as c', 'm.ccow_id', '=', 'c.id')
            ->leftJoin('users as u', 'm.ktt_id', '=', 'u.id')
            ->select(['m.*', 'c.company_name as ccow_name', 'u.name as ktt_name'])
            ->where('m.id', $memo->id)
            ->first();

        return ResponseFormatter::success($memoUpdated, 'Memo KTT berhasil dibuat.', 201);
    }

    // ── MEMO KTT FILE PREVIEW & DOWNLOAD ────────────────────────────────────
    public function previewMemoKttFile(string $id)
    {
        $file = CsmsMemoKttFile::find($id);
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

    public function downloadMemoKttFile(string $id)
    {
        $file = CsmsMemoKttFile::find($id);
        if (!$file) abort(404, 'File tidak ditemukan.');

        $sas = GetBlobSasUri('aims-cntr', $file->file, 60);
        $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? null) : $sas;
        if ($url) return redirect($url);
        abort(404, 'File tidak ditemukan.');
    }

    // ── LETTERS — INDEX ───────────────────────────────────────────────────────
    public function indexLetters(Request $request)
    {
        $q = CsmsLetter::orderBy('created_at', 'desc');
        if ($s = $request->search) {
            $q->where('title', 'like', "%{$s}%");
        }
        return ResponseFormatter::success($q->paginate($request->limit ?? 10));
    }

    // ── LETTERS — STORE ───────────────────────────────────────────────────────
    public function storeLetter(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $letter = CsmsLetter::create([
            'title'  => $request->title,
            'status' => $request->status ?? 'Active',
        ]);

        return ResponseFormatter::success(
            $letter,
            'Surat Edaran berhasil dibuat.',
            201
        );
    }

    // ── DICTIONARIES — INDEX ──────────────────────────────────────────────────
    public function indexDictionaries(Request $request)
    {
        $q = CsmsDictionary::orderBy('term');
        if ($s = $request->search) {
            $q->where('term', 'like', "%{$s}%")
              ->orWhere('definition', 'like', "%{$s}%");
        }
        return ResponseFormatter::success($q->paginate($request->limit ?? 10));
    }

    // ── DICTIONARIES — STORE ──────────────────────────────────────────────────
    public function storeDictionary(Request $request)
    {
        $request->validate([
            'term'       => 'required|string|max:255',
            'definition' => 'required|string',
        ]);

        $dict = CsmsDictionary::create([
            'term'       => $request->term,
            'definition' => $request->definition,
        ]);

        return ResponseFormatter::success(
            $dict,
            'Istilah berhasil ditambahkan.',
            201
        );
    }

    // ── PICA — INDEX ──────────────────────────────────────────────────────────
    public function indexPicas(Request $request)
    {
        $q = CsmsPica::with('bidding')->orderBy('created_at', 'desc');

        if ($s = $request->search) {
            $q->where('description', 'like', "%{$s}%");
        }
        if ($st = $request->status) {
            $q->where('status', $st);
        }

        return ResponseFormatter::success($q->paginate($request->limit ?? 10));
    }
}
