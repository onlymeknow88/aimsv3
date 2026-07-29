<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
            @page { margin: 90px 30px 80px 30px; }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 12px; color: #000; margin: 0; padding: 0;">

        {{-- ── HEADER (repeat every page) ──────────────────────────────── --}}
        <header style="position: fixed; top: -75px; left: 0; right: 0;">
            <table border="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="20%" style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle;">
                        <img src="{{ public_path('images/Alamtri Geo Logo - Full Color 1.png') }}" style="max-width: 100%; max-height: 60px;" alt="Alamtri Geo Logo" />
                    </td>
                    <td width="50%" style="border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; font-size: 15px; font-weight: 700; letter-spacing: 1px;">
                        SERTIFIKAT PEMENUHAN CSMS
                    </td>
                    <td width="30%" style="border: 1px solid #000; padding: 6px; font-size: 10px; vertical-align: top;">
                        <table border="0" style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <td style="padding: 1px 2px; width: 45%;">No. Dokumen</td>
                                <td style="padding: 1px 2px;">: {{ $data['document_number'] }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 1px 2px;">No. Revisi</td>
                                <td style="padding: 1px 2px;">: {{ $data['document_revision'] }}</td>
                            </tr>
                            <tr>
                                <td style="padding: 1px 2px;">Tanggal</td>
                                <td style="padding: 1px 2px;">: {{ $data['document_date'] }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </header>

        {{-- ── FOOTER ──────────────────────────────────────────────────── --}}
        <footer style="position: fixed; bottom: -60px; left: 0; right: 0; font-size: 10px; text-align: center; border-top: 1px solid #000; padding-top: 4px; color: #333;">
            Dokumen ini sah, diterbitkan secara elektronik oleh Dept. OHS {{ $data['issuing_company'] }}.
        </footer>

        {{-- ── MAIN CONTENT ─────────────────────────────────────────────── --}}
        <main>

            {{-- CCOW Name as issuing entity --}}
            <div style="margin-bottom: 12px;">
                <div style="font-size: 14px; font-weight: 700;">{{ $data['ccow'] }}</div>
            </div>

            {{-- Document metadata --}}
            <table border="0" style="border-collapse: collapse; width: 60%; margin-bottom: 6px;">
                <tbody>
                    <tr>
                        <td style="padding: 2px 4px; width: 35%;">Nomor</td>
                        <td style="padding: 2px 4px; width: 4%;">:</td>
                        <td style="padding: 2px 4px;">{{ $data['document_number'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;">Tanggal</td>
                        <td style="padding: 2px 4px;">:</td>
                        <td style="padding: 2px 4px;">{{ $data['document_date'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;">Berlaku s/d tanggal</td>
                        <td style="padding: 2px 4px;">:</td>
                        <td style="padding: 2px 4px; font-weight: 700;">{{ $data['document_date_end'] }}</td>
                    </tr>
                </tbody>
            </table>

            {{-- Memperhatikan / Mengingat --}}
            <table border="0" style="border-collapse: collapse; width: 100%; margin-bottom: 10px;">
                <tbody>
                    <tr>
                        <td style="padding: 2px 4px; width: 28%; vertical-align: top;">Memperhatikan</td>
                        <td style="padding: 2px 4px; width: 4%; vertical-align: top;">:</td>
                        <td style="padding: 2px 4px; vertical-align: top;">{{ $data['company_name'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;">
                            <table border="0" style="border-collapse: collapse; width: 100%;">
                                <tr>
                                    <td style="padding: 1px 4px; width: 35%;">Tanggal</td>
                                    <td style="padding: 1px 4px;">: {{ $data['document_date'] }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 1px 4px;">Tentang Permohonan Pemenuhan CSMS</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px; vertical-align: top;">Mengingat</td>
                        <td style="padding: 2px 4px; vertical-align: top;">:</td>
                        <td style="padding: 2px 4px; vertical-align: top;">Prosedur No. MAC-IMS-08 tentang Pengelolaan KPLH Kontraktor</td>
                    </tr>
                </tbody>
            </table>

            {{-- Memutuskan --}}
            <div style="font-size: 13px; font-weight: 700; margin: 10px 0 6px 0;">Memutuskan</div>

            <table border="0" style="border-collapse: collapse; width: 100%;">
                <tbody>
                    <tr>
                        <td style="padding: 2px 4px; width: 4%; vertical-align: top;"></td>
                        <td style="padding: 2px 4px; width: 4%; vertical-align: top;">1.</td>
                        <td style="padding: 2px 4px; width: 38%; vertical-align: top;">Nama Perusahaan</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_name'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Alamat</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_address'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">2.</td>
                        <td style="padding: 2px 4px; vertical-align: top;">Bidang Usaha Mitra Kerja</td>
                        <td style="padding: 2px 4px;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Keterangan Bidang</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_business_entity'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Usaha Mitra Kerja</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_business_entity'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">No. Ijin Usaha</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_license_number'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Tanggal Terbit</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_license_date_start'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Tanggal Berakhir</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_license_date_end'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">3.</td>
                        <td style="padding: 2px 4px; vertical-align: top;">Kegiatan Mitra Kerja Sesuai dengan Kontrak Kerja</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_license_suitability'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Jenis Kegiatan</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_service_criteria'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">4.</td>
                        <td style="padding: 2px 4px; vertical-align: top;">Nama PJO</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_pjo_name'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px;"></td>
                        <td style="padding: 2px 4px; vertical-align: top;">Nomor Telepon PJO</td>
                        <td style="padding: 2px 4px; vertical-align: top;">: {{ $data['company_pjo_phone'] }}</td>
                    </tr>
                    {{-- Keputusan --}}
                    <tr>
                        <td colspan="4" style="padding: 4px 4px 2px;"></td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">Pertama</td>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">:</td>
                        <td colspan="2" style="padding: 3px 4px; vertical-align: top;">Memberikan Izin Untuk Bekerja di Lokasi Kerja PKP2B PT. Maruwai Coal</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">Kedua</td>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">:</td>
                        <td colspan="2" style="padding: 3px 4px; vertical-align: top;">Sertifikat Pemenuhan CSMS berlaku selama 2 (dua) tahun terhitung sejak tanggal diterbitkan</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">Ketiga</td>
                        <td style="padding: 3px 4px; vertical-align: top; font-weight: 700;">:</td>
                        <td colspan="2" style="padding: 3px 4px; vertical-align: top;">Apabila ternyata terdapat kekeliruan dalam pemberian Surat Pemenuhan CSMS ini dikemudian hari, akan diadakan peninjauan dan/atau pembetulan sebagaimana mestinya.</td>
                    </tr>
                </tbody>
            </table>

            {{-- Tanda Tangan --}}
            <div style="width: 25%; text-align: center; margin-top: 30px;">
                <div style="font-weight: 700; margin-bottom: 4px; font-size: 12px;">{{ $data['issuing_company'] }}</div>
                <div style="margin: 8px 0;">
                    <img src="{{ $data['qrcode'] }}" style="height: 130px; width: 130px;" alt="QR Code" />
                </div>
                <div style="font-weight: 700; text-decoration: underline; font-size: 12px;">{{ $data['ktt_name'] }}</div>
                <div style="font-size: 11px; margin-top: 2px;">{{ $data['ktt_position'] }}</div>
            </div>

        </main>
    </body>
</html>
