<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoSpipType extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_spip_types';

    protected $fillable = ['ko_spip_category_id', 'name'];

    public function koSpipCategory()
    {
        return $this->belongsTo(KoSpipCategory::class, 'ko_spip_category_id');
    }

    public function koSpipUnits()
    {
        return $this->hasMany(KoSpipUnit::class, 'ko_spip_type_id');
    }
}
