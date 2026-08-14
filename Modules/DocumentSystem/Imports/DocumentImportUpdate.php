<?php

namespace Modules\DocumentSystem\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Modules\DocumentSystem\Entities\Document;
use Illuminate\Support\Facades\DB;

class DocumentImportUpdate implements ToModel, WithHeadingRow
{
    protected $updatedCount = 0;

    /**
     * Parse excel row and update local document system records.
     */
    public function model(array $row)
    {
        // 1. Identify document ID key
        $docId = $row['document_id'] ?? null;
        if (empty($docId)) {
            return null;
        }

        // 2. Fetch local document record
        $doc = Document::find($docId);
        if (!$doc) {
            return null; // Skip if no document matches
        }

        // 3. Process update variables
        $level = trim($row['document_level'] ?? $doc->document_level);
        if (!in_array(strtoupper($level), ['SOP', 'TS', 'WIN', 'FORM', 'MEMO'])) {
            $level = $doc->document_level; // Fallback to current level if value is invalid
        }

        $doc->update([
            'document_number' => $row['no_dokumen'] ?? $doc->document_number,
            'title'           => $row['judul_dokumen'] ?? $doc->title,
            'description'     => $row['deskripsi'] ?? $doc->description,
            'revision'        => $row['revisi'] ?? $doc->revision,
            'document_level'  => strtoupper($level),
        ]);

        $this->updatedCount++;

        return null; // Laravel Excel ToModel interface expects null when update is done in-place
    }

    /**
     * Get number of rows successfully updated.
     */
    public function getUpdatedCount(): int
    {
        return $this->updatedCount;
    }
}
