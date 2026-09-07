<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoIssueReport extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_issue_reports';

    protected $fillable = [
        'ko_proposal_id', 'ko_unit_id', 'ko_commissioning_field_id',
        'note', 'attachment', 'hazard_code', 'status', 'returned_message',
    ];

    public function koProposal()
    {
        return $this->belongsTo(KoProposal::class, 'ko_proposal_id');
    }

    public function koUnit()
    {
        return $this->belongsTo(KoUnit::class, 'ko_unit_id');
    }

    public function koCommissioningField()
    {
        return $this->belongsTo(KoCommissioningField::class, 'ko_commissioning_field_id');
    }

    public function attachments()
    {
        return $this->hasMany(KoIssueReportAttachment::class, 'ko_issue_report_id');
    }
}
