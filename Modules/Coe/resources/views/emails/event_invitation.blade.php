<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Undangan Acara Baru - Calendar of Events</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
        <h2 style="color: #153B73; border-bottom: 2px solid #153B73; padding-bottom: 8px; margin-top: 0;">Undangan Acara Baru (Calendar of Events)</h2>
        <p>Halo,</p>
        <p>Anda diundang untuk menghadiri acara berikut yang terdaftar di sistem AIMS:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">Judul Acara:</td>
                <td style="padding: 8px 0; color: #555;">{{ $event->title }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Tanggal Mulai:</td>
                <td style="padding: 8px 0; color: #555;">{{ date('d F Y H:i', strtotime($event->start_date)) }}</td>
            </tr>
            @if($event->end_date)
            <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Tanggal Selesai:</td>
                <td style="padding: 8px 0; color: #555;">{{ date('d F Y H:i', strtotime($event->end_date)) }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Status:</td>
                <td style="padding: 8px 0; color: #555;">
                    <span style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #374151;">
                        {{ $event->status }}
                    </span>
                </td>
            </tr>
            @if($event->description)
            <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Deskripsi:</td>
                <td style="padding: 8px 0; color: #555; white-space: pre-line;">{!! nl2br(e($event->description)) !!}</td>
            </tr>
            @endif
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
            Pesan otomatis dari Sistem AIMS. Mohon tidak membalas email ini.
        </div>
    </div>
</body>
</html>
