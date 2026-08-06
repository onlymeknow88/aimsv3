<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminActivityLog extends Model
{
    use HasUuids;

    protected $table = 'admin_activity_logs';

    // Append-only table — no updated_at
    public const UPDATED_AT = null;

    protected $fillable = [
        'admin_id',
        'admin_email',
        'admin_name',
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
     * Relasi opsional ke user (admin yang melakukan aksi).
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
