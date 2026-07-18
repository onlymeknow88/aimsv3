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
            ->where('is_obsolate', false)
            ->with(['company', 'department', 'owner', 'mapping.category.module', 'attachments'])
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
     * Edit document form page.
     */
    public function edit($id)
    {
        $document = Document::with(['company', 'department', 'owner', 'mapping.category.module', 'attachments', 'invitedPeople'])
            ->findOrFail($id);

        if (in_array((string) $document->status, ['5', '7'])) {
            $service = new \Modules\DocumentSystem\Services\DocumentSystemService();
            $newDoc = $service->replicate($document);
            return redirect()->route('doc.active.edit', $newDoc->id);
        }

        return inertia('DocumentSystem/Maker/Create', [
            'document' => $document
        ]);
    }

    /**
     * View document detail page.
     */
    public function detail($id)
    {
        return inertia('DocumentSystem/Maker/Detail', [
            'id' => $id
        ]);
    }

    /**
     * Active Documents browser.
     */
    public function activeDocument()
    {
        return inertia('DocumentSystem/ActiveDocument/Index', [
            'documents' => []
        ]);
    }

    /**
     * Ongoing Review page.
     */
    public function ongoing()
    {
        return inertia('DocumentSystem/OnGoing/Index', [
            'documents' => []
        ]);
    }

    /**
     * Draft Documents workspace.
     */
    public function draft()
    {
        return inertia('DocumentSystem/Draft/Index', [
            'documents' => []
        ]);
    }

    /**
     * Obsolete Documents archive.
     */
    public function obsolete()
    {
        return inertia('DocumentSystem/Obsolete/Index', [
            'documents' => []
        ]);
    }

    /**
     * Approval Action center.
     */
    public function approval()
    {
        return inertia('DocumentSystem/Approval/Index', [
            'documents' => []
        ]);
    }

    /**
     * JSA Documents listing.
     */
    public function jsa()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => []
        ]);
    }

    /**
     * Create JSA page.
     */
    public function jsaCreate()
    {
        return inertia('DocumentSystem/Jsa/Create');
    }

    /**
     * Edit JSA page.
     */
    public function jsaEdit($id)
    {
        $document = JsaDocument::with(['user', 'parent'])->findOrFail($id);
        return inertia('DocumentSystem/Jsa/Create', [
            'document' => $document
        ]);
    }

    /**
     * PTW Permit listing.
     */
    public function ptw()
    {
        return inertia('DocumentSystem/Ptw/Index', [
            'documents' => []
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
