<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sertifikat Pemenuhan CMS</title>
    <style>
        @page { size: A4; margin: 15mm 10mm; }
        * { box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; color: #000; background: #fff; line-height: 1.35; }
        h1.doc-title { text-align: center; font-weight: bold; font-size: 12pt; margin: 10px 0 6px 0; }
        table.main-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        table.main-table > tbody > tr > td { border: 1px solid #000; padding: 5px 7px; vertical-align: top; }
        .col-label  { width: 12%; }
        .col-colon  { width: 1.5%; text-align: center; }
        .col-field  { width: 24%; }
        .col-colon2 { width: 1.5%; text-align: center; }
        .col-value  { width: 61%; }
        .memutuskan-row { text-align: center; font-weight: bold; font-size: 12pt; }
        .section-num   { font-weight: bold; vertical-align: top; }
        .section-title { font-weight: bold; }
        .keterangan-header { font-weight: bold; text-align: center; }
        table.sub-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        table.sub-table th, table.sub-table td { border: 1px solid #000; padding: 4px 6px; font-size: 9.5pt; vertical-align: top; text-align: left; }
        table.sub-table th { text-align: center; background: #f2f2f2; }
        table.sub-table ul { margin: 0; padding-left: 16px; }
        table.sub-table li { margin-bottom: 3px; }
        table.kategori-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        table.kategori-table td { border: 1px solid #000; padding: 4px 8px; width: 25%; }
        table.owner-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        table.owner-table th, table.owner-table td { border: 1px solid #000; padding: 5px 6px; font-size: 9.5pt; text-align: center; }
        table.owner-table th { background: #f2f2f2; }
        table.jenis-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
        table.jenis-table th, table.jenis-table td { border: 1px solid #000; padding: 5px 6px; font-size: 9.5pt; text-align: left; vertical-align: top; }
        table.jenis-table th { text-align: center; background: #f2f2f2; }
        table.jenis-table p { margin: 3px 0; }
        .signature-block { margin-top: 26px; text-align: center; }
        .signature-block .company { font-weight: bold; margin-bottom: 50px; }
        .signature-block .name { font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
        .signature-block .nik { font-weight: bold; margin-bottom: 2px; }
        .footer-note { margin-top: 30px; border-top: 1px solid #999; padding-top: 4px; font-size: 8pt; text-align: center; color: #333; }
    </style>
</head>
<body>

    {{-- ── HEADER ──────────────────────────────────────────────────────── --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;">
        <tr>
            <td style="width: 16%; text-align: center; border-bottom: 1px solid #000; vertical-align: middle; padding: 4px 6px;">
                @if (!empty($data['company_logo']))
                    <img src="{{ $data['company_logo'] }}" style="max-width: 100px; height: auto;" alt="Logo" />
                @else
                    <span style="font-size: 8pt; font-weight: bold;">{{ $data['issuing_company'] ?? 'LOGO' }}</span>
                @endif
            </td>
            <td style="width: 54%; text-align: center; font-weight: bold; font-size: 13pt; border-bottom: 1px solid #000; vertical-align: middle; padding: 4px 6px;">
                SERTIFIKAT PEMENUHAN CMS
            </td>
            <td style="width: 30%; font-size: 8pt; line-height: 1.5; border-bottom: 1px solid #000; vertical-align: middle; padding: 4px 6px;">
                No. Dokumen&nbsp;&nbsp;: {{ $data['doc_template_number'] ?? 'F-MAC-IMS-08-006' }}<br>
                No. revisi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ $data['document_revision'] ?? '4.0' }}<br>
                Tanggal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ $data['document_template_date'] ?? '01-06-2025' }}
            </td>
        </tr>
    </table>

    {{-- ── JUDUL & METADATA ─────────────────────────────────────────────── --}}
    <h1 class="doc-title">{{ strtoupper($data['issuing_company'] ?? 'PT. MARUWAI COAL') }}</h1>

    <div style="margin: 2px 0;"><span style="display: inline-block; width: 130px;">Nomor</span>: {{ $data['document_number'] ?? '-' }}</div>
    <div style="margin: 2px 0;"><span style="display: inline-block; width: 130px;">Tanggal</span>: {{ $data['document_date'] ?? '-' }}</div>
    <div style="margin: 2px 0;"><span style="display: inline-block; width: 130px;">Berlaku s/d tanggal</span>: {{ $data['document_date_end'] ?? '-' }}</div>

    {{-- ── MAIN TABLE ───────────────────────────────────────────────────── --}}
    <table class="main-table">
        <tbody>

            {{-- Memperhatikan --}}
            <tr>
                <td class="col-label">Memperhatikan</td>
                <td class="col-colon">:</td>
                <td colspan="3">
                    Surat Permohonan {{ $data['company_name'] ?? '-' }}<br>
                    Nomor: {{ $data['application_letter_number'] ?? '-' }}<br>
                    Tanggal: {{ $data['application_letter_date'] ?? '-' }}<br>
                    Tentang Permohonan Pemenuhan CMS
                </td>
            </tr>

            {{-- Mengingat --}}
            <tr>
                <td class="col-label">Mengingat</td>
                <td class="col-colon">:</td>
                <td colspan="3">Prosedur No.{{ $data['procedure_number'] ?? 'MAC-IMS-08' }} tentang Pengelolaan KPLH Kontraktor</td>
            </tr>

            {{-- MEMUTUSKAN --}}
            <tr>
                <td colspan="5" class="memutuskan-row">MEMUTUSKAN</td>
            </tr>

            {{-- 1. Nama Perusahaan --}}
            <tr>
                <td class="section-num">1.</td>
                <td class="col-field section-title">Nama Perusahaan</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2"><strong>{{ $data['company_name'] ?? '-' }}</strong></td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Alamat</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2" rowspan="2">{{ $data['company_address'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">No.Telp/Fax/Email</td>
                <td class="col-colon2">:</td>
            </tr>

            {{-- 2. Profil PJO --}}
            <tr>
                <td class="section-num">2.</td>
                <td class="col-field section-title" colspan="3">Profil PJO</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Nama PJO</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['pjo_name'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Kompetensi PJO</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['pjo_competence'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Nomor Sertifikat</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['pjo_cert_number'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Masa Berlaku Sertifikat</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['pjo_cert_expiry'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Nomor Telepon PJO</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['pjo_phone_email'] ?? '-' }}</td>
            </tr>

            {{-- 3. Bidang Usaha Mitra Kerja --}}
            <tr>
                <td class="section-num">3.</td>
                <td class="col-field section-title" colspan="3">Bidang Usaha Mitra Kerja</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">No. Ijin Usaha</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">
                    {{ $data['nib_number'] ?? '-' }} (NIB)<br>
                    {{ $data['iujp_number'] ?? '-' }} (IUJP)
                </td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Tanggal Terbit</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['license_start_date'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="col-field">Tanggal Berakhir</td>
                <td class="col-colon2">:</td>
                <td class="col-value" colspan="2">{{ $data['license_end_date'] ?? '-' }}</td>
            </tr>
            <tr>
                <td></td>
                <td colspan="4">
                    Keterangan Bidang Usaha Mitra Kerja :
                    <table class="sub-table">
                        <thead>
                            <tr>
                                <th style="width: 8%;">No. KBLI</th>
                                <th style="width: 20%;">Jenis Usaha</th>
                                <th style="width: 16%;">Bidang Usaha/Sifat Usaha</th>
                                <th style="width: 46%;">Sub Bidang/Sub Klasifikasi</th>
                                <th style="width: 10%;">Risiko</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (!empty($data['business_fields']) && count($data['business_fields']) > 0)
                                @foreach ($data['business_fields'] as $field)
                                    <tr>
                                        <td style="text-align: center;">{{ $field['kbli'] ?? '-' }}</td>
                                        <td>{{ $field['jenis_usaha'] ?? '-' }}</td>
                                        <td>{{ $field['bidang_usaha'] ?? '-' }}</td>
                                        <td>
                                            @if (is_array($field['sub_bidang_list'] ?? null))
                                                <ul>
                                                    @foreach ($field['sub_bidang_list'] as $sub)
                                                        <li>{{ $sub }}</li>
                                                    @endforeach
                                                </ul>
                                            @else
                                                {!! nl2br(e($field['sub_bidang'] ?? '-')) !!}
                                            @endif
                                        </td>
                                        <td style="text-align: center;">{{ $field['risiko'] ?? '-' }}</td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td rowspan="4" style="text-align: center;">{{ $data['kbli_code'] ?? '-' }}</td>
                                    <td rowspan="4">{{ $data['business_type'] ?? '-' }}</td>
                                    <td>Penambangan</td>
                                    <td>
                                        <ul>
                                            <li>Pembukaan lahan</li>
                                            <li>Pengupasan, pemuatan dan pemindahan tanah/batuan penutup</li>
                                            <li>Pemberaian/pembongkaran tanah/batuan penutup dengan didahului peledakan</li>
                                            <li>penggalian batubara</li>
                                        </ul>
                                    </td>
                                    <td style="text-align: center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td>Pengangkutan</td>
                                    <td><ul><li>Menggunakan truk</li></ul></td>
                                    <td style="text-align: center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td>Konstruksi Pertambangan</td>
                                    <td>
                                        <ul>
                                            <li>Jalan tambang</li>
                                            <li>Fasilitas perbengkelan</li>
                                            <li>Pemboran dan Peledakan</li>
                                            <li>Sistem Penyaliran</li>
                                        </ul>
                                    </td>
                                    <td style="text-align: center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                                <tr>
                                    <td>Lingkungan Pertambangan</td>
                                    <td><ul><li>Pengendalian erosi</li></ul></td>
                                    <td style="text-align: center;">{{ $data['risk_category'] ?? 'Tinggi' }}</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </td>
            </tr>

            {{-- 4. Kegiatan Mitra Kerja --}}
            <tr>
                <td class="section-num">4.</td>
                <td class="col-field section-title" colspan="3">Kegiatan Mitra Kerja Sesuai dengan Kontrak Kerja</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td colspan="4">
                    @php $cat = $data['company_category'] ?? 'PJP Utama'; @endphp
                    a. Kategori Perusahaan :
                    <table class="kategori-table">
                        <tr>
                            <td><span style="font-weight: bold; margin-right: 4px;">{{ $cat == 'PJP Utama' ? '&#10003;' : '' }}</span> : <strong>PJP Utama</strong></td>
                            <td><span style="font-weight: bold; margin-right: 4px;">{{ $cat == 'PJP Langsung' ? '&#10003;' : '' }}</span> : <strong>PJP Langsung</strong></td>
                        </tr>
                        <tr>
                            <td><span style="font-weight: bold; margin-right: 4px;">{{ $cat == 'PJP Tunggal' ? '&#10003;' : '' }}</span> : <strong>PJP Tunggal</strong></td>
                            <td><span style="font-weight: bold; margin-right: 4px;">{{ $cat == 'PJP Bersama' ? '&#10003;' : '' }}</span> : <strong>PJP Bersama</strong></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td></td>
                <td colspan="4">
                    b. Kontrak Owner/User :
                    <table class="owner-table">
                        <thead>
                            <tr>
                                <th>Tingkatan</th>
                                <th>Dept PT Kontraktor</th>
                                <th>Sub Kontraktor</th>
                                <th>Sub-Sub Kontraktor</th>
                                <th>Sub-Sub-Sub Kontraktor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ $data['contract_level'] ?? 'PJP Tingkat 1' }}</td>
                                <td>{{ $data['owner_dept'] ?? 'Mining Engineering Dept' }}</td>
                                <td>{{ $data['contractor_name'] ?? ($data['company_name'] ?? '-') }}</td>
                                <td>{{ $data['sub_contractor'] ?? '-' }}</td>
                                <td>{{ $data['sub_sub_contractor'] ?? '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td></td>
                <td colspan="4">
                    c. Jenis Kegiatan :
                    <table class="jenis-table">
                        <thead>
                            <tr>
                                <th style="width: 30%;">Kontrak Owner/User</th>
                                <th style="width: 70%;">Jenis Kegiatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ $data['issuing_company'] ?? '-' }}</td>
                                <td>
                                    <p>Jasa pekerjaan :</p>
                                    {!! nl2br(e($data['activities_list'] ?? "a. Pengupasan dan Pemindahan Top Soil dan Lapisan Tanah Penutup (Overburden)\nb. Penggalian Batubara (Coal getting)\nc. Pengangkutan Batubara\nd. Coal Handling\ne. Reject Coal Handling (Reject removal)")) !!}
                                    <p><strong>Kontrak : {{ $data['owner_contract_info'] ?? '-' }}</strong></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            {{-- Keterangan --}}
            <tr>
                <td colspan="5" class="keterangan-header">Keterangan</td>
            </tr>
            <tr>
                <td class="col-label">Pertama</td>
                <td class="col-colon">:</td>
                <td colspan="3">Memberikan Izin Untuk Bekerja di Lokasi Kerja PKP2B {{ $data['issuing_company'] ?? '-' }}</td>
            </tr>
            <tr>
                <td class="col-label">Kedua</td>
                <td class="col-colon">:</td>
                <td colspan="3">
                    Sertifikat pemenuhan dokumen CMS ini berlaku selama {{ $data['validity_period'] ?? '3 (tiga) tahun' }}. Apabila ternyata terdapat kekeliruan dalam pemberian Surat Pemenuhan CMS ini kemudian hari, akan diadakan peninjauan dan/atau pembetulan sebagaimana mestinya.
                </td>
            </tr>

        </tbody>
    </table>

    {{-- ── TANDA TANGAN ─────────────────────────────────────────────────── --}}
    <div class="signature-block">
        @if (!empty($data['qrcode']))
            <img src="{{ $data['qrcode'] }}" style="width: 70px; height: 70px; display: block; margin: 0 auto 4px auto;" alt="QR Code" />
        @endif
        <div class="company">{{ strtoupper($data['issuing_company'] ?? 'PT. MARUWAI COAL') }}</div>
        <div class="name">{{ $data['ktt_name'] ?? '-' }}</div>
        @if (!empty($data['ktt_nik']))
            <div class="nik">NIK: {{ $data['ktt_nik'] }}</div>
        @endif
        <div class="jabatan">{{ $data['ktt_position'] ?? '-' }}</div>
    </div>

    <div class="footer-note">
        Dokumen ini sah, diterbitkan secara elektronik oleh CRS Section &ndash; OHS Dept {{ $data['issuing_company'] ?? 'PT. MARUWAI COAL' }}
    </div>

</body>
</html>
