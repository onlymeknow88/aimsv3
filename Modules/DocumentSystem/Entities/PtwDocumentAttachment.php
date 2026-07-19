<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PtwDocumentAttachment extends Model
{
    use HasUuids;

    protected $table = 'ptw_document_attachments';

    protected $fillable = [
        'ptw_document_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    public function ptwDocument()
    {
        return $this->belongsTo(PtwDocument::class, 'ptw_document_id');
    }
}
