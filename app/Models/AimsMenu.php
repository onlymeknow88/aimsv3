<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AimsMenu extends Model
{
    use HasFactory;

    protected $table = 'aims_menus';

    protected $fillable = ['module_id', 'name', 'slug'];

    public function module()
    {
        return $this->belongsTo(AimsModule::class, 'module_id');
    }

    public function permissions()
    {
        return $this->hasMany(AimsPermission::class, 'menu_id');
    }
}
