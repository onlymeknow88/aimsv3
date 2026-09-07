<?php

namespace Modules\Pica\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class PicaAuditor extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pica_auditors';

    protected $fillable = [
        'pica_id',
        'user_id',
        'name',
    ];

    public function picaDocument()
    {
        return $this->belongsTo(PicaDocument::class, 'pica_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
