<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class IncidentNotification extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'dashboard_incident_notification';

    protected $fillable = [
        'user_id',
        'slug',
        'date',
        'case',
        'category',
        'description',
        'visible',
        'attc',
        'url',
        'blob_url',
        'blob_response',
    ];

    protected $hidden = ['user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
