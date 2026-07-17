<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\PtwDocument;
use Modules\DocumentSystem\Entities\Module;
use Modules\DocumentSystem\Entities\Category;
use Modules\DocumentSystem\Entities\Mapping;
use Illuminate\Support\Facades\DB;

class DocumentSystemController extends Controller
{
    /**
     * Display the dashboard statistics.
     */
    public function index()
    {
        $stats = [
            'active_docs'   => Document::whereIn('status', ['5', '7'])->count(),
            'ongoing_docs'  => Document::whereIn('status', ['1', '3', '4', '6'])->count(),
            'draft_docs'    => Document::where('status', '2')->count(),
            'obsolete_docs' => Document::where('status', '8')->count(),
            'jsa_active'    => JsaDocument::where('status', '5')->count(),
            'ptw_active'    => PtwDocument::where('status', '5')->count(),
        ];

        return inertia('DocumentSystem/Index', [
            'stats' => $stats
        ]);
    }

    /**
     * Document Maker page (Draft + Active + Expired).
     */
    public function maker()
    {
        $documents = Document::whereIn('status', ['5', '7'])
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/Maker/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Create document form page.
     */
    public function create()
    {
        return inertia('DocumentSystem/Maker/Create');
    }

    /**
     * Active Documents browser.
     */
    public function activeDocument()
    {
        $documents = Document::whereIn('status', ['5', '7'])
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/ActiveDocument/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Ongoing Review page.
     */
    public function ongoing()
    {
        $documents = Document::whereIn('status', ['1', '3', '4', '6'])
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments', 'invitedPeople'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/OnGoing/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Draft Documents workspace.
     */
    public function draft()
    {
        $documents = Document::where('status', '2')
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/Draft/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Obsolete Documents archive.
     */
    public function obsolete()
    {
        $documents = Document::where('status', '8')
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/Obsolete/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Approval Action center.
     */
    public function approval()
    {
        $documents = Document::whereIn('status', ['1', '3', '4'])
            ->with(['department.company', 'owner', 'mapping.category.module', 'attachments'])
            ->latest()
            ->get();

        return inertia('DocumentSystem/Approval/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * JSA Documents listing.
     */
    public function jsa()
    {
        $documents = JsaDocument::latest()->get();

        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * PTW Permit listing.
     */
    public function ptw()
    {
        $documents = PtwDocument::latest()->get();

        return inertia('DocumentSystem/Ptw/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Master Data Settings.
     */
    public function master()
    {
        $taxonomy = Module::with('categories.mappings')->get();

        return inertia('DocumentSystem/Master/Index', [
            'taxonomy'    => $taxonomy,
        ]);
    }
}
