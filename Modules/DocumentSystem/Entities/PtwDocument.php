<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PtwDocument extends Model
{
    use HasUuids;

    protected $table = 'ptw_documents';

    protected $fillable = [
        'company_id',
        'department_id',
        'user_id',
        'area_manager_id',
        'status',
        'title',
        'description',
        'document_number',
        'doc_created',
        'inactive_at',
        'detail_location',
    ];

    protected $casts = [
        'doc_created' => 'datetime',
        'inactive_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function department()
    {
        return $this->belongsTo(\App\Models\Department::class, 'department_id');
    }

    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class, 'company_id');
    }

    public function areaManager()
    {
        return $this->belongsTo(\App\Models\User::class, 'area_manager_id');
    }

    public function activities()
    {
        return $this->hasMany(PtwDocumentActivity::class, 'ptw_document_id');
    }

    public function attachments()
    {
        return $this->hasMany(PtwDocumentAttachment::class, 'ptw_document_id');
    }

    public function peoples()
    {
        return $this->hasMany(PtwDocumentPeople::class, 'ptw_document_id');
    }
}
