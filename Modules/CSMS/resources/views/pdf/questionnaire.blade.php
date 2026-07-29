<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @page { margin: 100px 30px 30px 30px; }
    </style>
</head>
<body style="font-family: Arial, sans-serif; font-size: 11px; color: #000; margin: 0; padding: 0;">

    {{-- HEADER (fixed, repeat every page) --}}
    <header style="position: fixed; top: -85px; left: 0; right: 0;">
        <table border="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td width="20%" style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle;">
                    <img src="{{ public_path('images/Alamtri Geo Logo - Full Color 1.png') }}" style="max-width: 100%; max-height: 50px;" alt="Logo" />
                </td>
                <td width="50%" style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; font-size: 14px; font-weight: 700;">
                    KUESIONER CSMS
                </td>
                <td width="30%" style="border: 1px solid #000; padding: 6px; font-size: 10px; vertical-align: top;">
                    <div style="margin-bottom: 2px;">No. Dokumen: {{ $data['document_number'] ?? '-' }}</div>
                    <div style="margin-bottom: 2px;">No. Revisi: {{ $data['document_rev'] ?? '1.0' }}</div>
                    <div>Tanggal: {{ $data['document_date'] ?? '-' }}</div>
                </td>
            </tr>
        </table>
    </header>

    {{-- MAIN CONTENT --}}
    <main>
        <h3 style="text-align: center; font-size: 13px; margin: 10px 0; font-weight: 700;">1. DATA PERUSAHAAN</h3>
        
        <table border="1" style="border-collapse: collapse; width: 100%; font-size: 11px;">
            <tbody>
                <tr>
                    <td width="40%" style="padding: 5px; vertical-align: top;">Kriteria CSMS</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['criteria'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">CCOW</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['ccow'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Nama Perusahaan Kontraktor</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['company_name'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Singkatan Nama Perusahaan (Maks 5 huruf)</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['company_nickname'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Kriteria Jasa Perusahaan</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['business_entity'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Perusahaan Induk</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['company_parent'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Alamat Perusahaan</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['address'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Nomor Ijin Usaha Jasa</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['license_number'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Bidang Jasa/Pekerjaan</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['service_criteria'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Lingkup Usaha/Jasa</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['scope_of_business'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Periode Kontrak</td>
                    <td style="padding: 5px; vertical-align: top;">
                        {{ $data['date_contract_period_start'] ?? '-' }} s/d {{ $data['date_contract_period_end'] ?? '-' }}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Jumlah Pekerja</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_workers'] ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <h3 style="text-align: center; font-size: 13px; margin: 20px 0 10px; font-weight: 700;">2. PENGAWAS BERKOMPETENSI</h3>
        
        <table border="1" style="border-collapse: collapse; width: 100%; font-size: 11px;">
            <tbody>
                <tr>
                    <td width="40%" style="padding: 5px; vertical-align: top;">Pengawas Operasional Pertama (POP)</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_spv_pop'] ?? '-' }} orang</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Pengawas Operasional Madya (POM)</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_spv_pom'] ?? '-' }} orang</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Pengawas Operasional Utama (POU)</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_spv_pou'] ?? '-' }} orang</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Implementasi SMKP</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_spv_imp_smkp'] ?? '-' }} orang</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Auditor SMKP</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['number_of_spv_auditor_smkp'] ?? '-' }} orang</td>
                </tr>
            </tbody>
        </table>

        <h3 style="text-align: center; font-size: 13px; margin: 20px 0 10px; font-weight: 700;">3. DILENGKAPI OLEH</h3>
        
        <table border="1" style="border-collapse: collapse; width: 100%; font-size: 11px;">
            <tbody>
                <tr>
                    <td width="40%" style="padding: 5px; vertical-align: top;">Nama</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['equipped_name'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Jabatan</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['equipped_position'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Telepon</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['equipped_telephone'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Email</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['equipped_email'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 5px; vertical-align: top;">Tanggal Pengumpulan</td>
                    <td style="padding: 5px; vertical-align: top;">{{ $data['date'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 8px; font-size: 10px; line-height: 1.5;">
                        PT Maruwai Coal tidak akan me-review dokumen ini dan kontraktor tidak akan diundang untuk mengikuti proses selanjutnya apabila tidak ditandatangani oleh Direktur/Manajer Perusahaan. Dengan menandatangani formulir ini maka Kontraktor mengizinkan PT Maruwai Coal untuk melakukan verifikasi data dan dokumen yang diberikan. Lampirkan riwayat hidup (pengalaman kerja) dari para pekerja utama termasuk Pengawas di Lapangan, Manajer Proyek, dan Perwakilan K3LH dan Perwakilan Manajemen Perusahaan.
                    </td>
                </tr>
            </tbody>
        </table>

        {{-- Signature placeholder --}}
        <div style="margin-top: 30px; text-align: right;">
            <div style="margin-bottom: 60px; font-size: 11px;">
                Direktur/Manajer Perusahaan
            </div>
            <div style="border-bottom: 1px solid #000; width: 200px; display: inline-block; margin-bottom: 4px;"></div>
            <div style="font-size: 10px;">(Tanda Tangan & Cap Perusahaan)</div>
        </div>

    </main>

</body>
</html>
