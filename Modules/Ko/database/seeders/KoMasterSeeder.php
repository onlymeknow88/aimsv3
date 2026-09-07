<?php

namespace Modules\KO\Database\Seeders;

use DB;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\KO\Entities\KoAttachment;
use Modules\KO\Entities\KoBrand;
use Modules\KO\Entities\KoCommissioning;
use Modules\KO\Entities\KoCommissioningItem;
use Modules\KO\Entities\KoIssueReport;
use Modules\KO\Entities\KoIssueReportAttachment;
use Modules\KO\Entities\KoProposal;
use Modules\KO\Entities\KoSpipCategory;
use Modules\KO\Entities\KoSpipType;
use Modules\KO\Entities\KoSpipUnit;
use Modules\KO\Entities\KoUnit;
use Modules\KO\Entities\KoCommissioningHeader;
use Modules\KO\Entities\KoCommissioningField;

class KoMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // KoCommissioningField::truncate();
        // KoCommissioningHeader::truncate();
        // KoUnit::truncate();
        // KoSpipUnit::truncate();
        // KoSpipType::truncate();
        // KoSpipCategory::truncate();

        // Idempoten: lewati bila master sudah ada (tidak truncate agar data aman).
        if (KoSpipCategory::query()->exists()) {
            $this->command->info('KO master sudah ada, dilewati.');
            return;
        }

        //category
        $spipCategory = KoSpipCategory::create([
            'name' => 'Sarana',
            'internal_interval_year' => 1,
            'contractor_interval_year' => 1
        ]);

        //type
        $spipType = KoSpipType::create([
           'name' => 'Sarana Mobil / Light Vehicle',
           'ko_spip_category_id' => $spipCategory->id
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'SARANA / LIGHT VEHICLE',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Kondisi Body tidak penyok, jika ada penyok – Lampirkan justifikasi berita acara dan laporan insiden</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Warna kendaraan Putih atau Silver</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Nomor Lambung yang terpasang ada bagian pintu kanan, kiri dan belakang:</p><ul><li>Warna Dasar: Putih.</li><li>Warna kode dan angka adalah hitam/biru gelap dengan bahan scotlight Refrective.</li><li>Tinggi Kode dan atau Angka Nomor Sarana/Ambulance: 16x7cm</li><li>Logo atau Nama Perusahaan Custodian dan Subkontraktor: 10 x 8cm</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Strip Reflektor dengan lebar 5cm pada tiga (3) sisi kendaraan. Warna reflektor adalah:</p><ul><li>Bagian Kanan dan Kiri – berwarna Kuning</li><li>Bagian Belakang – Berwarna Merah</li><li>Untuk mobil box (baik single cabin, maupun double cabin) bagian belakang (pada BOX) ditempel stiker reflective warna merah mengelilingi.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Bemper terpasang di sisi depan dan belakang unit LV. Tipe ideal adalah Bumper Bullbar ARB Untuk Mitshubisi Triton.</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'PERLENGKAPAN KABIN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen | Channel Wajib: Channel 3 (CPP), Channel 4 (Project AKT & Jalan SHR), Channel 6 (Hauling CHR-SHR), Channel 7 (hauling LNR), Channel 9 (Area Village Lampunut), Channel 10 (Area CPP & Wash Plant Lampunut), ERT (15, 16, 17, dan 18), Channel 21 (AMA = Active Mining Area), Channel 19 (PIT Lampunut), Channel 22 (Dispact Lampunut).</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Kondisi Kursi – dapat disesuaikan atau tidak.</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Sabuk Pengaman 3 point inertia reel pada semua kursi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Menggunakan Kaca SNI dengan tingkat kegelapan kaca maksimum 20 %</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Alat Pemadam Api Ringan (APAR) ukuran 2 kg</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.6',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.7',
                'question' => '<p>Fungsi Klakson Minimum Intensitas Suara ≥83dB dan Maksimum 118dB dalam radius 0-15 meter; ukur dengan soundlevel meter (atau lihat di manual book spesifikasi)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.8',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.10',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.11',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.12',
                'question' => '<p>Kondisi Air Conditioner</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.13',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.14',
                'question' => '<p>Minimum 2 buah SRS Air Bags (kiri dan kanan di row depan)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.15',
                'question' => '<p>ROPS – dilengkapi dengan busa pelindung Jenis ROPS dengan struktur diluar kabin (Exo-Skeleton) tidak diijinkan kecuali ada kajian teknis yang disetujui oleh KTT- (Boleh tanpa ROPS jika sudah dinyatakan 5Star sesuai ASEAN NCAP & surat dari Dealer resmi / ATPM)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.16',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.17',
                'question' => '<p>Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman</li><li>(fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</li></ul>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.18',
                'question' => '<p>Untuk Camera wajib bisa di-monitor dan di-review online Oleh Team KO AMI maksimal 01 Januari 2024</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Lampu Depan | Lampu Jauh – Lampu Dekat – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Lampu Belakang | Lampu STOP/REM – Lampu Mundur – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Lampu Strobe warna Amber / Orange</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Alarm Mundur Minimum Intensitas Suara ≥80dB</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Kondisi Battery (kering/basah) dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Lampu Belakang terpasang pada Atap Kendaraan | Wajib untuk sarana Akses Penuh</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Lock Out Tag Out Station</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'SISTIM KEMUDI, REM DAN BAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Kondisi Kemudi (Steering) dan Kontrol</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Kondisi dan Pengoperasian Rem | Service Brake dan Parking Brake</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Kerataan dan Keseimbangan Roda (Rekaman Terlampir per 5.000 km); dari rekaman service terakhir.</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.4',
                'question' => '<p>System pengoperasian 4x4 pola/motif/ulir ban sama pada semua posisi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Ketebalan Ulir sisi kiri & kanan rata Serta Keausan ulir ban tidak kurang dari tinggi indikator keausan ban ( TWI ) dengan maksimum tahun produksi 5 tahun</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Vulkanisir tidak diperbolehkan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada velg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Wheel Nut Indikator</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'MESIN DAN LAIN – LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Tempat dudukan Buggy Wip terpasang pada bagian depan. Buggy Whip dengan tinggi > 4.5 Meter (Bendera berbahan kain warna Merah dan terdapat reflector) | Wajib untuk semua akses kendaraan</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Level Oli Steering, Oli Rem, Oli Kopling dan Level Air Pendingin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.4',
                'question' => '<p><p>Kondisi dan Pengoperasian 4x4 Dobel Gardan.</p><ul><li>Untuk mobil penumpang dengan usia pakai kurang dari 5 tahun dan pengoperasiannya berpindah perusahaan atau Odometer &gt; 100.000 Km, wajib dilengkapi dengan bukti hasil pemeriksaan seluruh bagian mobil dari yang dilakukan oleh bengkel yang ditunjuk AMC.</li><li>Untuk mobil penumpang dengan usia pakai lebih dari 5 tahun tidak diperbolehkan.</li></ul></p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Drive Shaft</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi Kipas (Fan), Sabuk (Belt), dan Pelindung (Guard)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Kondisi Chassis dan Kerangka Bawah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Kondisi Suspensi (Shock Absorber), Pegas (Spring) dan Dudukan (Mounting)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.9',
                'question' => '<p>AKSESORI LV |P3K (First Aid), Dongkrak dan Kunci Roda, Sepasang Segitiga minimal – Traffic Cone Ukuran 75cm (2pcs), Ganjal Ban (2pcs)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.10',
                'question' => '<p>Umur unit mobil penumpang (maks. 8 tempat duduk) & mobil barang maksimal 5 tahun terhitung dari tahun pembuatan.</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.11',
                'question' => '<p>Kapasitas mesin minimal 2000 cc. Dilihat dari manual book & Spesifikasi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.12',
                'question' => '<p>Tanda No Kendaraan (Plat nomor) KH atau surat izin operasi dari Samsat Murung Raya.</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.13',
                'question' => '<p>Kendaraan khusus harus dilengkapi design dan registrasi uji tipe.</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'TAMBAHAN KHUSUS AMBULANCE',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Lampu Light Bar LED (Biru dan Merah) | Terpasang Sirine</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Stretcher Roll-in, Suction, AED, Patient Monitor</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Lampu-Lampu Variasi sisi Kanan dan Kiri</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Logo, Tulisan, Sticker, List Warna menggunakan material Reflektif 3M</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Lampu Sorot (pada bagian dalam kabin) dengan ukuran 12V, 20W</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Terdapat Lampu Periksa, Lampu Plafon – Lampu Neon</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Terdapat Gantungan Infus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.8',
                'question' => '<p>2 Buah Tabung Oksigen dengan regulator dan central Oksigen</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.9',
                'question' => '<p>Wastafel, pompa, ±10 liter air bersih dan tempat limbah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.10',
                'question' => '<p>Lemari panjang untuk tempat penempatan obat & perlengkapan</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '7',
            'header' => '',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '7.1',
                'question' => '<p>Dilengkapi dengan winch – sling / steel rope dengan hook</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.2',
                'question' => '<p>Khusus untuk LV Explorasi wajib install Ch. 50; duplex / repeater.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.3',
                'question' => '<p>Dilengkapi dengan Rear-bumper ARB with Towing.</p>',
                'hazard_code' => 'A',
            ],
        ]);

        //category
        $spipCategory = KoSpipCategory::create([
            'name' => 'Peralatan',
            'internal_interval_year' => 2,
            'contractor_interval_year' => 1
        ]);

        //type
        $spipType = KoSpipType::create([
           'name' => 'Alat Berat Produksi',
           'ko_spip_category_id' => $spipCategory->id
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'Excavator / Shovel',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Data / Dokumen Prime Mover dan Data/dokumen Teknis (GVW, COG, Angle stability, dll)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Lampur rotary/Strobe Light warna oranye/amber dan warna biru (Kecuali Excavator Besar)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format</li><li>EX-0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Sticker Titik Jepit</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan</li><li>Warna Kuning pada sisi Kanan dan kiri Body</li><li>Warna Merah pada sisi belakang Body</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : <b>SK.5311/AJ.410/DRJF/20218</b></li></ul>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.3',
                'question' => '<p>ROPS / FOPS</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Alat Pemadam Api Ringan (APAR) Minimum 6Kg di luar cabin dan minimum ukuran 2kg di dalam cabin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fire Suppression System wajib untuk ≥ Exca 1250 atau sekelasnya untuk merk yang lain</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Fungsi Klakson dan Tingkat Kekerasan Suara</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.14',
                'question' => '<p>AKSESORI | Sepasang Segitiga (Traffic Triangle) minimum 75cm</p>',
                'hazard_code' => '',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Alarm Travel dan berfungsi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lock Out and Tag Out Switch</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Battery Isolation Switch</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Emergency Push Button</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SISTIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Track Link dan Shoe</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Kondisi Sistem kemudi dan fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Penerapan system dan Fungsi</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Sistem kemudi dan saluran hidrolik</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Fungsi dan Kontrol Pengunci swing</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Fungsi dan kondisi Sistem rem hidrolik (travel dan swing)</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Kondisi silinder hidrolik dan kondisi selang</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Tangga dan pijakan kaki</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Mirror / Spion</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Pagar dan pegangan untuk pengamanan bekerja di ketinggian</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Bucket dan kondisi kuku-kuku</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Penutup Pipa knalpot (jika menghadap keatas / lurus)</p>',
                'hazard_code' => 'A',
            ],
        ]);


        //type
        $spipType = KoSpipType::create([
           'name' => 'Alat Berat Penunjang Produksi',
           'ko_spip_category_id' => $spipCategory->id
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'Motor Grader',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Lampur rotary/Strobe Light warna oranye dan warna biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Lampur rotary/Strobe Light warna oranye dan warna biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Sticker Titik Jepit</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format MG-0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.6',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan</li><li>Warna Kuning pada sisi Kanan dan kiri Body</li><li>Warna Merah pada sisi belakang Body</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : <b>SK.5311/AJ.410/DRJF/20218</b></li></ul>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'PERLENGKAPAN KABIN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.3',
                'question' => '<p>ROPS / FOPS</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Alat Pemadam Api Ringan (APAR) ukuran 6Kg di luar kabin dan (APAR) ukuran 2 Kg</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fire Suppression System wajib untuk ≥ GD 825 atau sekelasnya untuk merk yang lain</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Fungsi Klakson dan Tingkat Kekerasan Suara</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'C',
            ],

        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu STOP / rem</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lampu kabut (jika diperlukan)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Lampu sein dan lampu hazard</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Alarm mundur dan berfungsi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Lock Out Tag Out Station</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Battery Isolation Switch</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.9',
                'question' => '<p>Emergency Shutdown Push Button</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '4.10',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SISTIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Ban dan Rim</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Kemudi dan Linkage</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Pelindung Lumpur (jika disediakan)</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Kondisi Sistem kemudi dan fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Rem Parkir dan Fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi rem servise dan fungsi</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'SISTIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Kondisi silinder hidrolik dan kondisi selang</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Penerapan system dan Fungsi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Tangga dan pijakan kaki</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Mirror / Spion</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Pagar dan pegangan tangan untuk pengamanan bekerja di ketinggian</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Kondisi Ripper dan kuku-kuku (jika dilengkapi)</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '6.8',
                'question' => '<p>Kondisi Blade dan Cutting Edge</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '6.9',
                'question' => '<p>Penutup Pipa knalpot (jika kenalpot posisi lurus)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.10',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.11',
                'question' => '<p>AKSESORI | Sepasang Segitiga (Traffic Triangle) minimum 75cm</p>',
                'hazard_code' => 'B',
            ],
        ]);



        $spipUnit = KoSpipUnit::create([
            'name' => 'TRACK TYPE TRACTOR (DOZER)',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format DZ-0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Sticker | Titik Jepit, Dilarang menumpang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan</li><li>Warna Kuning pada sisi Kanan dan kiri Body</li><li>Warna Merah pada sisi belakang Body</li><li>Untuk design pemasangan mengacu pada Peraturan DirekturJenderal Perhubungan darat No. : <b>SK.5311/AJ.410/DRJF/20218</b></li></ul>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Alat Pemadam Api Ringan (APAR) ukuran 6 Kg diluar kabin dan ukuran 2 Kg di dalam kabin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Fire Suppression System wajib untuk ≥ D375 atau sekelasnya untuk merk yang lain</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Klakson dan Tingkat Kekerasan Suara</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Kondisi Kabin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.14',
                'question' => '<p>AKSESORI | Sepasang Segitiga (Traffic Triangle) minimum 75cm</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu STOP - rem</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lampu Strobe warna orange dan biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Alarm Mundur</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Lock Out Tag Out Station</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Emergency Push Button</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SISTIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Track Link dan Shoe</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Kondisi Kemudi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Kondisi Undercarriage</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Kondisi dan Fungsi system kemudi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi dan Fungsi rem parkir</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi dan Fungsi rem service</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'MESIN DAN LAIN - LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Kondisi Silinder HIdrolik dan Selang-selang</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Kondisi tangga dan pijakan kaki</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Mirror / Spion</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Pagar dan pegangan tangan untuk pengamanan bekerja di ketinggian</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Kondisi Ripper dan kuku-ku (Jika tersedia)</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Kondisi Blade dan Cutting Edge</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '6.8',
                'question' => '<p>Penutup Knalpot (jika kenalpot posisi lurus)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.9',
                'question' => '<p>Fungsi Kontrol Pengunci Transmisi</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '7',
            'header' => 'TAMBAHAN KHUSUS DOZER AREA PROYEK LAND CLEARING & EKSPLORASI',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '7.1',
                'question' => '<p>Khusus untuk Dozer Explorasi wajib install Ch. 50; duplex / repeater.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.2',
                'question' => '<p>ROPS/FOPS wajib untuk dozer area land clearing & EXPLORASI</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.3',
                'question' => '<p>Canopy mesh wajib untuk dozer area land clearing & EXPLORASI</p>',
                'hazard_code' => 'AA',
            ],
        ]);



        $spipUnit = KoSpipUnit::create([
            'name' => 'ON HIGHWAY TRUCK (LT, DT)',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Data / Dokumen Prime Mover dan Data/dokumen Teknis design Truck (GVW, COG, Angle stability, dll) yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format DT-0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan dan samping Kabin</li><li>Warna Kuning pada sisi Kanan dan kiri Vessel</li><li>Warna Merah pada sisi belakang Vessel</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : <b>SK.5311/AJ.410/DRJF/20218</b></li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Sticker | Titik Jepit, Dilarang menumpang dan three body contact</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Buggy whip untuk kendaraan < 4.5 meter, apabila beroperasional di Active Mining Area (Bendera warna Merah dan ada reflector)</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Kaca Film dengan Maksimum Kadar Kegelapan 20% | Jenis Cermin dilarang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Alat Pemadam Api Ringan (APAR) ukuran 6 Kg diluar kabin dan ukuran 2 Kg di dalam kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Klakson dan Tingkat Kekerasan Suara (min 83 db, mak 100 db, terdengar dari jarak 50 meter)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Fatigue warning alarm</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.14',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.15',
                'question' => '<p>Kamera kabin, yang dapat merekam arah bagian depan operator dan juga ruangan kabin operator. Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman (fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</li></ul>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.16',
                'question' => '<p>Speed limiter Device ( dilampirkan bukti setting yang sudah dilakukan). Untuk unit tanpa fitur bawaan, dapat dilengkapi dengan device tambahan dengan fungsi yang serupa dan disertai dokumen Change Management yang disetujui oleh KTT.</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan | Lampu Jauh – Lampu Dekat – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang | Lampu STOP – Lampu Mundur – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu Strobe warna orange / Amber</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Alaram Mundur</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Lock Out Tag Out Station dan Emergency Push Button</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Kemudi (Steering) dan Kontrol</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Kondisi dan Pengoperasian Rem | Service Brake dan Parking Brake</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Kerataan dan Keseimbangan Roda ( Rekaman Terlampir per 5.000 km )</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.4',
                'question' => '<p>System pengoperasian 4x4 WD</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Ketebalan Ulir sisi kiri & kanan rata Serta Keausan ulir ban tidak kurang dari tinggi indikator keausan ban ( TWI ) dengan maksimum tahun produksi 5 tahun</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Pola/motif/ulir ban sama pada semua posisi. Vulkanisir tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada pelg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Nut Indicator</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'MESIN DAN LAIN - LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Kondisi Bak Truck bisa dumping dan kondisi cylinder tidak ada kebocoran</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Level Oli Mesin, Oli Steering, Oli Rem, Oli Kopling dan Level Air Pendingin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Kondisi dan Pengoperasian Dobel Gardan & Drive shaft</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Kondisi Kipas (Fan), Sabuk (Belt), dan Pelindung (Guard)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Kondisi Chassis dan Kerangka Bawah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Kondisi Suspensi (Shock Absorber), Pegas (Spring) dan Dudukan (Mounting)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.8',
                'question' => '<p>AKSESORI | P3K (First Aid), Dongkrak dan Kunci Roda, Sepasang Segitiga (Traffic Triangle)/Traffic Cone minimum ukuran 75 cm, serta 2x wheel choke</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.9',
                'question' => '<p>Kondisi Tail Gate dan accessories</p>',
                'hazard_code' => 'A',
            ],
        ]);


        $spipUnit = KoSpipUnit::create([
            'name' => 'WATER TRUCK',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Data / Dokumen Prime Mover dan Data/dokumen Teknis (GVW, COG, Angle stability, dll)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format WT - 0004 dan Logo perusahaan</li></ul><p>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk&nbsp;<span style="font-family: var(--font-dm-sans); background-color: var(--bs-body-bg); color: var(--bs-body-color); text-align: var(--bs-body-text-align);">minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</span></p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan dan samping Kabin</li><li>Warna Kuning pada sisi Kanan dan kiri Tanki</li><li>Warna Merah pada sisi belakang Tangki</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : SK.5311/AJ.410/DRJF/20218</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Sticker | Titik Jepit, Dilarang menumpang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Buggy whip untuk kendaraan < 4.5 meter apabila beroperasional di Active Mining Area</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'PERLENGKAPAN KABIN KENDARAAN / PRIME MOVER',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman 3 point inertia reel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Kaca Film SNI dengan Maksimum Kadar Kegelapan 20% | Jenis Cermin dilarang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.4',
                'question' => '<p>2x Alat Pemadam Api Ringan (APAR) ukuran 6 Kg diluar kabin dan ukuran 2 Kg di dalam kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Klakson dan tingkat Kekerasan Suara (min 83 db, mak 118 db, terdengar dari jarak 50 meter)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Speed limiter Device ( dilampirkan bukti setting yang sudah dilakukan). Untuk unit tanpa fitur bawaan, dapat dilengkapi dengan device tambahan dengan fungsi yang serupa dan disertai dokumen Change Management yang disetujui oleh KTT.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.14',
                'question' => '<p>Kamera kabin, yang dapat merekam arah bagian depan operator dan juga ruangan kabin operator. Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB atau sesuai spesifikasi Indash cam</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman (Fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</li></ul>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan | Lampu Jauh – Lampu Dekat – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang | Lampu STOP – Lampu Mundur – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu Strobe warna orange / Amber dan Biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lampu Samping untuk Fuel Truck (Min 4 Lampu setiap sisi)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Alarm Mundur (dapat terdengar dari jarak 30 meter)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Lock Out Tag Out Station dan Emergency Push Button</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Fatigue Warning Alarm</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SITIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Kemudi (Steering) dan Kontrol</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Pola/motif/ulir ban sama pada semua posisi. Vulkanisir tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Kondisi dan Pengoperasian Rem | Service Brake dan Parking Brake</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Pengoperasian Dobel Gardan/differential Lock</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Kompressor Angin, Hose, Sambungan Hose dan Tangki Angin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi Brake Chamber</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada velg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Wheel Nut Indikator</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'MESIN DAN LAIN – LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Level Oli Mesin, Steering, Oli Rem, Oli Kopling dan Level Air Pendingin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Kondisi Kipas (Fan), Sabuk (Belt), dan Pelindung (Guard)</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Kondisi Chassis dan Kerangka Bawah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Kondisi Suspensi (Shock Absorber), Pegas (Spring) dan Dudukan (Mounting)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.6',
                'question' => '<p>AKSESORI | P3K (First Aid), Dongkrak dan Kunci Roda, 2x Safety cone Minimal ukuran 75cm, 2x wheel choke (ganjal).</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '7',
            'header' => 'WATER TANK ATTACHMENT',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '7.1',
                'question' => '<p>Kondisi Tangki Air</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.2',
                'question' => '<p>Special Connector untuk Sambungan Selang Pemadam Api</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.3',
                'question' => '<p>Simbol Kapasitas Tangki</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.4',
                'question' => '<p>Simbol Warna Untuk Jenis Air</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.5',
                'question' => '<p>Sekatan dalam Tangki</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.6',
                'question' => '<p>Water Canon Jika Dilengkapi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.7',
                'question' => '<p>Kondisi Selang Air dan Sambungan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.8',
                'question' => '<p>Tutup Tanki Air</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.9',
                'question' => '<p>Sekatan dalam Tangki</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '7.10',
                'question' => '<p>Tangga dengan pegangan anti slip dalam kondisi layak</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.11',
                'question' => '<p>Pompa tambahan dengan jenis diesel (jika ada)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.12',
                'question' => '<p>Sticker tiga titik kontak</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'LUBE/SERVICE TRUCK',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Data / Dokumen Prime Mover dan Data/dokumen Teknis (GVW, COG, Angle stability, dll)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><p><br></p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format ST / LT - 0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p><p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan dan samping Kabin</li><li>Warna Kuning pada sisi Kanan dan kiri Tanki</li><li>Warna Merah pada sisi belakang Tangki</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : SK.5311/AJ.410/DRJF/20218</li></ul></p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Sticker | Titik Jepit, Dilarang menumpang</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman 3 point inertia reel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Kaca Film dengan Maksimum Kadar Kegelapan 20% | Jenis Cermin dilarang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.4',
                'question' => '<p>2x Alat Pemadam Api Ringan (APAR) ukuran 6 Kg diluar kabin dan minimal ukuran 2 Kg di dalam kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Klakson dan tingkat Kekerasan Suara (min 83 db, mak 118 db, terdengar dari jarak 50 meter)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Air Conditioner (Optional)</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Speed limiter Device (dilampirkan bukti setting yang sudah dilakukan). Untuk unit tanpa fitur bawaan, dapat dilengkapi dengan device tambahan dengan fungsi yang serupa dan disertai dokumen Change Management yang disetujui oleh KTT.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.14',
                'question' => '<p>Kamera kabin, yang dapat merekam arah bagian depan operator dan juga ruangan kabin operator. Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB atau sesuai spesifikasi Indash cam</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman</li></ul><p>(Fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</p>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan | Lampu Jauh – Lampu Dekat – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang | Lampu STOP – Lampu Mundur – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu Strobe warna orange / Amber dan Biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Alaram Mundur</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Lock Out Tag Out Station dan Emergency Push Button</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Fatigue Warning Alarm</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Lampu kerja tambahan</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SISTIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Kemudi (Steering) dan Kontrol</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Pola/motif/ulir ban sama pada semua posisi. Vulkanisir tidak di rekomendasikan</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Kondisi dan Pengoperasian Rem | Service Brake dan Parking Brake</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Pengoperasian Dobel Gardan/differential Lock</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Kompressor Angin, Hose, Sambungan Hose dan Tangki Angin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi Brake Chamber</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada velg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Wheel Nut Indikator</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'MESIN DAN LAIN – LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Level Oli Mesin, Steering, Oli Rem, Oli Kopling dan Level Air Pendingin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '63.',
                'question' => '<p>Kondisi Kipas (Fan), Sabuk (Belt), dan Pelindung (Guard)</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Kondisi Chassis dan Kerangka Bawah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Kondisi Suspensi (Shock Absorber), Pegas (Spring) dan Dudukan (Mounting)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.6',
                'question' => '<p>AKSESORI | P3K (First Aid), Dongkrak dan Kunci Roda, Sepasang Segitiga (Traffic Cone) Minimal ukuran 75cm, serta 2x wheel choke</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '7',
            'header' => 'LUBE TANK ATTACHMENT',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '7.1',
                'question' => '<p>Kondisi Tangki Oli/lubricant/Grease, tangki oli bekas</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.2',
                'question' => '<p>Melampirkan hasil pemeriksaan dan pengujian tiap sekatan / chamber Tangki</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.3',
                'question' => '<p>Emergency Spills Kit</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.4',
                'question' => '<p>Simbol Kapasitas dan Identifikasi Tangki Oli</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.5',
                'question' => '<p>Simbol Warna dan Identifikasi pada Tangki</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.6',
                'question' => '<p>Monitor Level Tangki Oli</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.7',
                'question' => '<p>Simbol Dilarang Merokok</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.8',
                'question' => '<p>Kondisi Selang Nossle dan Sambungan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.9',
                'question' => '<p>Kondisi dan Fungsi Meteran Oli</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.10',
                'question' => '<p>Secondary Containment</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.11',
                'question' => '<p>Tangga, Pagar, dan Pegangan Tangan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.12',
                'question' => '<p>Sticker tiga titik kontak</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'FUEL TRUCK',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Data / Dokumen Prime Mover dan Data/dokumen Teknis (GVW, COG, Angle stability, dll)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi yang telah direview dan disetujui oleh Tim KO PTMC</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format WT - 0004 dan Logo perusahaan</li></ul><p>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk&nbsp;<span style="font-family: var(--font-dm-sans); background-color: var(--bs-body-bg); color: var(--bs-body-color); text-align: var(--bs-body-text-align);">minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</span></p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan dan samping Kabin</li><li>Warna Kuning pada sisi Kanan dan kiri Tanki</li><li>Warna Merah pada sisi belakang Tangki</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : SK.5311/AJ.410/DRJF/20218</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Sticker | Titik Jepit, Dilarang menumpang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Buggy whip untuk kendaraan < 4.5 meter apabila beroperasional di Active Mining Area</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'PERLENGKAPAN KABIN KENDARAAN / PRIME MOVER',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman 3 point inertia reel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.3',
                'question' => '<p>Kaca Film SNI dengan Maksimum Kadar Kegelapan 20% | Jenis Cermin dilarang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.4',
                'question' => '<p>2x Alat Pemadam Api Ringan (APAR) ukuran 6 Kg diluar kabin dan ukuran 2 Kg di dalam kabin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.5',
                'question' => '<p>Fungsi Instrument Panel dan Speedometer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Klakson dan tingkat Kekerasan Suara (min 83 db, mak 118 db, terdengar dari jarak 50 meter)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Kondisi Interior Kabin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Kondisi Kaca Kabin</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Air Conditioner</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Speed limiter Device ( dilampirkan bukti setting yang sudah dilakukan). Untuk unit tanpa fitur bawaan, dapat dilengkapi dengan device tambahan dengan fungsi yang serupa dan disertai dokumen Change Management yang disetujui oleh KTT.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.14',
                'question' => '<p>Kamera kabin, yang dapat merekam arah bagian depan operator dan juga ruangan kabin operator. Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB atau sesuai spesifikasi Indash cam</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman (Fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</li></ul>',
                'hazard_code' => 'AA',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan | Lampu Jauh – Lampu Dekat – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang | Lampu STOP – Lampu Mundur – Lampu Kota</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Lampu Strobe warna orange / Amber dan Biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lampu Samping untuk Fuel Truck (Min 4 Lampu setiap sisi)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Alarm Mundur (dapat terdengar dari jarak 30 meter)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Lock Out Tag Out Station dan Emergency Push Button</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.8',
                'question' => '<p>Fatigue Warning Alarm</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'SITIM KEMUDI dan REM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Kemudi (Steering) dan Kontrol</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Pola/motif/ulir ban sama pada semua posisi. Vulkanisir tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Kondisi dan Pengoperasian Rem | Service Brake dan Parking Brake</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Pengoperasian Dobel Gardan/differential Lock</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Kompressor Angin, Hose, Sambungan Hose dan Tangki Angin</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi Brake Chamber</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada velg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Wheel Nut Indikator</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'MESIN DAN LAIN – LAIN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Level Oli Mesin, Steering, Oli Rem, Oli Kopling dan Level Air Pendingin</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Kondisi Kipas (Fan), Sabuk (Belt), dan Pelindung (Guard)</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Kondisi Chassis dan Kerangka Bawah</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Kondisi Suspensi (Shock Absorber), Pegas (Spring) dan Dudukan (Mounting)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.6',
                'question' => '<p>AKSESORI | P3K (First Aid), Dongkrak dan Kunci Roda, 2x Safety cone Minimal ukuran 75cm, 2x wheel choke (ganjal).</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '6.7',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '7',
            'header' => 'WATER TANK ATTACHMENT',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '7.1',
                'question' => '<p>Kondisi Tangki Fuel dan sertifikat hydro test masih berlaku</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '7.2',
                'question' => '<p>Emergency Spills Kit</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.3',
                'question' => '<p>Simbol Kapasitas Tangki Fuel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.4',
                'question' => '<p>Simbol Warna dan Identifikasi Fuel pada Tangki</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.5',
                'question' => '<p>Simbol B3</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.6',
                'question' => '<p>Sekatan dalam Tangki</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '7.7',
                'question' => '<p>Kondisi Selang dan Sambungan type coupling atau thread</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.8',
                'question' => '<p>Kondisi dan Fungsi Meteran Fuel (flow meter) dan kalibrasi masih berlaku</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.9',
                'question' => '<p>Kabel Grounding</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '7.10',
                'question' => '<p>Kondisi Secondary containment di bagian atas tangki</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.11',
                'question' => '<p>Sistem Pengunci pintu manhole + gembok</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.12',
                'question' => '<p>Indikator level dapat ditutup dan dikunci</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.13',
                'question' => '<p>Perlindungan bekerja di ketinggian (handrail, fall arrestor pada anchorage yang standard) tersedia dan kondisi Layak</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.14',
                'question' => '<p>Tangga dengan pegangan anti slip dalam kondisi layak</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.15',
                'question' => '<p>Pompa tambahan dengan jenis diesel (jika ada)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '7.16',
                'question' => '<p>Sticker tiga titik kontak</p>',
                'hazard_code' => 'B',
            ],
        ]);

        //type
        $spipType = KoSpipType::create([
           'name' => 'Alat Angkat',
           'ko_spip_category_id' => $spipCategory->id
        ]);

        $spipUnit = KoSpipUnit::create([
            'name' => 'CRANE TRUCK',
            'ko_spip_type_id' => $spipType->id
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '1',
            'header' => 'DOKUMEN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '1.1',
                'question' => '<p>Dokumen Pemeriksaan dan Pengujian dari kompeten person / PJIT yang berijin.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.2',
                'question' => '<p>Sertifikat Alat Angkat yang disetujui oleh KTT</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '1.3',
                'question' => '<p>Dokumen Unit, Faktur Pajak, dll</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.4',
                'question' => '<p>Dokumen pemeliharaan dan perawatan unit, termasuk midlife atau General Overhaul</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.5',
                'question' => '<p>Dokumen kajian teknis jika ada perubahan desain dari Standar Pabrikasi</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '1.6',
                'question' => '<p>Dokumen Komisioning rutin yang dilakukan internal oleh Mitra Kerja untuk Unit yang di re-komisioning</p>',
                'hazard_code' => 'A',
            ]
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '2',
            'header' => 'BAGIAN LUAR KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '2.1',
                'question' => '<p>Kondisi Body (Tidak penyok, jika ada penyok / kondisi abnormal lainnya – lampirkan justifikasi berita acara dan laporan insiden) dan Warna Cat Kendaraan dalam kondisi masih bagus</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.2',
                'question' => '<p>Lampur rotary/Strobe Light warna oranye dan warna biru</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.3',
                'question' => '<p>Nomor lambung reflektif pada empat sisi kendaraan, ukuran minimum A3 dengan tinggi angka minimal 50 cm dan jenis huruf Arial Bold. Latar huruf menggunakan bahan reflektif :</p><ul><li>Nomor lambung bagian depan dengan (maksimal) 4 digit angka</li><li>Nomor lambung samping kanan dan kiri dengan contoh format CT-0004 dan Logo perusahaan</li><li>Nomor lambung bagian belakang wajib menggunakan steel plate yang dibentuk minimal 3 digit, ditempel / digantung dan terlihat jelas jarak 50M.</li></ul>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.4',
                'question' => '<p>Buggy whip untuk kendaraan tinggi < 4.5 meter Jika beroperasi di Active Mining Area</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.5',
                'question' => '<p>Sticker | Titik Jepit, Kapasistas SWL pada Boom dan Block</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '2.6',
                'question' => '<p>Sticker | Dilarang merokok, Wajib menggunakan Seat Belt, Dilarang menggunakan HP, Tidak menggunakan Headset</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '2.7',
                'question' => '<p>Kondisi Mesin dan Kebocoran</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '2.8',
                'question' => '<p><p>Penambahan Strip Reflektor dengan ukuran minimal 5 cm</p><ul><li>Warna Putih / Kuning pada sisi depan dan samping Kabin</li><li>Warna Kuning pada sisi Kanan dan kiri bak</li><li>Warna Merah pada sisi belakang bak</li><li>Untuk design pemasangan mengacu pada Peraturan Direktur Jenderal Perhubungan darat No. : SK.5311/AJ.410/DRJF/20218</li></ul></p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '3',
            'header' => 'PERLENGKAPAN KABIN KENDARAAN',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '3.1',
                'question' => '<p>Radio Komunikasi dua arah terpasang Permanen dengan Channel Wajib di site dan dapat menampilkan ID Call Sign unit dan juga test fungsi channel radio.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.2',
                'question' => '<p>Kondisi Kursi dan masing-masing dilengkapi dengan Sabuk Pengaman</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.3',
                'question' => '<p>ROPS / FOPS</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.4',
                'question' => '<p>Kaca Film SNI dengan Maksimum Kadar Kegelapan 20% | Jenis Cermin dilarang</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '3.5',
                'question' => '<p>2x Alat Pemadam Api Ringan (APAR) ukuran 6Kg di luar kabin dan (APAR) ukuran 2 Kg</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.6',
                'question' => '<p>Fungsi Instrument Panel</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.7',
                'question' => '<p>Fungsi Klakson dan tingkat Kekerasan Suara (min 83 db, mak 100 db, terdengar dari jarak 50 meter)</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.8',
                'question' => '<p>Foot Step and Hand Hold untuk naik ke vessel</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.9',
                'question' => '<p>Windshield Wiper and Washer</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.10',
                'question' => '<p>Tabel Beban / Load chart</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.11',
                'question' => '<p>Kondisi Pintu dan Pengunci Pintu</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.12',
                'question' => '<p>Air Conditioner (Optional)</p>',
                'hazard_code' => 'C',
            ],
            [
                'number' => '3.13',
                'question' => '<p>Kondisi Spion / Cermin Pandang Belakang bisa diatur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.14',
                'question' => '<p>Fatigue Warning Alarm</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '3.15',
                'question' => '<p>Speed limiter Device ( dilampirkan bukti setting yang sudah dilakukan). Untuk unit tanpa fitur bawaan, dapat dilengkapi dengan device tambahan dengan fungsi yang serupa dan disertai dokumen Change Management yang disetujui oleh KTT.</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.16',
                'question' => '<p>Kamera kabin, yang dapat merekam arah bagian depan operator dan juga ruangan kabin operator. Indash Camera – dengan spesifikasi :</p><ul><li>Kamera sorot rekam arah depan</li><li>Kamera sorot rekam arah pengemudi</li><li>Micro-SD Card min. 32GB atau sesuai spesifikasi Indash cam</li><li>Power auto connect pada switch on power unit</li><li>Tanggal yang bisa di adjust / setting</li><li>Pembaca Kecepatan</li><li>GPS show pada file rekaman (Fitur tambahan pendukung – tidak wajib) koneksi wifi untuk transfer – download file.</li></ul>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '3.17',
                'question' => '<p>AKSESORI | P3K (First Aid), Dongkrak dan Kunci Roda, Sepasang Segitiga (Traffic Cone) Minimal ukuran 75cm, serta 2x wheel choke</p>',
                'hazard_code' => 'B',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '4',
            'header' => 'LAMPU dan AKSESORI ELEKTRIK',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '4.1',
                'question' => '<p>Lampu Depan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.2',
                'question' => '<p>Lampu Belakang</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.3',
                'question' => '<p>Alarm Mundur</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.4',
                'question' => '<p>Lock Out and Tag Out Switch</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.5',
                'question' => '<p>Battery Isolation Switch</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '4.6',
                'question' => '<p>Emergency Push Button</p>',
                'hazard_code' => 'B',
            ],
            [
                'number' => '4.7',
                'question' => '<p>Kondisi Battery dan Koneksi Kabel</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '5',
            'header' => 'STEERING and BRAKING SYSTEM',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '5.1',
                'question' => '<p>Kondisi Sistem kemudi dan fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.2',
                'question' => '<p>Kondisi system hidrolik dan selang-selang</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.3',
                'question' => '<p>Putaran kemudi dan titik belok /Turning Point</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.4',
                'question' => '<p>Jenis ban untuk Akses Penuh MT (Mud Terrain). Pola/motif/ulir ban sama pada semua posisi. Vulkanisir tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.5',
                'question' => '<p>Kondisi Rem Parkir dan Fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.6',
                'question' => '<p>Kondisi rem servise dan fungsi</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '5.7',
                'question' => '<p>Mur/Nut Roda standar dan aksesori cover pada velg tidak di rekomendasikan</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.8',
                'question' => '<p>Wheel Nut Indikator</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '5.9',
                'question' => '<p>Pengoperasian Dobel Gardan/differential Lock</p>',
                'hazard_code' => 'A',
            ],
        ]);

        $header = KoCommissioningHeader::create([
            'number' => '6',
            'header' => 'CRANE ATTACHMENT',
            'ko_spip_unit_id' => $spipUnit->id
        ]);

        $header->koCommissioningFields()->createMany([
            [
                'number' => '6.1',
                'question' => '<p>Penerapan Sistem dan Kontrol</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.2',
                'question' => '<p>Kondisi tali kawat / Wire Rope dalam keadaan laik pakai</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.3',
                'question' => '<p>Kondisi Counterweight</p>',
                'hazard_code' => 'A',
            ],
            [
                'number' => '6.4',
                'question' => '<p>Kondisi Safety Latch</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.5',
                'question' => '<p>Kondisi Out Rigger dan Base Plate tambahan (Plat besi)</p>',
                'hazard_code' => 'AA',
            ],
            [
                'number' => '6.6',
                'question' => '<p>Peralatan Bantu Angkat, aksesoris beserta box untuk penyimpanan aksesoris</p>',
                'hazard_code' => 'A',
            ],
        ]);
    }
}
