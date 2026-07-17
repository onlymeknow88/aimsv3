<?php

namespace Modules\DocumentSystem\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class InvitedPeople extends Model
{
    use HasUuids;

    protected $table = 'document_system_invited_people';

    protected $fillable = [
        'document_id',
        'user_id',
        'email',
        'status',
        'note',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
