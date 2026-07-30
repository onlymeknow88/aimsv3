<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Sertifikat Pemenuhan CMS</title>
    <style>
        @page {
            size: A4;
            margin: 34mm 10mm 15mm 10mm;
        }

        * {
            box-sizing: border-box;
        }
    </style>
</head>

<body
    style="font-family: Arial, Helvetica, sans-serif;
            font-size: 10.5pt;
            color: #000;
            background: #fff;
            line-height: 1.35;">

    {{-- ── HEADER (repeat setiap halaman) ─────────────────────────────── --}}
    <div style="position: fixed; top: -29mm; left: 0; right: 0; height: 30mm;">
        <table border="0" width="100%" style="width: 100%; border-collapse: collapse; height: 100%;">
            <tr>
                <td width="20%"
                    style="width: 20%; border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle;">
                    <img src="{{ public_path('images/Alamtri Geo Logo - Full Color.png') }}"
                        style="max-width: 100%; max-height: 22mm;" alt="Alamtri Geo Logo" />
                </td>
                <td width="50%"
                    style="width: 50%; border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; font-size: 15px; font-weight: 700; letter-spacing: 1px;">
                    SERTIFIKAT PEMENUHAN CSMS
                </td>
                <td width="30%"
                    style="width: 30%; border: 1px solid #000; padding: 6px; font-size: 10px; vertical-align: top;">
                    <table border="0" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 1px 2px; width: 45%;">No. Dokumen</td>
                            <td style="padding: 1px 2px;">: {{ $data['doc_template_number'] ?? 'F-MAC-IMS-08-006' }}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 1px 2px;">No. Revisi</td>
                            <td style="padding: 1px 2px;">: {{ $data['document_revision'] ?? '4.0' }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px 2px;">Tanggal</td>
                            <td style="padding: 1px 2px;">: {{ $data['document_template_date'] ?? '01-06-2025' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── JUDUL & METADATA ─────────────────────────────────────────────── --}}
    <h1 style="text-align:center; font-weight:bold; font-size:12pt; margin:0 0 10px 0;">
        {{ strtoupper($data['issuing_company'] ?? 'PT. MARUWAI COAL') }}</h1>

    <div style="margin:2px 0;"><span style="display:inline-block; width:130px;">Nomor</span>:
        {{ $data['document_number'] ?? '-' }}</div>
    <div style="margin:2px 0;"><span style="display:inline-block; width:130px;">Tanggal</span>:
        {{ $data['document_date'] ?? '-' }}</div>
    <div style="margin:2px 0;"><span style="display:inline-block; width:130px;">Berlaku s/d tanggal</span>:
        {{ $data['document_date_end'] ?? '-' }}</div>

    <div style="margin-top:8px;">

        {{-- Memperhatikan --}}
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:150px; vertical-align:top; padding:2px 4px;">Memperhatikan</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">
                    Surat Permohonan {{ $data['company_name'] ?? '-' }}<br>
                    Nomor: {{ $data['application_letter_number'] ?? '-' }}<br>
                    Tanggal: {{ $data['application_letter_date'] ?? '-' }}<br>
                    Tentang Permohonan Pemenuhan CMS
                </td>
            </tr>
        </table>

        {{-- Mengingat --}}
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:150px; vertical-align:top; padding:2px 4px;">Mengingat</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">Prosedur
                    No.{{ $data['procedure_number'] ?? 'MAC-IMS-08' }} tentang Pengelolaan KPLH Kontraktor</td>
            </tr>
        </table>

        <div style="text-align:center; font-weight:bold; font-size:12pt; margin:8px 0;">MEMUTUSKAN</div>

        {{-- 1. Nama Perusahaan --}}
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:26px; font-weight:bold; vertical-align:top; padding:2px 4px;">1.</td>
                <td style="width:200px; font-weight:bold; vertical-align:top; padding:2px 4px;">Nama Perusahaan</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;"><strong>{{ $data['company_name'] ?? '-' }}</strong>
                </td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Alamat</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['company_address'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">No.Telp/Fax/Email</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['company_phone'] ?? '-' }}</td>
            </tr>
        </table>

        {{-- 2. Profil PJO --}}
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:26px; font-weight:bold; vertical-align:top; padding:2px 4px;">2.</td>
                <td style="font-weight:bold; vertical-align:top; padding:2px 4px;" colspan="3">Profil PJO</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Nama PJO</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['pjo_name'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Kompetensi PJO</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['pjo_competence'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Nomor Sertifikat</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['pjo_cert_number'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Masa Berlaku Sertifikat</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['pjo_cert_expiry'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Nomor Telepon PJO</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['pjo_phone_email'] ?? '-' }}</td>
            </tr>
        </table>

        {{-- 3. Bidang Usaha Mitra Kerja --}}
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:26px; font-weight:bold; vertical-align:top; padding:2px 4px;">3.</td>
                <td style="font-weight:bold; vertical-align:top; padding:2px 4px;" colspan="3">Bidang Usaha Mitra
                    Kerja</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">No. Ijin Usaha</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">
                    {{ $data['nib_number'] ?? '-' }} (NIB)<br>
                    {{ $data['iujp_number'] ?? '-' }} (IUJP)
                </td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Tanggal Terbit</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['license_start_date'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="width:200px; vertical-align:top; padding:2px 4px;">Tanggal Berakhir</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">{{ $data['license_end_date'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="vertical-align:top; padding:2px 4px;" colspan="3">
                    Keterangan Bidang Usaha Mitra Kerja :
                    <table style="width:100%; border-collapse:collapse; margin:4px 0;">
                        <thead>
                            <tr>
                                <th style="width:8%; border:1px solid #000; padding:2px 4px; font-size:8pt; text-align:center; background:#f2f2f2;">No. KBLI</th>
                                <th style="width:20%; border:1px solid #000; padding:2px 4px; font-size:8pt; text-align:center; background:#f2f2f2;">Jenis Usaha</th>
                                <th style="width:16%; border:1px solid #000; padding:2px 4px; font-size:8pt; text-align:center; background:#f2f2f2;">Bidang Usaha/Sifat Usaha</th>
                                <th style="width:46%; border:1px solid #000; padding:2px 4px; font-size:8pt; text-align:center; background:#f2f2f2;">Sub Bidang/Sub Klasifikasi</th>
                                <th style="width:10%; border:1px solid #000; padding:2px 4px; font-size:8pt; text-align:center; background:#f2f2f2;">Risiko</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!empty($data['business_fields']) && count($data['business_fields']) > 0)
                                @php
                                    $fields = $data['business_fields'];
                                    $count  = count($fields);
                                    $firstKbli      = $fields[0]['kbli'] ?? '-';
                                    $firstJenis     = $fields[0]['jenis_usaha'] ?? '-';
                                    $allSameKbli    = collect($fields)->every(fn($f) => ($f['kbli'] ?? '-') === $firstKbli);
                                    $allSameJenis   = collect($fields)->every(fn($f) => ($f['jenis_usaha'] ?? '-') === $firstJenis);
                                @endphp
                                @foreach ($fields as $i => $field)
                                    <tr>
                                        @if ($i === 0 && $allSameKbli && $count > 1)
                                            <td rowspan="{{ $count }}" style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:middle; text-align:center;">{{ $firstKbli }}</td>
                                        @elseif (!$allSameKbli)
                                            <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $field['kbli'] ?? '-' }}</td>
                                        @endif
                                        @if ($i === 0 && $allSameJenis && $count > 1)
                                            <td rowspan="{{ $count }}" style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:middle;">{{ $firstJenis }}</td>
                                        @elseif (!$allSameJenis)
                                            <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">{{ $field['jenis_usaha'] ?? '-' }}</td>
                                        @endif
                                        <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">{{ $field['bidang_usaha'] ?? '-' }}</td>
                                        <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">
                                            @if (is_array($field['sub_bidang_list'] ?? null))
                                                <ul style="margin:0; padding-left:14px;">
                                                    @foreach ($field['sub_bidang_list'] as $sub)
                                                        <li style="margin-bottom:1px; font-size:8pt;">{{ $sub }}</li>
                                                    @endforeach
                                                </ul>
                                            @else
                                                {!! nl2br(e($field['sub_bidang'] ?? '-')) !!}
                                            @endif
                                        </td>
                                        <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $field['risiko'] ?? '-' }}</td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td rowspan="4" style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:middle; text-align:center;">{{ $data['kbli_code'] ?? '-' }}</td>
                                    <td rowspan="4" style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:middle;">{{ $data['business_type'] ?? '-' }}</td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">Penambangan</td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">
                                        <ul style="margin:0; padding-left:14px;">
                                            <li style="margin-bottom:1px;">Pembukaan lahan</li>
                                            <li style="margin-bottom:1px;">Pengupasan, pemuatan dan pemindahan tanah/batuan penutup</li>
                                            <li style="margin-bottom:1px;">Pemberaian/pembongkaran tanah/batuan penutup dengan didahului peledakan</li>
                                            <li style="margin-bottom:1px;">Penggalian batubara</li>
                                        </ul>
                                    </td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">Pengangkutan</td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;"><ul style="margin:0; padding-left:14px;"><li>Menggunakan truk</li></ul></td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">Konstruksi Pertambangan</td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">
                                        <ul style="margin:0; padding-left:14px;">
                                            <li style="margin-bottom:1px;">Jalan tambang</li>
                                            <li style="margin-bottom:1px;">Fasilitas perbengkelan</li>
                                            <li style="margin-bottom:1px;">Pemboran dan Peledakan</li>
                                            <li style="margin-bottom:1px;">Sistem Penyaliran</li>
                                        </ul>
                                    </td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;">Lingkungan Pertambangan</td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top;"><ul style="margin:0; padding-left:14px;"><li>Pengendalian erosi</li></ul></td>
                                    <td style="border:1px solid #000; padding:2px 4px; font-size:8pt; vertical-align:top; text-align:center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>

        {{-- 4. Kegiatan Mitra Kerja --}}
        @php $cat = $data['company_category'] ?? 'PJP Utama'; @endphp
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:26px; font-weight:bold; vertical-align:top; padding:2px 4px;">4.</td>
                <td style="font-weight:bold; vertical-align:top; padding:2px 4px;" colspan="3">Kegiatan Mitra Kerja
                    Sesuai dengan Kontrak Kerja</td>
            </tr>

            {{-- a. Kategori Perusahaan --}}
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="vertical-align:top; padding:2px 4px;" colspan="3">
                    a. Kategori Perusahaan :
                    <table style="width:100%; border-collapse:collapse; margin:4px 0;">
                        <tr>
                            <td style="border:1px solid #000; padding:4px 8px; width:25%;">
                                <span style="font-weight:bold; margin-right:4px;">{!! $cat == 'Kontraktor Utama' ? '[ v ]' : '[&nbsp;&nbsp;]' !!}</span>
                                : <strong>PJP Utama</strong>
                            </td>
                            <td style="border:1px solid #000; padding:4px 8px; width:25%;">
                                <span style="font-weight:bold; margin-right:4px;">{!! $cat == 'Kontraktor Langsung' ? '[ v ]' : '[&nbsp;&nbsp;]' !!}</span>
                                : <strong>PJP Langsung</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #000; padding:4px 8px; width:25%;">
                                <span style="font-weight:bold; margin-right:4px;">{!! $cat == 'Subkontraktor Tunggal' ? '[ v ]' : '[&nbsp;&nbsp;]' !!}</span>
                                : <strong>PJP Tunggal</strong>
                            </td>
                            <td style="border:1px solid #000; padding:4px 8px; width:25%;">
                                <span style="font-weight:bold; margin-right:4px;">{!! $cat == 'Kontraktor Bersama' ? '[ v ]' : '[&nbsp;&nbsp;]' !!}</span>
                                : <strong>PJP Bersama</strong>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            {{-- b. Kontrak Owner/User --}}
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="vertical-align:top; padding:2px 4px;" colspan="3">
                    b. Kontrak Owner/User :
                    <table style="width:100%; border-collapse:collapse; margin:4px 0;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Tingkatan Perusahaan</th>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Dept {{ $data['issuing_company'] ?? '' }}</th>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Kontraktor</th>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Sub Kontraktor</th>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Sub-Sub Kontraktor</th>
                                <th style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">Sub-Sub-Sub Kontraktor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['contract_level'] ?? '' }}</td>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['owner_dept'] ?? '' }}</td>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['issuing_company'] ?? '-' }}</td>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['contractor_name'] ?? ($data['company_name'] ?? '-') }}</td>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['sub_contractor'] ?? '-' }}</td>
                                <td style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center;">{{ $data['sub_sub_contractor'] ?? '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            {{-- c. Jenis Kegiatan --}}
            <tr>
                <td style="width:26px; padding:2px 4px;"></td>
                <td style="vertical-align:top; padding:2px 4px;" colspan="3">
                    c. Jenis Kegiatan :
                    <table style="width:100%; border-collapse:collapse; margin:4px 0;">
                        <thead>
                            <tr>
                                <th
                                    style="width:30%; border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">
                                    Kontrak Owner/User</th>
                                <th
                                    style="width:70%; border:1px solid #000; padding:5px 6px; font-size:9.5pt; text-align:center; background:#f2f2f2;">
                                    Jenis Kegiatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; vertical-align:top; text-align:left;">
                                    {{ $data['issuing_company'] ?? '-' }}</td>
                                <td
                                    style="border:1px solid #000; padding:5px 6px; font-size:9.5pt; vertical-align:top; text-align:left;">
                                    <p style="margin:3px 0;">Jasa pekerjaan :</p>
                                    @php $activitiesList = $data['activities_list'] ?? "a. Pengupasan dan Pemindahan Top Soil dan Lapisan Tanah Penutup (Overburden)\nb. Penggalian Batubara (Coal getting)\nc. Pengangkutan Batubara\nd. Coal Handling\ne. Reject Coal Handling (Reject removal)"; @endphp
                                    {!! nl2br(e($activitiesList)) !!}
                                    <p style="margin:3px 0;"><strong>Kontrak :
                                            {{ $data['owner_contract_info'] ?? '-' }}</strong></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>

        {{-- Keterangan --}}
        <div style="font-weight:bold; text-align:center; margin:6px 0;">Keterangan</div>
        <table style="width:100%; border-collapse:collapse; margin:3px 0;">
            <tr>
                <td style="width:150px; vertical-align:top; padding:2px 4px;">Pertama</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">Memberikan Izin Untuk Bekerja di Lokasi Kerja PKP2B
                    {{ $data['issuing_company'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="width:150px; vertical-align:top; padding:2px 4px;">Kedua</td>
                <td style="width:16px; vertical-align:top; padding:2px 0;">:</td>
                <td style="vertical-align:top; padding:2px 4px;">
                    Sertifikat pemenuhan dokumen CMS ini berlaku selama
                    {{ $data['validity_period'] ?? '3 (tiga) tahun' }}. Apabila ternyata terdapat kekeliruan dalam
                    pemberian Surat Pemenuhan CMS ini kemudian hari, akan diadakan peninjauan dan/atau pembetulan
                    sebagaimana mestinya.
                </td>
            </tr>
        </table>

    </div>

    {{-- ── TANDA TANGAN ─────────────────────────────────────────────────── --}}
    <div style="width: 25%; text-align: center; margin-top: 30px;">
        <div style="font-weight: 700; margin-bottom: 4px; font-size: 12px;">{{ $data['issuing_company'] }}</div>
        <div style="margin: 8px 0;">
            <img src="{{ $data['qrcode'] }}" style="height: 130px; width: 130px;" alt="QR Code" />
        </div>
        <div style="font-weight: 700; text-decoration: underline; font-size: 12px;">{{ $data['ktt_name'] }}</div>
        <div style="font-size: 11px; margin-top: 2px;">{{ $data['ktt_position'] }}</div>
    </div>

    <div
        style="margin-top:30px; border-top:1px solid #999; padding-top:4px; font-size:8pt; text-align:center; color:#333;">
        Dokumen ini sah, diterbitkan secara elektronik oleh CRS Section &ndash; OHS Dept
        {{ $data['issuing_company'] ?? 'PT. MARUWAI COAL' }}
    </div>

</body>

</html>
