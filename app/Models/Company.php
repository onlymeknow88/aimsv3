<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'company_name',
        'document_code',
        'address',
        'email',
        'phone_number',
        'type',
        'parent_company_id',
        'user_id',
    ];

    public function parentCompany()
    {
        return $this->belongsTo(Company::class, 'parent_company_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function departments()
    {
        return $this->hasMany(Department::class, 'company_id');
    }
}
