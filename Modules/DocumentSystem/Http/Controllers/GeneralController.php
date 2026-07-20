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
        } elseif ($type === 'jsa_activity') {
            $path = $request->query('path');
            if ($id !== 'none') {
                $activity = \Modules\DocumentSystem\Entities\JsaDocumentActivity::where('attachments', 'like', "%{$id}%")->firstOrFail();
                $attachmentData = collect($activity->attachments)->firstWhere('id', $id);
            } else {
                $filename = basename($path);
                $activity = \Modules\DocumentSystem\Entities\JsaDocumentActivity::where('attachments', 'like', "%{$filename}%")->firstOrFail();
                $attachmentData = collect($activity->attachments)->first(function($item) use ($path) {
                    return ($item['path'] ?? '') === $path;
                });
            }
            if (!$attachmentData) {
                abort(404);
            }
            $fileName = $attachmentData['file_name'];
            $mimeType = 'application/octet-stream';
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if ($ext === 'pdf') {
                $mimeType = 'application/pdf';
            } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                $mimeType = 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext);
            }
            $filePath = $attachmentData['path'] ?? '';
            $attachment = (object)[
                'path' => $filePath,
                'file_path' => $filePath,
            ];
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
        } elseif ($type === 'ptw') {
            $attachment = \Modules\DocumentSystem\Entities\PtwDocumentAttachment::findOrFail($id);
            $fileName = $attachment->file_name;
            $mimeType = $attachment->mime_type ?? 'application/octet-stream';
        } else {
            $attachment = Attachment::findOrFail($id);
            $fileName = $attachment->file_name;
            $mimeType = $attachment->mime_type ?? 'application/octet-stream';
        }

        $filePath = ($type === 'jsa' || $type === 'jsa_activity' || $type === 'ptw') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');
        $localPath = Storage::disk('public')->path($filePath);

        // Early return: jika path kosong langsung 404
        if (!$filePath) {
            abort(404, 'Path file tidak ditemukan.');
        }

        if (!file_exists($localPath)) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            if ($sas) {
                $url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null)
                    : $sas;

                if ($url) {
                    // Redirect ke SAS URL langsung — lebih cepat dari streaming via PHP
                    // Browser akan stream langsung dari Azure tanpa bottleneck PHP
                    return redirect($url);
                }
            }
            abort(404, 'File tidak ditemukan di storage.');
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
        } elseif ($type === 'jsa_activity') {
            $path = $request->query('path');
            if ($id !== 'none') {
                $activity = \Modules\DocumentSystem\Entities\JsaDocumentActivity::where('attachments', 'like', "%{$id}%")->firstOrFail();
                $attachmentData = collect($activity->attachments)->firstWhere('id', $id);
            } else {
                $filename = basename($path);
                $activity = \Modules\DocumentSystem\Entities\JsaDocumentActivity::where('attachments', 'like', "%{$filename}%")->firstOrFail();
                $attachmentData = collect($activity->attachments)->first(function($item) use ($path) {
                    return ($item['path'] ?? '') === $path;
                });
            }
            if (!$attachmentData) {
                abort(404);
            }
            $fileName = $attachmentData['file_name'];
            $filePath = $attachmentData['path'] ?? '';
            $attachment = (object)[
                'path' => $filePath,
                'file_path' => $filePath,
            ];
        } elseif ($type === 'jsa') {
            $attachment = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::findOrFail($id);
            $fileName = basename($attachment->file_path);
        } elseif ($type === 'ptw') {
            $attachment = \Modules\DocumentSystem\Entities\PtwDocumentAttachment::findOrFail($id);
            $fileName = $attachment->file_name;
        } else {
            $attachment = Attachment::findOrFail($id);
            $fileName = $attachment->file_name;
        }

        $filePath = ($type === 'jsa' || $type === 'jsa_activity' || $type === 'ptw') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');
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
        } elseif ($type === 'ptw') {
            $attachment = \Modules\DocumentSystem\Entities\PtwDocumentAttachment::findOrFail($id);
        } else {
            $attachment = Attachment::findOrFail($id);
        }

        $filePath = ($type === 'jsa' || $type === 'ptw') ? ($attachment->file_path ?? '') : ($attachment->path ?? '');

        if (str_starts_with($filePath, 'test/') || str_starts_with($filePath, 'complianceCMS/') || !file_exists(Storage::disk('public')->path($filePath))) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
            return response()->json(['url' => $url]);
        }

        $url = Storage::disk('public')->temporaryUrl($filePath, now()->addMinutes(30));

        return response()->json(['url' => $url]);
    }
}
