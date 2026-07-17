<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AimsModule extends Model
{
    use HasFactory;

    protected $table = 'aims_modules';

    protected $fillable = ['name', 'slug'];

    public function roles()
    {
        return $this->hasMany(AimsRole::class, 'module_id');
    }

    public function menus()
    {
        return $this->hasMany(AimsMenu::class, 'module_id');
    }
}
