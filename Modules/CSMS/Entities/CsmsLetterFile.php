<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsLetterFile extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_letter_files';

    protected $fillable = [
        'letter_id',
        'file',
        'blob_url',
        'blob_response',
        'name',
        'size'
    ];

    public function letter()
    {
        return $this->belongsTo(CsmsLetter::class, 'letter_id');
    }
}
