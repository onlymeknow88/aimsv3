<?php

namespace Modules\Coe\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CoeController extends Controller
{
    /**
     * Render the categories Inertia page.
     */
    public function categoryIndex()
    {
        return Inertia::render('Coe/Category/Index');
    }

    /**
     * Render the calendar Inertia page.
     */
    public function calendarIndex()
    {
        return Inertia::render('Coe/Calendar/Index');
    }

    /**
     * Render the events list Inertia page.
     */
    public function listIndex()
    {
        return Inertia::render('Coe/EventList/Index');
    }
}
