<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsPica extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_picas';

    protected $fillable = [
        'bidding_id',
        'description',
        'status',
    ];

    protected $appends = [
        'company_name'
    ];

    public function getCompanyNameAttribute()
    {
        return $this->bidding?->company_name;
    }

    public function bidding()
    {
        return $this->belongsTo(Bidding::class, 'bidding_id');
    }
}
