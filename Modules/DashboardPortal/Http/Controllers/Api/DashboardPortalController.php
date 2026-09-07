<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\DashboardPortal\app\Models\NewsAndUpdate;

class DashboardPortalController extends Controller
{
    /**
     * GET /api/portal/news
     * Retrieve latest 6 visible news items for the public dashboard widget.
     */
    public function newsIndex()
    {
        $newsItems = NewsAndUpdate::where('visible', 'true')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(fn ($item) => $this->mapNewsItem($item));

        return ResponseFormatter::success($newsItems, 'News items retrieved successfully');
    }

    /**
     * GET /api/portal/news/list
     * List lengkap berita (visible saja) dengan search + pagination
     * untuk halaman News & Update main dashboard.
     *
     * CATATAN: route ini harus didaftarkan SEBELUM /portal/news/{id}.
     */
    public function newsList(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $limit  = min(50, max(1, (int) $request->query('limit', 12)));
        $page   = max(1, (int) $request->query('page', 1));

        $query = NewsAndUpdate::where('visible', 'true')
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc');

        $total = (clone $query)->count();

        $items = $query
            ->forPage($page, $limit)
            ->get()
            ->map(fn ($item) => $this->mapNewsItem($item));

        return ResponseFormatter::success([
            'data'       => $items,
            'pagination' => [
                'total'      => $total,
                'page'       => $page,
                'limit'      => $limit,
                'total_page' => (int) ceil($total / $limit),
            ],
        ], 'News list retrieved successfully');
    }

    /**
     * Map item berita + refresh SAS URI attachment agar selalu accessible.
     */
    private function mapNewsItem($item): array
    {
        if ($item->url) {
            $sas = GetBlobSasUri('aims-cntr', $item->url);
            $item->blob_url = is_array($sas)
                ? ($sas['blobUriSas'] ?? $item->blob_url)
                : ($sas ?: $item->blob_url);
        }

        return [
            'id'          => $item->id,
            'title'       => $item->title,
            'slug'        => $item->slug,
            'description' => $item->description,
            'blob_url'    => $item->blob_url ?? null,
            'attc'        => $item->attc,
            'post_at'     => $item->created_at
                ? \Carbon\Carbon::parse($item->created_at)->translatedFormat('d M Y')
                : null,
        ];
    }

    /**
     * GET /api/portal/news/{id}
     * Retrieve full detail of a single news item, with fresh SAS URI for attachment.
     */
    public function newsShow($id)
    {
        $item = NewsAndUpdate::with('user:id,name')->findOrFail($id);

        $blobUrl = $item->blob_url ?? null;

        // Generate fresh SAS URI so the attachment is always accessible
        if ($item->url) {
            $sas = GetBlobSasUri('aims-cntr', $item->url);
            $blobUrl = is_array($sas)
                ? ($sas['blobUriSas'] ?? $blobUrl)
                : ($sas ?: $blobUrl);
        }

        return ResponseFormatter::success([
            'id'          => $item->id,
            'title'       => $item->title,
            'slug'        => $item->slug,
            'description' => $item->description,
            'blob_url'    => $blobUrl,
            'attc'        => $item->attc,
            'author'      => $item->user?->name,
            'post_at'     => $item->created_at
                ? \Carbon\Carbon::parse($item->created_at)->translatedFormat('d M Y')
                : null,
        ], 'News detail retrieved successfully');
    }

    /**
     * GET /api/portal/news/{id}/download
     * Stream attachment berita dari Azure Blob Storage sebagai forced download.
     *
     * Proxy server-side diperlukan karena atribut `download` HTML diabaikan
     * browser untuk URL cross-origin (blob SAS URL) — PDF/gambar akan terbuka
     * di tab, bukan tersimpan.
     */
    public function newsDownload($id)
    {
        $item = NewsAndUpdate::findOrFail($id);

        if (empty($item->url)) {
            return response()->json([
                'success' => false,
                'message' => 'Attachment tidak ditemukan',
            ], 404);
        }

        $sas    = GetBlobSasUri('aims-cntr', $item->url);
        $sasUrl = is_array($sas) ? ($sas['blobUriSas'] ?? null) : ($sas ?: null);

        if (empty($sasUrl)) {
            Log::error('newsDownload: gagal generate SAS URI', ['id' => $item->id]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyiapkan unduhan',
            ], 502);
        }

        // Nama file: pakai attc, fallback dari path blob
        $fileName = $item->attc ?: (string) basename((string) parse_url($item->url, PHP_URL_PATH));
        if ($fileName === '') {
            $fileName = 'attachment-' . $item->id;
        }

        try {
            $client   = new Client(['verify' => config('app.env') === 'production']);
            $response = $client->request('GET', $sasUrl, ['stream' => true]);
        } catch (\Throwable $e) {
            Log::error('newsDownload: gagal mengambil file dari blob: ' . $e->getMessage(), ['id' => $item->id]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil file dari storage',
            ], 502);
        }

        $headers = [
            'Content-Type'        => $response->getHeaderLine('Content-Type') ?: 'application/octet-stream',
            'Content-Disposition' => sprintf(
                'attachment; filename="%s"; filename*=UTF-8\'\'%s',
                str_replace('"', '', $fileName),
                rawurlencode($fileName)
            ),
            'Cache-Control'       => 'no-store',
        ];

        if (($length = $response->getHeaderLine('Content-Length')) !== '') {
            $headers['Content-Length'] = $length;
        }

        return response()->stream(function () use ($response) {
            $body = $response->getBody();
            while (! $body->eof()) {
                echo $body->read(8192);
                if (connection_aborted()) {
                    return;
                }
                flush();
            }
        }, 200, $headers);
    }
}
