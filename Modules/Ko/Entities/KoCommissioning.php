<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoCommissioning extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_commissionings';

    protected $fillable = [
        'ko_proposal_id', 'date', 'commissioning_completion_date',
        'smu_odo_meter', 'engine_status', 'expired_date', 'status', 'created_by',
    ];

    public function koProposal()
    {
        return $this->belongsTo(KoProposal::class, 'ko_proposal_id');
    }

    public function koCommissioningItems()
    {
        return $this->hasMany(KoCommissioningItem::class, 'ko_commissioning_id');
    }
}
