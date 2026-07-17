<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'department_id',
        'company_id',
        'number',
        'id_number',
        'name',
        'date_of_birth',
        'gender',
        'address',
        'blood_type',
        'marital_status',
        'employee_status',
        'position',
        'grade',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
