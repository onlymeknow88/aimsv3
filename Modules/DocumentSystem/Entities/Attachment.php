<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Attachment extends Model
{
    use HasUuids;

    protected $table = 'document_system_attachments';

    protected $fillable = [
        'document_id',
        'file_path',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
