<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsLetter extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_letters';

    protected $fillable = [
        'title',
        'status'
    ];

    public function files()
    {
        return $this->hasMany(CsmsLetterFile::class, 'letter_id');
    }
}
