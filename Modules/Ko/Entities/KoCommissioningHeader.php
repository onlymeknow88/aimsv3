<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoCommissioningHeader extends Model
{
    use HasFactory;

    protected $table = 'ko_commissioning_headers';

    protected $fillable = ['ko_spip_unit_id', 'number', 'header'];

    public function koSpipUnit()
    {
        return $this->belongsTo(KoSpipUnit::class, 'ko_spip_unit_id');
    }

    public function koCommissioningFields()
    {
        return $this->hasMany(KoCommissioningField::class, 'ko_commissioning_header_id');
    }
}
