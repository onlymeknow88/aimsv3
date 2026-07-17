<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ActivityAttachment extends Model
{
    use HasUuids;

    protected $table = 'document_system_activities_attachments';

    protected $fillable = [
        'activity_id',
        'path',
        'file_size',
        'file_type',
        'name',
        'blob_url',
        'blob_response',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }
}
