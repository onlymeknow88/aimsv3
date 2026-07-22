import React, { useEffect, useState } from 'react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import { FileText, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

const statCardStyle = (color) => ({
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
});

const iconBox = (bg) => ({
    width: '44px', height: '44px', borderRadius: '10px',
    backgroundColor: bg, display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
});

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/csms/biddings?limit=1')
            .then(r => r.json())
            .then(d => setStats(d?.data ?? null))
            .catch(() => {});
    }, []);

    const cards = [
        { label: 'Total Bidding',   value: '-', icon: <FileText size={20} color="#fff" />,    bg: 'var(--primary)' },
        { label: 'Approved',        value: '-', icon: <CheckCircle size={20} color="#fff" />,  bg: 'var(--success)' },
        { label: 'On Review',       value: '-', icon: <Clock size={20} color="#fff" />,        bg: 'var(--accent)' },
        { label: 'Draft',           value: '-', icon: <XCircle size={20} color="#fff" />,      bg: 'var(--text-secondary)' },
        { label: 'Renewal',         value: '-', icon: <RefreshCw size={20} color="#fff" />,    bg: 'var(--info)' },
    ];

    return (
        <CSMSLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Dashboard CSMS
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Contractor Safety Management System â€” Ringkasan kelayakan K3 kontraktor
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {cards.map((c, i) => (
                        <div key={i} style={statCardStyle(c.bg)}>
                            <div style={iconBox(c.bg)}>{c.icon}</div>
                            <div>
                                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.value}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info card */}
                <div style={{
                    backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                    borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                        Alur Kerja CSMS
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                        Proses dimulai dari <strong>Bidding</strong> â†’ Review OHS â†’ Review D/H OHS â†’ Review KTT â†’ <strong>Approved</strong>.
                        Setelah disetujui, kontraktor memasuki tahap <strong>Post-Bidding</strong> untuk penerbitan sertifikat CSMS.
                        Perpanjangan sertifikat dilakukan melalui proses <strong>Renewal</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {['Draft','On Review OHS','On Review D/H OHS','On Review KTT','Approved'].map((s, i) => (
                            <span key={i} style={{
                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                                backgroundColor: s === 'Approved' ? 'rgba(47,191,113,0.1)' : 'rgba(21,59,115,0.08)',
                                color: s === 'Approved' ? 'var(--success)' : 'var(--primary)',
                                border: `1px solid ${s === 'Approved' ? 'rgba(47,191,113,0.2)' : 'rgba(21,59,115,0.15)'}`,
                            }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </CSMSLayout>
    );
}
