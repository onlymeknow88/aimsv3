<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseFormatter;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getData(Request $request)
    {
        $events = [];
        if (class_exists('Modules\Coe\Entities\Event')) {
            $query = \Modules\Coe\Entities\Event::with(['category', 'section'])->orderBy('start_date', 'asc');
            $rawEvents = (clone $query)->where('start_date', '>=', now()->toDateString())->limit(5)->get();
            if ($rawEvents->isEmpty()) {
                $rawEvents = $query->limit(5)->get();
            }
            $events = $rawEvents->map(function ($event) {
                $startDate = \Carbon\Carbon::parse($event->start_date);

                $statusColor = '#FF8C24';
                if ($event->status === 'Completed') {
                    $statusColor = '#2FBF71';
                } elseif ($event->status === 'Cancelled') {
                    $statusColor = '#F44336';
                }

                return [
                    'date'   => strtoupper($startDate->translatedFormat('d M')), // e.g. "23 JUN"
                    'title'  => $event->title,
                    'dept'   => $event->section->name ?? ($event->category->name ?? 'General'),
                    'status' => strtoupper($event->status),
                    'color'  => $statusColor,
                ];
            })->toArray();
        }

        $slideshows = [];
        if (class_exists('Modules\DashboardPortal\app\Models\Slideshow')) {
            $slideshows = \Modules\DashboardPortal\app\Models\Slideshow::where('visible', 'true')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($slide) {
                    if ($slide->url) {
                        $sas = GetBlobSasUri('aims-cntr', $slide->url);
                        $slide->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $slide->blob_url) : ($sas ?: $slide->blob_url);
                    }
                    return $slide;
                })->toArray();
        }

        // Fetch latest general KPI stats from dashboard_general
        $generalStats = null;
        if (class_exists('Modules\DashboardPortal\app\Models\General')) {
            $generalStats = \Modules\DashboardPortal\app\Models\General::orderBy('created_at', 'desc')->first();
        }

        // Fetch latest news and updates (visible only, max 6 items)
        $newsItems = [];
        if (class_exists('Modules\DashboardPortal\app\Models\NewsAndUpdate')) {
            $newsItems = \Modules\DashboardPortal\app\Models\NewsAndUpdate::where('visible', 'true')
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
                        'blob_url'    => $item->blob_url,
                        'attc'        => $item->attc,
                        'post_at'     => $item->created_at
                            ? \Carbon\Carbon::parse($item->created_at)->translatedFormat('d M Y')
                            : null,
                    ];
                })->toArray();
        }

        return ResponseFormatter::success([
            'coeEvents'    => $events,
            'slideshows'   => $slideshows,
            'generalStats' => $generalStats,
            'newsItems'    => $newsItems,
        ], 'Dashboard data retrieved successfully');
    }
}
