<?php

namespace Modules\CSMS\Entities;

use App\Models\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsLetter extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_letters';

    protected $fillable = [
        'letter_number',
        'title',
        'ccow_id',
        'ktt_id',
        'date',
        'date_inactive',
        'description',
        'status'
    ];

    protected $casts = [
        'date'          => 'date',
        'date_inactive' => 'date',
    ];

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function files()
    {
        return $this->hasMany(CsmsLetterFile::class, 'letter_id');
    }
}
