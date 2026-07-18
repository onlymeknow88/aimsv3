<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocumentAttachment extends Model
{
    use HasUuids;

    protected $table = 'jsa_document_attachments';

    protected $fillable = [
        'jsa_document_id',
        'file_path',
        'blob_url',
        'blob_respon',
    ];

    public function jsaDocument()
    {
        return $this->belongsTo(JsaDocument::class, 'jsa_document_id');
    }
}
