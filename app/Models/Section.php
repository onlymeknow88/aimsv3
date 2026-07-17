<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'department_id',
        'name',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function areaLocations()
    {
        return $this->belongsToMany(AreaLocation::class, 'section_area_locations');
    }

    public function areaManagers()
    {
        return $this->belongsToMany(AreaManager::class, 'section_area_managers');
    }
}
