<?php

namespace Modules\DocumentSystem\Services;

use Illuminate\Support\Facades\Log;

class WatermarkService
{
    /**
     * Download a PDF from the given URL, apply a semi-transparent watermark image
     * on every page using watermark.py (PyMuPDF), and return the path to the
     * watermarked temp file.
     *
     * @param  string  $sourceUrl         SAS URL of the original PDF in Azure Blob Storage
     * @param  string  $originalFileName  Original file name (used to build temp file names)
     * @return string  Absolute path to the watermarked temp PDF
     *
     * @throws \RuntimeException  on any failure
     */
    /**
     * @param  string  $sourceUrl         SAS URL of the original PDF
     * @param  string  $originalFileName  Original file name
     * @param  string  $mode              'review' (routing approval) or 'rooting' (direct/JSA/PTW)
     */
    public function applyWatermark(string $sourceUrl, string $originalFileName, string $mode = 'review'): string
    {
        $tmpDir      = storage_path('app/tmp');
        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }
        $tmpOriginal = $tmpDir . '/downloaded_' . uniqid() . '_' . basename($originalFileName);
        $tmpOutput   = $tmpDir . '/uncontrolled_' . uniqid() . '_' . basename($originalFileName);

        // ── 1. Download original PDF to a temp file ───────────────────────────
        try {
            $client = new \GuzzleHttp\Client(['timeout' => 60]);
            $client->get($sourceUrl, ['sink' => $tmpOriginal]);
        } catch (\Throwable $e) {
            @unlink($tmpOriginal);
            throw new \RuntimeException('WatermarkService: Failed to download source PDF — ' . $e->getMessage());
        }

        // ── 2. Resolve paths ──────────────────────────────────────────────────
        $scriptPath   = module_path('DocumentSystem', 'scripts/watermark.py');

        // review mode → uncontrolled.png, rooting mode → watermark.png
        // Fall back to watermark.png if uncontrolled.png does not exist yet
        $reviewImg  = public_path('images/uncontrolled.png');
        $rootingImg = public_path('images/watermark.png');
        $watermarkImg = ($mode === 'review' && file_exists($reviewImg)) ? $reviewImg : $rootingImg;

        $pythonBin    = $this->resolvePythonBinary();

        if (! file_exists($scriptPath)) {
            @unlink($tmpOriginal);
            throw new \RuntimeException('WatermarkService: watermark.py not found at ' . $scriptPath);
        }

        if (! file_exists($watermarkImg)) {
            @unlink($tmpOriginal);
            throw new \RuntimeException('WatermarkService: watermark image not found at ' . $watermarkImg);
        }

        // ── 3. Run watermark.py ───────────────────────────────────────────────
        $watermarkSuccess = false;

        $cmd = implode(' ', [
            escapeshellcmd($pythonBin),
            escapeshellarg($scriptPath),
            escapeshellarg($tmpOriginal),
            escapeshellarg($tmpOutput),
            escapeshellarg($watermarkImg),
            escapeshellarg($mode),
        ]);

        $output     = [];
        $returnCode = -1;
        exec($cmd . ' 2>&1', $output, $returnCode);

        $outputStr = implode("\n", $output);

        if ($returnCode === 0) {
            $watermarkSuccess = true;
            Log::info('WatermarkService: watermark applied successfully', ['output' => $outputStr]);
        } else {
            Log::warning('WatermarkService: watermark.py returned error code ' . $returnCode . '. Output: ' . $outputStr);
        }

        // ── 4. Fallback: copy original if watermark failed ────────────────────
        if (! $watermarkSuccess) {
            if (file_exists($tmpOriginal)) {
                copy($tmpOriginal, $tmpOutput);
                Log::warning('WatermarkService: falling back to original file copy for ' . basename($originalFileName));
            } else {
                @unlink($tmpOriginal);
                throw new \RuntimeException('WatermarkService: watermark failed and source file not found for fallback.');
            }
        }

        @unlink($tmpOriginal);

        if (! file_exists($tmpOutput)) {
            throw new \RuntimeException('WatermarkService: output file not found at ' . $tmpOutput);
        }

        return $tmpOutput;
    }

    /**
     * Clean up a temp file silently.
     */
    public function cleanup(string $path): void
    {
        if ($path && file_exists($path)) {
            @unlink($path);
        }
    }

    /**
     * Resolve the Python 3 binary path.
     * Tries python3 first, falls back to python.
     * Can be overridden via PYTHON_BIN in .env.
     */
    private function resolvePythonBinary(): string
    {
        $envBin = env('PYTHON_BIN');
        if ($envBin && trim($envBin) !== '') {
            return trim($envBin);
        }

        exec('which python3 2>/dev/null', $out3, $code3);
        if ($code3 === 0 && ! empty($out3[0])) {
            return trim($out3[0]);
        }

        exec('which python 2>/dev/null', $out, $code);
        if ($code === 0 && ! empty($out[0])) {
            return trim($out[0]);
        }

        return 'python3';
    }
}
