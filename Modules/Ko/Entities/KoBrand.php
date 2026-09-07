<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KoBrand extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'ko_brands';

    protected $fillable = ['ko_spip_category_id', 'name'];

    public function koSpipCategory()
    {
        return $this->belongsTo(KoSpipCategory::class, 'ko_spip_category_id');
    }

    public function koUnits()
    {
        return $this->hasMany(KoUnit::class, 'ko_brand_id');
    }
}
