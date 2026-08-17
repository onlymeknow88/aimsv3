<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi Baru Menunggu Persetujuan</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f6;
        }
        .header {
            background-color: #10233F;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #94a3b8;
            margin: 5px 0 0 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1e293b;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .user-details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .detail-row {
            margin-bottom: 10px;
            font-size: 14px;
        }
        .detail-row:last-child {
            margin-bottom: 0;
        }
        .detail-label {
            font-weight: bold;
            color: #64748b;
            width: 120px;
            display: inline-block;
        }
        .detail-value {
            color: #334155;
        }
        .actions {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px 10px 10px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            text-decoration: none;
            text-align: center;
        }
        .btn-approve {
            background-color: #153B73;
            color: #ffffff !important;
        }
        .btn-reject {
            background-color: #ef4444;
            color: #ffffff !important;
            border: 1px solid #ef4444;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 12px;
        }
        .note {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 25px;
            text-align: center;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AIMS</h1>
            <p>Integrated Management System</p>
        </div>
        <div class="content">
            <h2>Registrasi Akun Baru Menunggu Persetujuan</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Halo Administrator,<br><br>
                Seorang pengguna baru telah mendaftar ke portal AIMS. Pendaftaran ini memerlukan verifikasi dan persetujuan Anda sebelum pengguna dapat masuk ke sistem.
            </p>
            
            <div class="user-details">
                <div class="detail-row">
                    <span class="detail-label">Nama Lengkap:</span>
                    <span class="detail-value">{{ $user->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Alamat Email:</span>
                    <span class="detail-value">{{ $user->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tanggal Daftar:</span>
                    <span class="detail-value">{{ $user->created_at->format('d M Y, H:i') }} WIB</span>
                </div>
            </div>

            <p style="color: #475569; font-size: 14px; text-align: center; font-weight: bold; margin-bottom: 20px;">
                Silakan pilih tindakan di bawah ini:
            </p>

            <div class="actions">
                <a href="{{ $approveUrl }}" class="btn btn-approve">Setujui & Aktifkan</a>
                <a href="{{ $rejectUrl }}" class="btn btn-reject">Tolak Pendaftaran</a>
            </div>

            <p class="note">
                Tautan persetujuan ini aman (signed URL) dan berlaku selama 72 jam.<br>
                Setelah Anda memilih tindakan, pengguna akan secara otomatis menerima notifikasi email.
            </p>
        </div>
        <div class="footer">
            &copy; 2026 AIMS Integrated Management System. All rights reserved.
        </div>
    </div>
</body>
</html>
