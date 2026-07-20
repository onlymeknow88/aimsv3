<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\DashboardPortal\app\Models\General;

class GeneralController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = General::with('user:id,name')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('project_to_date', 'like', "%{$search}%")
                  ->orWhere('manhours', 'like', "%{$search}%");
            });
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $data = $query->paginate($limit);
        } else {
            $data = $query->get();
        }

        return ResponseFormatter::success($data, 'General dashboard data retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'project_to_date'      => 'nullable|integer|min:0',
            'project_to_date_mark' => 'nullable|string|in:UP,DOWN',
            'manhours'             => 'nullable|integer|min:0',
            'manhours_mark'        => 'nullable|string|in:UP,DOWN',
            'day_after_last_lti'   => 'nullable|integer|min:0',
            'day_after_last_lti_mark' => 'nullable|string|in:UP,DOWN',
            'manpower'             => 'nullable|integer|min:0',
            'manpower_mark'        => 'nullable|string|in:UP,DOWN',
        ]);

        $general = General::create([
            'id'                      => (string) Str::uuid(),
            'user_id'                 => auth()->id(),
            'project_to_date'         => $request->project_to_date,
            'project_to_date_mark'    => $request->project_to_date_mark ?? 'UP',
            'manhours'                => $request->manhours,
            'manhours_mark'           => $request->manhours_mark ?? 'UP',
            'day_after_last_lti'      => $request->day_after_last_lti,
            'day_after_last_lti_mark' => $request->day_after_last_lti_mark ?? 'UP',
            'manpower'                => $request->manpower,
            'manpower_mark'           => $request->manpower_mark ?? 'UP',
        ]);

        return ResponseFormatter::success($general, 'General data created successfully', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'project_to_date'         => 'nullable|integer|min:0',
            'project_to_date_mark'    => 'nullable|string|in:UP,DOWN',
            'manhours'                => 'nullable|integer|min:0',
            'manhours_mark'           => 'nullable|string|in:UP,DOWN',
            'day_after_last_lti'      => 'nullable|integer|min:0',
            'day_after_last_lti_mark' => 'nullable|string|in:UP,DOWN',
            'manpower'                => 'nullable|integer|min:0',
            'manpower_mark'           => 'nullable|string|in:UP,DOWN',
        ]);

        $general = General::findOrFail($id);

        $general->update([
            'user_id'                 => auth()->id(),
            'project_to_date'         => $request->project_to_date,
            'project_to_date_mark'    => $request->project_to_date_mark ?? $general->project_to_date_mark,
            'manhours'                => $request->manhours,
            'manhours_mark'           => $request->manhours_mark ?? $general->manhours_mark,
            'day_after_last_lti'      => $request->day_after_last_lti,
            'day_after_last_lti_mark' => $request->day_after_last_lti_mark ?? $general->day_after_last_lti_mark,
            'manpower'                => $request->manpower,
            'manpower_mark'           => $request->manpower_mark ?? $general->manpower_mark,
        ]);

        return ResponseFormatter::success($general, 'General data updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $general = General::findOrFail($id);
        $general->delete();

        return ResponseFormatter::success(null, 'General data deleted successfully');
    }
}