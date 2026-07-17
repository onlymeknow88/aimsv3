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
        $localPath = Storage::disk('public')->path($attachment->path ?? '');

        if (!$attachment->path || !file_exists($localPath)) {
            $sas = GetBlobSasUri('aims-cntr', $attachment->path ?? '');
            if ($sas) {
                $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
                if ($url) {
                    try {
                        $client = new \GuzzleHttp\Client();
                        $response = $client->get($url);
                        return response($response->getBody()->getContents(), 200, [
                            'Content-Type' => $attachment->mime_type ?? 'application/octet-stream',
                            'Content-Disposition' => 'inline; filename="' . $attachment->file_name . '"',
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('Error streaming blob preview: ' . $e->getMessage());
                    }
                }
            }
            abort(404, 'File tidak ditemukan.');
        }

        return response()->file($localPath, [
            'Content-Type' => $attachment->mime_type ?? 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="' . $attachment->file_name . '"',
        ]);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment(string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $localPath = Storage::disk('public')->path($attachment->path ?? '');

        if (!$attachment->path || !file_exists($localPath)) {
            $sas = GetBlobSasUri('aims-cntr', $attachment->path ?? '');
            if ($sas) {
                $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
                if ($url) {
                    return redirect($url);
                }
            }
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($localPath, $attachment->file_name);
    }

    /**
     * Generate temporary SAS / signed URL for file access
     */
    public function sasUrl(Request $request, string $id)
    {
        $attachment = Attachment::findOrFail($id);
        $filePath = $attachment->path ?? '';
        
        if (str_starts_with($filePath, 'test/') || str_starts_with($filePath, 'complianceCMS/') || !file_exists(Storage::disk('public')->path($filePath))) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
            return response()->json(['url' => $url]);
        }

        $url = Storage::disk('public')->temporaryUrl($filePath, now()->addMinutes(30));

        return response()->json(['url' => $url]);
    }
}
