<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PtwDocumentActivity extends Model
{
    use HasUuids;

    protected $table = 'ptw_document_activities';

    protected $fillable = [
        'ptw_document_id',
        'user_id',
        'activity',
        'notes',
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
