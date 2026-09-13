<?php

namespace Modules\Ko\Entities;

use App\Models\Company;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoProposal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_proposals';

    protected $fillable = [
        'number', 'ccow_id', 'area', 'ko_unit_id', 'company_id', 'department_id',
        'other_department', 'applicant_email', 'pjo_id', 'internal_komisioning_schedule',
        'next_commissioning', 'temporary_validity_period', 'commissioning_period',
        'status', 'temporary_qr_reject_note', 'temporary_qr_status',
        'commissioning_reject_note', 'proposal_reject_note', 'admin_proposal_verified',
    ];

    protected $casts = ['admin_proposal_verified' => 'boolean'];

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function pjo()
    {
        return $this->belongsTo(User::class, 'pjo_id');
    }

    public function koUnit()
    {
        return $this->belongsTo(KoUnit::class, 'ko_unit_id');
    }

    public function koAttachment()
    {
        return $this->hasOne(KoAttachment::class, 'ko_proposal_id');
    }

    public function koCommissioning()
    {
        return $this->hasOne(KoCommissioning::class, 'ko_proposal_id');
    }

    public function koIssueReports()
    {
        return $this->hasMany(KoIssueReport::class, 'ko_proposal_id');
    }

    public function koQrRequestFiles()
    {
        return $this->hasMany(KoQrRequestFile::class, 'ko_proposal_id');
    }

    /**
     * Teks payload QR stiker/sertifikat unit.
     * Parity newaims Modules\KO\Entities\KoProposal::getQrCode (isi identik,
     * tanpa dependensi simplesoftwareio/simple-qrcode).
     */
    public function getQrPayload(): string
    {
        $unit = $this->koUnit;
        $category = $unit?->koSpipUnit?->koSpipType?->koSpipCategory;
        $intervalMonths = (int) (($category?->internal_interval_year ?? 0) * 12 / 2);

        try {
            $internalDue = $this->next_commissioning
                ? \Carbon\Carbon::parse($this->next_commissioning)->subMonths($intervalMonths)->format('Y-m-d')
                : '-';
        } catch (\Throwable) {
            $internalDue = '-';
        }

        return implode("\n", [
            'PERUSAHAAN: ' . ($this->company?->company_name ?? '-'),
            'NO POLISI: ' . ($unit?->identity_number ?? '-'),
            'CALL SIGN: ' . ($unit?->call_sign ?? '-'),
            'KATEGORI SPIP: ' . ($category?->name ?? '-'),
            'KLASIFIKASI SPIP: ' . ($unit?->koSpipUnit?->name ?? '-'),
            'BRAND: ' . ($unit?->koBrand?->name ?? '-'),
            'COMMISIONER: ' . ($this->koCommissioning?->created_by ?? '-'),
            'TAHUN PEMBUATAN: ' . ($unit?->production_year ?? '-'),
            'KOMISIONING INTERNAL SELAMBATNYA PADA: ' . $internalDue,
            'MASA BERLAKU: ' . ($this->status === 'Completed' ? ($this->next_commissioning ?? '-') : '-'),
            'MASA BERLAKU SEMENTARA: ' . ($this->status === 'Completed' ? '-' : ($this->temporary_validity_period ?? '-')),
            'PERIODE KOMISIONING KE-: ' . ($this->commissioning_period ?? '-'),
        ]);
    }

    /**
     * QR SVG dalam bentuk base64 (data URI) memakai bacon/bacon-qr-code,
     * mengikuti pola CSMSBiddingApiController.
     */
    public function getQrCodeSvgBase64(): ?string
    {
        try {
            $renderer = new \BaconQrCode\Renderer\ImageRenderer(
                new \BaconQrCode\Renderer\RendererStyle\RendererStyle(326),
                new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
            );
            $svg = (new \BaconQrCode\Writer($renderer))->writeString($this->getQrPayload());
            return 'data:image/svg+xml;base64,' . base64_encode($svg);
        } catch (\Throwable) {
            return null;
        }
    }
}
