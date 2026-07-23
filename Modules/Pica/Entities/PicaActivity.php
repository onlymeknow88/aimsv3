<?php

namespace Modules\Pica\Entities;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PicaActivity extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'pica_id',
        'description',
        'user_id', // stored as string per aims convention
    ];

    public function pica()
    {
        return $this->belongsTo(PicaDocument::class, 'pica_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function files()
    {
        return $this->hasMany(PicaActivityFile::class, 'pica_activity_id');
    }
}
