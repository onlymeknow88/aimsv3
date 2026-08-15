import { BarChart2 } from 'lucide-react';
import React from 'react';

const P      = '#1d4ed8';
const BORDER = '#e2e8f0';

const CATEGORIES = [
    { key: 'coal_shiping',  label: 'Coal Shiping',  color: '#153B73' },
    { key: 'waste_removal', label: 'Waste Removal', color: '#FF8C24' },
    { key: 'coal_mining',   label: 'Coal Mining',   color: '#2FBF71' },
    { key: 'coal_hauling',  label: 'Coal Hauling',  color: '#2D7FF9' },
    { key: 'coal_barged',   label: 'Coal Barged',   color: '#F5A623' },
];

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r,
            backgroundColor: '#e2e8f0',
            animation: 'prod-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

const fmt = (val) => val != null
    ? Number(val).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : '0';

export default function ProductionSummary({ summary, category = [], loading }) {
    const ytd = summary?.ytd ?? 0;
    const mtd = summary?.mtd ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            {/* YTD gradient card */}
            {loading ? (
                <div style={{ background: P, borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'prod-pulse 1.5s infinite' }}>
                    <Skel w="50%" h="11px" />
                    <Skel w="35%" h="36px" />
                    <Skel h="8px" r="999px" />
                </div>
            ) : (
                <div style={{
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    borderRadius: '12px', padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    color: '#fff', flex: 1, justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BarChart2 size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                            YTD — {summary?.year ?? new Date().getFullYear()}
                        </span>
                    </div>

                    <span style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>
                        {fmt(ytd)}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>MTD</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{fmt(mtd)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Category breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <Skel key={i} h="14px" />)
                ) : (
                    category.map((c, i) => {
                        const cfg   = CATEGORIES.find(x => x.key === c.slug) ?? CATEGORIES[i % CATEGORIES.length];
                        const total = Number(c.total ?? 0);
                        const max   = Math.max(...category.map(x => Number(x.total ?? 0)), 1);
                        const pct   = Math.round(total / max * 100);
                        return (
                            <div key={c.slug ?? i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                    <span style={{ color: '#475569' }}>{c.category}</span>
                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{fmt(total)}</span>
                                </div>
                                <div style={{ height: '5px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: cfg.color, borderRadius: '999px', transition: 'width 0.4s' }} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
