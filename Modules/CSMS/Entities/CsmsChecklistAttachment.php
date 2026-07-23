<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsChecklistAttachment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_checklist_attachments';

    protected $fillable = [
        'checklist_id',
        'file',
        'blob_url',
        'blob_response',
        'name',
        'type',
        'size'
    ];

    public function checklist()
    {
        return $this->belongsTo(CsmsChecklist::class, 'checklist_id');
    }
}
