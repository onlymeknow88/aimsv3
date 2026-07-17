<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PtwDocument extends Model
{
    use HasUuids;

    protected $table = 'ptw_documents';

    protected $fillable = [
        'department_id',
        'user_id',
        'status',
        'title',
        'description',
        'document_number',
        'doc_created',
        'detail_location',
    ];

    protected $casts = [
        'doc_created' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
