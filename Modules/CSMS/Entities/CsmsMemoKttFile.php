<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsMemoKttFile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_memo_ktt_files';

    protected $fillable = [
        'memo_id',
        'file',
        'blob_url',
        'blob_response',
        'name',
        'size'
    ];

    public function memo()
    {
        return $this->belongsTo(CsmsMemoKtt::class, 'memo_id');
    }
}
