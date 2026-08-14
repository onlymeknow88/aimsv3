<?php

namespace Modules\DocumentSystem\Services;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\Attachment;
use Modules\DocumentSystem\Entities\Mapping;
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
     * Build a structured blob storage folder path based on mapping hierarchy.
     * Result: document-systems-files/{module-slug}/{category-slug}/{mapping-slug}
     */
    public function buildUploadPath($mappingId): string
    {
        $base = 'document-systems-files';

        if (!$mappingId) {
            return $base . '/general';
        }

        $mapping = Mapping::with('category.module')->find($mappingId);

        if (!$mapping) {
            return $base . '/general';
        }

        $slug = fn(string $str): string => strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $str), '-'));

        $moduleName   = $slug($mapping->category?->module?->name ?? 'module');
        $categoryName = $slug($mapping->category?->name ?? 'category');
        $mappingName  = $slug($mapping->name ?? 'mapping');

        return "{$base}/{$moduleName}/{$categoryName}/{$mappingName}";
    }

    /**
     * Handle document file uploads.
     */
    public function uploadAttachment($file, string $path = 'document-systems-files/general')
    {
        if (!$file) {
            return null;
        }

        $filename = $file->getClientOriginalName();
        $filePathTemp = $file->getRealPath() ?: $file->getPathname();

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
                // Also strip the environment prefix ('test/' or 'aims/') that
                // uploadToBlobStorage will re-add automatically based on APP_ENV.
                $directoryPath = ltrim(dirname($currentPath), '/');
                // Strip all leading environment prefixes that uploadToBlobStorage will re-add
                $directoryPath = preg_replace('#^(test/)*#', '', $directoryPath);
                $directoryPath = preg_replace('#^(aims/)*#', '', $directoryPath);

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
            $document->update([
                'is_obsolate' => true,
                'status' => '8'
            ]);
        }

        return $newDoc;
    }

    /**
     * Replicate an OBSOLETE document to create a new draft revision.
     * Unlike replicate(), this does NOT mark the source as obsolete (already is)
     * and does NOT copy attachments.
     */
    public function replicateFromObsolete(Document $document): Document
    {
        if (!$document->is_obsolate) {
            throw new \InvalidArgumentException('Dokumen sumber bukan obsolete.');
        }

        // Guard: block hanya jika ada dokumen yang sedang aktif atau dalam proses approval.
        // Draft (status=2) yang terbengkalai tidak dihitung sebagai penghalang.
        // Status: 3=Routing, 4=Approved L1, 5=Active
        $existing = Document::where('document_number', $document->document_number)
            ->where('is_obsolate', false)
            ->whereIn('status', ['3', '4', '5'])
            ->exists();

        if ($existing) {
            throw new \RuntimeException('Sudah ada dokumen aktif atau dalam proses approval dengan nomor dokumen yang sama.');
        }

        // Guard: hanya boleh buat revisi dari versi obsolete tertinggi (terbaru)
        // Cegah user buat revisi dari Rev 0 jika ada Rev 2 yang juga obsolete
        $maxObsoleteRevision = Document::where('document_number', $document->document_number)
            ->where('is_obsolate', true)
            ->max(\Illuminate\Support\Facades\DB::raw('CAST(revision AS UNSIGNED)'));

        if ((int) $document->revision < (int) $maxObsoleteRevision) {
            throw new \RuntimeException(
                "Hanya revisi terbaru (Rev {$maxObsoleteRevision}) yang dapat dijadikan dasar revisi baru. Pilih dokumen dengan revisi tertinggi."
            );
        }

        $currentRevision = $document->revision ?? 0;

        $newDoc = $document->replicate();
        $newDoc->doc_created = now();
        $newDoc->status = Document::DRAFT; // '2'
        $newDoc->related_document_id = $document->id;
        $newDoc->revision = (int) $currentRevision + 1;
        $newDoc->is_obsolate = false;
        // Reset approval fields
        $newDoc->approved_by_crs = null;
        $newDoc->approved_at_crs = null;
        $newDoc->approved_by_pja = null;
        $newDoc->approved_at_pja = null;
        $newDoc->file_path = null;
        $newDoc->uncontrolled_file_path = null;
        $newDoc->uncontrolled_blob_url = null;
        $newDoc->uncontrolled_blob_respon = null;

        // Isi module_id dan category_id dari relasi mapping jika kosong
        // karena useMaker.jsx membaca langsung dari kolom ini
        if (!$newDoc->module_id || !$newDoc->category_id) {
            $mapping = \Modules\DocumentSystem\Entities\Mapping::with('category.module')
                ->find($newDoc->mapping_id);
            if ($mapping) {
                $newDoc->category_id = $newDoc->category_id ?: $mapping->category_id;
                $newDoc->module_id   = $newDoc->module_id   ?: ($mapping->category?->module?->id ?? null);
            }
        }

        $newDoc->save();

        // Copy invited people, tapi TIDAK copy attachments
        $invited = \DB::table('document_system_invited_people')
            ->where('document_id', $document->id)
            ->get();
        foreach ($invited as $person) {
            \DB::table('document_system_invited_people')->insert([
                'id'          => \Illuminate\Support\Str::uuid()->toString(),
                'document_id' => $newDoc->id,
                'user_id'     => $person->user_id,
                'email'       => $person->email,
                'status'      => 0,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        return $newDoc;
    }
}
