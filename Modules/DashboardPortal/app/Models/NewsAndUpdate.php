<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class NewsAndUpdate extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'dashboard_news_and_update';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'visible',
        'title',
        'slug',
        'description',
        'attc',
        'url',
        'blob_url',
        'blob_response',
    ];

    protected $casts = [
        'blob_response' => 'array',
    ];

    /**
     * Get the user who created/updated this record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}