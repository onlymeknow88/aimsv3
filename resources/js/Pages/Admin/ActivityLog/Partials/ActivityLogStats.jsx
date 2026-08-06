import React from 'react';

export default function ActivityLogStats({ stats }) {
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
                    Total Aktivitas (Hari Ini)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
                        {stats.total_today}
                    </span>
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>tindakan</span>
                </div>
            </div>

            <div style={cardStyle}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tindakan Hapus (Hari Ini)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: stats.deletes_today > 0 ? '#ef4444' : '#0f172a' }}>
                        {stats.deletes_today}
                    </span>
                    <span style={{ fontSize: '12px', color: stats.deletes_today > 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>hapus</span>
                </div>
            </div>

            <div style={cardStyle}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Admin Paling Aktif (Hari Ini)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    {stats.most_active_admin ? (
                        <>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1e4ed8' }} title={stats.most_active_admin.email}>
                                {stats.most_active_admin.name}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                                ({stats.most_active_admin.count} aksi)
                            </span>
                        </>
                    ) : (
                        <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 600 }}>
                            Belum ada aktivitas
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
