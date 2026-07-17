<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Attachment extends Model
{
    use HasUuids;

    protected $table = 'document_system_attachments';

    protected $fillable = [
        'document_id',
        'file_name',
        'file_type',
        'file_size',
        'path',
        'blob_url',
        'blob_respon',
        'status',
    ];

    public function getFilePathAttribute()
    {
        return $this->path;
    }

    public function setFilePathAttribute($value)
    {
        $this->attributes['path'] = $value;
    }

    public function getMimeTypeAttribute()
    {
        $map = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'txt' => 'text/plain',
            'zip' => 'application/zip',
        ];
        return $map[strtolower($this->file_type)] ?? 'application/octet-stream';
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
