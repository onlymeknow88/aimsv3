import React from 'react';

const P      = '#153B73';
const O      = '#FF8C24';
const G      = '#91BA5F';
const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const BG     = '#f8fafc';

const COLORS = [P, O, G];

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite ease-in-out' }} />;
}

function ProgressBar({ pct, color = P }) {
    return (
        <div style={{ height: '6px', backgroundColor: '#e8edf3', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', backgroundColor: color, borderRadius: '999px', transition: 'width .6s ease' }} />
        </div>
    );
}

export default function CsmsDetail({ detail = [], summary, loading }) {
    const ytd = summary?.ytd ?? 0;

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: 0 }}>Detail Kategori</p>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: MUTED }}>YTD</div>
                    {loading
                        ? <div style={{ width: '40px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'csms-pulse 1.8s infinite' }} />
                        : <div style={{ fontSize: '20px', fontWeight: 800, color: P, lineHeight: 1 }}>{ytd.toLocaleString('id-ID')}</div>
                    }
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {loading
                    ? [1, 2, 3].map(i => (
                        <div key={i} style={{ backgroundColor: BG, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Skel h="10px" w="60%" />
                            <Skel h="28px" w="50%" />
                            <Skel h="6px" r="999px" />
                            <Skel h="10px" w="40%" />
                        </div>
                    ))
                    : detail.map((row, i) => {
                        const isUp  = row.this_year_mark === 'up';
                        const color = COLORS[i % COLORS.length];
                        return (
                            <div key={i} style={{ backgroundColor: BG, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                                    {row.name}
                                </span>
                                <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>
                                    {(row.this_year ?? 0).toLocaleString('id-ID')}
                                </span>
                                <ProgressBar pct={row.this_year_percent ?? 0} color={color} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: MUTED }}>{row.this_year_percent ?? 0}% dari YTD</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700,
                                        padding: '1px 6px', borderRadius: '999px',
                                        backgroundColor: isUp ? '#ecfdf5' : '#fef2f2',
                                        color: isUp ? '#065f46' : '#991b1b',
                                    }}>
                                        {isUp ? '▲' : '▼'} VS LY
                                    </span>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}