<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessEntity;
use Inertia\Inertia;

class BusinessEntityController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/BusinessEntities/Index', [
            'entities' => BusinessEntity::latest()->get()
        ]);
    }

}
