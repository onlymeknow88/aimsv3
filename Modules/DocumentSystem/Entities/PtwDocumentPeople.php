<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PtwDocumentPeople extends Model
{
    use HasUuids;

    protected $table = 'ptw_document_people';

    protected $fillable = [
        'ptw_document_id',
        'user_id',
        'email',
        'role',   // e.g. 'penanggung_jawab', 'reviewer'
        'status',
    ];

    public function ptwDocument()
    {
        return $this->belongsTo(PtwDocument::class, 'ptw_document_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
