<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AimsLegacyApiController extends Controller
{
    /**
     * GET /api/document-system/aims-legacy
     * Fetches top 10 records from legacy SQL Server 'Documents' table, skipping binary/file fields.
     */
    public function index(Request $request)
    {
        try {
            $query = DB::connection('aims_legacy')
                ->table('Documents')
                ->select([
                    'Id',
                    'ModulCode',
                    'Modul',
                    'CompanyCode',
                    'Company',
                    'CategoryCode',
                    'Category',
                    'MappingCode',
                    'Mapping',
                    'Description',
                    'CreatedBy',
                    'Created',
                    'ModifiedBy',
                    'Modified',
                    'intCategory',
                    'intMapping',
                ]);

            // Apply column search filtering if parameters are provided
            if ($request->filled('Modul')) {
                $query->where('Modul', 'like', '%' . $request->query('Modul') . '%');
            }
            if ($request->filled('Company')) {
                $query->where('Company', 'like', '%' . $request->query('Company') . '%');
            }
            if ($request->filled('Category')) {
                $query->where('Category', 'like', '%' . $request->query('Category') . '%');
            }
            if ($request->filled('Mapping')) {
                $query->where('Mapping', 'like', '%' . $request->query('Mapping') . '%');
            }
            if ($request->filled('Description')) {
                $query->where('Description', 'like', '%' . $request->query('Description') . '%');
            }

            $limit = $request->query('limit', 10);
            $data = $query->orderBy('Created', 'desc')->paginate($limit);

            return ResponseFormatter::success($data, 'Legacy AIMS documents retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error(
                'Gagal mengambil data dari SQL Server legacy: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * GET /api/document-system/aims-legacy/file/{id}
     * Fetches file content on-demand based on document ID.
     */
    public function getFile(string $id)
    {
        try {
            $doc = DB::connection('aims_legacy')
                ->table('Documents')
                ->select(['FileName', 'FileType', 'FileBase'])
                ->where('Id', $id)
                ->first();

            if (!$doc) {
                return ResponseFormatter::error('Dokumen tidak ditemukan.', 404);
            }

            if (empty($doc->FileBase)) {
                return ResponseFormatter::error('Konten file kosong.', 400);
            }

            return ResponseFormatter::success([
                'FileName' => $doc->FileName ?? 'dokumen_legacy',
                'FileType' => $doc->FileType ?? 'application/pdf',
                'FileBase' => $doc->FileBase // base64 string
            ], 'File content retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error(
                'Gagal mengambil file dari SQL Server legacy: ' . $e->getMessage(),
                500
            );
        }
    }
}
