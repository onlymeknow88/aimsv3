<?php
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$file = 'agent/DOC-20250729-WA0184..xlsx';
if (!file_exists($file)) {
    echo "File not found\n";
    exit(1);
}

try {
    $spreadsheet = IOFactory::load($file);
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray(null, true, true, true);

    // Print first 10 rows to inspect headers and data structure
    for ($i = 1; $i <= min(15, count($rows)); $i++) {
        echo "Row $i: " . json_encode($rows[$i]) . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
