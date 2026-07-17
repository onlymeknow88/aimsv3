<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AimsPermission extends Model
{
    use HasFactory;

    protected $table = 'aims_permissions';

    protected $fillable = [
        'role_id',
        'menu_id',
        'can_view',
        'can_create',
        'can_edit',
        'can_delete',
        'can_approval',
    ];

    public function role()
    {
        return $this->belongsTo(AimsRole::class, 'role_id');
    }

    public function menu()
    {
        return $this->belongsTo(AimsMenu::class, 'menu_id');
    }
}
