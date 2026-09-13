<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\DashboardPortal\app\Models\NewsAndUpdate;

class NewsController extends Controller
{
    /**
     * Halaman list News & Update untuk main dashboard.
     * Data diambil client-side dari /api/portal/news/list (search + pagination).
     */
    public function index()
    {
        return Inertia::render('News/Index');
    }

    /**
     * Halaman detail News & Update untuk main dashboard.
     * Route ini berada di main app (bukan dashboard-portal) agar
     * seluruh user terautentikasi dapat mengaksesnya.
     */
    public function show(string $id)
    {
        $item = NewsAndUpdate::with('user:id,name')->findOrFail($id);

        // Generate fresh SAS URI agar attachment selalu accessible
        $blobUrl = $item->blob_url;
        if ($item->url) {
            $sas = GetBlobSasUri('aims-cntr', $item->url);
            $blobUrl = is_array($sas) ? ($sas['blobUriSas'] ?? $blobUrl) : ($sas ?: $blobUrl);
        }

        return Inertia::render('News/Detail', [
            'news' => [
                'id'          => $item->id,
                'title'       => $item->title,
                'description' => $item->description,
                'blob_url'    => $blobUrl,
                'attc'        => $item->attc,
                'author'      => $item->user?->name,
                'post_at'     => $item->created_at
                    ? \Carbon\Carbon::parse($item->created_at)->translatedFormat('d M Y')
                    : null,
            ],
        ]);
    }
}
