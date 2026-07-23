<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CsmsChecklist extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_checklists';

    public $timestamps = false;

    protected $fillable = [
        'bidding_id',
        'question_id',
        'value',
        'comment',
        'ordinal_number'
    ];

    public function bidding()
    {
        return $this->belongsTo(Bidding::class, 'bidding_id');
    }

    public function question()
    {
        return $this->belongsTo(CsmsMasterDataChecklist::class, 'question_id');
    }

    public function attachments()
    {
        return $this->hasMany(CsmsChecklistAttachment::class, 'checklist_id');
    }
}
