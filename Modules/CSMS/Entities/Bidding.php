<?php

namespace Modules\CSMS\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Company;
use App\Models\BusinessEntity;

class Bidding extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'biddings';

    protected $fillable = [
        'maker_id',
        'criteria',
        'classification',
        'ccow_id',
        'company_id',
        'parent_id',
        'grand_parent_id',
        'business_entity_id',
        'company_name',
        'address',
        'company_site',
        'license_number',
        'service_criteria',
        'person_in_charge',
        'status',
        'requested',
        'published',
        'approved_by',
        'ktt_name',
        'questionnaire',
        'risk_category',
        'is_obsolate',
        'csms_doc_number',
        'date'
    ];

    protected $casts = [
        'questionnaire' => 'json',
        'is_obsolate' => 'boolean',
        'date' => 'date'
    ];

    protected $appends = [
        'maker_name',
        'ccow_name',
        'parent_name',
        'business_entity_name'
    ];

    public function getMakerNameAttribute()
    {
        return $this->maker?->name ?? '-';
    }

    public function getCcowNameAttribute()
    {
        return $this->ccow?->company_name ?? null;
    }

    public function getParentNameAttribute()
    {
        return $this->parent?->company_name ?? null;
    }

    public function getBusinessEntityNameAttribute()
    {
        return $this->businessEntity?->name ?? null;
    }

    public function maker()
    {
        return $this->belongsTo(User::class, 'maker_id');
    }

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function parent()
    {
        return $this->belongsTo(Company::class, 'parent_id');
    }

    public function businessEntity()
    {
        return $this->belongsTo(BusinessEntity::class, 'business_entity_id');
    }

    public function checklists()
    {
        return $this->hasMany(CsmsChecklist::class, 'bidding_id');
    }
}
