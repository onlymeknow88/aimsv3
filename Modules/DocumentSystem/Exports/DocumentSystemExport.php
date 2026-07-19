<?php

namespace Modules\DocumentSystem\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class DocumentSystemExport implements FromView, ShouldAutoSize, WithColumnWidths, WithColumnFormatting, WithDrawings
{
    public $data;
    public $revision_col;

    public function __construct($data, $revision_col)
    {
        $this->data = $data;
        $this->revision_col = $revision_col;
    }

    /**
     * @return View
     */
    public function view(): View
    {
        return view('documentsystem::exports.document', [
            'data' => $this->data,
            'revision_col' => $this->revision_col,
        ]);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 3.89,
            'B' => 3.89,
            'C' => 3.89,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'H' => NumberFormat::FORMAT_NUMBER_0,
        ];
    }

    public function drawings()
    {
        $drawing = new Drawing();
        $drawing->setName('Logo');
        $drawing->setDescription('This is my logo');
        $drawing->setPath(public_path('/images/Alamtri Geo Logo - Full Color 1.png'));
        $drawing->setHeight(100);
        $drawing->setCoordinates('D1');

        return $drawing;
    }
}
