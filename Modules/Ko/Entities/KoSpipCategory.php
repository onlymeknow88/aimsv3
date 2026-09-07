<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoSpipCategory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_spip_categories';

    protected $fillable = ['name', 'internal_interval_year', 'contractor_interval_year'];

    public function koSpipTypes()
    {
        return $this->hasMany(KoSpipType::class, 'ko_spip_category_id');
    }

    public function koBrands()
    {
        return $this->hasMany(KoBrand::class, 'ko_spip_category_id')->withTrashed();
    }
}
