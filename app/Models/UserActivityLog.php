<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserActivityLog extends Model
{
    use HasUuids;

    protected $table = 'user_activity_logs';

    // Append-only table — no updated_at column
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'user_email',
        'user_name',
        'module',
        'action',
        'resource',
        'resource_id',
        'description',
        'old_data',
        'new_data',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_data'   => 'array',
        'new_data'   => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Relationship to the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
