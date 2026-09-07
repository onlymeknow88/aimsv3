<?php

namespace Modules\Ko\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Ko\Entities\KoAttachment;
use Modules\Ko\Entities\KoProposal;
use Modules\Ko\Enums\KoStatus;

/**
 * Proposal KO + verifikasi (admin/koordinator) + Temporary QR.
 * Parity transisi aims:
 *  admin verify -> CoordinatorProposalVerification (+schedule, verified=1)
 *  admin reject -> Returned (+proposal_reject_note)
 *  coordinator verify -> Commissioning in Progress
 *  coordinator reject -> Returned
 */
class KoProposalApiController extends KoBaseApiController
{
    public function index(Request $request)
    {
        $q = KoProposal::with(['koUnit.koSpipUnit', 'koUnit.koBrand', 'company', 'ccow'])
            ->orderBy('created_at', 'desc');
        if ($s = $request->search) {
            $q->where(fn($qq) => $qq->where('number', 'like', "%{$s}%")
                ->orWhere('applicant_email', 'like', "%{$s}%"));
        }
        if ($st = $request->status) {
            $statuses = array_values(array_filter(array_map('trim', explode(',', (string) $st))));
            count($statuses) > 1 ? $q->whereIn('status', $statuses) : $q->where('status', $statuses[0] ?? $st);
        }
        return $this->success($q->paginate($request->limit ?? 10));
    }

    public function show(string $id)
    {
        return $this->success(KoProposal::with([
            'koUnit.koSpipUnit.koSpipType.koSpipCategory', 'koUnit.koBrand',
            'company', 'ccow', 'department', 'pjo',
            'koAttachment', 'koCommissioning.koCommissioningItems.koCommissioningField',
            'koIssueReports.attachments', 'koQrRequestFiles',
        ])->findOrFail($id));
        // Note: kategori via koUnit.koSpipUnit.koSpipType.koSpipCategory (nested eager load).
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ccow_id'        => 'nullable|uuid|exists:companies,id',
            'area'           => 'required|string|max:255',
            'ko_unit_id'     => 'nullable|uuid|exists:ko_units,id',
            'company_id'     => 'nullable|uuid|exists:companies,id',
            'department_id'  => 'nullable|uuid|exists:departments,id',
            'other_department' => 'nullable|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'pjo_id'         => 'nullable|uuid|exists:users,id',
            'internal_komisioning_schedule' => 'nullable|date',
            'next_commissioning' => 'nullable|date',
            'temporary_validity_period' => 'nullable|date',
            'commissioning_period' => 'nullable|integer|min:0',
        ]);

        $validated['number'] = $this->generateNumber();
        $validated['status'] = KoStatus::Draft->value;

        DB::beginTransaction();
        try {
            $proposal = KoProposal::create($validated);
            KoAttachment::create(['ko_proposal_id' => $proposal->id]);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }

        return $this->success($proposal->fresh(), 201);
    }

    public function update(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        if ($proposal->status !== KoStatus::Draft->value && $proposal->status !== KoStatus::Returned->value) {
            return $this->error('Hanya proposal Draft/Returned yang dapat diedit.', 422);
        }
        $proposal->update($request->validate([
            'ccow_id'        => 'nullable|uuid|exists:companies,id',
            'area'           => 'sometimes|required|string|max:255',
            'ko_unit_id'     => 'nullable|uuid|exists:ko_units,id',
            'company_id'     => 'nullable|uuid|exists:companies,id',
            'department_id'  => 'nullable|uuid|exists:departments,id',
            'other_department' => 'nullable|string|max:255',
            'applicant_email' => 'sometimes|required|email|max:255',
            'pjo_id'         => 'nullable|uuid|exists:users,id',
            'internal_komisioning_schedule' => 'nullable|date',
            'next_commissioning' => 'nullable|date',
            'temporary_validity_period' => 'nullable|date',
            'commissioning_period' => 'nullable|integer|min:0',
        ]));
        return $this->success($proposal->fresh());
    }

    public function destroy(string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        if (!in_array($proposal->status, [KoStatus::Draft->value, KoStatus::Returned->value])) {
            return $this->error('Hanya proposal Draft/Returned yang dapat dihapus.', 422);
        }
        $proposal->koAttachment()->delete();
        $proposal->delete();
        return $this->success(['message' => 'Proposal dihapus.']);
    }

    public function submit(string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        if ($proposal->status !== KoStatus::Draft->value) {
            return $this->error('Hanya Draft yang dapat disubmit.', 422);
        }
        $proposal->update(['status' => KoStatus::AdminProposalVerification->value]);
        return $this->success($proposal->fresh());
    }

    /**
     * Verifikasi proposal.
     * stage: admin|coordinator, action: approve|return
     */
    public function verify(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        $request->validate([
            'stage'  => 'required|in:admin,coordinator',
            'action' => 'required|in:approve,return',
            'note'   => 'nullable|string',
            'internal_komisioning_schedule' => 'nullable|date',
        ]);

        if ($request->stage === 'admin') {
            if ($proposal->status !== KoStatus::AdminProposalVerification->value) {
                return $this->error('Proposal harus pada tahap verifikasi admin.', 422);
            }
            if ($request->action === 'approve') {
                $proposal->update([
                    'status' => KoStatus::CoordinatorProposalVerification->value,
                    'internal_komisioning_schedule' => $request->internal_komisioning_schedule ?? $proposal->internal_komisioning_schedule,
                    'admin_proposal_verified' => true,
                ]);
            } else {
                $proposal->update([
                    'status' => KoStatus::Returned->value,
                    'proposal_reject_note' => $request->note,
                ]);
            }
        } else {
            if ($proposal->status !== KoStatus::CoordinatorProposalVerification->value) {
                return $this->error('Proposal harus pada tahap verifikasi koordinator.', 422);
            }
            if ($request->action === 'approve') {
                $proposal->update(['status' => KoStatus::Commissioning->value]);
            } else {
                $proposal->update([
                    'status' => KoStatus::Returned->value,
                    'proposal_reject_note' => $request->note,
                ]);
            }
        }

        return $this->success($proposal->fresh());
    }

    /**
     * Request Temporary QR (parity aims RequestQR): set masa berlaku +
     * ganti file + status Coordinator Verification.
     */
    public function requestTemporaryQr(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        $request->validate(['temporary_validity_period' => 'required|date']);

        DB::beginTransaction();
        try {
            $proposal->update([
                'temporary_validity_period' => $request->temporary_validity_period,
                'temporary_qr_status'       => 'Coordinator Verification',
            ]);

            if ($request->hasFile('files')) {
                $proposal->koQrRequestFiles()->delete();
                foreach ((array) $request->file('files') as $file) {
                    if (!$file || !$file->isValid()) continue;
                    $this->uploadQrFile($file, $proposal->id);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), 500);
        }

        return $this->success($proposal->fresh()->load('koQrRequestFiles'));
    }

    /**
     * Temporary QR: approve (set Approved) / return (+note).
     * Hanya dari status Coordinator Verification (parity aims).
     */
    public function temporaryQr(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        if ($proposal->temporary_qr_status !== 'Coordinator Verification') {
            return $this->error('QR sementara harus pada tahap verifikasi koordinator.', 422);
        }
        $request->validate([
            'action' => 'required|in:approve,return',
            'note'   => 'nullable|string',
        ]);
        if ($request->action === 'approve') {
            $proposal->update(['temporary_qr_status' => 'Approved']);
        } else {
            $proposal->update([
                'temporary_qr_status'      => 'Rejected',
                'temporary_qr_reject_note' => $request->note,
            ]);
        }
        return $this->success($proposal->fresh());
    }

    /**
     * Lampiran dokumen proposal (parity aims AddAttachment, tanpa upload fisik:
     * nilai berupa path/nama berkas). Hanya saat Draft/Returned.
     */
    public function updateAttachments(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        if (!in_array($proposal->status, [KoStatus::Draft->value, KoStatus::Returned->value])) {
            return $this->error('Hanya proposal Draft/Returned yang dapat dilengkapi lampirannya.', 422);
        }

        $fields = ['stnk','nota_pajak','surat_pengantar','re_manufacture','oem','dokumen_sertifikat','inspeksi_p3k','kir','uji_pjit','pra_komisioning','setting_radio','slo','komisioning_internal','com'];
        $validated = $request->validate(array_fill_keys($fields, 'nullable|string|max:255')
            + array_fill_keys(array_map(fn($f) => "file_{$f}", $fields), 'nullable|file|max:20480'));

        $data = array_filter($validated, fn($k) => in_array($k, $fields), ARRAY_FILTER_USE_KEY);

        // Upload fisik per field ke blob (parity aims: ko/attachment/{id}/{field}).
        $blobResponses = [];
        foreach ($fields as $field) {
            $fileKey = "file_{$field}";
            if ($request->hasFile($fileKey) && $request->file($fileKey)->isValid()) {
                $file = $request->file($fileKey);
                try {
                    $url = $this->uploadProposalAttachmentFile($file, $proposal->id, $field);
                    $data[$field] = $url;
                    $blobResponses[$field] = $url;
                } catch (\Throwable $e) {
                    \Log::error('KO: gagal upload lampiran proposal', ['field' => $field, 'error' => $e->getMessage()]);
                }
            }
        }
        if (!empty($blobResponses)) {
            $data['blob_response'] = json_encode($blobResponses);
        }

        $attachment = KoAttachment::firstOrCreate(['ko_proposal_id' => $proposal->id]);
        $attachment->update($data);

        return $this->success($attachment->fresh());
    }

    /**
     * Upload berkas QR request (parity aims RequestQR.php).
     */
    public function storeQrFiles(Request $request, string $id)
    {
        $proposal = KoProposal::findOrFail($id);
        $uploaded = [];
        if ($request->hasFile('files')) {
            foreach ((array) $request->file('files') as $file) {
                if (!$file || !$file->isValid()) continue;
                $uploaded[] = $this->uploadQrFile($file, $proposal->id);
            }
        }
        return $this->success($uploaded, 201);
    }

    /**
     * Preview lampiran dokumen proposal KO (stnk, nota_pajak, kir, dll)
     * via path query parameter (parity FieldLeadership & legacy KOController).
     */
    public function previewAttachment(Request $request)
    {
        $path = $request->query('path');
        if (!$path) abort(400, 'Path tidak diberikan.');

        $storageUrl = asset('storage/');
        if (strpos($path, $storageUrl) === 0) {
            $path = substr($path, strlen($storageUrl));
        }
        $path = ltrim($path, '/');

        $fileName = basename($path);
        $ext      = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $mimeType = match ($ext) {
            'pdf'         => 'application/pdf',
            'png'         => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            default       => 'application/octet-stream',
        };

        $filePath = $path;
        $container = 'aims-cntr';

        if (filter_var($path, FILTER_VALIDATE_URL) && strpos($path, 'blob.core.windows.net') !== false) {
            $parsedUrl = parse_url($path);
            $urlPath   = ltrim($parsedUrl['path'] ?? '', '/');
            $parts     = explode('/', $urlPath, 2);
            if (count($parts) === 2) {
                $container = $parts[0];
                $filePath  = urldecode(preg_replace('/\/+/', '/', $parts[1]));
            }
        }

        $sas = GetBlobSasUri($container, $filePath, 60);
        $url = is_array($sas)
            ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? null)
            : $sas;

        if (!$url && filter_var($path, FILTER_VALIDATE_URL)) {
            $url = $path;
        }

        if ($url) {
            $contents = @file_get_contents($url);
            if ($contents !== false) {
                return response($contents, 200, [
                    'Content-Type'        => $mimeType,
                    'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
                    'Cache-Control'       => 'private, max-age=300',
                ]);
            }
        }

        $localPath = \Illuminate\Support\Facades\Storage::disk('public')->path($filePath);
        if (file_exists($localPath)) {
            return response()->file($localPath, [
                'Content-Type'        => $mimeType,
                'Content-Disposition' => 'inline; filename="' . addslashes($fileName) . '"',
            ]);
        }

        abort(404, 'File tidak dapat diakses.');
    }

    /**
     * Download lampiran dokumen proposal KO.
     */
    public function downloadAttachment(Request $request)
    {
        $path = $request->query('path');
        if (!$path) abort(400, 'Path tidak diberikan.');

        $storageUrl = asset('storage/');
        if (strpos($path, $storageUrl) === 0) {
            $path = substr($path, strlen($storageUrl));
        }
        $path = ltrim($path, '/');

        $fileName = basename($path);
        $filePath = $path;
        $container = 'aims-cntr';

        if (filter_var($path, FILTER_VALIDATE_URL) && strpos($path, 'blob.core.windows.net') !== false) {
            $parsedUrl = parse_url($path);
            $urlPath   = ltrim($parsedUrl['path'] ?? '', '/');
            $parts     = explode('/', $urlPath, 2);
            if (count($parts) === 2) {
                $container = $parts[0];
                $filePath  = urldecode(preg_replace('/\/+/', '/', $parts[1]));
            }
        }

        $sas = GetBlobSasUri($container, $filePath, 60);
        $url = is_array($sas)
            ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? null)
            : $sas;

        if (!$url && filter_var($path, FILTER_VALIDATE_URL)) {
            $url = $path;
        }

        if ($url) return redirect($url);

        $localPath = \Illuminate\Support\Facades\Storage::disk('public')->path($filePath);
        if (file_exists($localPath)) return response()->download($localPath, $fileName);

        abort(404, 'File tidak ditemukan.');
    }

    private function generateNumber(): string
    {
        $prefix = 'KO/'.now()->format('Y').'/';
        $count = KoProposal::where('number', 'like', $prefix.'%')->count();
        do {
            $count++;
            $number = $prefix.str_pad((string) $count, 4, '0', STR_PAD_LEFT);
        } while (KoProposal::where('number', $number)->exists());
        return $number;
    }
}
