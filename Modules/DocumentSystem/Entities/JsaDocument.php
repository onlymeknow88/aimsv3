<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JsaDocument extends Model
{
    use HasUuids;

    // Status Constants
    const DRAFT          = '1';
    const PENDING_REVIEW = '2';
    const REJECTED       = '3';
    const ACTIVE         = '5';

    protected $table = 'jsa_documents';

    protected $fillable = [
        'department_id',
        'company_id',
        'department_code_id',
        'user_id',
        'created_by',
        'status',
        'title',
        'description',
        'document_number',
        'doc_created',
        'detail_location',
        'parent_document',
        'is_obsolate',
        'revision',
        'area_manager_id',
    ];

    protected $casts = [
        'doc_created' => 'datetime',
        'is_obsolate' => 'boolean',
        'status'      => 'string',
    ];

    public function areaManager()
    {
        return $this->belongsTo(\App\Models\User::class, 'area_manager_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
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
        return $this->hasMany(JsaDocumentActivity::class, 'document_id')->latest();
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
