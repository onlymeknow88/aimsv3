# Panduan UI Sidebar — AIMS Module

Dokumen ini berisi panduan lengkap untuk menerapkan desain sidebar yang konsisten pada semua modul AIMS (Document System, JSA, PTW, COE, dll).

Desain ini menggunakan tema **Navy Dark Blue** (#10233F) untuk sidebar dan latar abu-abu (`#F4F6F9`) untuk konten utama.

---

## 1. Struktur HTML Sidebar

File: `Modules/{NamaModule}/Resources/views/layouts/partials/sidebar.blade.php`

Struktur dasar yang harus diikuti:

```html
<div class="content-sidebar" style="background-color: #10233F; min-height: 100vh; color: #a9b9d0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; padding: 1rem 0.5rem 2rem 0.5rem !important;">
    <style>
        /* === PASTE SEMUA CSS DARI BAGIAN 2 DI BAWAH === */
    </style>

    <ul style="list-style: none; padding-left: 0;">

        {{-- Menu item tanpa submenu --}}
        <li class="item-sidebar">
            <a href="{{ route('nama-module::dashboard') }}"
               class="link-sidebar text-decoration-none {{ Request::routeIs('nama-module::dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-chart-pie" style="width: 20px; text-align: center;"></i>
                Nama Menu
            </a>
        </li>

        {{-- Menu item dengan submenu (dropdown) --}}
        <li class="item-sidebar">
            <a class="link-sidebar text-decoration-none dropdown {{ Request::routeIs('nama-module::sub.*') ? '' : 'collapsed' }}"
               data-bs-toggle="collapse" href="#sub-menu-id" role="button"
               aria-expanded="false" aria-controls="sub-menu-id">
                <i class="fa-solid fa-folder-open" style="width: 20px; text-align: center;"></i>
                Nama Menu Dropdown
            </a>
            <ul class="collapse sub-menu {{ Request::routeIs('nama-module::sub.*') ? 'show' : '' }}" id="sub-menu-id">
                <li class="item-sidebar">
                    <a href="{{ route('nama-module::sub.index') }}"
                       class="link-sidebar text-decoration-none d-flex justify-content-between align-items-center {{ Request::routeIs('nama-module::sub.index') ? 'active' : '' }}">
                        Nama Submenu
                    </a>
                </li>
            </ul>
        </li>

    </ul>
</div>
```

---

## 2. CSS Lengkap — Paste di dalam `<style>` di sidebar.blade.php

```css
/* === BACKGROUND === */
body,
.page-wrapper,
.main-content,
.content-wrapper,
.section-footer {
    background-color: #F4F6F9 !important;
}

/* === SIDEBAR OFFCANVAS === */
.sidebar.offcanvas,
.sidebar.offcanvas-start {
    background-color: #10233F !important;
    border-right: none !important;
    width: 250px !important;
}

/* === MAIN CONTENT — sesuaikan dengan lebar sidebar === */
.main-content.sidebar-open {
    padding-left: 250px !important;
    width: calc(100% - 250px) !important;
}

.main-content.sidebar-open .section-footer {
    width: calc(100% - 250px) !important;
    left: 250px !important;
}

/* === LINK MENU UTAMA === */
.content-sidebar .link-sidebar {
    color: #a3b1c6 !important;
    font-weight: 500;
    transition: all 0.2s ease-in-out !important;
    padding: 0.65rem 1rem !important;
    border-radius: 8px !important;
    margin: 0 0.5rem 0.35rem 0.5rem !important;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.88rem !important;
    text-decoration: none !important;
    position: relative;
    outline: none !important;
}

/* Hapus focus ring bawaan browser */
.content-sidebar .link-sidebar:focus {
    box-shadow: none !important;
    outline: none !important;
}

/* === HOVER STATE === */
.content-sidebar .link-sidebar:hover {
    background-color: #f1f5f9 !important;
    color: #153B73 !important;
}

/* === ACTIVE STATE === */
.content-sidebar .link-sidebar.active {
    background-color: #153B73 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    box-shadow: none !important;
}

/* === IKON DI MENU UTAMA === */
.content-sidebar .link-sidebar i {
    font-size: 1.1rem !important;
    width: 24px !important;
    text-align: center !important;
    color: #64748b !important;
    transition: color 0.2s ease-in-out !important;
}

/* Ikon saat hover → gelap (kontras di background terang) */
.content-sidebar .link-sidebar:hover i {
    color: #323130 !important;
}

/* Ikon saat active → putih */
.content-sidebar .link-sidebar.active i,
.content-sidebar .link-sidebar.active:hover i {
    color: #ffffff !important;
}

/* === CHEVRON DROPDOWN — Pindah ke kanan === */
.sidebar .content-sidebar ul li a.link-sidebar.dropdown::before {
    left: auto !important;
    right: 15px !important;
}

/* === SUBMENU === */
.content-sidebar .sub-menu {
    padding-left: 0;
    list-style: none;
    background-color: transparent;
    margin-top: 4px;
    padding-top: 4px;
    padding-bottom: 4px;
}

.content-sidebar .sub-menu .link-sidebar {
    padding: 0.5rem 1rem 0.5rem 3.5rem !important;
    font-size: 0.85rem !important;
    margin: 0 0.5rem 0.35rem 0.5rem !important;
    border-radius: 8px !important;
    position: relative;
}

/* Submenu active → biru solid */
.content-sidebar .sub-menu .link-sidebar.active {
    background-color: #153B73 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
}

/* Titik oranye di submenu active */
.content-sidebar .sub-menu .link-sidebar.active::before {
    content: '';
    position: absolute;
    left: 32px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #F58500;
}
```

---

## 3. Layout App — `layouts/app.blade.php`

File ini menggunakan Alpine.js (`$store.isSidebar.open`) untuk toggle sidebar. Pastikan strukturnya seperti berikut:

```html
<x-nama-module-base>

    @include('namamodule::layouts.partials.header')

    <div class="page-wrapper">
        <div class="content-wrapper d-flex">

            <div :class="$store.isSidebar.open ? 'show' : 'hidden'"
                 class="sidebar offcanvas offcanvas-start"
                 id="sidebar" data-bs-backdrop="false" data-bs-scroll="true">
                @include('namamodule::layouts.partials.sidebar')
            </div><!-- /.sidebar -->

            <div class="col main-content" :class="$store.isSidebar.open ? 'sidebar-open' : ''">
                {{ $slot }}
            </div><!-- /.main-content -->

        </div><!-- /.content-wrapper -->
    </div><!-- /.page-wrapper -->

</x-nama-module-base>
```

---

## 4. Color Tokens (Referensi Warna)

| Token               | Nilai       | Keterangan                          |
|---------------------|-------------|-------------------------------------|
| Sidebar Background  | `#10233F`   | Navy dark blue                      |
| Menu Text Default   | `#a3b1c6`   | Abu-abu muda (slate gray)           |
| Menu Icon Default   | `#64748b`   | Abu-abu medium                      |
| Hover Background    | `#f1f5f9`   | Abu-abu terang (light gray-blue)    |
| Hover Text          | `#153B73`   | Biru navy                           |
| Hover Icon          | `#323130`   | Abu-abu gelap                       |
| Active Background   | `#153B73`   | Biru navy solid                     |
| Active Text         | `#ffffff`   | Putih                               |
| Active Dot          | `#F58500`   | Oranye AIMS                         |
| Page Background     | `#F4F6F9`   | Abu-abu terang untuk konten         |
| Sidebar Width       | `250px`     | Lebar sidebar                       |

---

## 5. Checklist Penerapan ke Modul Baru

Saat menerapkan desain ini ke modul baru, pastikan semua item berikut sudah dilakukan:

- [ ] Tambahkan CSS lengkap (Bagian 2) ke dalam `<style>` di `sidebar.blade.php`
- [ ] Tambahkan `style="..."` inline di div `.content-sidebar` (Bagian 1)
- [ ] Pastikan `app.blade.php` menggunakan struktur dengan class `sidebar offcanvas offcanvas-start` (Bagian 3)
- [ ] Semua link menu menggunakan class `link-sidebar`
- [ ] Link menu aktif ditandai dengan class `active` menggunakan `Request::routeIs()`
- [ ] Semua link menu dropdown menggunakan class `dropdown` dan `data-bs-toggle="collapse"`
- [ ] Sub-menu menggunakan class `sub-menu` dan `collapse`
- [ ] Semua ikon menggunakan tag `<i>` dengan `style="width: 20px; text-align: center;"`
- [ ] Background `.section-footer` sudah disamakan dengan background halaman (`#F4F6F9`)

---

## 6. Contoh Penerapan — Modul COE

Untuk modul COE yang saat ini belum memiliki desain baru, berikut contoh `sidebar.blade.php` yang diperbarui:

```html
<div class="content-sidebar" style="background-color: #10233F; min-height: 100vh; color: #a9b9d0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important; padding: 1rem 0.5rem 2rem 0.5rem !important;">
    <style>
        /* ... paste CSS dari Bagian 2 di sini ... */
    </style>

    <ul style="list-style: none; padding-left: 0;">
        <li class="item-sidebar">
            <a href="{{ route('dashboard-public') }}" class="link-sidebar text-decoration-none">
                <i class="fa-solid fa-house" style="width: 20px; text-align: center;"></i>
                Home AIMS
            </a>
        </li>
        @if (auth()->user()->hasPermissionTo('COE - View Dashboard', 'coe'))
        <li class="item-sidebar">
            <a href="{{ route('coe::dashboard') }}"
               class="link-sidebar text-decoration-none {{ Request::routeIs('coe::dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-chart-pie" style="width: 20px; text-align: center;"></i>
                Dashboard
            </a>
        </li>
        @endif
        <li class="item-sidebar">
            <a href="{{ route('coe::callendar') }}"
               class="link-sidebar text-decoration-none {{ Request::routeIs('coe::callendar') ? 'active' : '' }}">
                <i class="fa-solid fa-calendar-days" style="width: 20px; text-align: center;"></i>
                Calendar
            </a>
        </li>
        @if (auth()->user()->hasPermissionTo('COE - View List', 'coe'))
        <li class="item-sidebar">
            <a href="{{ route('coe::list') }}"
               class="link-sidebar text-decoration-none {{ Request::routeIs('coe::list') ? 'active' : '' }}">
                <i class="fa-solid fa-list" style="width: 20px; text-align: center;"></i>
                Invited Event
            </a>
        </li>
        @endif
    </ul>
</div>
```

---

## 7. Panduan UI Halaman Detail (Detail Page Guidelines)

Halaman detail di semua modul AIMS wajib mengikuti pola layout **CSS Grid 3-Kolom** yang konsisten dengan pembagian lebar kolom: `320px` (Info Kiri), `1fr` (Konten Utama Tengah), dan `340px` (Aktivitas Kanan).

### A. Struktur Grid Layout Utama

Gunakan CSS Grid secara langsung pada pembungkus konten utama:
```html
<div class="inner-content" style="background-color: #F7F9FC;">

    {{-- Top Sticky Header Bar --}}
    <div class="header-detail-maker" style="height: 60px; background: #ffffff; border-bottom: 1px solid #E7ECF3; display: flex; align-items: center; gap: 12px; padding: 0 16px; position: sticky; top: 0; z-index: 100;">
        <a href="{{ $back_url }}" style="color: #153B73 !important; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-arrow-left"></i>
            <span>{{ $title }}</span>
        </a>
        
        {{-- Button Action (Berada rapat di sebelah kanan judul) --}}
        <a href="#" class="btn-edit" style="color: #ffffff !important; background-color: #153B73; font-size: 13px; padding: 6px 18px; border-radius: 8px; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fas fa-pencil"></i> Edit Document
        </a>
    </div>

    {{-- 3-Column Grid Wrapper --}}
    <div class="detail-grid-container" style="display: grid; grid-template-columns: 320px 1fr 340px; min-height: calc(100vh - 120px);">
        
        {{-- 1. Kolom Kiri (Sidebar Info) --}}
        <aside class="detail-left" style="background: #ffffff; border-right: 1px solid #E7ECF3; min-height: calc(100vh - 120px); padding: 0;">
            <!-- Info Items -->
        </aside>

        {{-- 2. Kolom Tengah (Main Content Area) --}}
        <main class="detail-center" style="background: #F7F9FC; padding: 32px 40px; min-width: 0;">
            <!-- Cards info, status, desc, attachment -->
        </main>

        {{-- 3. Kolom Kanan (Sidebar Activity) --}}
        <aside class="detail-right" style="background: #ffffff; border-left: 1px solid #E7ECF3; min-height: calc(100vh - 120px); padding: 24px;">
            <!-- Current Document info & Timeline activity -->
        </aside>

    </div>
</div>
```

### B. Aturan Desain & Elemen Visual Detail
1. **Warna Header & Body**: Latar belakang konten diatur ke abu-abu terang `#F7F9FC`. Ikon/tombol utama di header menggunakan Navy Blue `#153B73` dengan warna hover `#1E4E96`.
2. **Tanpa Garis Oranye di Judul Card**: Card di area tengah (`detail-center`) tidak boleh memiliki garis vertikal oranye (`border-left`) di samping judul card.
3. **Sidebar Min-Height**: Kolom kiri dan kanan wajib disematkan `min-height: calc(100vh - 120px)` dan berlatar belakang putih penuh (`#ffffff`) agar meregang sempurna hingga ke bagian paling bawah layar.

---

> **Catatan:** File CSS global `public/assets/css/styles.css` masih menggunakan nilai `300px` untuk `.sidebar.offcanvas.offcanvas-start`. Override `250px` dilakukan secara lokal di setiap `sidebar.blade.php` modul menggunakan `!important` agar tidak merusak modul lain yang belum diperbarui.
