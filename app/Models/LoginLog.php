<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginLog extends Model
{
    use HasUuids;

    // Disabling default updated_at column
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'user_email',
        'user_name',
        'event',
        'login_method',
        'ip_address',
        'user_agent',
        'browser',
        'os',
        'device_type',
        'session_id',
        'failure_reason',
    ];

    /**
     * Get the user that owns the login log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
