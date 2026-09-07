<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KoCommissioningItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_commissioning_items';

    protected $fillable = ['ko_commissioning_id', 'ko_commissioning_field_id', 'condition', 'note'];

    public function koCommissioning()
    {
        return $this->belongsTo(KoCommissioning::class, 'ko_commissioning_id');
    }

    public function koCommissioningField()
    {
        return $this->belongsTo(KoCommissioningField::class, 'ko_commissioning_field_id');
    }
}
