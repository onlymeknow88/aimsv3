# AIMS v3 — Asset Integrity Management System

Sistem manajemen integritas aset berbasis web yang dibangun dengan Laravel 11, Inertia.js, dan React. Aplikasi ini menggunakan arsitektur modular (Laravel Modules) untuk memisahkan domain bisnis secara terstruktur.

---

## Tech Stack

**Backend**
- PHP 8.2+
- Laravel 11
- Laravel Sanctum (API Auth)
- Laravel Modules (nwidart/laravel-modules v13)
- Inertia.js v2
- DomPDF (generate PDF)
- Maatwebsite Excel (export/import Excel)
- Google 2FA (two-factor authentication)
- Ziggy (route binding ke frontend)

**Frontend**
- React 19
- Tailwind CSS v3
- Vite 5
- shadcn/ui + Radix UI
- TanStack Table v8
- FullCalendar v6
- Chart.js / react-chartjs-2
- Lucide React (icons)

---

## Modul

| Modul | Alias | Deskripsi |
|---|---|---|
| **CSMS** | `csms` | Contract & Service Management System — manajemen kontrak, PJO, bidding, PICA, checklist, renewal |
| **Pica** | `pica` | Problem Identification & Corrective Action |
| **DashboardPortal** | `dashboardportal` | Portal dashboard utama |
| **DocumentSystem** | `documentsystem` | Sistem manajemen dokumen |
| **FieldLeadership** | `fieldleadership` | Manajemen kepemimpinan lapangan |
| **Coe** | `coe` | Center of Excellence |

---

## Persyaratan

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL / PostgreSQL
- Git

---

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/onlymeknow88/aimsv3.git
cd aimsv3
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Konfigurasi environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` sesuaikan koneksi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aimsv3
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrasi dan seeder

```bash
php artisan migrate --seed
```

### 5. Build frontend

```bash
# Development
npm run dev

# Production
npm run build
```

### 6. Jalankan server

```bash
php artisan serve
```

Akses aplikasi di `http://localhost:8000`

---

## Struktur Modul

Setiap modul mengikuti struktur berikut:

```
Modules/{NamaModul}/
├── app/
│   └── Providers/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── Entities/          # Eloquent models
├── Http/
│   ├── Controllers/
│   └── Requests/
├── resources/
│   ├── js/
│   │   ├── Pages/     # React/Inertia pages
│   │   └── Components/
│   └── views/         # Blade views (PDF, email)
├── routes/
│   ├── web.php
│   └── api.php
└── module.json
```

---

## Artisan Commands

```bash
# Jalankan semua seeder modul
php artisan module:seed CSMS

# List semua modul
php artisan module:list

# Enable/disable modul
php artisan module:enable {module}
php artisan module:disable {module}
```

---

## Fitur Utama CSMS

- Manajemen kontrak dan vendor
- Proses bidding (active/inactive)
- Manajemen PJO (Penanggung Jawab Operasional)
- PICA (Problem Identification & Corrective Action) dalam kontrak
- Checklist inspeksi
- Proses renewal kontrak
- Generate sertifikat & kuesioner PDF
- Two-Factor Authentication (Google 2FA)

---

## Lisensi

Proprietary — PT Alamtri Resources Indonesia
