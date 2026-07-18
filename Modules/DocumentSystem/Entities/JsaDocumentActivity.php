<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocumentActivity extends Model
{
    use HasUuids;

    protected $table = 'jsa_document_activities';

    protected $fillable = [
        'document_id',
        'user_id',
        'status_document',
        'description',
        'attachments',
    ];

    public function jsaDocument()
    {
        return $this->belongsTo(JsaDocument::class, 'document_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
