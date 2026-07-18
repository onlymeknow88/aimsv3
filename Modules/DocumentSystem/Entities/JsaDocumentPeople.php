<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocumentPeople extends Model
{
    use HasUuids;

    protected $table = 'jsa_document_people';

    protected $fillable = [
        'document_id',
        'user_id',
        'email',
        'type',
        'is_notify_email',
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
