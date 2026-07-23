<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Company;

class CsmsPjo extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'csms_pjos';

    protected $fillable = [
        'company_id',
        'criteria',
        'ccow_id',
        'submission',
        'number_pjo',
        'name',
        'date_of_birth',
        'phone',
        'email',
        'date_submission',
        'date_approved',
        'comment',
        'status',
        'published',
        'requested',
        'created_by'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_submission' => 'date',
        'date_approved' => 'date'
    ];

    protected $appends = [
        'company_name_resolved'
    ];

    public function getCompanyNameResolvedAttribute()
    {
        return $this->company?->company_name ?? '-';
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function files()
    {
        return $this->hasMany(CsmsPjoFile::class, 'pjo_id');
    }
}
