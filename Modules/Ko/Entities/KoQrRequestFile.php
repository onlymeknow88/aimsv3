<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KoQrRequestFile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_qr_request_files';

    protected $fillable = [
        'ko_proposal_id', 'attachment', 'blob_url', 'blob_response',
        'type', 'name', 'size',
    ];

    public function koProposal(): BelongsTo
    {
        return $this->belongsTo(KoProposal::class, 'ko_proposal_id');
    }
}
