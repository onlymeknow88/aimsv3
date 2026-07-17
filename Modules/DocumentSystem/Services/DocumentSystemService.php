<?php

namespace Modules\DocumentSystem\Services;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\Attachment;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class DocumentSystemService
{
    /**
     * Generate document running code and full number.
     */
    public function generateDocumentNumber(string $company, string $dept, string $level): string
    {
        $prefix = "{$company}-{$dept}-{$level}";
        $count = Document::where('prefix_code', $prefix)->count() + 1;
        $runningCode = str_pad($count, 3, '0', STR_PAD_LEFT);
        
        return "{$prefix}-{$runningCode}";
    }

    /**
     * Handle document file uploads.
     */
    public function uploadAttachment($file, string $path = 'documents')
    {
        if (!$file) {
            return null;
        }

        $filename = $file->getClientOriginalName();
        $filePathTemp = $file->getRealPath();

        $result = uploadToBlobStorage($filename, $filePathTemp, $path);
        
        if (is_array($result) && !empty($result['fileBlobPathName'])) {
            return $result;
        }

        return null;
    }

    /**
     * Rename all attachments of a document to have FINAL_ prefix.
     * Downloads each file from blob, re-uploads with FINAL_ prefix, updates the database record.
     */
    public function renameToBlobFinal(Document $document): void
    {
        $attachments = Attachment::where('document_id', $document->id)->get();

        foreach ($attachments as $attachment) {
            $currentFileName = $attachment->file_name ?? '';

            // Skip if already prefixed
            if (str_starts_with($currentFileName, 'FINAL_')) {
                continue;
            }

            $newFileName = 'FINAL_' . $currentFileName;
            $currentPath = $attachment->path ?? '';

            if (!$currentPath) {
                continue;
            }

            try {
                // Get the SAS URL for the current file to download it
                $sas = GetBlobSasUri('aims-cntr', $currentPath);
                $sasUrl = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                    : $sas;

                if (!$sasUrl) {
                    Log::warning("renameToBlobFinal: No SAS URL for attachment {$attachment->id}");
                    continue;
                }

                // Download file content from blob
                $client = new Client();
                $response = $client->get($sasUrl);
                $fileContent = $response->getBody()->getContents();

                // Store temporarily
                $tmpPath = sys_get_temp_dir() . '/' . $newFileName;
                file_put_contents($tmpPath, $fileContent);

                // Determine the directory path (strip existing filename from the path)
                $directoryPath = ltrim(dirname($currentPath), '/');

                // Re-upload with the new FINAL_ filename
                $uploadResult = uploadToBlobStorage($newFileName, $tmpPath, $directoryPath);

                // Clean temp file
                @unlink($tmpPath);

                if (!$uploadResult || empty($uploadResult['fileBlobPathName'])) {
                    Log::warning("renameToBlobFinal: Upload failed for attachment {$attachment->id}");
                    continue;
                }

                // Update the attachment record
                $attachment->update([
                    'file_name' => $newFileName,
                    'path'      => $uploadResult['fileBlobPathName'],
                    'blob_url'  => $uploadResult['fileBlobUrl'] ?? $attachment->blob_url,
                    'blob_respon' => json_encode($uploadResult['blobResponse'] ?? []),
                ]);

                Log::info("renameToBlobFinal: Renamed attachment {$attachment->id} to {$newFileName}");

            } catch (\Exception $e) {
                Log::error("renameToBlobFinal: Error processing attachment {$attachment->id}: " . $e->getMessage());
            }
        }
    }

    /**
     * Replicate/clone an active/expired document to create a new draft revision.
     */
    public function replicate(Document $document): Document
    {
        $currentRevision = $document->revision ?? 0;

        $newDoc = $document->replicate();
        $newDoc->doc_created = now();
        $newDoc->status = '2'; // Draft
        $newDoc->related_document_id = $document->id;
        $newDoc->revision = (int) $currentRevision + 1;
        $newDoc->is_obsolate = false;

        if ($newDoc->save()) {
            // Replicate invited people
            $invited = \DB::table('document_system_invited_people')
                ->where('document_id', $document->id)
                ->get();
            foreach ($invited as $person) {
                \DB::table('document_system_invited_people')->insert([
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'document_id' => $newDoc->id,
                    'user_id' => $person->user_id,
                    'email' => $person->email,
                    'status' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Replicate attachments
            $attachments = Attachment::where('document_id', $document->id)->get();
            foreach ($attachments as $attachment) {
                $newAtt = $attachment->replicate();
                $newAtt->document_id = $newDoc->id;
                $newAtt->save();
            }

            // Mark the old active/expired document as obsolete
            $document->update(['is_obsolate' => true]);
        }

        return $newDoc;
    }
}
