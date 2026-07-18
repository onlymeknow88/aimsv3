<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\JsaDocumentActivity;
use Modules\DocumentSystem\Entities\JsaDocumentPeople;

class JsaController extends Controller
{
    /**
     * JSA Documents listing page.
     */
    public function index()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => []
        ]);
    }

    /**
     * Create JSA page.
     */
    public function create()
    {
        return inertia('DocumentSystem/Jsa/Create');
    }

    /**
     * Edit JSA page.
     */
    public function edit($id)
    {
        $document = JsaDocument::with(['user', 'parent', 'attachments'])->findOrFail($id);
        return inertia('DocumentSystem/Jsa/Create', [
            'document' => $document
        ]);
    }

    /**
     * Obsolete JSA page.
     */
    public function obsolete()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => [],
            'isObsolete' => true
        ]);
    }

    /**
     * Draft JSA page.
     */
    public function draft()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => [],
            'isDraft' => true
        ]);
    }
}

