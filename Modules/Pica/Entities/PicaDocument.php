<?php

namespace Modules\Pica\Entities;

use App\Models\AreaLocation;
use App\Models\AreaManager;
use App\Models\Company;
use App\Models\Section;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PicaDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'identity_id',
        'source',
        'source_id',
        'type',
        'date',
        'ccow_id',
        'company_id',
        'section_id',
        'location_id',
        'location_detail',
        'company_detail',
        'pja_id',
        'pjo_id',
        'auditor',
        'non_compliance',
        'non_compliance_root_cause',
        'corrective_action',
        'target_settlement_date',
        'settlement_date',
        'remarks',
        'requested',
        'published',
        'status',
        'created_by',
    ];

    protected $casts = [
        'date'                   => 'date',
        'target_settlement_date' => 'date',
        'settlement_date'        => 'date',
    ];

    protected $appends = ['is_overdue', 'auditor_name'];

    // -------------------------------------------------------------------------
    // Relations
    // -------------------------------------------------------------------------

    public function ccow()
    {
        return $this->belongsTo(Company::class, 'ccow_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function areaLocation()
    {
        return $this->belongsTo(AreaLocation::class, 'location_id');
    }

    public function pja()
    {
        return $this->belongsTo(AreaManager::class, 'pja_id');
    }

    public function pjo()
    {
        return $this->belongsTo(User::class, 'pjo_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function activities()
    {
        return $this->hasMany(PicaActivity::class, 'pica_id');
    }

    public function picaFiles()
    {
        return $this->hasMany(PicaFile::class, 'pica_id');
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    public function getIsOverdueAttribute(): bool
    {
        if (! $this->target_settlement_date) {
            return false;
        }
        if (in_array($this->status, ['Closed', 'Draft'])) {
            return false;
        }
        return Carbon::parse($this->target_settlement_date)->isPast();
    }

    public function getAuditorNameAttribute(): ?string
    {
        if ($this->auditor) {
            return $this->auditor;
        }
        return $this->pjo?->name
            ?? $this->pja?->user?->name
            ?? null;
    }
}
