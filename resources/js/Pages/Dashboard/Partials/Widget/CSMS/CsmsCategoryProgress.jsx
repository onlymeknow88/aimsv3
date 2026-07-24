import React from 'react';

const P      = '#153B73';
const P2     = '#1E4E96';
const O      = '#FF8C24';
const G      = '#91BA5F';
const R      = '#ef4444';
const MUTED  = '#64748b';
const BORDER = '#e2e8f0';
const BG     = '#f8fafc';

const COLORS = [P, G, O, P2, R];

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

export default function CsmsCategoryProgress({ category = [], loading }) {
    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 14px' }}>By Category</p>
            {loading ? (
                [1, 2, 3].map(i => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                        <Skel h="10px" w="60%" />
                        <div style={{ marginTop: '6px' }}><Skel h="6px" r="999px" /></div>
                    </div>
                ))
            ) : category.length === 0 ? (
                <p style={{ fontSize: '12px', color: MUTED, textAlign: 'center', padding: '16px 0', margin: 0 }}>Belum ada data</p>
            ) : (
                category.map((item, i) => (
                    <div key={i} style={{ marginBottom: i === category.length - 1 ? 0 : '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '10px', color: MUTED }}>{item.count}</span>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700,
                                    color: COLORS[i % COLORS.length],
                                    backgroundColor: COLORS[i % COLORS.length] + '18',
                                    padding: '1px 6px', borderRadius: '999px',
                                }}>
                                    {item.value}%
                                </span>
                            </div>
                        </div>
                        <ProgressBar pct={item.value} color={COLORS[i % COLORS.length]} />
                    </div>
                ))
            )}
        </div>
    );
}