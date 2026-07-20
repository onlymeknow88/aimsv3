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
}
