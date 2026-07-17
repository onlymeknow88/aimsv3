# 📂 AIMS: Document System Module PRD & Workflow Specification

Dokumen Persyaratan Produk (PRD) ini menjabarkan arsitektur, alur kerja, siklus hidup dokumen, sub-modul Job Safety Analysis (JSA), Permit to Work (PTW), serta konfigurasi Master Data pada modul **DocumentSystem** di platform AIMS.

---

## 📌 1. Gambaran Umum Modul

Modul **DocumentSystem** berfungsi sebagai repositori dokumen legal dan operasional perusahaan. Modul ini memastikan:
*   Penerapan nomor dokumen terstandarisasi.
*   Pemeriksaan alur peninjauan (*review workflow*) sebelum dokumen diterbitkan sebagai dokumen aktif.
*   Kontrol versi yang ketat (*revision tracking*) untuk menghindari penggunaan dokumen kedaluwarsa.
*   Pengelompokan dokumen keselamatan khusus kerja (JSA & PTW).

---

## 📂 2. Struktur Direktori Modul

Seluruh komponen logika dan visual untuk modul Document System berada di bawah direktori `Modules/DocumentSystem/`.

```bash
Modules/DocumentSystem/
├── Config/
│   └── config.php                    # Konfigurasi internal modul Document System
├── Database/
│   ├── Migrations/                   # Struktur database dokumen, JSA, PTW, kategori, dll.
│   └── Seeders/
│       ├── DocumentSystemDatabaseSeeder.php  # Pemanggil seeder utama
│       └── PermissionSeeder.php              # Seeder permission guard 'document-system'
├── Entities/                         # Model Eloquent untuk data operasional Document System
│   ├── Document.php                  # Model utama dokumen standar (SOP, TS, MN, WIN, FORM)
│   ├── Attachment.php                # File lampiran dokumen standar
│   ├── Activity.php                  # Log histori/aktivitas dokumen
│   ├── ActivityAttachment.php        # Lampiran berkas aktivitas log
│   ├── InvitedPeople.php             # Daftar reviewer/approver yang diundang dalam alur dokumen
│   ├── Category.php                  # Kategori pengelompokan dokumen
│   ├── JsaDocument.php               # Dokumen Job Safety Analysis (JSA)
│   ├── JsaDocumentActivity.php       # Log histori aktivitas JSA
│   ├── JsaDocumentAttachment.php     # Lampiran berkas dokumen JSA
│   ├── JsaDocumentPeople.php         # Tim penyusun / peninjau dokumen JSA
│   ├── PtwDocument.php               # Dokumen Permit to Work (PTW)
│   ├── PtwDocumentActivity.php       # Log histori aktivitas PTW
│   ├── PtwDocumentAttachment.php     # Lampiran berkas dokumen PTW
│   ├── PtwDocumentPeople.php         # Penanggung jawab / reviewer PTW
│   ├── Mapping.php                   # Mapping dokumen referensi
│   ├── Module.php                    # Klasifikasi modul utama
│   └── ModuleCategory.php            # Klasifikasi kategori modul
├── Http/
│   ├── Controllers/
│   │   ├── DocumentController.php    # CRUD dokumen standar (SOP, TS, MN, WIN, FORM)
│   │   ├── JsaController.php         # CRUD & workflow Job Safety Analysis
│   │   ├── PtwController.php         # CRUD & workflow Permit to Work
│   │   ├── MasterController.php      # Manajemen master data (modul, kategori, mapping)
│   │   ├── ApprovalController.php    # Endpoint approve/reject dokumen (Level 1 & 2)
│   │   ├── DashboardController.php   # Statistik & summary untuk halaman dashboard
│   │   └── GeneralController.php     # Preview attachment, SAS URI, unduh file
│   └── Requests/                     # Form Request Validation
│       ├── StoreDocumentRequest.php
│       ├── StoreJsaRequest.php
│       └── StorePtwRequest.php
├── Providers/
│   └── DocumentSystemServiceProvider.php  # Registrasi Service & bindings
├── Resources/
│   └── views/
│       └── app.blade.php             # Root Blade template (entry point @inertia)
├── Routes/
│   └── web.php                       # Peta routing URL modul Document System
└── Services/
    └── DocumentSystemService.php     # Business logic (upload, approval, numbering)

# ─── Frontend (React + Inertia.js) ───────────────────────────────────────────
resources/js/Pages/DocumentSystem/
├── Index.jsx                         # Dashboard / landing halaman Document System
│
├── ActiveDocument/                   # Penjelajah & unduh dokumen aktif
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useActiveDocument.jsx
│   └── Partials/
│       ├── DocumentTable.jsx
│       ├── DocumentPreviewModal.jsx
│       └── Components/
│           ├── DocumentBadge.jsx
│           └── DownloadButton.jsx
│
├── Maker/                            # Halaman pembuat dokumen (Draft + Active + Expired)
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useMaker.jsx
│   └── Partials/
│       ├── AddDocumentModal.jsx      # Form buat dokumen baru
│       ├── EditDocumentModal.jsx     # Form edit metadata dokumen
│       ├── DocumentDetailDrawer.jsx  # Drawer detail + histori aktivitas
│       └── Components/
│           ├── InvitedPeopleInput.jsx
│           ├── FileDropzone.jsx
│           └── DocumentNumberPreview.jsx
│
├── OnGoing/                          # Dokumen dalam proses review/approval
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useOnGoing.jsx
│   └── Partials/
│       ├── OnGoingTable.jsx
│       ├── ReviewDetailDrawer.jsx
│       └── Components/
│           ├── StatusTimeline.jsx
│           └── RevisionBanner.jsx
│
├── Draft/                            # Dokumen draft belum disubmit ke workflow
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useDraft.jsx
│   └── Partials/
│       └── DraftTable.jsx
│
├── Obsolete/                         # Arsip dokumen tidak berlaku
│   ├── Index.jsx
│   └── Partials/
│       └── ObsoleteTable.jsx
│
├── Approval/                         # Halaman approve/reject (CRS & PJA)
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useApproval.jsx
│   └── Partials/
│       ├── ApprovalDetailDrawer.jsx
│       ├── ApproveModal.jsx
│       └── RejectModal.jsx
│
├── Jsa/                              # Sub-modul Job Safety Analysis
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── useJsa.jsx
│   └── Partials/
│       ├── JsaFormModal.jsx
│       ├── JsaDetailDrawer.jsx
│       ├── JsaStepTable.jsx          # Tabel matriks langkah kerja & bahaya
│       └── Components/
│           ├── HazardRow.jsx
│           └── PpeSelector.jsx
│
├── Ptw/                              # Sub-modul Permit to Work
│   ├── Index.jsx
│   ├── Hooks/
│   │   └── usePtw.jsx
│   └── Partials/
│       ├── PtwFormModal.jsx
│       ├── PtwDetailDrawer.jsx
│       └── Components/
│           └── PermitTypeBadge.jsx
│
└── Master/                           # Manajemen master data (admin only)
    ├── Index.jsx
    ├── Hooks/
    │   └── useMaster.jsx
    └── Partials/
        ├── ModuleTable.jsx
        ├── CategoryTable.jsx
        ├── MappingTable.jsx
        └── DocumentSystemConfig.jsx
```

---

## 🔄 3. Siklus Hidup & Status Dokumen Standar

Setiap dokumen standar (SOP, Technical Standard, Manual, Work Instruction, Form) memiliki siklus hidup transisi status yang ketat:

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Buat Baru / Upload Awal
    DRAFT --> PREPARING : Siapkan untuk Review
    PREPARING --> WAITING_REVIEW : Kirim ke Peninjau
    WAITING_REVIEW --> ROOTING_APPROVAL : Disetujui Peninjau
    WAITING_REVIEW --> REVISION : Ditolak / Perlu Revisi
    REVISION --> PREPARING : Perbaiki & Kirim Ulang
    ROOTING_APPROVAL --> ACTIVE : Disetujui Pembuat / Penyetuju Akhir
    ACTIVE --> EXPIRED : Umur Dokumen > 2 Tahun
    ACTIVE --> OBSOLATE : Dibuat Versi Baru / Direvisi
    EXPIRED --> OBSOLATE : Dinonaktifkan Permanen
    OBSOLATE --> [*]
```

### Matriks Status Dokumen Standar
| Kode Status | Nama Status (Sistem) | Deskripsi |
| :---: | :--- | :--- |
| **`1`** | **WAITING_REVIEW** | Dokumen telah diajukan dan sedang menunggu pemeriksaan oleh peninjau (reviewers). |
| **`2`** | **DRAFT** | Dokumen baru dibuat, file belum diunggah secara final, atau masih dalam tahap edit pembuat. |
| **`3`** | **ROOTING_REVIEW** | Dokumen disetujui peninjau dan sedang menunggu tanda tangan / persetujuan akhir dari para pimpinan. |
| **`4`** | **ON_REVISION** | Dokumen ditolak oleh reviewer/approver dan dikembalikan ke pembuat untuk diperbaiki. |
| **`5`** | **ACTIVE** | Dokumen resmi aktif dan dapat diunduh/dijadikan acuan operasional di lapangan. |
| **`6`** | **PREPARE_ROOTING_REVIEW** | Dokumen sedang dipersiapkan dan diatur daftar orang yang harus menyetujui (workflow configuration). |
| **`7`** | **EXPIRED** | Dokumen telah melewati batas masa berlaku (default: 2 tahun setelah tanggal pembuatan). |
| **`8`** | **OBSOLATE** | Dokumen lama yang sudah tidak berlaku lagi karena digantikan oleh revisi baru (Revision +1). |

### Tipe Dokumen (Document Level)
1.  **`1` - SOP**: Standard Operating Procedure.
2.  **`2` - TS**: Technical Standard.
3.  **`3` - MN**: Manual.
4.  **`4` - WIN**: Working Instruction.
5.  **`5` - FORM**: Form Standard.

---

## 🖥️ 4. Pengelompokan Tampilan Halaman (Standard Documents)

Rute web diatur di `Modules/DocumentSystem/Routes/web.php` dan dibagi berdasarkan kategori halaman:

### A. Active & Expired Document (Maker Page)
*   **Rute**: `document-systems.maker` ➔ `Modules\DocumentSystem\Http\Livewire\Maker\Maker`
*   **Fungsi**: Menampilkan seluruh dokumen yang memiliki status **Active (`5`)** dan **Expired (`7`)**. Halaman ini memfasilitasi pembuatan revisi baru (`documentReplicate()` yang meningkatkan nomor versi `revision + 1` dan mengubah status salinan baru menjadi `Draft`).

### B. Document on Review (Ongoing Page)
*   **Rute**: `document-systems.ongoing` ➔ `Modules\DocumentSystem\Http\Livewire\OnGoing\TableOnGoing`
*   **Fungsi**: Menampilkan dokumen yang sedang berjalan di dalam workflow persetujuan, mencakup status **Preparing (`6`)**, **Waiting Review (`1`)**, **Rooting Review (`3`)**, dan **Revision (`4`)**.

### C. Draft Document
*   **Rute**: `document-systems.draft` ➔ `Modules\DocumentSystem\Http\Livewire\Draft\Index`
*   **Fungsi**: Menampung dokumen berstatus **Draft (`2`)** yang baru diunggah oleh pembuat dan belum dikirimkan ke alur workflow.

### D. Obsolete Document
*   **Rute**: `document-systems.obsolate` ➔ `Modules\DocumentSystem\Http\Livewire\Obsolate\Index`
*   **Fungsi**: Menampilkan daftar arsip dokumen lama yang telah berstatus **Obsolete (`8`)** (tidak boleh diunduh untuk penggunaan operasional baru).

---

## 📋 5. Sub-Modul Job Safety Analysis (JSA)

JSA digunakan untuk menganalisis bahaya dari langkah-langkah pekerjaan tertentu sebelum pekerjaan dimulai.

*   **Model**: `Modules\DocumentSystem\Entities\JsaDocument`
*   **Masa Berlaku**: Default 1 tahun (`doc_created` + 1 tahun).
*   **Daftar Status JSA**:
    *   **`1` - ACTIVE**: JSA disetujui dan berlaku untuk pekerjaan di lapangan.
    *   **`2` - DRAFT**: JSA masih ditulis oleh pengawas/karyawan.
    *   **`3` - EXPIRED**: JSA melewati masa aktif 1 tahun.
    *   **`4` - OBSOLATE**: JSA lama yang sudah tidak berlaku/digantikan versi baru.

### Diagram Alur Kerja JSA:
```mermaid
flowchart TD
    A["Draft (Status 2)"] -->|"Submit JSA"| B["Active (Status 1)"]
    B -->|"Masa Aktif > 1 Tahun"| C["Expired (Status 3)"]
    B -->|"Perbarui (Renew JSA)"| D["Obsolete (Status 4)"]
    C -->|"Perbarui (Renew JSA)"| D
    D -->|"Clone ke Draft Baru (Revisi +1)"| A
```

### Pemetaan Rute JSA:
*   **Active JSA**: `/jsa/active` ➔ `Modules\DocumentSystem\Http\Livewire\Jsa\Active`
*   **Draft JSA**: `/jsa/draft` ➔ `Modules\DocumentSystem\Http\Livewire\Jsa\Draft`
*   **Create JSA**: `/jsa/create` ➔ `Modules\DocumentSystem\Http\Livewire\Jsa\CreateNewDocument`
*   **Obsolete JSA**: `/jsa/obsolate` ➔ `Modules\DocumentSystem\Http\Livewire\Jsa\Obsolate`

---

## 🔑 6. Sub-Modul Permit to Work (PTW)

PTW adalah dokumen izin kerja aman resmi yang diperlukan untuk pekerjaan berisiko tinggi (panas, ketinggian, ruang terbatas, listrik, dll.).

*   **Model**: `Modules\DocumentSystem\Entities\PtwDocument`
*   **Daftar Status PTW**:
    *   **`1` - ACTIVE**: Izin kerja sedang aktif dan berlaku di area kerja.
    *   **`2` - INACTIVE**: Izin kerja telah selesai masa berlakunya atau ditutup setelah pekerjaan rampung.

### Diagram Alur Kerja PTW:
```mermaid
flowchart TD
    A["Create Permit"] --> B["Active (Status 1)"]
    B -->|"Pekerjaan Selesai / Waktu Habis"| C["Inactive (Status 2)"]
```

### Pemetaan Rute PTW:
*   **Active PTW**: `/ptw/active` ➔ `Modules\DocumentSystem\Http\Livewire\Ptw\Active`
*   **Create PTW**: `/ptw/create` ➔ `Modules\DocumentSystem\Http\Livewire\Ptw\CreateNewDocument`
*   **Edit / Detail PTW**: `/ptw/edit/{id}` & `/ptw/detail/{id}/{type}`

---

## 🗃️ 7. Pengelolaan Master Data

Master data digunakan untuk mengonfigurasi taksonomi, hak akses modul, dan relasi pemetaan dokumen.

*   **Prefix URL**: `/master`

### Komponen Master Data:
1.  **Modules Management (`/master/modules`)**:
    *   *Livewire Component*: `Modules\DocumentSystem\Http\Livewire\Master\ModuleIndex`
    *   *Fungsi*: Mengatur daftar modul internal AIMS yang terdaftar dan terintegrasi dengan Document System.
2.  **Categories Management (`/master/categories`)**:
    *   *Livewire Component*: `Modules\DocumentSystem\Http\Livewire\Master\CategoriesIndex`
    *   *Fungsi*: Mengatur kategori dokumen (seperti SOP K3, Standar Lingkungan, Formulir Keuangan).
3.  **Mapping Management (`/master/mapping`)**:
    *   *Livewire Component*: `Modules\DocumentSystem\Http\Livewire\Master\MappingIndex`
    *   *Fungsi*: Memetakan kategori dokumen ke modul-modul spesifik agar dokumen tampil di modul yang tepat.
4.  **Document System Master (`/master/document-system`)**:
    *   *Livewire Component*: `Modules\DocumentSystem\Http\Livewire\Master\DocumentSystem`
    *   *Fungsi*: Konfigurasi umum kode prefix perusahaan, departemen, dan aturan penomoran dokumen otomatis.

---

## 🔐 8. Spesifikasi Roles & Akses Modul (Dynamic Permission Matrix)

Modul **DocumentSystem** menggunakan sistem kontrol akses berbasis peran (RBAC) dinamis yang didesain secara independen tanpa bergantung pada paket global Spatie. Hak akses per peran dikelola melalui visual **Permission Matrix** menggunakan interface checkbox (seperti gambar contoh).

---

### A. Struktur Database Pendukung Matrix Permission

Untuk mendukung dynamic checkbox grid pada panel admin Master Data, struktur tabel dirancang sebagai berikut:

```sql
-- 1. Daftar Peran (Roles) internal modul
document_system_roles
├── id          (uuid, PK)
├── name        (string)        -- e.g. "Maker", "Approval CRS", "Approval PJA"
├── slug        (string, UNIQUE)-- e.g. "maker", "approval_crs", "approval_pja"
└── is_system   (boolean)       -- True jika role bawaan sistem (tidak bisa dihapus)

-- 2. Daftar Aksi/Permissions modul
document_system_permissions
├── id          (uuid, PK)
├── module_name (string)        -- e.g. "Standard Documents", "JSA", "PTW", "Master Data"
├── name        (string)        -- e.g. "View", "Create", "Edit", "Delete", "Approve", "Export"
└── slug        (string, UNIQUE)-- e.g. "doc.view", "doc.create", "jsa.approve"

-- 3. Tabel Pivot Matrix (Role Has Permissions)
document_system_role_permissions
├── role_id       (uuid, FK -> document_system_roles.id)
├── permission_id (uuid, FK -> document_system_permissions.id)
└── PRIMARY KEY (role_id, permission_id)

-- 4. Mapping User ke Role modul
document_system_user_roles
├── user_id     (uuid, FK -> users.id)
├── role_id     (uuid, FK -> document_system_roles.id)
└── PRIMARY KEY (user_id, role_id)
```

---

### B. Mekanisme Pengecekan Hak Akses (Policy/Middleware)

Pengecekan hak akses di backend dilakukan menggunakan database check yang efisien atau caching mapping role-permissions:

```php
// Helper Method pada User Model / Helper class
public function hasDocumentAccess(string $permissionSlug): bool
{
    // Mengambil role aktif user untuk modul Document System
    return \Cache::remember("user.{$this->id}.doc_perms", 3600, function() {
        return $this->documentRoles()
            ->with('permissions')
            ->get()
            ->pluck('permissions.*.slug')
            ->flatten()
            ->unique()
            ->toArray();
    })->contains($permissionSlug);
}

// Penggunaan di Controller
public function store(StoreDocumentRequest $request)
{
    abort_unless(auth()->user()->hasDocumentAccess('doc.create'), 403);
    // ...
}
```

---

### C. Visual Checkbox Permission Matrix (Per Modul)

Konfigurasi hak akses diatur per modul. Kolom menampilkan aksi (`VIEW` | `CREATE` | `EDIT` | `DEL` | `EXPORT` | `APP` *(Approve)*), sedangkan baris menampilkan role bawaan sistem:

> `☑` = punya akses &nbsp;|&nbsp; `☐` = tidak punya akses

---

#### 📄 Standard Documents

| Role | VIEW | CREATE | EDIT | DEL | EXPORT | APP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Maker** | ☑ | ☑ | ☑ | ☐ | ☐ | ☐ |
| **Approval CRS** | ☑ | ☐ | ☐ | ☐ | ☑ | ☑ |
| **Approval PJA** | ☑ | ☐ | ☐ | ☐ | ☐ | ☑ |
| **Super Admin** | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ |

> **Catatan VIEW & APP**: 
> - `Maker` hanya melihat Draft & dokumen Active miliknya.
> - `CRS` melihat semua status (Active, OnGoing, Obsolete) dan berwenang Approve Level 1 (Review/Reject).
> - `PJA` melihat Active & OnGoing dan berwenang Approve Level 2 (Final Sign-off).

#### 📋 Job Safety Analysis (JSA)

| Role | VIEW | CREATE | EDIT | DEL | EXPORT | APP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Maker** | ☑ | ☑ | ☑ | ☐ | ☐ | ☐ |
| **Approval CRS** | ☑ | ☐ | ☐ | ☐ | ☑ | ☐ |
| **Approval PJA** | ☑ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Super Admin** | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ |

#### 🔑 Permit to Work (PTW)

| Role | VIEW | CREATE | EDIT | DEL | EXPORT | APP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Maker** | ☑ | ☑ | ☐ | ☐ | ☐ | ☐ |
| **Approval CRS** | ☑ | ☐ | ☐ | ☐ | ☑ | ☐ |
| **Approval PJA** | ☑ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Super Admin** | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ |

#### ⚙️ Master Data

| Role | VIEW | CREATE | EDIT | DEL | EXPORT | APP |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Maker** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Approval CRS** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Approval PJA** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Super Admin** | ☑ | ☑ | ☑ | ☑ | ☑ | ☑ |

> [!NOTE]
> State checkbox di atas adalah **nilai default bawaan sistem** (seeded saat install modul). Super Admin dapat mengubah konfigurasi ini kapan saja melalui halaman **Master Data → Role Management** tanpa deploy ulang.

---

### D. Struktur Slug Permission (Ringkas)

Dengan format matrix di atas, slug permission mengikuti pola `{module}.{action}` — hanya **20 slug total**:

```php
// Modules/DocumentSystem/Database/Seeders/DocumentPermissionSeederTableSeeder.php

$permissions = [
    // Standard Documents — 6 aksi
    ['module' => 'Standard Documents', 'action' => 'view',   'slug' => 'doc.view'],
    ['module' => 'Standard Documents', 'action' => 'create', 'slug' => 'doc.create'],
    ['module' => 'Standard Documents', 'action' => 'edit',   'slug' => 'doc.edit'],
    ['module' => 'Standard Documents', 'action' => 'delete', 'slug' => 'doc.delete'],
    ['module' => 'Standard Documents', 'action' => 'export', 'slug' => 'doc.export'],
    ['module' => 'Standard Documents', 'action' => 'approve','slug' => 'doc.approve'],

    // JSA — 6 aksi
    ['module' => 'JSA', 'action' => 'view',   'slug' => 'jsa.view'],
    ['module' => 'JSA', 'action' => 'create', 'slug' => 'jsa.create'],
    ['module' => 'JSA', 'action' => 'edit',   'slug' => 'jsa.edit'],
    ['module' => 'JSA', 'action' => 'delete', 'slug' => 'jsa.delete'],
    ['module' => 'JSA', 'action' => 'export', 'slug' => 'jsa.export'],
    ['module' => 'JSA', 'action' => 'approve','slug' => 'jsa.approve'],

    // PTW — 6 aksi
    ['module' => 'PTW', 'action' => 'view',   'slug' => 'ptw.view'],
    ['module' => 'PTW', 'action' => 'create', 'slug' => 'ptw.create'],
    ['module' => 'PTW', 'action' => 'edit',   'slug' => 'ptw.edit'],
    ['module' => 'PTW', 'action' => 'delete', 'slug' => 'ptw.delete'],
    ['module' => 'PTW', 'action' => 'export', 'slug' => 'ptw.export'],
    ['module' => 'PTW', 'action' => 'approve','slug' => 'ptw.approve'],

    // Master Data — 2 aksi
    ['module' => 'Master Data', 'action' => 'view',  'slug' => 'master.view'],
    ['module' => 'Master Data', 'action' => 'manage','slug' => 'master.manage'],
];

// Default matrix per role
$defaultMatrix = [
    'maker'        => ['doc.view','doc.create','doc.edit',
                       'jsa.view','jsa.create','jsa.edit',
                       'ptw.view','ptw.create'],

    'approval_crs' => ['doc.view','doc.export','doc.approve',
                       'jsa.view','jsa.export',
                       'ptw.view','ptw.export'],

    'approval_pja' => ['doc.view','doc.approve',
                       'jsa.view',
                       'ptw.view'],

    'super_admin'  => ['*'], // semua permission
];
```

> [!IMPORTANT]
> Logika **konteks VIEW** dikontrol di backend berdasarkan role, bukan di permission:
> - `maker` → VIEW hanya tampilkan halaman Draft + Active milik sendiri
> - `approval_crs` → VIEW tampilkan semua status (Active, OnGoing, Obsolete)
> - `approval_pja` → VIEW tampilkan Active + OnGoing saja

---










## 📝 9. Panduan Langkah-Langkah Operasional Form & Workflow

### A. Alur Pembuatan Dokumen Baru (SOP/TS/MN/WIN/FORM)
1.  **Akses Formulir**: User dengan peran **`Maker`** masuk ke halaman **Maker** dan mengklik tombol **Add Maker** (mengarahkan ke komponen `AddNewDocument`).
2.  **Input Informasi Dasar**:
    *   Pilih **Perusahaan** (Company) dan **Departemen** (Department) asal dokumen. Sistem akan membaca konfigurasi database untuk menghasilkan kode prefix penomoran dokumen secara otomatis (misalnya: `COMPANY-DEPT-`).
    *   Tentukan **PIC / Penanggung Jawab** dari daftar karyawan departemen terkait.
    *   Pilih **Modul** dan **Kategori** pemetaan dokumen di portal AIMS.
3.  **Tentukan Tipe Dokumen**:
    *   **SOP (Standard Operating Procedure)**: Masukkan nomor urut SOP. Format penomoran otomatis digabungkan dengan prefix departemen.
    *   **WIN (Work Instruction) / Form**: Tentukan SOP induk (*Parent Document*) terlebih dahulu dari daftar SOP yang aktif. Tulis nomor instruksi kerja / kode formulir baru.
    *   **TS (Technical Standard) / Manual**: Sistem otomatis memicu format penomoran global khusus (misal: `TS-COMPANY-DEPT-` atau `COMPANY-Manual-`).
4.  **Isi Konten & Metadata**:
    *   Tulis **Judul Dokumen** dan **Deskripsi Singkat**.
    *   Masukkan **Tanggal Pembuatan** (Doc Created). Sistem otomatis menghitung batas kedaluwarsa dokumen selama 2 tahun ke depan.
5.  **Otorisasi Alur Review**:
    *   Unggah berkas dokumen (PDF, Word, Excel, JPG, dll.) pada kolom dropzone file pendukung.
    *   Ketik nama/email pada kolom **Invited People** untuk menunjuk para pemeriksa/reviewers yang akan melakukan verifikasi draf dokumen.
6.  **Tindakan Akhir Pembuat**:
    *   **Save Draft (Status 2)**: Dokumen disimpan secara lokal. File lampiran dapat diubah kapan saja. Dokumen hanya terlihat di halaman Draft pembuat.
    *   **Kirim Review (Status 1)**: Dokumen dikunci dan dikirimkan ke dalam antrean **Ongoing Review** agar diperiksa oleh tim CRS.

### B. Alur Peninjauan Dokumen oleh CRS (Approval Level 1)
1.  User dengan peran **`Approval CRS`** membuka halaman **Ongoing** untuk memantau dokumen berstatus **Waiting Review (`1`)**.
2.  CRS membuka detail dokumen, mengunduh file draf, dan memeriksa kepatuhan aspek K3LH serta standar regulasi perusahaan.
3.  **Tolak (Reject / Revision - Status 4)**: Jika dokumen tidak memenuhi syarat, CRS menekan tombol Reject dan menulis alasan revisi. Status dokumen berubah menjadi **Revision**. Pembuat dokumen mendapat notifikasi, memperbaiki dokumen, dan mengajukannya kembali.
4.  **Setuju (Approve - Status 3)**: Jika draf dinilai layak, CRS menekan tombol Approve. Status dokumen berubah menjadi **Rooting Approval** dan diteruskan ke antrean Area Manager (PJA).

### C. Alur Pengesahan Dokumen oleh PJA (Approval Level 2)
1.  User dengan peran **`Approval PJA`** membuka antrean **Ongoing** dan mencari dokumen berstatus **Rooting Approval (`3`)**.
2.  PJA meneliti berkas draf dan hasil persetujuan tim CRS di sidebar histori aktivitas.
3.  **Approve & Publish (Status 5 - Active)**: PJA menekan tombol Approve Final. Sistem secara resmi merubah status dokumen menjadi **Active**. Versi dokumen terkunci, nomor revisi didaftarkan, dan file PDF final dipublikasikan agar dapat diakses secara publik oleh seluruh karyawan.

### D. Alur Pembuatan Job Safety Analysis (JSA)
1.  User masuk ke menu **JSA** -> klik **Create JSA**.
2.  Input informasi dasar: Judul Pekerjaan, Lokasi Kerja Detail, Departemen Terkait, Supervisor Pelaksana, dan APD (Alat Pelindung Diri) yang wajib digunakan.
3.  Isi tabel matriks JSA:
    *   **Langkah Pekerjaan (Job Steps)**: Urutan pelaksanaan tugas.
    *   **Potensi Bahaya (Potential Hazard)**: Risiko kecelakaan di tiap langkah.
    *   **Tindakan Pengendalian (Recommended Action)**: Cara kerja aman / kontrol risiko.
    *   **Penanggung Jawab**: Karyawan yang mengawasi kepatuhan kontrol.
4.  Unggah dokumen pendukung dan simpan. JSA yang disetujui berstatus **Active** dengan masa berlaku 1 tahun.

### E. Alur Pembuatan Surat Izin Kerja Aman (PTW)
1.  User masuk ke menu **PTW** -> klik **Create PTW**.
2.  Pilih jenis pekerjaan berisiko tinggi (Panas, Ketinggian, Ruang Terbatas, Listrik, Penggalian, dsb.).
3.  Input informasi kontraktor pelaksana, area kerja spesifik, tanggal mulai, dan perkiraan jam selesai pekerjaan.
4.  Unggah dokumen lampiran (JSA pendukung, checklist kelayakan alat, sertifikat kompetensi pekerja).
5.  Kirim pengajuan ke pengawas area. Setelah disetujui, PTW berstatus **Active** dan wajib ditempel di lokasi kerja. Setelah pekerjaan selesai, PTW ditutup dan berstatus **Inactive**.

---

## 📋 10. Contoh Data Masukan (Dummy Input Examples)

Sebagai referensi pengisian data pengujian (testing) maupun seeding database, berikut adalah contoh data dummy yang valid dan logis untuk masing-masing tipe dokumen di Document System:

### A. Contoh Dummy Dokumen Standar (SOP)
*   **Formulir Utama**:
    *   **Company**: `PT. Pamapersada Nusantara`
    *   **Department**: `Occupational Health & Safety (OHS)`
    *   **Document Level**: `Level 2 - Standard Operating Procedure (SOP)`
    *   **Document Type**: `SOP`
    *   **Document Number / Running Code**: `002` (Kode otomatis terformat: `PAMA-OHS-SOP-002`)
    *   **PIC**: `Budi Santoso`
    *   **Module**: `Safety Operations`
    *   **Category**: `SOP K3`
    *   **Title**: `Prosedur Bekerja Aman di Ketinggian (Working at Heights Procedure)`
    *   **Description**: `Prosedur standar mengenai penggunaan safety harness, penentuan angkur penambat, verifikasi scaffolding, serta mitigasi risiko jatuh dari ketinggian di atas 1.8 meter.`
    *   **Created Date**: `2026-06-12` (Masa berlaku terhitung otomatis 2 tahun hingga `2028-06-12`)
*   **Workflow / People Invited**:
    *   **Reviewer (CRS)**: `crs.safety.reviewer@pamapersada.com`
    *   **Approver (PJA / Project Manager)**: `pja.project.manager@pamapersada.com`
*   **Lampiran Berkas**:
    *   `SOP-Working-At-Heights.pdf` (Berkas panduan teks utama)
    *   `Checklist-Scaffolding-Inspection.xlsx` (Dokumen pendukung kelayakan scaffolding)

### B. Contoh Dummy Job Safety Analysis (JSA)
*   **Informasi Umum JSA**:
    *   **Job Title / Nama Pekerjaan**: `Pengelasan Konstruksi Tangki Air (Hot Work)`
    *   **Detail Location / Lokasi Kerja**: `Workshop Plant Main Building, Sektor 4B`
    *   **Department**: `Plant Maintenance`
    *   **Supervisor / Pengawas Kerja**: `Aditya Pratama`
    *   **Required PPE / APD Wajib**: `Kacamata Las (Welding Shield Shade 10-11), Safety Shoes, Welding Leather Apron, Leather Gloves, Double Lanyard Safety Harness, APAR Powder 6kg.`
*   **Matriks Langkah Analisis Keselamatan Kerja**:
    | No | Langkah Pekerjaan (Job Steps) | Potensi Bahaya (Potential Hazard) | Tindakan Pengendalian (Recommended Action) | Penanggung Jawab |
    | :--- | :--- | :--- | :--- | :--- |
    | 1 | Persiapan area & pembersihan bahan mudah terbakar | Kebakaran akibat percikan las menyentuh material mudah terbakar | Singkirkan material mudah terbakar dalam radius 10 meter, siapkan APAR di dekat welder | Aditya Pratama |
    | 2 | Pemasangan kabel las & grounding mesin las | Sengatan listrik (*electric shock*) karena isolasi kabel terkelupas | Periksa fisik kabel las sebelum dicolokkan, pastikan grounding dipasang pada material yang stabil | Teknisi Listrik |
    | 3 | Proses pengelasan plat besi tangki | Radiasi sinar las pada mata, terhirup asap beracun (*welding fumes*) | Gunakan tameng las gelap, gunakan blower hisap (*exhaust fan*) di area terbatas | Welder Utama |
*   **Lampiran Berkas**:
    *   `jsa-welding-water-tank-v1.pdf`

### C. Contoh Dummy Permit to Work (PTW)
*   **Formulir Izin Kerja**:
    *   **Permit Type / Jenis Pekerjaan**: `Hot Work Permit (Izin Kerja Panas)`
    *   **Contractor / Pelaksana**: `PT. Rekayasa Industri Utama`
    *   **Work Location / Detail Area**: `Fasilitas Fuel Station Utama, Sektor A-3`
    *   **Start Date & Time**: `2026-06-12 08:00`
    *   **End Date & Time**: `2026-06-12 17:00`
    *   **Parent JSA (Reference ID)**: `JSA-2026-OHS-004` (Hot Work JSA Pengelasan Tangki)
*   **Checklist Pengendalian Tambahan & Lampiran**:
    *   `JSA Terkait (Mandatory)`: `jsa_welding_solar_tank.pdf`
    *   `Sertifikat Welder / Pekerja Khusus`: `sertifikat_las_kelas1_antony.pdf`
    *   `Checklist Uji Gas Flammability (LEL 0%)`: `gas_test_solar_station_1206.pdf`
    *   `Izin Kerja di Area Sinar Matahari Langsung / Panas`: Ya (Checklist APAR & Fire Blanket aktif)

---

## 🗄️ 11. Arsitektur Database & Relasi (Database Schema & Relationships)

Bagian ini menjabarkan struktur tabel database, kolom, tipe data, serta hubungan antar-entitas (Entity Relationship) pada modul **DocumentSystem**.

### A. Diagram Hubungan Entitas (Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email
        uuid department_id FK
    }
    departments {
        uuid id PK
        string name
        string code
        uuid company_id FK
    }
    department_codes {
        uuid id PK
        uuid department_id FK
        string code
    }
    area_managers {
        uuid id PK
        uuid user_id FK
        uuid section_id FK
        boolean is_active
    }
    companies {
        uuid id PK
        uuid user_id FK
        string company_name
        string document_code
    }
    document_system_documents {
        uuid id PK
        uuid department_id FK
        uuid department_code_id FK
        uuid mapping_id FK
        uuid area_manager_id FK
        uuid user_id FK "Owner/PIC"
        uuid created_by FK
        uuid related_document_id FK "Self relation for revisions"
        string upload_type
        string document_level
        string status
        string revision
        string title
        longText description
        string sop_number
        string sop_add_win
        string sop_add_form
        string document_number
        string prefix_code
        string file_path
        string uncontrolled_file_path
        date doc_created
        boolean is_obsolate
    }
    document_system_modules {
        uuid id PK
        string index
        string name
        boolean has_document_number
    }
    document_system_categories {
        uuid id PK
        uuid module_id FK
        string index
        string name
    }
    document_system_mappings {
        uuid id PK
        uuid category_id FK
        string index
        string name
    }
    document_system_attachments {
        uuid id PK
        uuid document_id FK
        string file_path
    }
    document_system_invited_people {
        uuid id PK
        uuid document_id FK
        uuid user_id FK
        string email
        smallInteger status
        text note
    }
    document_system_activities {
        uuid id PK
        uuid document_id FK
        uuid user_id FK
        string activity
    }
    jsa_documents {
        uuid id PK
        uuid department_id FK
        uuid department_code_id FK
        uuid user_id FK
        smallInteger status
        string title
        longText description
        string document_number
        timestamp doc_created
        string detail_location
        uuid parent_document FK
        boolean is_obsolate
    }
    ptw_documents {
        uuid id PK
        uuid department_id FK
        uuid user_id FK
        smallInteger status
        string title
        longText description
        string document_number
        timestamp doc_created
        string detail_location
    }

    companies ||--o{ departments : "owns"
    departments ||--o{ department_codes : "has"
    departments ||--o{ users : "has members"
    users ||--o{ model_has_permissions : "has"
    
    users ||--o{ document_system_documents : "PIC"
    departments ||--o{ document_system_documents : "belongs to"
    department_codes ||--o{ document_system_documents : "references"
    area_managers ||--o{ document_system_documents : "assigned reviewer"
    
    document_system_modules ||--o{ document_system_categories : "defines"
    document_system_categories ||--o{ document_system_mappings : "defines"
    document_system_mappings ||--o{ document_system_documents : "classifies"
    
    document_system_documents ||--o{ document_system_attachments : "has"
    document_system_documents ||--o{ document_system_invited_people : "reviewed by"
    document_system_documents ||--o{ document_system_activities : "logs"
    document_system_documents |o--o| document_system_documents : "revises (self relation)"

    jsa_documents ||--o{ jsa_document_attachments : "has"
    jsa_documents ||--o{ jsa_document_people : "involves"
    jsa_documents ||--o{ jsa_document_activities : "logs"
    jsa_documents |o--o| jsa_documents : "revises (self relation)"

    ptw_documents ||--o{ ptw_document_attachments : "has"
    ptw_documents ||--o{ ptw_document_people : "involves"
    ptw_documents ||--o{ ptw_document_activities : "logs"
```

### B. Daftar & Spesifikasi Tabel Database

#### 1. Tabel `document_system_documents`
Menampung berkas dokumen standar (SOP, TS, MN, WIN, FORM) beserta riwayat revisi dan status alur persetujuan.
*   **Relasi**:
    *   `department_id` ➔ `departments.id` (Many-to-One)
    *   `department_code_id` ➔ `department_codes.id` (Many-to-One)
    *   `mapping_id` ➔ `document_system_mappings.id` (Many-to-One)
    *   `area_manager_id` ➔ `area_managers.id` (Many-to-One)
    *   `user_id` ➔ `users.id` (Many-to-One, Pemilik Dokumen / PIC)
    *   `created_by` ➔ `users.id` (Many-to-One, Pembuat draf awal)
    *   `related_document_id` ➔ `document_system_documents.id` (Many-to-One, Referensi dokumen induk sebelum direvisi)

#### 2. Tabel `jsa_documents`
Menampung data Job Safety Analysis (JSA) beserta detail lokasi dan masa berlaku JSA (1 tahun).
*   **Relasi**:
    *   `department_id` ➔ `departments.id` (Many-to-One)
    *   `user_id` ➔ `users.id` (Many-to-One, Pengawas/Pembuat)
    *   `parent_document` ➔ `jsa_documents.id` (Many-to-One, Referensi JSA lama yang di-renew)

#### 3. Tabel `ptw_documents`
Menampung data Permit to Work (PTW) untuk izin kerja berisiko tinggi.
*   **Relasi**:
    *   `department_id` ➔ `departments.id` (Many-to-One)
    *   `user_id` ➔ `users.id` (Many-to-One, Pemohon/Pekerja)

#### 4. Tabel Klasifikasi Master Data (`document_system_modules`, `document_system_categories`, `document_system_mappings`)
Tabel penunjang untuk klasifikasi taksonomi dokumen dalam portal AIMS.
*   `document_system_categories.module_id` ➔ `document_system_modules.id` (Many-to-One)
*   `document_system_mappings.category_id` ➔ `document_system_categories.id` (Many-to-One)

#### 5. Tabel Lampiran & Alur Persetujuan
*   `document_system_attachments` (Lampiran Dokumen): `document_id` ➔ `document_system_documents.id` (Many-to-One)
*   `document_system_invited_people` (Reviewer): `document_id` ➔ `document_system_documents.id` (Many-to-One), `user_id` ➔ `users.id` (Many-to-One)
*   `document_system_activities` (Log Aktivitas): `document_id` ➔ `document_system_documents.id` (Many-to-One), `user_id` ➔ `users.id` (Many-to-One)

---

## 📌 12. Log Pembaruan Arsitektur & Penyimpanan (Update Log)

### Integrasi Upload & Preview File Komentar Revisi dengan Azure Blob Storage (Juni 2026)
Melakukan migrasi penyimpanan berkas revisi/komentar pada alur *Return with Comment* dari penyimpanan lokal ke Azure Blob Storage, serta mengintegrasikan modal pratinjau (*preview*) dinamis menggunakan SAS URI.

#### 1. Perubahan Database & Model
*   **Migration**: `2026_06_15_100000_add_blob_columns_to_activity_attachments_table.php`
    - Menambahkan kolom `blob_url` (string, nullable) dan `blob_response` (text, nullable) ke tabel `document_system_activities_attachments`.
*   **Model**: `Modules/DocumentSystem/Entities/ActivityAttachment.php`
    - Menambahkan `blob_url` dan `blob_response` ke dalam properti `$fillable` agar mendukung mass-assignment.

#### 2. Perubahan Logika Layanan (Services)
*   **Module Service**: `Modules/DocumentSystem/Services/DocumentSystemService.php`
    - **Fungsi Diubah**: `return($data)`
    - Mengintegrasikan helper `uploadToBlobStorage($file, $path)` untuk menyimpan berkas komentar ke Blob Storage dan mengisi data `blob_url` serta `blob_response`. Berkas lokal sementara di direktori `tmp` dihapus secara otomatis.
*   **App Service**: `app/Services/DocumentSystemService.php`
    - **Fungsi Diubah**: `return($data)`
    - Melakukan sinkronisasi perubahan logika yang sama dengan Module Service.

#### 3. Perubahan Pratinjau & Kontroler (Preview & Controller Support)
*   **Controller**: `Modules/DocumentSystem/Http/Controllers/GeneralController.php`
    - **Fungsi Diubah**: `getAttachmentSasUri($id, Request $request)` dan `previewAttachment($id, Request $request)`
    - Menambahkan penanganan `type = 'activity'` untuk memproses model `ActivityAttachment` (mengambil `blob_url` untuk di-generate SAS URI-nya atau di-stream secara inline).
*   **Livewire Components**: `DetailMaker.php` (Maker), `Detail.php` (JSA), dan `Detail.php` (PTW)
    - **Fungsi Diubah**: `detailItem($id)`
    - Jika data lampiran aktivitas memiliki `blob_url`, URL pratinjau akan diarahkan ke route `attachments.preview` dengan parameter `type=activity` serta query parameter `filename` (untuk membawa nama & ekstensi berkas).
*   **Livewire Blade View**: `Modules/DocumentSystem/Resources/views/livewire/maker/detail-maker.blade.php`
    - **Script Diubah**: Event Listener `detail-media`
    - Memperbarui parser javascript agar dapat mendeteksi nama file dan ekstensinya melalui query parameter `filename` jika path URL akhir (`/preview`) tidak menyertakan ekstensi berkas secara langsung. Hal ini memperbaiki masalah pratinjau yang menampilkan pesan *"Preview Tidak Tersedia"*.

---

## 🔄 13. Perintah Reset Database Khusus Modul (Module Database Reset Command)

Berikut adalah panduan perintah untuk melakukan reset database secara spesifik hanya untuk modul **DocumentSystem** tanpa mempengaruhi tabel modul lain di platform AIMS.

### A. Perintah Utama

Jalankan perintah berikut pada terminal di root direktori project:

```bash
php artisan module:migrate-refresh DocumentSystem --seed
```

Atau jalankan langkah demi langkah secara terpisah:

1. **Rollback & Reset tabel milik modul:**
   ```bash
   php artisan module:migrate-reset DocumentSystem
   ```
2. **Migrasi ulang seluruh tabel milik modul:**
   ```bash
   php artisan module:migrate DocumentSystem
   ```
3. **Mengisi ulang data awal (seeding) untuk modul:**
   ```bash
   php artisan module:seed DocumentSystem
   ```

### B. Detail Proses & Tabel yang Terpengaruh

#### 1. Migrasi Ulang (Migrations)
Sistem akan memuat seluruh file migrasi di dalam `Modules/DocumentSystem/Database/Migrations/`. Seluruh tabel transaksi dan relasi di bawah ini akan di-drop dan dibuat ulang:
* **Tabel Dokumen Standar**: `document_system_documents`, `document_system_attachments`, `document_system_invited_people`, `document_system_activities`
* **Tabel JSA (Job Safety Analysis)**: `jsa_documents`, `jsa_document_attachments`, `jsa_document_people`, `jsa_document_activities`
* **Tabel PTW (Permit to Work)**: `ptw_documents`, `ptw_document_attachments`, `ptw_document_people`, `ptw_document_activities`
* **Tabel Master Data**: `document_system_modules`, `document_system_categories`, `document_system_mappings`

#### 2. Seeding Data Awal
Setelah migrasi sukses, parameter `--seed` memanggil seeder utama `DocumentSystemDatabaseSeeder` yang menjalankan seeder-seeder internal berikut secara berurutan:
* **`DocumentPermissionSeederTableSeeder`**: Pendaftaran permissions Spatie dengan guard `document-system`.
* **`DocumentSystemTruncateSeederTableSeeder`**: Memastikan tabel bersih menggunakan perintah truncate dengan mematikan foreign key checks sementara.
* **`DocumentModuleSeederTableSeeder`**: Pengisian master data modul bawaan (Perencanaan, Organisasi, Implementasi, Dokumentasi) beserta kategori dan pemetaannya.
* **`DocumentSystemDummySeederTableSeeder`**: Pengisian data dummy awal untuk dokumen standar, JSA, dan PTW demi kebutuhan testing.
* **`DocumentSystemStatusDummySeeder`**: Konfigurasi data status workflow dokumen.

---

## 🧩 14. Setup Modular: nwidart/laravel-modules + React + Inertia.js

Bagian ini menjabarkan panduan instalasi paket `nwidart/laravel-modules`, konfigurasi stack React + Inertia.js, serta standar struktur direktori frontend yang digunakan di seluruh modul AIMS.

---

### A. Instalasi `nwidart/laravel-modules`

Package ini memungkinkan pemisahan logika backend ke dalam modul-modul terpisah (DocumentSystem, Safety, PICA, dll.) di bawah direktori `Modules/`.

#### 1. Install via Composer

```bash
composer require nwidart/laravel-modules
```

#### 2. Publish Konfigurasi Modul

```bash
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"
```

File konfigurasi akan dipublikasikan ke `config/modules.php`. Sesuaikan path sesuai kebutuhan proyek.

#### 3. Auto-load Modul (PSR-4 via `composer.json`)

Tambahkan entri berikut di `composer.json` agar Laravel dapat menemukan namespace modul:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Modules\\": "Modules/"
        }
    }
}
```

Lalu jalankan:

```bash
composer dump-autoload
```

#### 4. Membuat Modul Baru

```bash
php artisan module:make NamaModul
```

Contoh untuk modul Safety (AIM-SAFE):

```bash
php artisan module:make Safety
php artisan module:make DocumentSystem
php artisan module:make Pica
```

---

### B. Instalasi Stack Frontend: React + Inertia.js

#### 1. Install Inertia.js (Server Side — Laravel Adapter)

```bash
composer require inertiajs/inertia-laravel
```

Publish middleware Inertia:

```bash
php artisan inertia:middleware
```

Daftarkan middleware di `app/Http/Kernel.php` pada grup `web`:

```php
'web' => [
    // ...
    \App\Http\Middleware\HandleInertiaRequests::class,
],
```

#### 2. Install Inertia.js (Client Side — React Adapter)

```bash
npm install @inertiajs/react
```

#### 3. Install React & Dependencies

```bash
npm install react react-dom
npm install --save-dev @vitejs/plugin-react
```

#### 4. Konfigurasi Vite (`vite.config.js`)

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
```

#### 5. Setup Entry Point (`resources/js/app.jsx`)

```jsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - AIMS`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
```

#### 6. Root Blade Template (`resources/views/app.blade.php`)

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
```

---

### C. Instalasi Package Pendukung Tambahan

| Package | Kegunaan | Perintah Instalasi |
|:---|:---|:---|
| `@ant-design/icons` | Icon library untuk Ant Design | `npm install @ant-design/icons` |
| `antd` | UI Component library (Ant Design) | `npm install antd` |
| `axios` | HTTP client untuk API calls | `npm install axios` |
| `dayjs` | Manipulasi tanggal (pengganti moment.js) | `npm install dayjs` |
| `zustand` | State management ringan (opsional) | `npm install zustand` |
| `react-hook-form` | Form management dengan validasi | `npm install react-hook-form` |
| `zod` | Schema validation (digunakan bersama react-hook-form) | `npm install zod @hookform/resolvers` |


