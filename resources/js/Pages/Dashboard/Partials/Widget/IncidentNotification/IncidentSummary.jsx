import { AlertTriangle } from 'lucide-react';
import React from 'react';

const P      = '#dc2626';
const BORDER = '#e2e8f0';

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r,
            backgroundColor: '#e2e8f0',
            animation: 'incident-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function IncidentSummary({ summary, loading }) {
    const total    = summary?.total    ?? 0;
    const thisYear = summary?.thisYear ?? 0;
    const visible  = summary?.visible  ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>

            {/* YTD gradient card */}
            {loading ? (
                <div style={{
                    background: P, borderRadius: '12px', padding: '16px 20px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    animation: 'incident-pulse 1.5s infinite',
                }}>
                    <Skel w="50%" h="11px" />
                    <Skel w="35%" h="36px" />
                    <Skel h="8px" r="999px" />
                </div>
            ) : (
                <div style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    borderRadius: '12px', padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    color: '#fff', flex: 1, justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                            Total Incident
                        </span>
                    </div>

                    <span style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>
                        {total.toLocaleString('id-ID')}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
                        {[
                            { label: 'Tahun Ini',  val: thisYear },
                            { label: 'Ditampilkan', val: visible },
                            { label: 'Disembunyikan', val: total - visible },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.val.toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
