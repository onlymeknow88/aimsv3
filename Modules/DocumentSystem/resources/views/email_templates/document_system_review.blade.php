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
                                    @lang('global.new_document')
                                </h1>
                                
                                <p style="margin-top:0; margin-bottom:24px; color:#475569; font-size:15px; line-height:24px;">
                                    Dokumen baru telah diajukan dan memerlukan tinjauan/persetujuan Anda. Berikut detail informasi dokumen tersebut:
                                </p>

                                <!-- Detail Table -->
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

                                <!-- CTA Buttons -->
                                @if(!empty($action_url))
                                <table role="presentation" style="width:100%; border:none; border-spacing:0;">
                                    <tr>
                                        <td align="center" style="padding-top:4px;">
                                            <!--[if mso]>
                                            <table role="presentation" align="center" style="border:none;border-spacing:0;">
                                            <tr>
                                            <td style="padding: 8px;">
                                            <![endif]-->
                                            <a href="{{ $action_url }}?action=approve" style="background-color: #2fbf71; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; line-height: 44px; text-align: center; text-decoration: none; padding: 0 24px; margin: 6px; -webkit-text-size-adjust: none; box-shadow: 0 4px 6px -1px rgba(47, 191, 113, 0.2);">
                                                ✓ Setujui Dokumen
                                            </a>
                                            <!--[if mso]>
                                            </td>
                                            <td style="padding: 8px;">
                                            <![endif]-->
                                            <a href="{{ $action_url }}?action=reject" style="background-color: #ef4444; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; line-height: 44px; text-align: center; text-decoration: none; padding: 0 24px; margin: 6px; -webkit-text-size-adjust: none; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);">
                                                ✕ Kembalikan Dokumen
                                            </a>
                                            <!--[if mso]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
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
