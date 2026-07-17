<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocumentAttachment extends Model
{
    use HasUuids;

    protected $table = 'document_system_jsa_attachments';

    protected $fillable = [
        'jsa_document_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    public function jsaDocument()
    {
        return $this->belongsTo(JsaDocument::class, 'jsa_document_id');
    }
}
