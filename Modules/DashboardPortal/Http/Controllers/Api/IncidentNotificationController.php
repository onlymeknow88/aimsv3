<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\UserActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\DashboardPortal\app\Models\IncidentNotification;

class IncidentNotificationController extends Controller
{
    /**
     * GET /api/dashboard-portal/incident-notification
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');
            $page   = $request->query('page', 1);

            $query = IncidentNotification::query();

            if (!empty($search)) {
                $query->where('case', 'like', "%{$search}%");
            }

            $data = $query->orderBy('date', 'desc')->paginate($limit, ['*'], 'page', $page);

            return ResponseFormatter::success($data, 'Incident notifications retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/incident-notification
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'date'        => 'required|date',
                'case'        => 'required|string|max:500',
                'category'    => 'required|string|max:255',
                'description' => 'required|string',
                'file'        => 'nullable|file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx',
            ]);

            $input = $request->only(['date', 'case', 'category', 'description']);
            $input['user_id'] = auth()->id();
            $input['slug']    = Str::slug($request->input('case'), '-');
            $input['visible'] = 'true';

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $name = Str::slug($request->input('case'), '-') . time() . '.' . $file->extension();
                $path = $file->storeAs('incident_notification', $name, 'public');
                $input['attc'] = $path;
                $input['url']  = Storage::disk('public')->url($path);
            }

            $record = IncidentNotification::create($input);

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'create',
                resource: 'IncidentNotification',
                resourceId: $record->id,
                description: "Membuat incident notification baru '{$record->case}'",
                newData: $record->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($record, 'Incident notification created successfully', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error creating data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT/POST /api/dashboard-portal/incident-notification/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $record = IncidentNotification::findOrFail($id);

            $request->validate([
                'date'        => 'required|date',
                'case'        => 'required|string|max:500',
                'category'    => 'required|string|max:255',
                'description' => 'required|string',
                'file'        => 'nullable|file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx',
            ]);

            $oldData = $record->toArray();
            $input   = $request->only(['date', 'case', 'category', 'description']);
            $input['slug'] = Str::slug($request->input('case'), '-');

            if ($request->hasFile('file')) {
                if ($record->attc) {
                    Storage::disk('public')->delete($record->attc);
                }
                $file = $request->file('file');
                $name = Str::slug($request->input('case'), '-') . time() . '.' . $file->extension();
                $path = $file->storeAs('incident_notification', $name, 'public');
                $input['attc'] = $path;
                $input['url']  = Storage::disk('public')->url($path);
            }

            $record->update($input);

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'update',
                resource: 'IncidentNotification',
                resourceId: $record->id,
                description: "Memperbarui incident notification '{$record->case}'",
                oldData: $oldData,
                newData: $record->fresh()->toArray(),
                request: $request,
            );

            return ResponseFormatter::success($record->fresh(), 'Incident notification updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseFormatter::error($e->errors(), 422);
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error updating data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE/POST /api/dashboard-portal/incident-notification/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $record  = IncidentNotification::findOrFail($id);
            $oldData = $record->toArray();
            $record->delete();

            UserActivityLogService::log(
                module: 'dashboard_portal',
                action: 'delete',
                resource: 'IncidentNotification',
                resourceId: (string) $id,
                description: "Menghapus incident notification '{$oldData['case']}'",
                oldData: $oldData,
                request: $request,
            );

            return ResponseFormatter::success(null, 'Incident notification deleted successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error deleting data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/incident-notification/bulk-delete
     */
    public function bulkDestroy(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array', 'ids.*' => 'required|string']);
            $count = IncidentNotification::whereIn('id', $request->input('ids'))->delete();

            return ResponseFormatter::success(['deleted' => $count], "{$count} incident notification berhasil dihapus");
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error bulk deleting: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/incident-notification/{id}/toggle-visible
     */
    public function toggleVisible(Request $request, $id)
    {
        try {
            $record          = IncidentNotification::findOrFail($id);
            $record->visible = $record->visible === 'true' ? 'false' : 'true';
            $record->save();

            return ResponseFormatter::success($record, 'Visibility toggled successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error toggling visibility: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/dashboard-portal/incident-notification/bulk-toggle-visible
     */
    public function bulkToggleVisible(Request $request)
    {
        try {
            $request->validate(['ids' => 'required|array', 'ids.*' => 'required|string']);

            $ids        = $request->input('ids');
            $records    = IncidentNotification::whereIn('id', $ids)->get();
            $trueCount  = $records->where('visible', 'true')->count();
            $newVisible = $trueCount > ($records->count() / 2) ? 'false' : 'true';

            IncidentNotification::whereIn('id', $ids)->update(['visible' => $newVisible]);

            return ResponseFormatter::success(
                ['updated' => $records->count(), 'visible' => $newVisible],
                'Bulk visibility updated successfully'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error bulk toggling visibility: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/dashboard-portal/incident-notification/stats
     * Widget stats for the main dashboard.
     */
    public function stats(Request $request)
    {
        try {
            $year = $request->query('year');
            $parsedYears = array_filter(array_map('intval', explode(',', $year)));
            $primaryYear = !empty($parsedYears) ? $parsedYears[0] : null;
            $trendYear = $primaryYear ?: now()->year;

            $baseQuery = $primaryYear
                ? IncidentNotification::whereYear('date', $primaryYear)
                : IncidentNotification::query();

            $summary = [
                'total'    => (clone $baseQuery)->count(),
                'thisYear' => IncidentNotification::whereYear('date', $trendYear)->count(),
                'visible'  => (clone $baseQuery)->where('visible', 'true')->count(),
            ];

            $monthly   = IncidentNotification::selectRaw(
                    "DATE_FORMAT(date, '%b') as month, MONTH(date) as month_num, COUNT(*) as count"
                )
                ->whereYear('date', $trendYear)
                ->groupByRaw("DATE_FORMAT(date, '%b'), MONTH(date)")
                ->orderBy('month_num')
                ->get()
                ->map(fn($r) => ['month' => $r->month, 'count' => (int) $r->count]);

            $category = (clone $baseQuery)
                ->selectRaw('category, COUNT(*) as count')
                ->whereNotNull('category')
                ->groupBy('category')
                ->orderByDesc('count')
                ->get()
                ->map(fn($r) => ['category' => $r->category, 'count' => (int) $r->count]);

            // ── Recent incidents (5 terbaru, visible) ────────────────────────
            $recent = IncidentNotification::where('visible', 'true')
                ->orderByDesc('date')
                ->limit(5)
                ->get(['id', 'date', 'case', 'category'])
                ->map(fn($r) => [
                    'id'       => $r->id,
                    'date'     => $r->date,
                    'case'     => $r->case,
                    'category' => $r->category,
                ]);

            return ResponseFormatter::success(
                compact('summary', 'monthly', 'category', 'recent'),
                'Incident stats retrieved successfully'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving incident stats: ' . $e->getMessage(), 500);
        }
    }
}
