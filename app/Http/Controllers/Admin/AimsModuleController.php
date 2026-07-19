<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AimsModuleController extends Controller
{
    /**
     * Render the admin index page for AIMS modules.
     */
    public function index()
    {
        return Inertia::render('Admin/AimsModule/Index');
    }
}
