<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
            ->map(function ($item) {
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
            });

        return ResponseFormatter::success($newsItems, 'News items retrieved successfully');
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
}
