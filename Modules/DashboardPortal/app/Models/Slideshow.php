<?php

namespace Modules\DashboardPortal\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Slideshow extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

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
