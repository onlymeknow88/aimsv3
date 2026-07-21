<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Document extends Model
{
    use HasUuids;

    protected $table = 'document_system_documents';

    protected $fillable = [
        'company_id',
        'department_id',
        'department_code_id',
        'mapping_id',
        'module_id',
        'category_id',
        'area_manager_id',
        'user_id',
        'created_by',
        'related_document_id',
        'upload_type',
        'document_level',
        'status',
        'revision',
        'title',
        'description',
        'sop_number',
        'sop_add_win',
        'sop_add_form',
        'document_number',
        'prefix_code',
        'file_path',
        'uncontrolled_file_path',
        'uncontrolled_blob_url',
        'uncontrolled_blob_respon',
        'approved_by_crs',
        'approved_at_crs',
        'approved_by_pja',
        'approved_at_pja',
        'doc_created',
        'is_obsolate',
    ];

    protected $casts = [
        'doc_created' => 'date',
        'is_obsolate' => 'boolean',
    ];

    public function mapping()
    {
        return $this->belongsTo(Mapping::class, 'mapping_id');
    }

    public function relatedDocument()
    {
        return $this->belongsTo(Document::class, 'related_document_id');
    }

    public function revisions()
    {
        return $this->hasMany(Document::class, 'related_document_id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'document_id');
    }

    public function invitedPeople()
    {
        return $this->hasMany(InvitedPeople::class, 'document_id');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'document_id');
    }

    public function owner()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function areaManager()
    {
        return $this->belongsTo(\App\Models\AreaManager::class, 'area_manager_id');
    }

    public function department()
    {
        return $this->belongsTo(\App\Models\Department::class, 'department_id');
    }

    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class, 'company_id');
    }

    public function approvedByCrsUser()
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by_crs');
    }

    public function approvedByPjaUser()
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by_pja');
    }
}
