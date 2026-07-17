<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AimsRole extends Model
{
    use HasFactory;

    protected $table = 'aims_roles';

    protected $fillable = ['name', 'slug', 'is_system', 'module_id'];

    public function module()
    {
        return $this->belongsTo(AimsModule::class, 'module_id');
    }

    public function permissions()
    {
        return $this->hasMany(AimsPermission::class, 'role_id');
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'aims_user_roles',
            'role_id',
            'user_id'
        );
    }
}
