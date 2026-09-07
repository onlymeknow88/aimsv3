<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoUnit extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_units';

    protected $fillable = [
        'ko_spip_unit_id', 'call_sign', 'identity_number', 'serial_number',
        'ko_brand_id', 'model_unit', 'production_year', 'commissioning_count',
        'is_revoked', 'revoked_date', 'revoke_requested_date',
        'revoke_request_note', 'revoke_status',
    ];

    protected $casts = ['is_revoked' => 'boolean'];

    public function koSpipUnit()
    {
        return $this->belongsTo(KoSpipUnit::class, 'ko_spip_unit_id');
    }

    public function koBrand()
    {
        return $this->belongsTo(KoBrand::class, 'ko_brand_id');
    }

    public function koProposals()
    {
        return $this->hasMany(KoProposal::class, 'ko_unit_id');
    }
}
