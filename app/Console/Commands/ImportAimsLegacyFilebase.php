<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ImportAimsLegacyFilebase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:aims-legacy-filebase
        {--limit=10 : Jumlah file yang diproses per run}
        {--offset=0 : Mulai dari dokumen ke-N (urut berdasarkan id lokal)}
        {--id=      : Import satu dokumen spesifik berdasarkan ID legacy (integer)}
        {--force    : Upload ulang meski uncontrolled_blob_url sudah ada}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Upload FileBase dari AIMS legacy ke Blob Storage dan update uncontrolled_blob_url di document_system_documents';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // FileBase bisa sangat besar — tingkatkan memory limit
        ini_set('memory_limit', '512M');

        $limit  = (int) $this->option('limit');
        $offset = (int) $this->option('offset');
        $singleId = $this->option('id');
        $force  = (bool) $this->option('force');

        $this->info("Memulai import FileBase dari AIMS legacy ke Blob Storage...");
        $this->line("  limit={$limit} | offset={$offset} | force=" . ($force ? 'true' : 'false'));

        try {
            // Build query: ambil dokumen lokal yang ID-nya integer (berasal dari import legacy)
            $query = DB::table('document_system_documents')
                ->whereRaw("id REGEXP '^[0-9]+$'");

            // Skip yang sudah punya blob URL kecuali --force
            if (!$force) {
                $query->whereNull('uncontrolled_blob_url');
            }

            if ($singleId) {
                $query->where('id', $singleId);
            } else {
                $query->orderByRaw('CAST(id AS UNSIGNED)')
                      ->limit($limit)
                      ->offset($offset);
            }

            $docs = $query->get(['id', 'title']);

            if ($docs->isEmpty()) {
                $this->info("Tidak ada dokumen yang perlu diproses.");
                return 0;
            }

            $this->info("Ditemukan {$docs->count()} dokumen untuk diproses.");

            $progressBar = $this->output->createProgressBar($docs->count());
            $progressBar->start();

            $count   = 0;
            $skipped = 0;
            $failed  = 0;

            foreach ($docs as $doc) {
                $tmpPath = null;

                try {
                    // Ambil FileBase dari SQL Server legacy
                    $legacy = DB::connection('aims_legacy')
                        ->table('Documents')
                        ->select(['Id', 'FileName', 'FileType', 'FileBase'])
                        ->where('Id', $doc->id)
                        ->first();

                    if (!$legacy) {
                        $this->newLine();
                        $this->warn("Skip id={$doc->id}: tidak ditemukan di legacy database.");
                        $skipped++;
                        $progressBar->advance();
                        continue;
                    }

                    if (empty($legacy->FileBase)) {
                        $this->newLine();
                        $this->warn("Skip id={$doc->id} ({$legacy->FileName}): FileBase kosong.");
                        $skipped++;
                        $progressBar->advance();
                        continue;
                    }

                    // Normalisasi extension
                    $ext = $this->normalizeExtension($legacy->FileType ?? '');

                    // Tulis binary ke temp file
                    // FileBase dari SQL Server ODBC driver di-encode sebagai base64 — decode dulu
                    $tmpPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . Str::uuid() . '.' . $ext;
                    $binaryContent = base64_decode($legacy->FileBase, true);
                    if ($binaryContent === false) {
                        // Jika bukan base64 valid, coba langsung tulis sebagai binary
                        $binaryContent = $legacy->FileBase;
                    }
                    file_put_contents($tmpPath, $binaryContent);

                    // Nama file untuk blob — prefix FINAL_ + timestamp untuk menghindari
                    // "Blob Already Exist" dari API yang tidak meng-overwrite file lama
                    $timestamp = now()->format('YmdHis');
                    $filename = 'FINAL_' . trim($legacy->FileName ?? 'dokumen_legacy') . '_' . $timestamp . '.' . $ext;

                    // Upload ke blob storage
                    $result = uploadToBlobStorage($filename, $tmpPath, 'document-system/legacy');

                    if (empty($result['fileBlobUrl']) && empty($result['fileBlobPathName'])) {
                        $this->newLine();
                        $this->error("Gagal upload id={$doc->id} ({$filename}): blob URL kosong.");
                        Log::error("aims-legacy-filebase: gagal upload", [
                            'id'       => $doc->id,
                            'filename' => $filename,
                            'result'   => $result,
                        ]);
                        $failed++;
                        $progressBar->advance();
                        continue;
                    }

                    // Setelah upload, simpan file_path dan bare blobUri (tanpa SAS token).
                    // SAS URL tidak disimpan ke DB karena akan expired — SAS di-generate fresh
                    // setiap kali dibutuhkan via GetBlobSasUri di GeneralController::sasUrl().
                    $filePath = $result['fileBlobPathName'];
                    $blobUri  = $result['fileBlobUrl']; // bare URI tanpa SAS token

                    // Update record lokal
                    DB::table('document_system_documents')
                        ->where('id', $doc->id)
                        ->update([
                            'uncontrolled_file_path'   => $filePath,
                            'uncontrolled_blob_url'    => $blobUri,
                            'uncontrolled_blob_respon' => json_encode($result['blobResponse'] ?? []),
                        ]);

                    $count++;
                } catch (\Throwable $e) {
                    $this->newLine();
                    $this->error("Error id={$doc->id}: " . $e->getMessage());
                    Log::error("aims-legacy-filebase: exception", [
                        'id'      => $doc->id,
                        'error'   => $e->getMessage(),
                        'trace'   => $e->getTraceAsString(),
                    ]);
                    $failed++;
                } finally {
                    // Selalu hapus temp file meski terjadi exception
                    if ($tmpPath && file_exists($tmpPath)) {
                        @unlink($tmpPath);
                    }
                }

                $progressBar->advance();
            }

            $progressBar->finish();
            $this->newLine(2);

            $this->info("Selesai.");
            $this->line("  Berhasil upload : {$count}");
            $this->line("  Dilewati (skip) : {$skipped}");
            $this->line("  Gagal           : {$failed}");

            if ($failed > 0) {
                $this->warn("Ada {$failed} dokumen yang gagal. Lihat log untuk detail.");
            }

            return $failed > 0 ? 1 : 0;
        } catch (\Exception $e) {
            $this->error("Fatal error: " . $e->getMessage());
            Log::error("aims-legacy-filebase: fatal error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }

    /**
     * Normalisasi FileType dari legacy ke ekstensi file.
     * FileType di legacy bisa berupa MIME type penuh atau ekstensi saja.
     */
    private function normalizeExtension(string $fileType): string
    {
        return match (strtolower(trim($fileType))) {
            'pdf', 'application/pdf'
                => 'pdf',
            'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                => 'docx',
            'doc', 'application/msword'
                => 'doc',
            'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                => 'xlsx',
            'xls', 'application/vnd.ms-excel'
                => 'xls',
            'pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                => 'pptx',
            'ppt', 'application/vnd.ms-powerpoint'
                => 'ppt',
            'txt', 'text/plain'
                => 'txt',
            'zip', 'application/zip', 'application/x-zip-compressed'
                => 'zip',
            default
                => 'pdf',
        };
    }
}
