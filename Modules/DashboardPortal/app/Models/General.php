<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class General extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'dashboard_general';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'project_to_date',
        'project_to_date_mark',
        'manhours',
        'manhours_mark',
        'day_after_last_lti',
        'day_after_last_lti_mark',
        'manpower',
        'manpower_mark',
    ];

    protected $casts = [
        'project_to_date'    => 'integer',
        'manhours'           => 'integer',
        'day_after_last_lti' => 'integer',
        'manpower'           => 'integer',
    ];

    /**
     * Get the user who last updated this record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}