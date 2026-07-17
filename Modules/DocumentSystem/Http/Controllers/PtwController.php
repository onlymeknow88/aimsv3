<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\DocumentSystem\Entities\PtwDocument;
use Modules\DocumentSystem\Entities\PtwDocumentActivity;
use Modules\DocumentSystem\Entities\PtwDocumentPeople;

class PtwController extends Controller
{
    /**
     * List all PTW documents
     */
    public function index(Request $request)
    {
        $documents = PtwDocument::with(['activities', 'people', 'attachments'])
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Ptw/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Store new PTW permit
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'permit_type' => 'required|string',
            'location'    => 'required|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
        ]);

        $doc = PtwDocument::create([
            'title'       => $request->title,
            'permit_type' => $request->permit_type,
            'location'    => $request->location,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'status'      => '1', // Draft
            'created_by'  => auth()->id(),
        ]);

        return back()->with('success', 'PTW berhasil dibuat.');
    }

    /**
     * Update PTW document
     */
    public function update(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);
        $doc->update($request->only(['title', 'permit_type', 'location', 'start_date', 'end_date', 'status']));

        return back()->with('success', 'PTW berhasil diperbarui.');
    }

    /**
     * Delete PTW document
     */
    public function destroy(string $id)
    {
        PtwDocument::findOrFail($id)->delete();

        return back()->with('success', 'PTW berhasil dihapus.');
    }
}

