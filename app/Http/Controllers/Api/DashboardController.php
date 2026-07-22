<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/data
     * Aggregator utama dashboard — dipanggil oleh useDashboard.jsx saat mount.
     */
    public function getData(Request $request)
    {
        return ResponseFormatter::success([
            'coeEvents'    => $this->getCoeEvents(),
            'slideshows'   => $this->getSlideshows(),
            'generalStats' => $this->getGeneralStats(),
            'newsItems'    => $this->getNewsItems(),
        ], 'Dashboard data retrieved successfully');
    }

    /**
     * GET /api/dashboard/coe/calendar
     * Events per bulan untuk FullCalendar.
     * Query params: ?month=1&year=2024
     */
    public function coeCalendar(Request $request)
    {
        if (!class_exists('Modules\Coe\Entities\Event')) {
            return response()->json([]);
        }

        $month = (int) $request->query('month', now()->month);
        $year  = (int) $request->query('year',  now()->year);

        // Clamp ke range valid
        $month = max(1, min(12, $month));
        $year  = max(2000, min(2100, $year));

        $events = \Modules\Coe\Entities\Event::with(['category', 'section.department'])
            ->whereMonth('start_date', $month)
            ->whereYear('start_date', $year)
            ->orderBy('start_date', 'asc')
            ->get()
            ->map(fn ($event) => [
                'id'     => $event->id,
                'title'  => $event->title,
                'start'  => Carbon::parse($event->start_date)->toDateString(),
                'end'    => $event->end_date
                    ? Carbon::parse($event->end_date)->addDay()->toDateString() // FullCalendar end is exclusive
                    : null,
                'status' => strtoupper($event->status),
            ]);

        return response()->json($events);
    }

    /**
     * GET /api/dashboard/coe/events/{id}
     * Detail event untuk modal.
     */
    public function coeEventDetail(string $id)
    {
        if (!class_exists('Modules\Coe\Entities\Event')) {
            return ResponseFormatter::error('Event not found', 404);
        }

        $event = \Modules\Coe\Entities\Event::with(['category', 'section.department'])
            ->findOrFail($id);

        return ResponseFormatter::success([
            'id'              => $event->id,
            'title'           => $event->title,
            'start_date'      => $event->start_date
                ? Carbon::parse($event->start_date)->toDateTimeString()
                : null,
            'end_date'        => $event->end_date
                ? Carbon::parse($event->end_date)->toDateTimeString()
                : null,
            'dept'            => $event->section?->department?->name
                ?? $event->section?->name
                ?? '-',
            'status'          => strtoupper($event->status),
            'category'        => $event->category?->name ?? null,
            'description'     => $event->description,
            'invited_emails'  => $event->invited_emails ?? [],
            'repeat'          => (bool) $event->repeat,
        ], 'Event detail retrieved successfully');
    }

    /**
     * GET /api/dashboard/coe/stats
     * Stats untuk widget CalendarOfEventStats.
     */
    public function coeStats()
    {
        if (!class_exists('Modules\Coe\Entities\Event')) {
            return ResponseFormatter::success($this->getDefaultCoeStats(), 'No COE data available');
        }

        $year = Carbon::now()->year;
        $month = Carbon::now()->month;
        $lastYear = $year - 1;

        // YTD (Year to Date)
        $ytdCurrent = \Modules\Coe\Entities\Event::whereYear('start_date', $year)->count();
        $ytdLastYear = \Modules\Coe\Entities\Event::whereYear('start_date', $lastYear)->count();
        $ytdTrend = $ytdLastYear > 0 ? round((($ytdCurrent - $ytdLastYear) / $ytdLastYear) * 100, 1) : 0;

        // This month
        $thisMonthActual = \Modules\Coe\Entities\Event::whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->count();
        $thisMonthLastYear = \Modules\Coe\Entities\Event::whereYear('start_date', $lastYear)
            ->whereMonth('start_date', $month)
            ->count();
        $thisMonthTrend = $thisMonthLastYear > 0
            ? round((($thisMonthActual - $thisMonthLastYear) / $thisMonthLastYear) * 100, 1)
            : 0;

        // This year
        $thisYearActual = $ytdCurrent;
        $thisYearLastYear = $ytdLastYear;
        $thisYearTrend = $ytdTrend;

        // Complete & OnGoing
        $completeCount = \Modules\Coe\Entities\Event::where('status', 'DONE')->count();
        $onGoingCount = \Modules\Coe\Entities\Event::where('status', 'PENDING')->count();
        $totalEvents = \Modules\Coe\Entities\Event::count();

        // Monthly chart data (actual vs target dummy)
        $monthlyActual = \Modules\Coe\Entities\Event::selectRaw('MONTH(start_date) as month, COUNT(*) as count')
            ->whereYear('start_date', $year)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->all();

        $chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartActual = [];
        $chartTarget = [];
        for ($m = 1; $m <= 12; $m++) {
            $actual = $monthlyActual[$m] ?? 0;
            $chartActual[] = $actual;
            $chartTarget[] = max(5, $actual + rand(0, 3)); // Dummy target
        }

        // By category — dynamic dari tabel coe_categories
        $categories = \Modules\Coe\Entities\Category::withCount('events')
            ->orderBy('name', 'asc')
            ->get();
        $totalCategoryEvents = $categories->sum('events_count') ?: 1;

        $byCategory = $categories->map(fn ($cat) => [
            'name'    => $cat->name,
            'color'   => $cat->color ?? '#94a3b8',
            'count'   => $cat->events_count,
            'percent' => round(($cat->events_count / $totalCategoryEvents) * 100, 1),
        ])->values()->toArray();

        return ResponseFormatter::success([
            'ytd' => [
                'value' => $ytdCurrent,
                'trend' => $ytdTrend,
            ],
            'thisMonth' => [
                'actual' => $thisMonthActual,
                'target' => max(5, $thisMonthActual + 2),
                'trend'  => $thisMonthTrend,
            ],
            'thisYear' => [
                'actual' => $thisYearActual,
                'target' => max(50, $thisYearActual + 10),
                'trend'  => $thisYearTrend,
            ],
            'complete' => [
                'value'  => $completeCount,
                'target' => $totalEvents,
            ],
            'onGoing' => [
                'value'  => $onGoingCount,
                'target' => $totalEvents,
            ],
            'chartData' => [
                'labels' => $chartLabels,
                'actual' => $chartActual,
                'target' => $chartTarget,
            ],
            'byCategory' => $byCategory,
        ], 'COE stats retrieved successfully');
    }

    private function getDefaultCoeStats(): array
    {
        return [
            'ytd'        => ['value' => 0, 'trend' => 0],
            'thisMonth'  => ['actual' => 0, 'target' => 0, 'trend' => 0],
            'thisYear'   => ['actual' => 0, 'target' => 0, 'trend' => 0],
            'complete'   => ['value' => 0, 'target' => 0],
            'onGoing'    => ['value' => 0, 'target' => 0],
            'chartData'  => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                'actual' => array_fill(0, 12, 0),
                'target' => array_fill(0, 12, 0),
            ],
            'byCategory' => [],
        ];
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /**
     * 7 upcoming events terdekat dari hari ini, diurutkan ASC.
     * Fix bug V2: ordering DESC & tanpa filter >= today.
     */
    private function getCoeEvents(): array
    {
        if (!class_exists('Modules\Coe\Entities\Event')) {
            return [];
        }

        $events = \Modules\Coe\Entities\Event::with(['category', 'section.department'])
            ->where('start_date', '>=', Carbon::today()->toDateString())
            ->orderBy('start_date', 'asc')
            ->take(7)
            ->get();

        // Jika tidak ada event mendatang, ambil 7 event terdekat tanpa filter
        if ($events->isEmpty()) {
            $events = \Modules\Coe\Entities\Event::with(['category', 'section.department'])
                ->orderBy('start_date', 'desc')
                ->take(7)
                ->get();
        }

        return $events->map(function ($event) {
            $startDate = Carbon::parse($event->start_date);

            return [
                'id'         => $event->id,
                'title'      => $event->title,
                'day'        => $startDate->format('d'),
                'month'      => strtoupper($startDate->translatedFormat('M')),
                'start_date' => $startDate->toDateString(),
                'end_date'   => $event->end_date
                    ? Carbon::parse($event->end_date)->toDateString()
                    : null,
                // null-safe: fix bug V2 fallback hardcoded "HSE Department"
                'dept'       => $event->section?->department?->name
                    ?? $event->section?->name
                    ?? '-',
                'status'     => strtoupper($event->status),
                'category'   => $event->category?->name ?? null,
            ];
        })->toArray();
    }

    private function getSlideshows(): array
    {
        if (!class_exists('Modules\DashboardPortal\app\Models\Slideshow')) {
            return [];
        }

        return \Modules\DashboardPortal\app\Models\Slideshow::where('visible', 'true')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($slide) {
                if ($slide->url) {
                    $sas = GetBlobSasUri('aims-cntr', $slide->url);
                    $slide->blob_url = is_array($sas)
                        ? ($sas['blobUriSas'] ?? $slide->blob_url)
                        : ($sas ?: $slide->blob_url);
                }
                return $slide;
            })->toArray();
    }

    private function getGeneralStats(): mixed
    {
        if (!class_exists('Modules\DashboardPortal\app\Models\General')) {
            return null;
        }

        return \Modules\DashboardPortal\app\Models\General::orderBy('created_at', 'desc')->first();
    }

    private function getNewsItems(): array
    {
        if (!class_exists('Modules\DashboardPortal\app\Models\NewsAndUpdate')) {
            return [];
        }

        return \Modules\DashboardPortal\app\Models\NewsAndUpdate::where('visible', 'true')
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
                        ? Carbon::parse($item->created_at)->translatedFormat('d M Y')
                        : null,
                ];
            })->toArray();
    }
}
