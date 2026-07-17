<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        return ResponseFormatter::success($documents, 'PTW documents retrieved successfully');
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

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc = PtwDocument::create([
            'title'       => $request->title,
            'permit_type' => $request->permit_type,
            'location'    => $request->location,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'status'      => '1', // Draft
            'user_id'     => $userId,
            'created_by'  => $userId,
        ]);

        return ResponseFormatter::success($doc, 'PTW berhasil dibuat.');
    }

    /**
     * Update PTW document
     */
    public function update(Request $request, string $id)
    {
        $doc = PtwDocument::findOrFail($id);

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc->update(array_merge(
            $request->only(['title', 'permit_type', 'location', 'start_date', 'end_date', 'status']),
            [
                'user_id' => $doc->user_id ?? $userId,
                'created_by' => $doc->created_by ?? $userId,
            ]
        ));

        return ResponseFormatter::success($doc, 'PTW berhasil diperbarui.');
    }

    /**
     * Delete PTW document
     */
    public function destroy(string $id)
    {
        $doc = PtwDocument::findOrFail($id);
        $doc->delete();

        return ResponseFormatter::success(null, 'PTW berhasil dihapus.');
    }
}

