<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Company;

class CsmsMemoKtt extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_memo_ktts';

    protected $fillable = [
        'ccow_id',
        'ktt_id',
        'memo_number',
        'title',
        'date',
        'description',
        'status'
    ];

    protected $casts = [
        'date' => 'date'
    ];

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function files()
    {
        return $this->hasMany(CsmsMemoKttFile::class, 'memo_id');
    }
}
