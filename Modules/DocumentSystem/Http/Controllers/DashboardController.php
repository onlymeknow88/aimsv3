<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\PtwDocument;

class DashboardController extends Controller
{
    /**
     * Document System main dashboard with stats summary
     */
    public function index()
    {
        $stats = [
            'active_docs'   => Document::where('status', '5')->count(),
            'ongoing_docs'  => Document::where('status', '2')->count(),
            'draft_docs'    => Document::where('status', '1')->count(),
            'obsolete_docs' => Document::where('status', '6')->count(),
            'jsa_active'    => JsaDocument::where('status', '5')->count(),
            'ptw_active'    => PtwDocument::where('status', '5')->count(),
        ];

        return Inertia::render('DocumentSystem/Index', [
            'stats' => $stats,
        ]);
    }
}

