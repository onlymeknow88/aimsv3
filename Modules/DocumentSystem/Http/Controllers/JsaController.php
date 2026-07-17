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
     * List all JSA documents
     */
    public function index(Request $request)
    {
        $documents = JsaDocument::with(['activities', 'people', 'attachments'])
            ->latest()
            ->get();

        return ResponseFormatter::success($documents, 'JSA documents retrieved successfully');
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

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc = JsaDocument::create([
            'title'      => $request->title,
            'work_type'  => $request->work_type,
            'location'   => $request->location,
            'status'     => '1', // Draft
            'created_by' => $userId,
        ]);

        return ResponseFormatter::success($doc, 'JSA berhasil dibuat.');
    }

    /**
     * Update JSA document
     */
    public function update(Request $request, string $id)
    {
        $doc = JsaDocument::findOrFail($id);
        $doc->update($request->only(['title', 'work_type', 'location', 'status']));

        return ResponseFormatter::success($doc, 'JSA berhasil diperbarui.');
    }

    /**
     * Delete JSA document
     */
    public function destroy(string $id)
    {
        $doc = JsaDocument::findOrFail($id);
        $doc->delete();

        return ResponseFormatter::success(null, 'JSA berhasil dihapus.');
    }
}

