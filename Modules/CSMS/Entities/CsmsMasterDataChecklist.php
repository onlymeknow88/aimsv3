<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsMasterDataChecklist extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_master_data_checklists';

    protected $fillable = [
        'point',
        'sub_point',
        'criteria',
        'legal_base',
        'ordinal_number',
        'crtiteria',
        'note'
    ];

    public function checklists()
    {
        return $this->hasMany(CsmsChecklist::class, 'question_id');
    }
}
