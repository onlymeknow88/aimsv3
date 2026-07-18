<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocument extends Model
{
    use HasUuids;

    protected $table = 'jsa_documents';

    protected $fillable = [
        'department_id',
        'company_id',
        'department_code_id',
        'user_id',
        'status',
        'title',
        'description',
        'document_number',
        'doc_created',
        'detail_location',
        'parent_document',
        'is_obsolate',
        'revision',
    ];

    protected $casts = [
        'doc_created' => 'datetime',
        'is_obsolate' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function parent()
    {
        return $this->belongsTo(JsaDocument::class, 'parent_document');
    }

    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class, 'company_id');
    }

    public function department()
    {
        return $this->belongsTo(\App\Models\Department::class, 'department_id');
    }

    public function activities()
    {
        return $this->hasMany(JsaDocumentActivity::class, 'document_id');
    }

    public function people()
    {
        return $this->hasMany(JsaDocumentPeople::class, 'document_id');
    }

    public function attachments()
    {
        return $this->hasMany(JsaDocumentAttachment::class, 'jsa_document_id');
    }
}
