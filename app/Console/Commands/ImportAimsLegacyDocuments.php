<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImportAimsLegacyDocuments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:aims-legacy-documents {--limit=10 : Jumlah dokumen yang diimport untuk testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data dokumen dari SQL Server AIMS legacy ke MySQL lokal (mengecualikan FileBase)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limitOption = $this->option('limit');
        $this->info("Memulai proses sinkronisasi dan import dokumen dari AIMS legacy...");

        // Ambil default user lokal untuk pencocokan pembuat
        $defaultUser = DB::table('users')->first();
        if (!$defaultUser) {
            $this->error("Error: Tidak ada data user di tabel 'users'. Harap buat user terlebih dahulu.");
            return 1;
        }
        $defaultUserId = $defaultUser->id;

        // Ambil module 'Documentation' (index 6) sebagai fallback jika module tidak ditemukan
        $defaultModule = DB::table('document_system_modules')->where('index', '6')->first()
            ?? DB::table('document_system_modules')->first();

        if (!$defaultModule) {
            $this->error("Error: Tidak ada module di database document_system_modules.");
            return 1;
        }

        // Pre-load semua modules, categories, mappings ke memory untuk performa
        // Ini menghindari N+1 query dan memastikan kita lookup dari data yang sudah ada
        $allModules    = DB::table('document_system_modules')->get()->keyBy('index');
        $allCategories = DB::table('document_system_categories')->get()->keyBy('index');
        $allMappings   = DB::table('document_system_mappings')->get()->keyBy('index');

        try {
            $query = DB::connection('aims_legacy')
                ->table('Documents')
                ->select([
                    'Id',
                    'ModulCode',
                    'Modul',
                    'CompanyCode',
                    'Company',
                    'CategoryCode',
                    'Category',
                    'MappingCode',
                    'Mapping',
                    'FileName',
                    'FileType',
                    'Description',
                    'CreatedBy',
                    'Created',
                    'ModifiedBy',
                    'Modified',
                    'intCategory',
                    'intMapping',
                ])
                ->whereBetween('Created', ['2021-01-01 00:00:00', '2026-12-31 23:59:59']);

            if ($limitOption !== 'all' && is_numeric($limitOption)) {
                $query->take((int)$limitOption);
            }

            $legacyDocs = $query->orderBy('Created', 'desc')->get();
            $count = 0;
            $skipped = 0;

            if ($legacyDocs->isEmpty()) {
                $this->warn("Tidak ada dokumen yang ditemukan dari database legacy.");
                return 0;
            }

            DB::beginTransaction();

            $progressBar = $this->output->createProgressBar(count($legacyDocs));
            $progressBar->start();

            foreach ($legacyDocs as $docData) {
                // 1. Resolve Company
                $companyCode = trim($docData->CompanyCode ?? 'MAC');
                // Normalisasi company code legacy ke format baru
                $companyCodeMap = ['MC' => 'MAC', 'LC' => 'LAC', 'JC' => 'JAC'];
                $companyCode = $companyCodeMap[$companyCode] ?? $companyCode;

                $company = DB::table('companies')->where('document_code', $companyCode)->first();
                if (!$company) {
                    $companyId = Str::uuid()->toString();
                    DB::table('companies')->insert([
                        'id'            => $companyId,
                        'company_name'  => $docData->Company ?? 'PT Maruwai Coal',
                        'document_code' => $companyCode,
                        'address'       => 'Imported Address',
                        'email'         => 'imported@adaro.com',
                        'phone_number'  => '0',
                        'type'          => 'INTERNAL',
                        'created_at'    => Carbon::now(),
                        'updated_at'    => Carbon::now(),
                    ]);
                } else {
                    $companyId = $company->id;
                }

                // 2. Resolve Department
                // Department di-resolve dari MappingCode (strip angka di belakang) + CompanyCode
                // Contoh: MappingCode=KMK3LH001 → deptCode=KMK3LH, lalu cari dengan document_code
                $mappingCode = trim($docData->MappingCode ?? '');
                $deptCode = !empty($mappingCode)
                    ? preg_replace('/\d+$/', '', $mappingCode)  // strip trailing numbers
                    : strtoupper($companyCode);

                if (empty($deptCode)) {
                    $deptCode = strtoupper($companyCode);
                }

                $department = DB::table('departments')
                    ->where(function ($q) use ($deptCode) {
                        $q->where('document_code', $deptCode)
                          ->orWhere('code', $deptCode);
                    })
                    ->whereNull('deleted_at')
                    ->first();

                if (!$department) {
                    $departmentId = Str::uuid()->toString();
                    // Buat nama department yang unik dengan menambahkan company code
                    $deptName = ($docData->Mapping ?? $deptCode) . ' - ' . $companyCode;
                    DB::table('departments')->insert([
                        'id'            => $departmentId,
                        'name'          => $deptName,
                        'document_code' => $deptCode,
                        'code'          => $deptCode,
                        'created_at'    => Carbon::now(),
                        'updated_at'    => Carbon::now(),
                    ]);
                } else {
                    $departmentId = $department->id;
                }

                // 6. Resolve User
                $createdByStr = trim($docData->CreatedBy ?? 'admin');
                $user = null;
                if (!empty($createdByStr) && !in_array($createdByStr, ['admin', 'sa'])) {
                    $lastName    = strlen($createdByStr) > 1 ? substr($createdByStr, 1) : $createdByStr;
                    $firstLetter = $createdByStr[0];

                    $user = DB::table('users')
                        ->where('email', 'like', $firstLetter . '%' . $lastName . '%')
                        ->orWhere('email', 'like', '%' . $createdByStr . '%')
                        ->orWhere('name', 'like', '%' . $lastName . '%')
                        ->first();
                }
                $userId = $user ? $user->id : $defaultUserId;

                // 7. Prepare document fields
                $createdTime  = $docData->Created ?? Carbon::now();
                $modifiedTime = $docData->Modified ?? $createdTime;

                // Ekstrak revisi dari Description atau default '00'
                $revision = '00';
                if (isset($docData->Description) && preg_match('/Rev\s*(\d+(\.\d+)?)/i', $docData->Description, $revMatches)) {
                    $revision = $revMatches[1];
                }

                // Tentukan document_level berdasarkan CategoryCode asal
                $categoryCode  = trim($docData->CategoryCode ?? '');
                $documentLevel = 'SOP';
                if (str_contains($categoryCode, 'SOP'))       $documentLevel = 'SOP';
                elseif (str_contains($categoryCode, 'TS'))    $documentLevel = 'TS';
                elseif (str_contains($categoryCode, 'WIN'))   $documentLevel = 'WIN';
                elseif (str_contains($categoryCode, 'FORM'))  $documentLevel = 'FORM';
                elseif (str_contains($categoryCode, 'MEMO'))  $documentLevel = 'MEMO';

                // Ekstrak document_number dari FileName (bagian pertama sebelum spasi)
                $fileName       = trim($docData->FileName ?? '');
                $documentNumber = null;
                if (!empty($fileName)) {
                    $parts          = explode(' ', $fileName);
                    $documentNumber = $parts[0];
                }

                // 3, 4, 5. Resolve Module, Category, Mapping
                // Prioritas: lookup dari aimsv3 berdasarkan DeptCode di document_number
                // Format: [Level]-[Company]-[DeptCode]-[Seq]-[Num] atau [Company]-[DeptCode]-[Seq]
                // DeptCode di aimsv3 = name di document_system_mappings (LOG, CBL, OHS, dll)
                // Category ditentukan dari document_level:
                //   SOP→6.2, WIN→6.4, FORM→6.5, TS→6.3, MEMO/default→6.1
                $levelPrefixes = ['F', 'WIN', 'TS', 'MEMO', 'SOP'];
                $docParts = explode('-', $documentNumber ?? '');
                $deptCodeFromDocNum = null;

                if (count($docParts) >= 3) {
                    if (in_array(strtoupper($docParts[0]), $levelPrefixes)) {
                        // Format: F-MAC-LOG-... → DeptCode = parts[2]
                        $deptCodeFromDocNum = strtoupper($docParts[2]);
                    } else {
                        // Format: MAC-LOG-... → DeptCode = parts[1]
                        $deptCodeFromDocNum = strtoupper($docParts[1]);
                    }
                }

                // Category index berdasarkan document_level
                $catIndexByLevel = match($documentLevel) {
                    'SOP'  => '6.2',
                    'WIN'  => '6.4',
                    'FORM' => '6.5',
                    'TS'   => '6.3',
                    default => '6.1',
                };

                $resolvedModuleId = $defaultModule->id;
                $categoryId       = null;
                $mappingId        = null;

                // Coba lookup mapping dari aimsv3 berdasarkan DeptCode + category level
                if ($deptCodeFromDocNum) {
                    $matchedMapping = DB::table('document_system_mappings as m')
                        ->join('document_system_categories as c', 'm.category_id', '=', 'c.id')
                        ->join('document_system_modules as mod', 'c.module_id', '=', 'mod.id')
                        ->where('m.name', $deptCodeFromDocNum)
                        ->where('c.index', $catIndexByLevel)
                        ->select('m.id as mapping_id', 'c.id as category_id', 'mod.id as module_id')
                        ->first();

                    if ($matchedMapping) {
                        $mappingId        = $matchedMapping->mapping_id;
                        $categoryId       = $matchedMapping->category_id;
                        $resolvedModuleId = $matchedMapping->module_id;
                    }
                }

                // Fallback: jika tidak ditemukan via DeptCode, gunakan intCategory/intMapping
                if (!$mappingId) {
                    $intCategory = trim($docData->intCategory ?? '');
                    $moduleIndex = !empty($intCategory) ? substr($intCategory, 0, 1) : '6';
                    $module = $allModules->get($moduleIndex) ?? $defaultModule;
                    $resolvedModuleId = $module->id;

                    $catIndex = '6.4';
                    if (!empty($intCategory) && strlen($intCategory) >= 2) {
                        $catIndex = substr($intCategory, 0, 1) . '.' . substr($intCategory, 1, 1);
                    }

                    $category = $allCategories->get($catIndex)
                        ?? DB::table('document_system_categories')->where('index', $catIndex)->first();

                    if (!$category) {
                        $categoryId = Str::uuid()->toString();
                        DB::table('document_system_categories')->insert([
                            'id'         => $categoryId,
                            'module_id'  => $resolvedModuleId,
                            'index'      => $catIndex,
                            'name'       => $docData->Category ?? $catIndex,
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                        $allCategories = DB::table('document_system_categories')->get()->keyBy('index');
                        $category = $allCategories->get($catIndex);
                    }
                    $categoryId = $category->id;

                    $intMapping = trim($docData->intMapping ?? '');
                    $mapIndex = '6.4.7';
                    if (!empty($intMapping) && strlen($intMapping) >= 3) {
                        $firstDigit  = substr($intMapping, 0, 1);
                        $secondDigit = substr($intMapping, 1, 1);
                        $remainder   = substr($intMapping, 2);
                        $mapIndex    = "{$firstDigit}.{$secondDigit}.{$remainder}";
                    }

                    $mapping = $allMappings->get($mapIndex)
                        ?? DB::table('document_system_mappings')->where('index', $mapIndex)->first();

                    if (!$mapping) {
                        $mappingId = Str::uuid()->toString();
                        DB::table('document_system_mappings')->insert([
                            'id'          => $mappingId,
                            'category_id' => $categoryId,
                            'index'       => $mapIndex,
                            'name'        => $docData->Mapping ?? $mapIndex,
                            'created_at'  => Carbon::now(),
                            'updated_at'  => Carbon::now(),
                        ]);
                        $allMappings = DB::table('document_system_mappings')->get()->keyBy('index');
                        $mapping = $allMappings->get($mapIndex);
                    }
                    $mappingId = $mapping->id;
                }

                // 8. Insert Document (skip jika sudah ada berdasarkan ID legacy)
                $exists = DB::table('document_system_documents')->where('id', $docData->Id)->exists();
                if (!$exists) {
                    DB::table('document_system_documents')->insert([
                        'id'              => $docData->Id,
                        'company_id'      => $companyId,
                        'department_id'   => $departmentId,
                        'mapping_id'      => $mappingId,
                        'module_id'       => $resolvedModuleId,   // ← ditambahkan
                        'category_id'     => $categoryId,          // ← ditambahkan
                        'user_id'         => $userId,
                        'created_by'      => $userId,
                        'upload_type'     => 'document',
                        'document_level'  => $documentLevel,
                        'status'          => '5', // Active
                        'revision'        => $revision,
                        'title'           => $docData->FileName ?? 'Untitled Document',
                        'description'     => $docData->Description ?? '',
                        'sop_number'      => null,
                        'document_number' => $documentNumber,
                        'file_path'       => 'storage/imported/' . ($docData->FileName ?? 'file') . '.' . ($docData->FileType ?? 'pdf'),
                        'doc_created'     => Carbon::parse($createdTime)->toDateString(),
                        'created_at'      => $createdTime,
                        'updated_at'      => $modifiedTime,
                    ]);
                    $count++;
                } else {
                    $skipped++;
                }

                $progressBar->advance();
            }

            $progressBar->finish();
            $this->line('');

            DB::commit();
            $this->info("Berhasil mengimport {$count} data dokumen dari AIMS legacy. ({$skipped} dilewati karena sudah ada)");
            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($progressBar)) {
                $progressBar->finish();
                $this->line('');
            }
            $this->error("Gagal mengimport data: " . $e->getMessage());
            return 1;
        }
    }
}
