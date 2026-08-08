<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Review Dokumen Baru</title>
    <!--[if mso]>
    <style>
        table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
        div, td {padding:0;}
        div {margin:0 !important;}
    </style>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body, table, td, div, p, a, span {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
        }
        
        a {
            text-decoration: none;
        }

        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 10px !important;
            }
            .content-card {
                padding: 24px 16px !important;
                border-radius: 12px !important;
            }
        }
    </style>
</head>

<body style="margin:0;padding:0;word-spacing:normal;background-color:#f4f6f8;">
    <div role="article" aria-roledescription="email" lang="id" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#f4f6f8;padding: 40px 0;">
        <table role="presentation" style="width:100%;border:none;border-spacing:0;">
            <tr>
                <td align="center" style="padding:0;">
                    <!--[if mso]>
                    <table role="presentation" align="center" style="width:600px;">
                    <tr>
                    <td>
                    <![endif]-->
                    
                    <table class="container" role="presentation" style="width:100%;max-width:600px;border:none;border-spacing:0;text-align:left;font-size:15px;line-height:24px;color:#334155;">
                        
                        <!-- Header Logo & Brand -->
                        <tr>
                            <td style="padding: 0 24px 24px 24px; text-align: center;">
                                <table role="presentation" style="width:100%; border:none; border-spacing:0;">
                                    <tr>
                                        <td align="center" style="padding-bottom: 8px;">
                                            <div style="width: 48px; height: 48px; border-radius: 12px; background-color: #153b73; display: inline-block; text-align: center; line-height: 48px; font-size: 24px;">
                                                📄
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: -0.01em;">
                                                {{ config('app.name') }}
                                            </h2>
                                            <span style="font-size: 12px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-top: 4px;">
                                                Document System
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content Card -->
                        <tr>
                            <td class="content-card" style="padding:40px; background-color:#ffffff; border-radius:16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                                <h1 style="margin-top:0; margin-bottom:12px; font-size:22px; line-height:30px; font-weight:700; color:#1e293b; letter-spacing:-0.02em;">
                                    {{ $header_title ?? __('global.new_document') }}
                                </h1>
                                
                                <p style="margin-top:0; margin-bottom:24px; color:#475569; font-size:15px; line-height:24px;">
                                    {{ $description_text ?? 'Berikut adalah detail informasi dokumen saat ini:' }}
                                </p>
 
                                @if(!empty($document))
                                    @php
                                        $statusNames = [
                                            '2' => 'Draft',
                                            '3' => 'Menunggu Review',
                                            '4' => 'Revisi',
                                            '5' => 'Aktif',
                                            '6' => 'Menunggu Approval',
                                            '7' => 'Expired',
                                            '8' => 'Obsolete'
                                        ];
                                        $statusColors = [
                                            '2' => ['bg' => '#f1f5f9', 'text' => '#475569'],
                                            '3' => ['bg' => '#fef3c7', 'text' => '#d97706'],
                                            '4' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
                                            '5' => ['bg' => '#dcfce7', 'text' => '#16a34a'],
                                            '6' => ['bg' => '#dbeafe', 'text' => '#2563eb'],
                                            '7' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
                                            '8' => ['bg' => '#f1f5f9', 'text' => '#475569'],
                                        ];
                                        $currStatus = (string)$document->status;
                                        $statusName = $statusNames[$currStatus] ?? 'Unknown';
                                        $colors = $statusColors[$currStatus] ?? ['bg' => '#f1f5f9', 'text' => '#475569'];
                                    @endphp

                                    <!-- DETAIL DOKUMEN Section Header -->
                                    <h3 style="font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                                        Detail Dokumen
                                    </h3>

                                    <!-- Detail Table -->
                                    <table role="presentation" style="width:100%; border:none; border-spacing:0; background-color:#f8fafc; border-radius:12px; margin-bottom:28px; border: 1px solid #edf2f7; font-size: 14px;">
                                        <tr>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; width: 35%; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                No. Dokumen
                                            </td>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; font-weight: 700; color: #153b73;">
                                                {{ $document->document_number ?? 'DRAFT' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                Level Dokumen
                                            </td>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7;">
                                                <span style="font-size: 11px; font-weight: 700; background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 4px;">
                                                    {{ $document->document_level ?? '-' }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                Modul / Kategori
                                            </td>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; color: #334155; font-weight: 500;">
                                                {{ $document->mapping->category->module->name ?? '-' }} / {{ $document->mapping->category->name ?? '-' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                Mapping Target
                                            </td>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; color: #334155;">
                                                {{ $document->mapping->name ?? '-' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                Tipe Upload
                                            </td>
                                            <td style="padding: 14px 18px; border-bottom: 1px solid #edf2f7; color: #334155;">
                                                {{ $document->upload_type ?? '-' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 18px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                Status Dokumen
                                            </td>
                                            <td style="padding: 14px 18px;">
                                                <span style="font-size: 11px; font-weight: 700; background-color: {{ $colors['bg'] }}; color: {{ $colors['text'] }}; padding: 3px 10px; border-radius: 12px; border: 1px solid {{ $colors['text'] }}33;">
                                                    {{ $statusName }}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- ALUR PERSETUJUAN (APPROVAL TIMELINE) Section Header -->
                                    <h3 style="font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                                        Alur Persetujuan (Approval Timeline)
                                    </h3>

                                    <!-- Approval Timeline Table -->
                                    <table style="width:100%; border-collapse:collapse; margin-bottom:28px; border: 1px solid #edf2f7; font-size: 13px; border-radius: 8px; overflow: hidden;">
                                        <thead>
                                            <tr style="background-color: #153b73; color: #ffffff;">
                                                <th style="padding: 10px 14px; text-align: left; font-weight: 600;">Tipe Approval</th>
                                                <th style="padding: 10px 14px; text-align: left; font-weight: 600;">Nama Pemeriksa</th>
                                                <th style="padding: 10px 14px; text-align: center; font-weight: 600;">Status</th>
                                                <th style="padding: 10px 14px; text-align: center; font-weight: 600;">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Row Maker -->
                                            <tr style="border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
                                                <td style="padding: 10px 14px; color: #334155; font-weight: 500;">Pembuat Dokumen (Maker)</td>
                                                <td style="padding: 10px 14px; color: #475569;">{{ $document->owner->name ?? $document->creator->name ?? '-' }}</td>
                                                <td style="padding: 10px 14px; text-align: center;">
                                                    <span style="font-size: 10px; font-weight: 700; background-color: #dcfce7; color: #16a34a; padding: 2px 6px; border-radius: 4px;">Selesai</span>
                                                </td>
                                                <td style="padding: 10px 14px; text-align: center; color: #64748b;">
                                                    {{ $document->created_at ? $document->created_at->format('d M Y, H.i') : '-' }}
                                                </td>
                                            </tr>
                                            <!-- Row Review DC IMS (Stage 1) -->
                                            @php
                                                $stage1Status = 'Belum Mulai';
                                                $stage1Color = ['bg' => '#f1f5f9', 'text' => '#475569'];
                                                $stage1Date = '-';

                                                if ($document->status == '3') {
                                                    $stage1Status = 'Menunggu';
                                                    $stage1Color = ['bg' => '#fef3c7', 'text' => '#d97706'];
                                                } elseif (in_array($document->status, ['6', '5'])) {
                                                    $stage1Status = 'Disetujui';
                                                    $stage1Color = ['bg' => '#dcfce7', 'text' => '#16a34a'];
                                                    $stage1Date = $document->approved_at_pja ? \Carbon\Carbon::parse($document->approved_at_pja)->format('d M Y, H.i') : ($document->updated_at ? $document->updated_at->format('d M Y, H.i') : '-');
                                                } elseif ($document->status == '4') {
                                                    $stage1Status = 'Revisi';
                                                    $stage1Color = ['bg' => '#fee2e2', 'text' => '#dc2626'];
                                                    $stage1Date = $document->updated_at ? $document->updated_at->format('d M Y, H.i') : '-';
                                                }
                                            @endphp
                                            <tr style="border-bottom: 1px solid #edf2f7; background-color: #f8fafc;">
                                                <td style="padding: 10px 14px; color: #334155; font-weight: 500;">Review DC IMS (Tahap 1)</td>
                                                <td style="padding: 10px 14px; color: #475569;">Approval DC IMS</td>
                                                <td style="padding: 10px 14px; text-align: center;">
                                                    <span style="font-size: 10px; font-weight: 700; background-color: {{ $stage1Color['bg'] }}; color: {{ $stage1Color['text'] }}; padding: 2px 6px; border-radius: 4px;">
                                                        {{ $stage1Status }}
                                                    </span>
                                                </td>
                                                <td style="padding: 10px 14px; text-align: center; color: #64748b;">
                                                    {{ $stage1Date }}
                                                </td>
                                            </tr>
                                            <!-- Row Approval DC IMS (Stage 2) -->
                                            @php
                                                $stage2Status = 'Belum Mulai';
                                                $stage2Color = ['bg' => '#f1f5f9', 'text' => '#475569'];
                                                $stage2Date = '-';

                                                if ($document->status == '6') {
                                                    $stage2Status = 'Menunggu';
                                                    $stage2Color = ['bg' => '#fef3c7', 'text' => '#d97706'];
                                                } elseif ($document->status == '5') {
                                                    $stage2Status = 'Disetujui';
                                                    $stage2Color = ['bg' => '#dcfce7', 'text' => '#16a34a'];
                                                    $stage2Date = $document->approved_at_crs ? \Carbon\Carbon::parse($document->approved_at_crs)->format('d M Y, H.i') : '-';
                                                }
                                            @endphp
                                            <tr style="background-color: #ffffff;">
                                                <td style="padding: 10px 14px; color: #334155; font-weight: 500;">Approval DC IMS (Tahap 2)</td>
                                                <td style="padding: 10px 14px; color: #475569;">Approval DC IMS</td>
                                                <td style="padding: 10px 14px; text-align: center;">
                                                    <span style="font-size: 10px; font-weight: 700; background-color: {{ $stage2Color['bg'] }}; color: {{ $stage2Color['text'] }}; padding: 2px 6px; border-radius: 4px;">
                                                        {{ $stage2Status }}
                                                    </span>
                                                </td>
                                                <td style="padding: 10px 14px; text-align: center; color: #64748b;">
                                                    {{ $stage2Date }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                @else
                                     <!-- Fallback Simple Table -->
                                     <table role="presentation" style="width:100%; border:none; border-spacing:0; background-color:#f8fafc; border-radius:12px; margin-bottom:28px; border: 1px solid #edf2f7;">
                                         <tr>
                                             <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; width: 30%; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                 Judul Dokumen
                                             </td>
                                             <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; font-size: 15px; font-weight: 600; color: #1e293b;">
                                                 {{ $title }}
                                             </td>
                                         </tr>
                                         <tr>
                                             <td style="padding: 16px 20px; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em;">
                                                 Pembuat / PIC
                                             </td>
                                             <td style="padding: 16px 20px; font-size: 15px; color: #334155; font-weight: 500;">
                                                 {{ $pic }}
                                             </td>
                                         </tr>
                                     </table>
                                @endif
 
                                 <!-- CTA Buttons -->
                                 @if(!empty($action_url))
                                 <table role="presentation" style="width:100%; border:none; border-spacing:0;">
                                     <tr>
                                         <td align="center" style="padding-top:4px;">
                                             <a href="{{ $action_url }}" style="background-color: #153b73; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; line-height: 44px; text-align: center; text-decoration: none; padding: 0 24px; margin: 6px; -webkit-text-size-adjust: none; box-shadow: 0 4px 6px -1px rgba(21, 59, 115, 0.2);">
                                                 Buka Dokumen
                                             </a>
                                         </td>
                                     </tr>
                                 </table>
                                 @endif
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 24px 0 24px; text-align: center;">
                                <p style="margin: 0; font-size: 12px; line-height: 20px; color: #94a3b8; font-weight: 500;">
                                    Email ini dikirim secara otomatis oleh sistem, mohon untuk tidak membalas email ini.
                                </p>
                                <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 20px; color: #94a3b8; font-weight: 600;">
                                    © {{ date('Y') }} <a style="color: #64748b; text-decoration: underline;" href="{{ url('/') }}">{{ config('app.name') }}</a>. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                    
                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
