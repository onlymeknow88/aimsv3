<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ModuleCategory extends Model
{
    use HasUuids;

    protected $table = 'document_system_module_categories';

    protected $fillable = [
        'module_id',
        'name',
        'index',
        'description',
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
