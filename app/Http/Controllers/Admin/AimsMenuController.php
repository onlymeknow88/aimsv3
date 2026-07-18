<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AimsMenuController extends Controller
{
    /**
     * Render halaman Inertia Admin/AimsMenu/Index
     */
    public function index()
    {
        return Inertia::render('Admin/AimsMenu/Index');
    }
}
