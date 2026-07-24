import React from 'react';

const P      = '#153B73';
const O      = '#FF8C24';
const G      = '#91BA5F';
const R      = '#ef4444';
const BORDER = '#e2e8f0';

const COLORS = [P, O, G, R];

function Skel({ w = '100%', h = '12px', r = '6px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite ease-in-out' }} />;
}

function CategoryRow({ name, count, value, color, loading }) {
    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skel w="90px" h="11px" />
                    <Skel w="32px" h="11px" />
                </div>
                <Skel h="8px" r="999px" />
            </div>
        );
    }
    const pct = Math.min(100, Math.max(0, value ?? 0));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>({(count ?? 0).toLocaleString('id-ID')})</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{pct}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
        </div>
    );
}

export default function CsmsCategoryProgress({ category = [], loading }) {
    const total = category.reduce((s, c) => s + (c.count ?? 0), 0);

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 16px' }}>By Category</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {loading
                    ? [1, 2, 3].map(i => <CategoryRow key={i} loading />)
                    : category.length === 0
                        ? <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '16px 0', margin: 0 }}>Belum ada data</p>
                        : category.map((item, i) => (
                            <CategoryRow
                                key={i}
                                name={item.name}
                                count={item.count}
                                value={item.value}
                                color={COLORS[i % COLORS.length]}
                                loading={false}
                            />
                        ))
                }
            </div>
            {!loading && category.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Total</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: P }}>{total.toLocaleString('id-ID')}</span>
                </div>
            )}
        </div>
    );
}
