<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'company_id',
        'head_id',
        'code',
        'document_code',
        'name',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'department_id');
    }
}
