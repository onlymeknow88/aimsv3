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
    /**
     * Preview or stream attachment file
     */
    public function previewAttachment(string $id, Request $request)
    {
        $type = $request->query('type', 'document');
        if ($type === 'activity') {
            $attachment = \Modules\DocumentSystem\Entities\ActivityAttachment::findOrFail($id);
            $fileName = $attachment->name;
            $mimeType = 'application/octet-stream';
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if ($ext === 'pdf') {
                $mimeType = 'application/pdf';
            } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                $mimeType = 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext);
            }
        } elseif ($type === 'jsa') {
            $attachment = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::findOrFail($id);
            $fileName = basename($attachment->file_path);
            $mimeType = 'application/octet-stream';
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if ($ext === 'pdf') {
                $mimeType = 'application/pdf';
            } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                $mimeType = 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext);
            }
        } else {
            $attachment = Attachment::findOrFail($id);
            $fileName = $attachment->file_name;
            $mimeType = $attachment->mime_type ?? 'application/octet-stream';
        }

        $filePath = ($type === 'jsa') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');
        $localPath = Storage::disk('public')->path($filePath);

        if (!$filePath || !file_exists($localPath)) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            if ($sas) {
                $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
                if ($url) {
                    try {
                        $client = new \GuzzleHttp\Client();
                        $response = $client->get($url);
                        return response($response->getBody()->getContents(), 200, [
                            'Content-Type' => $mimeType,
                            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('Error streaming blob preview: ' . $e->getMessage());
                    }
                }
            }
            abort(404, 'File tidak ditemukan.');
        }

        return response()->file($localPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
        ]);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment(string $id, Request $request)
    {
        $type = $request->query('type', 'document');
        if ($type === 'activity') {
            $attachment = \Modules\DocumentSystem\Entities\ActivityAttachment::findOrFail($id);
            $fileName = $attachment->name;
        } elseif ($type === 'jsa') {
            $attachment = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::findOrFail($id);
            $fileName = basename($attachment->file_path);
        } else {
            $attachment = Attachment::findOrFail($id);
            $fileName = $attachment->file_name;
        }

        $filePath = ($type === 'jsa') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');
        $localPath = Storage::disk('public')->path($filePath);

        if (!$filePath || !file_exists($localPath)) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            if ($sas) {
                $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
                if ($url) {
                    return redirect($url);
                }
            }
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($localPath, $fileName);
    }

    /**
     * Generate temporary SAS / signed URL for file access
     */
    public function sasUrl(Request $request, string $id)
    {
        $type = $request->query('type', 'document');
        if ($type === 'activity') {
            $attachment = \Modules\DocumentSystem\Entities\ActivityAttachment::findOrFail($id);
        } elseif ($type === 'jsa') {
            $attachment = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::findOrFail($id);
        } else {
            $attachment = Attachment::findOrFail($id);
        }

        $filePath = ($type === 'jsa') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');
        
        if (str_starts_with($filePath, 'test/') || str_starts_with($filePath, 'complianceCMS/') || !file_exists(Storage::disk('public')->path($filePath))) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
            return response()->json(['url' => $url]);
        }

        $url = Storage::disk('public')->temporaryUrl($filePath, now()->addMinutes(30));

        return response()->json(['url' => $url]);
    }
}
