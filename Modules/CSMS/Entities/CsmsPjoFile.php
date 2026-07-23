<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsPjoFile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_pjo_files';

    protected $fillable = [
        'pjo_id',
        'file',
        'blob_url',
        'blob_response',
        'name',
        'size'
    ];

    public function pjo()
    {
        return $this->belongsTo(CsmsPjo::class, 'pjo_id');
    }
}
