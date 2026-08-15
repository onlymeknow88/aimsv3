<?php


namespace Modules\DashboardPortal\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardPortalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboardIndex()
    {
        $widgets = DB::table('app_settings')
            ->where('id', 'like', 'widget_%')
            ->orderBy('id')
            ->get();

        return Inertia::render('DashboardPortal/Dashboard/Index', [
            'widgets' => $widgets
        ]);
    }

    /**
     * Update widget setting.
     */
    public function updateSetting(Request $request)
    {
        $request->validate([
            'id' => 'required|string|exists:app_settings,id',
            'val' => 'required|string'
        ]);

        DB::table('app_settings')
            ->where('id', $request->id)
            ->update([
                'val' => $request->val,
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Setting updated successfully']);
    }
    /**
     * Display a listing of the resource.
     */
    public function slideshowIndex()
    {
        return Inertia::render('DashboardPortal/Slideshow/Index');
    }
    /**
     * Display a listing of the resource.
     */
    public function bannerIndex()
    {
        return Inertia::render('DashboardPortal/Banner/Index');
    }

    /**
     * Display a listing of the resource.
     */
    public function generalIndex()
    {
        return Inertia::render('DashboardPortal/General/Index');
    }

    /**
     * Display a listing of the resource.
     */
    public function newsAndUpdateIndex()
    {
        return Inertia::render('DashboardPortal/NewsAndUpdate/Index');
    }

    /**
     * Display incident notification page.
     */
    public function incidentNotificationIndex()
    {
        return Inertia::render('DashboardPortal/IncidentNotification/Index');
    }

    /**
     * Display production page.
     */
    public function productionIndex()
    {
        return Inertia::render('DashboardPortal/Production/Index');
    }

    public function safetyPerformanceIndex()
    {
        return Inertia::render('DashboardPortal/SafetyPerformance/Index');
    }

    public function healthPerformanceIndex()
    {
        return Inertia::render('DashboardPortal/HealthPerformance/Index');
    }
}
