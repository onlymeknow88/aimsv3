<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'microsoft_id',
        'microsoft_token',
        'avatar',
        'azure_tenant_id',
        'department_id',
        'google2fa_secret',
        'google2fa_enabled',
        'email_otp',
        'email_otp_expires_at',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google2fa_enabled' => 'boolean',
            'is_active' => 'boolean',
            'email_otp_expires_at' => 'datetime',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return in_array($this->role, ['super_admin', 'admin']) && $this->is_active;
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function documentRoles()
    {
        return $this->belongsToMany(
            AimsRole::class,
            'aims_user_roles',
            'user_id',
            'role_id'
        );
    }

    public function hasDocumentAccess(string $permissionSlug): bool
    {
        return \Cache::remember("user.{$this->id}.doc_perms", 3600, function() {
            return $this->documentRoles()
                ->with('permissions')
                ->get()
                ->pluck('permissions.*.slug')
                ->flatten()
                ->unique()
                ->toArray();
        })->contains($permissionSlug) || $this->role === 'super_admin';
    }

    public function employee()
    {
        return $this->hasOne(Employee::class, 'user_id');
    }
}
