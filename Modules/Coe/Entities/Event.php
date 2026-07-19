<?php

namespace Modules\Coe\Entities;

use App\Models\Section;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'coe_events';

    protected $guarded = [];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'invited_emails' => 'array',
        'notification_sent' => 'boolean',
        'repeat' => 'boolean',
        'must_send_email' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function related_event()
    {
        return $this->belongsTo(Event::class, 'related_event_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }
}
