<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\JsaDocumentActivity;
use Modules\DocumentSystem\Entities\JsaDocumentPeople;

class JsaController extends Controller
{
    /**
     * List all JSA documents
     */
    public function index(Request $request)
    {
        $documents = JsaDocument::with(['activities', 'people', 'attachments'])
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Jsa/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Store new JSA document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'work_type'   => 'required|string',
            'location'    => 'required|string',
        ]);

        $doc = JsaDocument::create([
            'title'      => $request->title,
            'work_type'  => $request->work_type,
            'location'   => $request->location,
            'status'     => '1', // Draft
            'created_by' => auth()->id(),
        ]);

        return back()->with('success', 'JSA berhasil dibuat.');
    }

    /**
     * Update JSA document
     */
    public function update(Request $request, string $id)
    {
        $doc = JsaDocument::findOrFail($id);
        $doc->update($request->only(['title', 'work_type', 'location', 'status']));

        return back()->with('success', 'JSA berhasil diperbarui.');
    }

    /**
     * Delete JSA document
     */
    public function destroy(string $id)
    {
        JsaDocument::findOrFail($id)->delete();

        return back()->with('success', 'JSA berhasil dihapus.');
    }
}

