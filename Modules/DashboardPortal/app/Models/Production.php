<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Production extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    protected $table = 'dashboard_production';

    protected $fillable = [
        'user_id',
        'visible',
        'month',
        'coal_shiping',
        'waste_removal',
        'coal_mining',
        'coal_hauling',
        'coal_barged',
    ];

    protected $hidden = ['user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
