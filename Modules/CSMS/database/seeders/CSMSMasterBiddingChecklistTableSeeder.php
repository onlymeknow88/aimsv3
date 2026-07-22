<?php

namespace Modules\CSMS\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class CSMSMasterBiddingChecklistTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $criteria = [
            [
                'ordinal_number' => 1,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan memiliki Kebijakan KPLH tertulis yang sudah ditetapkan dan ditanda-tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan KPLH'
            ],
            [
                'ordinal_number' => 2,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan memiliki Kebijakan/Program pemantauan penyalahgunaan minuman keras dan Narkoba (Narkotika, Psikotropika, Bahan Adiktif)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan & Program Anti Miras dan Narkotika'
            ],
            [
                'ordinal_number' => 3,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan memiliki Surat Ijin Usaha Jasa Pertambangan / Non Pertambangan yang masih berlaku & memenuhi kualifikasi bidang usaha',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Surat Ijin Jasa Pertambangan (SIUJP) / Non Pertambangan'
            ],
            [
                'ordinal_number' => 4,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan Memiliki Prosedur  Identifikasi Bahaya dan Pengendalian Risiko (IBPR)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur IBPR'
            ],
            [
                'ordinal_number' => 5,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan memiliki Struktur Organisasi yang sudah ditetapkan dan ditanda tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Struktur Organisasi Perusahaan'
            ],
            [
                'ordinal_number' => 6,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan mengirimkan jumlah Frequency Rate (FR) dan Severity Rate (SR) dalam 5 tahun kebelakang (Secara Corporate Perusahaan)',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen (Acuan dalam corporate bila ada'
            ],
            [
                'ordinal_number' => 7,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Kompetensi yang digunakan dalam Training Matriks perusahaan, sesuai dengan standar peraturan, contoh:
                1. POP/POM/POU = Bagi Penanggung Jawab Operasional (PJO) dan/atau Level Pengawas, Petugas Safety, dll
                2. AK3 Umum = Bagi Petugas Safety
                3. AK3 Konstruksi (Pratama/Madya/Utama) = Bagi PJO/Pengawas/Petugas Safety, dll (Kewajiban bagi Kontraktor Konstruksi)
                4. AK3 Listrik = Kewaiban bagi Kontraktor Konstruksi. Tetapi tidak menutup kemungkinan minimum adalah K3 Listrik.
                5. Juru Ukur = Bagi Surveyor
                6. Implementasi dan Auditor SMKP = Bagi PJO/Pengawas/Petugas Safety (Kewajiban bagi Kontraktor yang bekerja dengan ijin SIUJP Minerba)
                7. dll',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019
                - Permen ESDM No. 5 Tahun 2021 (Lampiran 3, hal. 66)',
                'note' => 'Lampirkan Training Matriks, Sertifikat yang diperlukan sesuai dengan kompetensi peraturan dan PTMC'
            ],
            [
                'ordinal_number' => 8,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Sertifikat Standar Management System:
                    1. ISO 9001 - Manajemen Mutu
                    2. ISO 14001 - Sistem Manajemen Lingkungan
                    3. ISO 45001 - Sistem Manajemen K3
                    4. ISO 22000 - Sistem Manajemen Pangan

                    (Sertifikat Standar Manajemen System ini akan menyesuaikan dengan kontrak dan juga aturan dari PT MC).
                    Calon mitra kerja untuk catering wajib memiliki ISO22000 - Sistem Manajemen Pangan.',
                'legal_base' => 'Technical Guideline IHOH AMC',
                'note' => 'Lampirkan Sertifikat Standar Manajemen System yang dimiliki'
            ],
            [
                'ordinal_number' => 9,
                'point' => 'BIDDING PROCESS',
                'sub_point' => null,
                'crtiteria' => 'Perusahaan memiliki HSE Plan dan mengirimkan sample HSE Plan',
                'legal_base' => '- KepMen ESDM No.1827/2018',
                'note' => 'Lampirkan HSE Plan'
            ],
            [
                'ordinal_number' => 1,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '1. KEBIJAKAN',
                'crtiteria' => 'Perusahaan memiliki Kebijakan KPLH tertulis yang sudah ditetapkan dan ditanda-tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan KPLH'
            ],
            [
                'ordinal_number' => 2,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '1. KEBIJAKAN',
                'crtiteria' => 'Perusahaan memiliki Kebijakan/Program pemantauan penyalahgunaan minuman keras dan Narkoba (Narkotika, Psikotropika, Bahan Adiktif)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan & Program Anti Miras dan Narkotika'
            ],
            [
                'ordinal_number' => 3,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki Surat Ijin Usaha Jasa Pertambangan / Non Pertambangan yang masih berlaku & memenuhi kualifikasi bidang usaha',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Surat Ijin Jasa Pertambangan (SIUJP) / Non Pertambangan - Bukan NIB'
            ],
            [
                'ordinal_number' => 4,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan Memiliki Prosedur  Identifikasi Bahaya dan Pengendalian Risiko',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur IBPR'
            ],
            [
                'ordinal_number' => 5,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki dan telah melengkapi Manual HSE & Biodiversity Plan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/201',
                'note' => 'Lampirkan Dokumen Manual HSE & Biodiversity Plan'
            ],
            [
                'ordinal_number' => 6,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki daftar pekerjaan yang akan dilakukan (Bisnis Proses)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Daftar Pekerjaan'
            ],
            [
                'ordinal_number' => 7,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki Prosedur Program KPLH',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Program KPLH
                '
            ],
            [
                'ordinal_number' => 8,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Struktur Organisasi yang sudah ditetapkan dan ditanda tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Struktur Organisasi Perusahaan'
            ],
            [
                'ordinal_number' => 9,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Struktur Organisasi KPLH yang sudah ditetapkan dan ditanda tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Struktur Organisasi KPLH
                '
            ],
            [
                'ordinal_number' => 10,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Pimpinan Tertinggi memberikan penunjukan PJO (Penanggung Jawab Operasional) untuk Perusahaan Jasa Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen Penunjukan PJO dan lainnya'
            ],
            [
                'ordinal_number' => 11,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki training matriks, yang didalamnya mencakup:
                a. Pemenuhan yang harus dipenuhi karyawan
                b. Training yang harus dipenuhi oleh pengawas, diantaranya POP/POM/POU
                c. Training sesuai kompetensi sebagai penunjang pekerjaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Training Matriks'
            ],
            [
                'ordinal_number' => 12,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki pekerja yang telah mengikuti Training:
                a. Implementasi SMKP
                b. Auditor SMKP (Pengecualian untuk Perusahaan Memiliki Tingkat Risiko Sedang)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Surat Penunjukan Internal Perusahaan dan Sertifikat'
            ],
            [
                'ordinal_number' => 13,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki program orientasi/ pengenalan KPLH untuk pekerja baru sebelum bekerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Program Orientasi / Pengenalah KPLH bagi karyawan'
            ],
            [
                'ordinal_number' => 14,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan Memiliki Prosedur Pengelolaan Kecelakaan, Kejadian Berbahaya, Kejadian Akibat Penyakit Tenaga Kerja, dan Penyakit Akibat Kerja yang dilengkapi dengan:
                - Form Laporan Kecelakaan
                - Daftar Kecelakaan Kerja
                - Statistik Kecelakaan Kerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pengelolaan Kecelakaan'
            ],
            [
                'ordinal_number' => 15,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Manual SMKP (Sistem Manajemen Keselamatan Pertambangan)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Manual SMKP'
            ],
            [
                'ordinal_number' => 16,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Operasi/Kerja terkait pekerjaan dan ijin kerja yang dilakukan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Daftar Prosedur Kerja (Daftar Induk Dokumen - DID) dan Ijin Kerja yang akan digunakan di lokasi kerja'
            ],
            [
                'ordinal_number' => 17,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur terkait Alat Pelindung Diri (APD), yang didalamnya memuat program:
                a. Pemilihan APD sesuai dengan jenis pekerjaan
                b. Penggunaan APD (sesuai Matriks APD)
                c. Penggantian APD',
                'legal_base' => '- Permenakertrans No. 08/2010
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Alat Pelindung Diri'
            ],
            [
                'ordinal_number' => 18,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Lingkungan Kerja',
                'legal_base' => '- KepDirJen ESDM No. 185/201',
                'note' => 'Lampirkan Prosedur Pengelolaan Lingkungan Kerja'
            ],
            [
                'ordinal_number' => 19,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Kesehatan Kerja, yang berisi diantaranya:
                - Melakukan MCU bagi karyawan (baru, annual, khusus & pensiun)
                - Pengelolaan hasil MCU karyawan',
                'legal_base' => '- KepDirJen ESDM No. 185/201',
                'note' => 'Lampirkan Prosedur Pengelolaan Kesehatan Kerja'
            ],
            [
                'ordinal_number' => 20,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Keselamatan Operasi Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Keselamatan Operasi Pertambangan'
            ],
            [
                'ordinal_number' => 21,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Bahan Peledak dan Peledakan Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pelaksanaan Pengelolaan Bahan Peledak'
            ],
            [
                'ordinal_number' => 22,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Penetapan Sistem Perancangan dan Rekayasa Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pelaksanaan Sistem Perancangan & Rekayasa Pertambangan'
            ],
            [
                'ordinal_number' => 23,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Penetapan Sistem Pembelian Pertambangan, yang berisi diantaranya:
                - Pemeliharaan bahan  kimia
                - Menyediakan dan memeliharan MSDS (Material Safety Data Sheet)
                - Petugas yang bekerja telah mengikuti training hydrokarbon',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Sistem Pembelian'
            ],
            [
                'ordinal_number' => 24,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pengelolaan Keadaan Darurat',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pengelolaan Keadaan Darurat'
            ],
            [
                'ordinal_number' => 25,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Penyediaan dan Penyiapan P3K',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Penyediaan dan Penyiapan P3K'
            ],
            [
                'ordinal_number' => 26,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Keselamatan di Luar Pekerjaan (Off The Job Safety)',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pelaksanaan Keselamatan di Luar Pekerjaan'
            ],
            [
                'ordinal_number' => 27,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan melakukan Identifikasi Bahaya dan Pengendalian Risiko (IBPR) terkait pekerjaan yang ada',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan IBPR dari Pekerjaan yang akan dilakukan'
            ],
            [
                'ordinal_number' => 28,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Kaidah Teknik Pertambangan Yang Baik (Good Mining Practice), dengan melakukan Audit GMP
                (Dapat dilampirkan dari lokasi lain yang pernah dilakukan, sebagai acuan)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019'
            ],
            [
                'ordinal_number' => 29,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan SMKP dengan melakukan Audit SMKP Minerba/SMKP Khusus
                (Dapat dilampirkan dari lokasi lain yang pernah dilakukan, sebagai acuan)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen
                (Acuan dari lokasi lain bila ada)'
            ],
            [
                'ordinal_number' => 30,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan mengirimkan jumlah Frequency Rate (FR) dan Severity Rate (SR) dalam 5 tahun kebelakang
                (Secara Corporate Perusahaan)',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen
                (Acuan dalam corporate bila ada)'
            ],
            [
                'ordinal_number' => 31,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan memiliki sistem Tindakan Perbaikan dan memiliki Prosedur yang Tindakan Perbaikan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen
                (Acuan dari lokasi lain bila ada)'
            ],
            [
                'ordinal_number' => 32,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '6. DOKUMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pengendalian Dokumen Keselamatan Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pengendalian Dokumen'
            ],
            [
                'ordinal_number' => 33,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '6. DOKUMENTASI',
                'crtiteria' => 'Perusahaan memiliki, menerapkan dan menetapkan Prosedur Pengendalian Rekaman Keselamatan Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Catatan dan Rekaman'
            ],
            [
                'ordinal_number' => 34,
                'point' => 'POST KUALIFIKASI',
                'sub_point' => '7. TINJAUAN MANAJEMEN DAN PENINGKATAN KINERJA',
                'crtiteria' => 'Perusahaan memiliki dan menerapkan Prosedur Tinjauan Manajemen',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Tinjauan Manajemen'
            ],
            [
                'ordinal_number' => 1,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '1. KEBIJAKAN',
                'crtiteria' => 'Perusahaan memiliki Kebijakan KPLH tertulis yang sudah ditetapkan dan ditanda-tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan KPLH'
            ],
            [
                'ordinal_number' => 2,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '1. KEBIJAKAN',
                'crtiteria' => 'Perusahaan memiliki Kebijakan/Program pemantauan penyalahgunaan minuman keras dan Narkoba (Narkotika, Psikotropika, Bahan Adiktif)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Kebijakan & Program Anti Miras dan Narkotika'
            ],
            [
                'ordinal_number' => 3,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki Surat Ijin Usaha Jasa Pertambangan (IUJP) / Non Pertambangan yang masih berlaku sesuai instansi & memenuhi kualifikasi bidang usaha',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Surat Ijin Jasa Pertambangan (SIUJP) / Non Pertambangan'
            ],
            [
                'ordinal_number' => 4,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki dan telah melengkapi Manual HSE & Biodiversity Plan dan setiap tahun-nya dilakukan pembaharuan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen Manual HSE & Biodiversity Plan'
            ],
            [
                'ordinal_number' => 5,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan Memiliki Prosedur  Identifikasi Bahaya dan Pengendalian Risiko',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur IBPR'
            ],
            [
                'ordinal_number' => 6,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki Bisnis Proses dari Pekerjaan yang berjalan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bisnis Proses Perusahaan'
            ],
            [
                'ordinal_number' => 7,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan memiliki Prosedur Program KPLH',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Program KPLH'
            ],
            [
                'ordinal_number' => 8,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '2. PERENCANAAN',
                'crtiteria' => 'Perusahaan mengirimkan Program KPLH (Target, Sasaran & Program) dan Rencana Anggaran Program (RAP) yang telah disetujui pada akhir tahun berjalan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => '- Lampirkan Program KPLH (TSP)
                - Lampirkan RAP yang telah disetuju'
            ],
            [
                'ordinal_number' => 9,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Struktur Organisasi yang sudah ditetapkan dan ditanda tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Struktur Organisasi Perusahaan'
            ],
            [
                'ordinal_number' => 10,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Struktur Organisasi KPLH  yang sudah ditetapkan dan ditanda tangani oleh Pimpinan Tertinggi perusahaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Struktur Organisasi KPLH'
            ],
            [
                'ordinal_number' => 11,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Pimpinan Tertinggi memberikan penunjukan PJO (Penanggung Jawab Operasional) untuk Perusahaan Jasa Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Dokumen Penunjukan PJO dan lainnya'
            ],
            [
                'ordinal_number' => 12,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki training matriks, yang didalamnya mencakup:
                a. Pemenuhan yang harus dipenuhi karyawan
                b. Training yang harus dipenuhi oleh pengawas, diantaranya POP/POM/POU
                c. Training sesuai kompetensi sebagai penunjang pekerjaan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Training Matriks'
            ],
            [
                'ordinal_number' => 13,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki pekerja yang telah mengikuti Training:
                a. Implementasi SMKP
                b. Auditor SMKP',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Surat Penunjukan Internal Perusahaan dan Sertifikat'
            ],
            [
                'ordinal_number' => 14,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki program orientasi/ pengenalan KPLH untuk pekerja baru sebelum bekerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Program Orientasi / Pengenalah KPLH bagi karyawan'
            ],
            [
                'ordinal_number' => 15,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan Memiliki Prosedur Pengelolaan Kecelakaan, Kejadian Berbahaya, Kejadian Akibat Penyakit Tenaga Kerja, dan Penyakit Akibat Kerja yang dilengkapi dengan:
                - Form Laporan Kecelakaan
                - Daftar Kecelakaan Kerja
                - Statistik Kecelakaan Kerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Pengelolaan Kecelakaan'
            ],
            [
                'ordinal_number' => 16,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '3. ORGANISASI & PERSONEL',
                'crtiteria' => 'Perusahaan memiliki Manual SMKP (Sistem Manajemen Keselamatan Pertambangan)',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Manual SMKP'
            ],
            [
                'ordinal_number' => 17,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Operasi/Kerja terkait pekerjaan dan ijin kerja yang dilakukan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Daftar Induk Dokumen (SOP, WIN, IBPR, Ijin Kerja)
                - Semua Prosedur Kerja'
            ],
            [
                'ordinal_number' => 18,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur terkait Alat Pelindung Diri (APD), yang didalamnya memuat program:
                a. Pemilihan APD sesuai dengan jenis pekerjaan
                b. Penggunaan APD (sesuai Matriks APD)
                c. Penggantian APD',
                'legal_base' => '- Permenakertrans No. 08/2010
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Kerja
                - Matriks APD
                - Daftar Pemberian APD'
            ],
            [
                'ordinal_number' => 19,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Lingkungan Kerja',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pengeloalan Lingkungan Kerja
                - Bukti Pengelolaan Lingkungan Kerja'
            ],
            [
                'ordinal_number' => 20,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Kesehatan Kerja',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pengelolaan Kesehatan Kerja
                - Bukti Pengelolaan Kesehatan Kerja'
            ],
            [
                'ordinal_number' => 21,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Keselamatan Operasi Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Keselamatan Operasi Pertambangan
                - Bukti Pengelolaan Keselamatan Operasi'
            ],
            [
                'ordinal_number' => 22,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Pengelolaan Bahan Peledak dan Peledakan Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pengelolaan Bahan Peledak
                - Bukti Pengelolaan Bahan Peledak'
            ],
            [
                'ordinal_number' => 23,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Penetapan Sistem Perancangan dan Rekayasa Pertambangan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pelaksanaan Sistem Perancangan dan Rekayasa Pertambangan
                - Bukti Pelaksanaan Sistem Perancangan dan Rekayasa Pertambangan'
            ],
            [
                'ordinal_number' => 24,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Penetapan Sistem Pembelian Pertambangan, yang berisi diantaranya:
                - Pemeliharaan bahan  kimia
                - Menyediakan dan memeliharan MSDS (Material Safety Data Sheet)
                - Petugas yang bekerja telah mengikuti training hydrokarbon',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Sistem Pembelian
                - Bukti Pelaksanaan Sistem Pembelian
                - Daftar MSDS'
            ],
            [
                'ordinal_number' => 25,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pengelolaan Keadaan Darurat',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pengelolaan Keadaan Darurat
                - Daftar Tim Pengelolaan Keadaan Darurat
                - Daftar Alat Pengelolaan Keadaan Darurat'
            ],
            [
                'ordinal_number' => 26,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Penyediaan dan Penyiapan P3K',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Penyediaan dan Penyiapan P3K
                - Daftar Tim Volunteer P3K'
            ],
            [
                'ordinal_number' => 27,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '4. IMPLEMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pelaksanaan Keselamatan di Luar Pekerjaan (Off The Job Safety)',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan:
                - Prosedur Pelaksanaan Keselamatan di Luar Pekerjaan
                - Daftar Pelaksanaan yang telah dilakukan dalam 2 tahun berlalu
                - Bukti Pelaksanaan'
            ],

            [
                'ordinal_number' => 28,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan melakukan Identifikasi Bahaya dan Pengendalian Risiko (IBPR) terkait pekerjaan yang ada',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => '-Lampirkan IBPR dari semua pekerjaan yang dilakukan.
                - Mitra kerja yang memiliki Sub Mitra Kerja, untuk melampirkan IBPR dari Sub Mitra Kerja-nya'
            ],
            [
                'ordinal_number' => 29,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Kaidah Teknik Pertambangan Yang Baik (Good Mining Practice), dengan melakukan Audit GMP',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Audit GMP dalam 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 30,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Pengelolaan Lingkungan Kerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Laporan Pengelolaan Lingkungan Kerja 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 31,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Pelaksanaan Pengelolaan Kesehatan Kerja',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Laporan Pelaksanaan Pengelolaan Kesehatan Kerja  2 tahun berjalan'
            ],
            [
                'ordinal_number' => 32,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Pelaksanaan Pengelolaan Keselamatan Operasi Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Laporan Pelaksanaan Pengelolaan Keselamatan Operasi Pertambangan 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 33,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Pelaksanaan Pengelolaan Bahan Peledak dan Peledakan Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Laporan Pelaksanaan Pengelolaan Bahan Peledak dan Peledakan Pertambangan 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 34,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan Pelaksanaan Penetapan Sistem Perancangan dan Rekayasa Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Daftar Menerapkan Pelaksanaan Penetapan Sistem Perancangan dan Rekayasa Pertambangan 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 35,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan telah menerapkan SMKP dengan melakukan Audit SMKP Minerba/SMKP Khusus',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Audit SMKP dalam 2 tahun berjalan'
            ],
            [
                'ordinal_number' => 36,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan mengirimkan jumlah Frequency Rate (FR) dan Severity Rate (SR) dalam 5 tahun kebelakang',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Bukti Pencapaian FR & SR
                (5 Tahun Kebelakang)'
            ],
            [
                'ordinal_number' => 37,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '5. MONITORING, EVALUASI & TINDAK LANJUT',
                'crtiteria' => 'Perusahaan memiliki sistem Tindakan Perbaikan dan memiliki Prosedur yang Tindakan Perbaikan',
                'legal_base' => '- KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan
                - Prosedur Sistem Tindakan Perbaikan
                -Bukti Sistem Tindakan Perbaikan'
            ],

            [
                'ordinal_number' => 38,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '6. DOKUMENTASI',
                'crtiteria' => 'Perusahaan memiliki Prosedur Pengendalian Dokumen Keselamatan Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan
                - Prosedur Pengendalian Dokumen
                - Daftar Induk Dokumen'
            ],
            [
                'ordinal_number' => 39,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '6. DOKUMENTASI',
                'crtiteria' => 'Perusahaan memiliki, menerapkan dan menetapkan Prosedur Pengendalian Rekaman Keselamatan Pertambangan',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Catatan dan Rekaman'
            ],

            [
                'ordinal_number' => 40,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '7. TINJAUAN MANAJEMEN DAN PENINGKATAN KINERJA',
                'crtiteria' => 'Perusahaan memiliki Prosedur Tinjauan Manajemen',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan Prosedur Tinjauan Manajemen'
            ],
            [
                'ordinal_number' => 41,
                'point' => 'PERPANJANGAN SERTIFIKASI CSMS',
                'sub_point' => '7. TINJAUAN MANAJEMEN DAN PENINGKATAN KINERJA',
                'crtiteria' => 'Perusahaan menerapkan Prosedur Tinjauan Manajemen',
                'legal_base' => '- KepMen ESDM No.1827/2018
                - KepDirJen ESDM No. 185/2019',
                'note' => 'Lampirkan
                - Bukti Tinjauan Manajemen, Progress Perbaikan dan Rencana Mendatang'
            ],
        ];

        foreach ($criteria as $key) {
            $mappedCriteria = 'Bidding';
            if ($key['point'] === 'PERPANJANGAN SERTIFIKASI CSMS') {
                $mappedCriteria = 'Renewal';
            } elseif ($key['point'] === 'POST KUALIFIKASI') {
                $mappedCriteria = 'PostBidding';
            }

            $exists = \Illuminate\Support\Facades\DB::table('csms_master_data_checklists')
                ->where('point', $key['point'])
                ->where('ordinal_number', $key['ordinal_number'])
                ->exists();

            if (!$exists) {
                \Illuminate\Support\Facades\DB::table('csms_master_data_checklists')->insert([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'ordinal_number' => $key['ordinal_number'],
                    'point' => $key['point'],
                    'sub_point' => $key['sub_point'],
                    'crtiteria' => $key['crtiteria'],
                    'criteria' => $mappedCriteria,
                    'legal_base' => $key['legal_base'],
                    'note' => $key['note'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
