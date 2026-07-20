<?php


namespace Modules\DashboardPortal\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardPortalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function dashboardIndex()
    {
        return Inertia::render('DashboardPortal/Dashboard/Index');
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
}
