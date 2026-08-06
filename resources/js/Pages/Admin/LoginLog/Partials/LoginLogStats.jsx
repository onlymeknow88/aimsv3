import React from 'react';

export default function LoginLogStats({ stats }) {
    const cardStyle = {
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: '1',
        minWidth: '220px',
    };

    return (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={cardStyle}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Login Berhasil (Hari Ini)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
                        {stats.success_today}
                    </span>
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>sukses</span>
                </div>
            </div>

            <div style={cardStyle}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Percobaan Gagal (Hari Ini)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: stats.failed_today > 0 ? '#ef4444' : '#0f172a' }}>
                        {stats.failed_today}
                    </span>
                    <span style={{ fontSize: '12px', color: stats.failed_today > 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>gagal</span>
                </div>
            </div>

            <div style={cardStyle}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Pengguna Aktif (24 Jam)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e4ed8' }}>
                        {stats.active_users_24h}
                    </span>
                    <span style={{ fontSize: '12px', color: '#1e4ed8', fontWeight: 600 }}>pengguna</span>
                </div>
            </div>
        </div>
    );
}
