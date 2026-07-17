<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Category extends Model
{
    use HasUuids;

    protected $table = 'document_system_categories';

    protected $fillable = [
        'module_id',
        'index',
        'name',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function mappings()
    {
        return $this->hasMany(Mapping::class, 'category_id');
    }
}
