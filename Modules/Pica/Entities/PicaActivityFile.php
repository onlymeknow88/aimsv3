<?php

namespace Modules\Pica\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PicaActivityFile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'pica_activity_id',
        'file',
        'type_file', // file extension: pdf, png, etc
        'size',
        'blob_url',
        'blob_response',
    ];

    public function activity()
    {
        return $this->belongsTo(PicaActivity::class, 'pica_activity_id');
    }

    public function getNameAttribute(): string
    {
        return basename($this->file ?? '');
    }
}
