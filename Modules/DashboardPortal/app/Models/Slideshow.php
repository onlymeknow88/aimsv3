<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Slideshow extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'dashboard_slideshow';

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'visible',
        'description',
        'attc',
        'url',
        'blob_url',
        'blob_response',
    ];

    protected $casts = [
        'blob_response' => 'array',
    ];
}
