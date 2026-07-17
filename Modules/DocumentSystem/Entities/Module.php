<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Module extends Model
{
    use HasUuids;

    protected $table = 'document_system_modules';

    protected $fillable = [
        'index',
        'name',
        'has_document_number',
    ];

    public function categories()
    {
        return $this->hasMany(Category::class, 'module_id');
    }
}
