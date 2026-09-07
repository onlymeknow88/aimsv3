<?php

namespace Modules\Ko\Entities;

use App\Models\Company;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoProposal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_proposals';

    protected $fillable = [
        'number', 'ccow_id', 'area', 'ko_unit_id', 'company_id', 'department_id',
        'other_department', 'applicant_email', 'pjo_id', 'internal_komisioning_schedule',
        'next_commissioning', 'temporary_validity_period', 'commissioning_period',
        'status', 'temporary_qr_reject_note', 'temporary_qr_status',
        'commissioning_reject_note', 'proposal_reject_note', 'admin_proposal_verified',
    ];

    protected $casts = ['admin_proposal_verified' => 'boolean'];

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function pjo()
    {
        return $this->belongsTo(User::class, 'pjo_id');
    }

    public function koUnit()
    {
        return $this->belongsTo(KoUnit::class, 'ko_unit_id');
    }

    public function koAttachment()
    {
        return $this->hasOne(KoAttachment::class, 'ko_proposal_id');
    }

    public function koCommissioning()
    {
        return $this->hasOne(KoCommissioning::class, 'ko_proposal_id');
    }

    public function koIssueReports()
    {
        return $this->hasMany(KoIssueReport::class, 'ko_proposal_id');
    }

    public function koQrRequestFiles()
    {
        return $this->hasMany(KoQrRequestFile::class, 'ko_proposal_id');
    }
}
