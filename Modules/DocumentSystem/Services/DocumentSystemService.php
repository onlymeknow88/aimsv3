<?php

namespace Modules\DocumentSystem\Services;

use Modules\DocumentSystem\Entities\Document;
use Illuminate\Support\Facades\Storage;

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

        return Storage::disk('public')->putFile($path, $file);
    }
}
