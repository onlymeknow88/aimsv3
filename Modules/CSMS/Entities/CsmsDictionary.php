<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsDictionary extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_dictionaries';

    protected $fillable = [
        'term',
        'definition'
    ];
}
