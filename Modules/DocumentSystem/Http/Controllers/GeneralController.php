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

        // Uncontrolled copy — path passed directly via query string
        if ($type === 'uncontrolled') {
            $filePath = $request->query('path');
            if (!$filePath) abort(404, 'Path tidak ditemukan.');
            $fileName = basename($filePath);
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $mimeType = match($ext) {
                'pdf'                    => 'application/pdf',
                'png'                    => 'image/png',
                'jpg', 'jpeg'            => 'image/jpeg',
                'gif'                    => 'image/gif',
                'webp'                   => 'image/webp',
                'docx'                   => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc'                    => 'application/msword',
                'xlsx'                   => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'xls'                    => 'application/vnd.ms-excel',
                'pptx'                   => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'ppt'                    => 'application/vnd.ms-powerpoint',
                default                  => 'application/octet-stream',
            };
            $localPath = Storage::disk('public')->path($filePath);
            if (!file_exists($localPath)) {
                $sas = GetBlobSasUri('aims-cntr', $filePath);
                $url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                    : $sas;
                if ($url) {
                    try {
                        $client = new \GuzzleHttp\Client([
                            'verify' => config('app.env') === 'production'
                        ]);
                        $fileContents = $client->get($url)->getBody()->getContents();
                    } catch (\Throwable $e) {
                        abort(404, 'File tidak dapat diambil dari storage.');
                    }
                    return response($fileContents, 200, [
                        'Content-Type' => $mimeType,
                        'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
                        'Cache-Control' => 'private, max-age=300',
                    ]);
                }
            }
            return response()->file($localPath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
            ]);
        }
        if ($type === 'activity') {
            $attachment = \Modules\DocumentSystem\Entities\ActivityAttachment::findOrFail($id);
            $fileName = $attachment->name;
            $mimeType = $this->getMimeType($fileName, $attachment->file_type ?? null);
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
            $mimeType = $this->getMimeType($fileName, $attachmentData['file_type'] ?? null);
            $filePath = $attachmentData['path'] ?? '';
            $attachment = (object)[
                'path' => $filePath,
                'file_path' => $filePath,
            ];
        } elseif ($type === 'jsa') {
            $attachment = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::findOrFail($id);
            $fileName = basename($attachment->file_path);
            $mimeType = $this->getMimeType($fileName, $attachment->file_type ?? null);
        } elseif ($type === 'ptw') {
            $attachment = \Modules\DocumentSystem\Entities\PtwDocumentAttachment::findOrFail($id);
            $fileName = $attachment->file_name;
            $mimeType = $this->getMimeType($fileName, $attachment->mime_type ?? null);
        } else {
            $attachment = Attachment::findOrFail($id);
            $fileName = $attachment->file_name;
            $mimeType = $this->getMimeType($fileName, $attachment->file_type ?? null);
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
                    // Stream via PHP so we control Content-Disposition header
                    // Direct redirect to Azure causes forced download due to blob storage headers
                    try {
                        $client = new \GuzzleHttp\Client([
                            'verify' => config('app.env') === 'production'
                        ]);
                        $fileContents = $client->get($url)->getBody()->getContents();
                    } catch (\Throwable $e) {
                        abort(404, 'File tidak dapat diambil dari storage.');
                    }
                    return response($fileContents, 200, [
                        'Content-Type' => $mimeType,
                        'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
                        'Cache-Control' => 'private, max-age=300',
                    ]);
                }
            }
            abort(404, 'File tidak ditemukan di storage.');
        }

        return response()->file($localPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
        ]);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment(string $id, Request $request)
    {
        $type = $request->query('type', 'document');

        // Uncontrolled copy — path passed directly via query string
        if ($type === 'uncontrolled') {
            $filePath = $request->query('path');
            if (!$filePath) abort(404, 'Path tidak ditemukan.');
            $fileName = basename($filePath);
            $localPath = Storage::disk('public')->path($filePath);
            if (!file_exists($localPath)) {
                $sas = GetBlobSasUri('aims-cntr', $filePath);
                $url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                    : $sas;
                if ($url) {
                    return redirect($url);
                }
                abort(404, 'File tidak ditemukan.');
            }
            return response()->download($localPath, $fileName);
        }
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

        // Uncontrolled — path passed directly via query string, no DB lookup needed
        if ($type === 'uncontrolled') {
            $filePath = $request->query('path');
            if (!$filePath) return response()->json(['url' => null], 404);
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
            return response()->json(['url' => $url]);
        }

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

        if (str_starts_with($filePath, 'test/') || str_starts_with($filePath, 'aims/') || !file_exists(Storage::disk('public')->path($filePath))) {
            $sas = GetBlobSasUri('aims-cntr', $filePath);
            $url = is_array($sas) ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? $sas[0]['sasUri'] ?? null) : $sas;
            return response()->json(['url' => $url]);
        }

        $url = Storage::disk('public')->temporaryUrl($filePath, now()->addMinutes(30));

        return response()->json(['url' => $url]);
    }

    /**
     * Helper method to derive exact MIME type from file extension or file_type column
     */
    private function getMimeType(string $fileName, ?string $fileType = null): string
    {
        $ext = strtolower($fileType ?? pathinfo($fileName, PATHINFO_EXTENSION));
        if (str_contains($ext, '/')) {
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        }

        return match ($ext) {
            'pdf'         => 'application/pdf',
            'png'         => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif'         => 'image/gif',
            'webp'        => 'image/webp',
            'docx'        => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc'         => 'application/msword',
            'xlsx'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls'         => 'application/vnd.ms-excel',
            'pptx'        => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'ppt'         => 'application/vnd.ms-powerpoint',
            'txt'         => 'text/plain',
            default       => 'application/octet-stream',
        };
    }
}
