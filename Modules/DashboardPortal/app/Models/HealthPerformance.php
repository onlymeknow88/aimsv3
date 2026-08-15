<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class HealthPerformance extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'dashboard_health_performance';

    protected $fillable = [
        'user_id', 'visible', 'month',
        'rkk', 'cmr', 'mmr', 'ssr', 'asr',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
