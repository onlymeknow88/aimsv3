<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoSpipUnit extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_spip_units';

    protected $fillable = ['ko_spip_type_id', 'name', 'attachment_field'];

    protected $casts = ['attachment_field' => 'array'];

    public function koSpipType()
    {
        return $this->belongsTo(KoSpipType::class, 'ko_spip_type_id');
    }

    public function koCommissioningHeaders()
    {
        return $this->hasMany(KoCommissioningHeader::class, 'ko_spip_unit_id');
    }

    public function koUnits()
    {
        return $this->hasMany(KoUnit::class, 'ko_spip_unit_id');
    }
}
