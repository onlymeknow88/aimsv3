<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\Attachment;
use Modules\DocumentSystem\Entities\Activity;
use Modules\DocumentSystem\Entities\InvitedPeople;
use Modules\DocumentSystem\Services\DocumentSystemService;

class DocumentController extends Controller
{
    public function __construct(protected DocumentSystemService $service) {}

    /**
     * Maker list (Draft + Active + Expired)
     */
    public function maker(Request $request)
    {
        $documents = Document::with(['activity', 'attachments', 'invitedPeople'])
            ->whereIn('status', ['1', '2', '4', '5']) // draft, ongoing, expired, active
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Maker/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * List active documents for browsing/download
     */
    public function activeDocument(Request $request)
    {
        $documents = Document::where('status', '5') // Active
            ->with(['attachments'])
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/ActiveDocument/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Ongoing (in review) documents
     */
    public function ongoing(Request $request)
    {
        $documents = Document::where('status', '2') // Ongoing
            ->with(['activity', 'invitedPeople'])
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/OnGoing/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Draft documents workspace
     */
    public function draft(Request $request)
    {
        $documents = Document::where('status', '1') // Draft
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Draft/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Obsolete document archive
     */
    public function obsolete(Request $request)
    {
        $documents = Document::where('status', '6') // Obsolete
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Obsolete/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Store a newly created draft document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'document_level' => 'required|string',
            'department' => 'required|string',
        ]);

        $company = $request->input('company', 'PAMA');
        $docNumber = $this->service->generateDocumentNumber($company, $request->department, $request->document_level);

        $doc = Document::create([
            'title'           => $request->title,
            'document_level'  => $request->document_level,
            'description'     => $request->description,
            'prefix_code'     => "{$company}-{$request->department}-{$request->document_level}",
            'document_number' => $docNumber,
            'status'          => '1', // Draft
            'revision'        => '0',
            'doc_created'     => now(),
        ]);

        // Store invited reviewer
        if ($request->filled('invited_email')) {
            InvitedPeople::create([
                'document_id' => $doc->id,
                'email'       => $request->invited_email,
                'status'      => 0,
            ]);
        }

        return back()->with('success', 'Dokumen berhasil dibuat sebagai draft.');
    }

    /**
     * Update document metadata
     */
    public function update(Request $request, string $id)
    {
        $doc = Document::findOrFail($id);
        $doc->update($request->only(['title', 'description', 'document_level']));

        return back()->with('success', 'Dokumen berhasil diperbarui.');
    }

    /**
     * Delete document
     */
    public function destroy(string $id)
    {
        $doc = Document::findOrFail($id);
        $doc->delete();

        return back()->with('success', 'Dokumen berhasil dihapus.');
    }
}

