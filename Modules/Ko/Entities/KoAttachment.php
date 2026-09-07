<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoAttachment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_attachments';

    protected $fillable = [
        'ko_proposal_id', 'stnk', 'nota_pajak', 'surat_pengantar', 're_manufacture',
        'oem', 'dokumen_sertifikat', 'inspeksi_p3k', 'kir', 'uji_pjit',
        'pra_komisioning', 'setting_radio', 'slo', 'komisioning_internal', 'com',
        'blob_response',
    ];

    public function koProposal()
    {
        return $this->belongsTo(KoProposal::class, 'ko_proposal_id');
    }
}
