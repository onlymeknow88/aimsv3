<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Document extends Model
{
    use HasUuids;

    protected $table = 'document_system_documents';

    protected $fillable = [
        'department_id',
        'department_code_id',
        'mapping_id',
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

    public function department()
    {
        return $this->belongsTo(\App\Models\Department::class, 'department_id');
    }
}
