<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\DocumentSystem\Entities\PtwDocument;

class PtwController extends Controller
{
    /**
     * PTW Documents listing page.
     */
    public function index()
    {
        return inertia('DocumentSystem/Ptw/Index', [
            'documents' => []
        ]);
    }

    /**
     * Create PTW page.
     */
    public function create()
    {
        return inertia('DocumentSystem/Ptw/Create');
    }

    /**
     * Edit PTW page.
     */
    public function edit($id)
    {
        $document = PtwDocument::with(['user', 'attachments', 'peoples'])->findOrFail($id);

        return inertia('DocumentSystem/Ptw/Create', [
            'document' => $document
        ]);
    }

    /**
     * View PTW document detail page.
     */
    public function detail($id)
    {
        return inertia('DocumentSystem/Ptw/Detail', [
            'id' => $id
        ]);
    }
}

