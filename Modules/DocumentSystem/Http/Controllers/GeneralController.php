<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Modules\DocumentSystem\Entities\Attachment;

class GeneralController extends Controller
{
    /**
     * Preview or stream attachment file
     */
    public function previewAttachment(string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $path = Storage::disk('public')->path($attachment->file_path);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->file($path, [
            'Content-Type' => $attachment->mime_type ?? 'application/octet-stream',
        ]);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment(string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $path = Storage::disk('public')->path($attachment->file_path);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($path, $attachment->file_name);
    }

    /**
     * Generate temporary SAS / signed URL for file access
     */
    public function sasUrl(Request $request, string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $url = Storage::disk('public')->temporaryUrl($attachment->file_path, now()->addMinutes(30));

        return response()->json(['url' => $url]);
    }
}
