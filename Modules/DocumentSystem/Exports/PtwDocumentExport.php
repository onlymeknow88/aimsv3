<?php

namespace Modules\DocumentSystem\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * PTW Excel export (port of v2 PtwService::export, adapted to v3 columns).
 */
class PtwDocumentExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    public array $rows;

    public function __construct(array $rows)
    {
        $this->rows = $rows;
    }

    public function collection()
    {
        return collect($this->rows);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nomor Dokumen',
            'Judul',
            'Company',
            'Department',
            'PIC',
            'Status',
            'Detail Lokasi',
            'Tgl Dibuat',
            'Tgl Nonaktif',
        ];
    }
}
