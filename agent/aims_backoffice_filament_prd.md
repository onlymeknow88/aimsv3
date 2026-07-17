# 🖥️ PRD — AIMS Back-Office: Admin Panel dengan Filament v3

> **Document ID**: PRD-BACKOFFICE-001 Rev 1.0
> **Tanggal**: 15 Juli 2026
> **Status**: Draft
> **Project**: `aimsv3` (Laravel 11 + Filament v3)
> **Stack**: PHP 8.2 · Laravel 11 · Filament v3 · MySQL · Livewire v3

---

## 1. Executive Summary

Back-Office AIMS adalah panel administrasi terpusat untuk mengelola seluruh **master data**, **user management**, **role & permission**, **konfigurasi modul**, dan **monitoring sistem** dari platform AIMS. Panel ini dibangun di atas **Filament v3** yang berjalan di path `/admin` dan diakses hanya oleh pengguna dengan role tertentu (Super Admin atau Admin Back-Office).

---

## 2. Instalasi & Setup Filament v3

### A. Install Package

```bash
composer require filament/filament:"^3.0"
```

### B. Install Panel Admin

```bash
php artisan filament:install --panels
```

Perintah ini akan:
- Membuat file `app/Providers/Filament/AdminPanelProvider.php`
- Mendaftarkan panel di `config/app.php`
- Membuat direktori `app/Filament/`

### C. Konfigurasi Panel (`AdminPanelProvider.php`)

```php
<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Navigation\NavigationGroup;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Blue,
                'danger'  => Color::Red,
                'success' => Color::Green,
                'warning' => Color::Amber,
                'info'    => Color::Sky,
            ])
            ->brandName('AIMS Back-Office')
            ->favicon(asset('favicon.ico'))
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->widgets([
                \App\Filament\Widgets\StatsOverview::class,
                \App\Filament\Widgets\SystemHealthWidget::class,
            ])
            ->navigationGroups([
                NavigationGroup::make('Master Data')->icon('heroicon-o-building-office'),
                NavigationGroup::make('User & Access')->icon('heroicon-o-user-group'),
                NavigationGroup::make('Monitoring')->icon('heroicon-o-chart-bar')->collapsed(),
                NavigationGroup::make('Pengaturan')->icon('heroicon-o-cog-6-tooth')->collapsed(),
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
```

### D. Tambahkan `FilamentUser` Interface ke Model User

```php
// app/Models/User.php

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    public function canAccessPanel(Panel $panel): bool
    {
        // Hanya role back-office admin yang bisa akses panel Filament
        return in_array($this->role, ['super_admin', 'admin']);
    }
}
```

---

## 3. Struktur Direktori Back-Office

> Mengikuti susunan sidebar gambar: **Dashboard → Business Entities → Roles → Users & Employee** (top-level), kemudian grup **Master Data** berisi Companies, Departments, Sections.

```
app/Filament/
├── Pages/
│   ├── Dashboard.php                      # 🏠 Dashboard utama
│   └── Settings/
│       ├── GeneralSettings.php            # Konfigurasi umum sistem
│       └── ModuleSettings.php             # Toggle aktif/nonaktif modul AIMS
│
├── Resources/
│   │
│   │  ── [Top-Level Navigation] ──
│   │
│   ├── BusinessEntityResource/            # 🏢 Business Entities
│   │   ├── BusinessEntityResource.php
│   │   └── Pages/
│   │       ├── ListBusinessEntities.php
│   │       ├── CreateBusinessEntity.php
│   │       └── EditBusinessEntity.php
│   │
│   ├── RoleResource/                      # 🔑 Roles
│   │   ├── RoleResource.php
│   │   └── Pages/
│   │       ├── ListRoles.php
│   │       ├── CreateRole.php
│   │       └── EditRole.php
│   │
│   ├── UserResource/                      # 👥 Users & Employee
│   │   ├── UserResource.php
│   │   └── Pages/
│   │       ├── ListUsers.php
│   │       ├── CreateUser.php
│   │       └── EditUser.php
│   │
│   │  ── [Master Data Group] ──
│   │
│   ├── CompanyResource/                   # 🏛️ Companies
│   │   ├── CompanyResource.php
│   │   └── Pages/
│   │       ├── ListCompanies.php
│   │       ├── CreateCompany.php
│   │       └── EditCompany.php
│   │
│   ├── DepartmentResource/                # 🏬 Departments
│   │   ├── DepartmentResource.php
│   │   └── Pages/
│   │       ├── ListDepartments.php
│   │       ├── CreateDepartment.php
│   │       └── EditDepartment.php
│   │
│   ├── SectionResource/                   # 📂 Sections (sub-departemen)
│   │   ├── SectionResource.php
│   │   └── Pages/
│   │       ├── ListSections.php
│   │       ├── CreateSection.php
│   │       └── EditSection.php
│   │
│   ├── ModuleResource/                    # 📦 Module Management
│   │   ├── ModuleResource.php
│   │   └── Pages/
│   │       └── ListModules.php
│   │
│   └── AuditLogResource/                 # 📈 Audit Log (read-only)
│       ├── AuditLogResource.php
│       └── Pages/
│           └── ListAuditLogs.php
│
└── Widgets/
    ├── StatsOverview.php                  # Widget: Statistik ringkas
    └── SystemHealthWidget.php             # Widget: Status kesehatan sistem
```

---

## 4. Fitur & Resource Detail

### A. Dashboard

Widget yang tampil di halaman utama `/admin`:

| Widget | Deskripsi |
|:---|:---|
| **Total Users** | Jumlah user aktif di sistem |
| **Total Modul Aktif** | Modul AIMS yang sedang berjalan |
| **Total Dokumen Aktif** | Dokumen yang berstatus Active di DocumentSystem |
| **System Health** | Status database, cache, queue worker |

```php
// app/Filament/Widgets/StatsOverview.php

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::where('is_active', true)->count())
                ->description('User aktif di sistem')
                ->color('success')
                ->icon('heroicon-o-users'),

            Stat::make('Modul Aktif', Module::where('is_active', true)->count())
                ->description('Modul AIMS berjalan')
                ->color('info')
                ->icon('heroicon-o-cube'),

            Stat::make('Dokumen Aktif', Document::where('status', 5)->count())
                ->description('Dokumen berlaku hari ini')
                ->color('primary')
                ->icon('heroicon-o-document-text'),
        ];
    }
}
```

---

### B. User Management (`/admin/users`)

Resource CRUD user dengan fitur:

- **List**: Tabel dengan filter by role, status, department, company
- **Create**: Form input user baru
- **Edit**: Update data user, reset password, toggle status aktif
- **Bulk Action**: Deactivate selected, export ke Excel

**Kolom Tabel:**

| Kolom | Tipe | Deskripsi |
|:---|:---|:---|
| `name` | Text | Nama lengkap user |
| `email` | Text | Email (unik) |
| `department` | Relation | Departemen user |
| `company` | Relation | Perusahaan user |
| `role` | Badge | Role back-office |
| `is_active` | Toggle | Status aktif/nonaktif |
| `last_login_at` | DateTime | Waktu login terakhir |

```php
// app/Filament/Resources/UserResource.php — form schema

public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\Section::make('Informasi Dasar')
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()->required()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->dehydrateStateUsing(fn ($state) => bcrypt($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $context) => $context === 'create'),
            ])->columns(2),

        Forms\Components\Section::make('Organisasi')
            ->schema([
                Forms\Components\Select::make('company_id')
                    ->relationship('company', 'company_name')
                    ->searchable()->preload()->required(),
                Forms\Components\Select::make('department_id')
                    ->relationship('department', 'name')
                    ->searchable()->preload()->required(),
            ])->columns(2),

        Forms\Components\Section::make('Akses & Status')
            ->schema([
                Forms\Components\Select::make('role')
                    ->options([
                        'super_admin' => 'Super Admin',
                        'admin'       => 'Admin Back-Office',
                        'viewer'      => 'Viewer Only',
                    ])->required(),
                Forms\Components\Toggle::make('is_active')
                    ->label('User Aktif')->default(true),
            ])->columns(2),
    ]);
}
```

---

### C. Role Management (`/admin/roles`)

Manajemen role back-office dengan **Permission Matrix** checkbox bergaya gambar (MODULE × ACTION).

```php
// app/Filament/Resources/RoleResource.php — permission matrix section

Forms\Components\Section::make('Permission Matrix')
    ->schema([
        Forms\Components\Repeater::make('permissions')
            ->schema([
                Forms\Components\Select::make('module')
                    ->options([
                        'user'       => 'User Management',
                        'company'    => 'Company',
                        'department' => 'Department',
                        'module'     => 'Module Management',
                        'log'        => 'Audit Log',
                        'settings'   => 'Settings',
                    ])->required()->columnSpan(2),
                Forms\Components\CheckboxList::make('actions')
                    ->options([
                        'view'   => 'VIEW',
                        'create' => 'CREATE',
                        'edit'   => 'EDIT',
                        'delete' => 'DEL',
                        'export' => 'EXPORT',
                    ])->columns(5)->columnSpan(5),
            ])->columns(7),
    ])
```

**Default Matrix Back-Office:**

| Module | VIEW | CREATE | EDIT | DEL | EXPORT |
|:---|:---:|:---:|:---:|:---:|:---:|
| **User Management** | ☑ | ☑ | ☑ | ☑ | ☑ |
| **Company** | ☑ | ☑ | ☑ | ☐ | ☑ |
| **Department** | ☑ | ☑ | ☑ | ☐ | ☑ |
| **Module Management** | ☑ | ☐ | ☑ | ☐ | ☐ |
| **Audit Log** | ☑ | ☐ | ☐ | ☐ | ☑ |
| **Settings** | ☑ | ☐ | ☑ | ☐ | ☐ |

---

### D. Master Data & Users (Schema Database Riil `aimsv1`)

Berikut adalah detail skema field yang disesuaikan langsung dengan skema database riil `aimsv1` agar integrasi data berjalan sinkron:

#### 1. Business Entities (`business_entities`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `name` | varchar(191) | NO | Nama entitas bisnis |

#### 2. Company (`companies`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `company_name` | varchar(191) | NO | Nama perusahaan |
| `document_code` | varchar(191) | YES | Kode prefix dokumen (e.g. `PAMA`), Unique |
| `address` | varchar(191) | YES | Alamat |
| `email` | varchar(191) | YES | Email |
| `phone_number` | varchar(191) | YES | Nomor Telepon |
| `type` | varchar(191) | YES | Tipe Perusahaan |
| `parent_company_id` | char(36) | YES | Link ke parent company |
| `user_id` | char(36) | YES | Link ke user penanggung jawab |

#### 3. Department (`departments`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `company_id` | char(36) | YES (FK) | Relasi ke `companies.id` |
| `head_id` | char(36) | YES (FK) | Relasi ke `users.id` (Kepala Departemen) |
| `code` | varchar(191) | YES | Kode Departemen (e.g. `OHS`) |
| `document_code` | varchar(191) | YES | Kode prefix dokumen departemen, Unique |
| `name` | varchar(191) | NO | Nama departemen |

#### 4. Section (`sections`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `department_id` | char(36) | NO (FK) | Relasi ke `departments.id` |
| `name` | varchar(191) | NO | Nama section |

#### 5. Employee (`employees`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `user_id` | char(36) | YES (FK) | Relasi ke `users.id` |
| `department_id` | char(36) | YES (FK) | Relasi ke `departments.id` |
| `company_id` | char(36) | YES (FK) | Relasi ke `companies.id` |
| `number` | varchar(191) | YES | Nomor karyawan |
| `id_number` | varchar(191) | NO | Nomor ID unik (KTP/NIK) |
| `name` | varchar(191) | NO | Nama karyawan |
| `date_of_birth` | date | YES | Tanggal Lahir |
| `gender` | varchar(191) | YES | Jenis Kelamin |
| `address` | text | NO | Alamat lengkap |
| `blood_type` | varchar(191) | YES | Golongan Darah |
| `marital_status` | varchar(191) | YES | Status Pernikahan |
| `employee_status` | varchar(191) | YES | Status Kepegawaian |
| `position` | varchar(191) | YES | Jabatan / Posisi |
| `grade` | varchar(191) | YES | Grade karyawan |

#### 6. User & Employee Access (`users`)
| Kolom | Tipe | Null | Deskripsi |
|:---|:---|:---:|:---|
| `id` | char(36) | NO (PK) | UUID |
| `name` | varchar(191) | NO | Nama lengkap |
| `email` | varchar(191) | NO | Email (untuk login) |
| `password` | varchar(191) | NO | Hashed password |
| `department_id` | char(36) | YES (FK) | Relasi ke `departments.id` |
| `microsoft_id` | varchar(191) | YES | ID Azure AD/Microsoft |
| `avatar` | varchar(191) | YES | URL/Path Foto profil |
| `google2fa_enabled` | tinyint(1) | NO | Flag 2FA aktif |

---

### E. Module Management (`/admin/modules`)

Toggle aktif/nonaktif modul AIMS:

| Modul | Slug | Status Default |
|:---|:---|:---|
| Document System | `document-system` | ✅ Aktif |
| Safety (AIM-SAFE) | `safety` | ✅ Aktif |
| PICA | `pica` | 🔄 Beta |
| HR Module | `hr` | ❌ Nonaktif |

---

### F. Audit Log (`/admin/audit-logs`)

Log **read-only** semua aktivitas:

| Kolom | Deskripsi |
|:---|:---|
| `user` | User yang melakukan aksi |
| `action` | Jenis aksi (`created`, `updated`, `deleted`, `approved`) |
| `model` | Model yang terpengaruh (e.g. `Document`, `JSA`) |
| `record_id` | ID record |
| `old_values` | JSON nilai sebelum |
| `new_values` | JSON nilai sesudah |
| `ip_address` | IP user |
| `created_at` | Waktu aksi |

Filter: by user, by action, by model, by date range. Export ke CSV.

---

## 5. Navigasi Panel (Sesuai Gambar Sidebar)

```
🏠  Dashboard
🏢  Business Entities
🔑  Roles
👥  Users & Employee

──── MASTER DATA ────
🏛️  Companies
🏬  Departments          ← Active (highlighted orange)
📂  Sections

──── LAINNYA ────
📦  Module Management
📈  Audit Logs
⚙️  Settings
```

### Konfigurasi Navigation Groups di `AdminPanelProvider.php`

```php
->navigationGroups([
    // Top-level items (tanpa group) — tampil di atas sidebar
    // Dashboard, Business Entities, Roles, Users & Employee
    // dikontrol lewat $navigationGroup = null; di masing-masing resource

    NavigationGroup::make('Master Data')
        ->icon('heroicon-o-building-office-2')
        ->collapsed(false),  // selalu terbuka seperti gambar

    NavigationGroup::make('Monitoring')
        ->icon('heroicon-o-chart-bar')
        ->collapsed(true),

    NavigationGroup::make('Pengaturan')
        ->icon('heroicon-o-cog-6-tooth')
        ->collapsed(true),
])
```

### Pemetaan Resource → Navigation Group

| Resource | Group | `navigationSort` | Icon |
|:---|:---|:---:|:---|
| `Dashboard` | *(tidak ada grup)* | 1 | `heroicon-o-home` |
| `BusinessEntityResource` | *(tidak ada grup)* | 2 | `heroicon-o-building-storefront` |
| `RoleResource` | *(tidak ada grup)* | 3 | `heroicon-o-shield-check` |
| `UserResource` | *(tidak ada grup)* | 4 | `heroicon-o-users` |
| `CompanyResource` | `Master Data` | 1 | `heroicon-o-building-library` |
| `DepartmentResource` | `Master Data` | 2 | `heroicon-o-building-office` |
| `SectionResource` | `Master Data` | 3 | `heroicon-o-rectangle-stack` |
| `ModuleResource` | `Monitoring` | 1 | `heroicon-o-cube` |
| `AuditLogResource` | `Monitoring` | 2 | `heroicon-o-clipboard-document-list` |

```php
// Contoh: DepartmentResource.php — masuk grup Master Data
protected static ?string $navigationGroup = 'Master Data';
protected static ?int $navigationSort = 2;
protected static ?string $navigationIcon = 'heroicon-o-building-office';
protected static ?string $navigationLabel = 'Departments';

// Contoh: BusinessEntityResource.php — top-level (tanpa grup)
protected static ?string $navigationGroup = null;
protected static ?int $navigationSort = 2;
protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
protected static ?string $navigationLabel = 'Business Entities';
```

---

## 6. Perintah Instalasi Lengkap

```bash
# 1. Install Filament v3
composer require filament/filament:"^3.0"

# 2. Install panel admin
php artisan filament:install --panels

# 3. Buat resource (sesuai sidebar gambar)
php artisan make:filament-resource BusinessEntity --generate
php artisan make:filament-resource Role --generate
php artisan make:filament-resource User --generate
php artisan make:filament-resource Company --generate
php artisan make:filament-resource Department --generate
php artisan make:filament-resource Section --generate
php artisan make:filament-resource Module --generate
php artisan make:filament-resource AuditLog --generate --readonly

# 4. Buat widget dashboard
php artisan make:filament-widget StatsOverview --stats-overview
php artisan make:filament-widget SystemHealthWidget

# 5. Buat halaman settings
php artisan make:filament-page Settings/GeneralSettings
php artisan make:filament-page Settings/ModuleSettings

# 6. Publish assets Filament
php artisan filament:assets

# 7. Migrasi dan seed admin default
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```

---

## 7. Seeder Admin Default

```php
// database/seeders/AdminUserSeeder.php

public function run(): void
{
    User::create([
        'name'      => 'Super Administrator',
        'email'     => 'superadmin@aims.id',
        'password'  => bcrypt('Admin@123!'),
        'role'      => 'super_admin',
        'is_active' => true,
    ]);
}
```

---

## 8. Proteksi Akses Panel

```php
// app/Policies/UserPolicy.php

public function viewAny(User $user): bool
{
    return $user->hasBackOfficePermission('user.view');
}

public function create(User $user): bool
{
    return $user->hasBackOfficePermission('user.create');
}

public function delete(User $user, User $model): bool
{
    return $user->hasBackOfficePermission('user.delete')
        && $user->id !== $model->id; // tidak bisa hapus diri sendiri
}
```

---

## 9. ✅ Checklist Implementasi

- [ ] Install `filament/filament:^3.0` via Composer
- [ ] Setup `AdminPanelProvider` (path, colors, brandName, navigationGroups)
- [ ] Implement `FilamentUser` interface di `User` model
- [ ] Buat migration `add_role_is_active_to_users_table`
- [ ] Buat `UserResource` (form + table + filters + bulk actions)
- [ ] Buat `RoleResource` dengan permission checkbox matrix
- [ ] Buat `CompanyResource` dan `DepartmentResource`
- [ ] Buat `ModuleResource` (toggle aktif/nonaktif)
- [ ] Buat `AuditLogResource` (read-only + export CSV)
- [ ] Buat widget `StatsOverview` dan `SystemHealthWidget`
- [ ] Buat halaman `GeneralSettings` dan `ModuleSettings`
- [ ] Setup navigation groups & icons
- [ ] Buat `AdminUserSeeder`
- [ ] Setup Laravel Policies untuk setiap Resource
- [ ] Test akses panel di `/admin`
- [ ] Test login dengan akun Super Admin
