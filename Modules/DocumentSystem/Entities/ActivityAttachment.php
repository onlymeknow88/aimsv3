<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ActivityAttachment extends Model
{
    use HasUuids;

    protected $table = 'document_system_activity_attachments';

    protected $fillable = [
        'activity_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }
}
