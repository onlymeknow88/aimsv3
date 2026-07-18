<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AimsMenu extends Model
{
    use HasFactory;

    protected $table = 'aims_menus';

    protected $fillable = ['module_id', 'parent_id', 'order_by', 'name', 'slug'];

    public function module()
    {
        return $this->belongsTo(AimsModule::class, 'module_id');
    }

    public function permissions()
    {
        return $this->hasMany(AimsPermission::class, 'menu_id');
    }

    public function parent()
    {
        return $this->belongsTo(AimsMenu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(AimsMenu::class, 'parent_id');
    }
}
