<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocumentActivity extends Model
{
    use HasUuids;

    protected $table = 'document_system_jsa_activities';

    protected $fillable = [
        'jsa_document_id',
        'user_id',
        'activity',
        'notes',
    ];

    public function jsaDocument()
    {
        return $this->belongsTo(JsaDocument::class, 'jsa_document_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
