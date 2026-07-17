<?php
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel Application
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

$file = 'agent/DOC-20250729-WA0184..xlsx';
if (!file_exists($file)) {
    echo "File not found\n";
    exit(1);
}

try {
    $spreadsheet = IOFactory::load($file);
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray(null, true, true, true);

    // Disable Foreign Key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    DB::table('document_system_mappings')->truncate();
    DB::table('document_system_categories')->truncate();
    DB::table('document_system_modules')->truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    $currentModuleId = null;
    $currentCategoryId = null;

    $lastModuleIndex = null;
    $lastModuleName = null;

    $lastCategoryIndex = null;
    $lastCategoryName = null;

    echo "Importing taxonomy data...\n";

    // Row 1 to 3 are headers, data starts at Row 4
    for ($i = 4; $i <= count($rows); $i++) {
        $row = $rows[$i];

        $moduleRaw = trim($row['C'] ?? '');
        $categoryRaw = trim($row['E'] ?? '');
        $mappingRaw = trim($row['G'] ?? '');

        // 1. Process Modul (C)
        if ($moduleRaw !== '') {
            // Extract index e.g. "1. Kebijakan" -> index "1", name "Kebijakan"
            $parts = explode('.', $moduleRaw, 2);
            $index = null;
            $name = $moduleRaw;
            if (count($parts) === 2 && is_numeric(trim($parts[0]))) {
                $index = trim($parts[0]);
                $name = trim($parts[1]);
            }

            $currentModuleId = Str::uuid()->toString();
            DB::table('document_system_modules')->insert([
                'id' => $currentModuleId,
                'index' => $index,
                'name' => $name,
                'has_document_number' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $lastModuleIndex = $index;
            $lastModuleName = $name;
            $currentCategoryId = null; // Reset category when module changes
        }

        // 2. Process Category (E)
        if ($categoryRaw !== '') {
            // Extract index e.g. "1.1. Kebijakan PTLC" -> index "1.1", name "Kebijakan PTLC"
            $parts = explode(' ', $categoryRaw, 2);
            $index = null;
            $name = $categoryRaw;
            if (count($parts) === 2 && preg_match('/^\d+(\.\d+)+\.?$/', trim($parts[0]))) {
                $index = trim($parts[0], '.');
                $name = trim($parts[1]);
            } else {
                // Try splitting by dot
                $partsDot = explode('.', $categoryRaw);
                if (count($partsDot) > 2) {
                    $index = trim($partsDot[0] . '.' . $partsDot[1]);
                    unset($partsDot[0], $partsDot[1]);
                    $name = trim(implode('.', $partsDot));
                }
            }

            $currentCategoryId = Str::uuid()->toString();
            DB::table('document_system_categories')->insert([
                'id' => $currentCategoryId,
                'module_id' => $currentModuleId,
                'index' => $index,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $lastCategoryIndex = $index;
            $lastCategoryName = $name;
        }

        // 3. Process Mapping (G)
        if ($mappingRaw !== '') {
            // Extract index e.g. "1.1.1 Kebijakan MK3LH" -> index "1.1.1", name "Kebijakan MK3LH"
            $parts = explode(' ', $mappingRaw, 2);
            $index = null;
            $name = $mappingRaw;
            if (count($parts) === 2 && preg_match('/^\d+(\.\d+)+$/', trim($parts[0]))) {
                $index = trim($parts[0]);
                $name = trim($parts[1]);
            } else {
                // Try split by dot for numeric prefixes
                $partsDot = explode('.', $mappingRaw);
                if (count($partsDot) > 3) {
                    $index = trim($partsDot[0] . '.' . $partsDot[1] . '.' . $partsDot[2]);
                    unset($partsDot[0], $partsDot[1], $partsDot[2]);
                    $name = trim(implode('.', $partsDot));
                }
            }

            if ($currentCategoryId && $currentModuleId) {
                DB::table('document_system_mappings')->insert([
                    'id' => Str::uuid()->toString(),
                    'category_id' => $currentCategoryId,
                    'index' => $index,
                    'name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    echo "Import completed successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
