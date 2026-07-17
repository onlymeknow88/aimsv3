<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Mapping extends Model
{
    use HasUuids;

    protected $table = 'document_system_mappings';

    protected $fillable = [
        'category_id',
        'index',
        'name',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'mapping_id');
    }
}
