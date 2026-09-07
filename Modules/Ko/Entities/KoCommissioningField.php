<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoCommissioningField extends Model
{
    use HasFactory;

    protected $table = 'ko_commissioning_fields';

    protected $fillable = ['ko_commissioning_header_id', 'number', 'question', 'hazard_code'];

    public function header()
    {
        return $this->belongsTo(KoCommissioningHeader::class, 'ko_commissioning_header_id');
    }
}
