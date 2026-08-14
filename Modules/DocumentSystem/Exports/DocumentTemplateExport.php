<?php

namespace Modules\DocumentSystem\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Modules\DocumentSystem\Entities\Document;

class DocumentTemplateExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $ids;

    public function __construct(array $ids = [])
    {
        $this->ids = $ids;
    }

    /**
     * Fetch active documents.
     */
    public function collection()
    {
        $query = Document::query();
        if (!empty($this->ids)) {
            $query->whereIn('id', $this->ids);
        } else {
            // Default to active, expired, and obsolete documents
            $query->whereIn('status', ['5', '7', '8']);
        }
        return $query->get();
    }

    /**
     * Excel columns headers.
     */
    public function headings(): array
    {
        return [
            'Document ID',
            'No. Dokumen',
            'Judul Dokumen',
            'Deskripsi',
            'Revisi',
            'Document Level'
        ];
    }

    /**
     * Map database row values to excel columns.
     */
    public function map($row): array
    {
        return [
            $row->id,
            $row->document_number,
            $row->title,
            $row->description ?? '',
            $row->revision ?? '0',
            $row->document_level ?? 'SOP'
        ];
    }
}
