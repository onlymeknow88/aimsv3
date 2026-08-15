import { Doughnut } from 'react-chartjs-2';
import React from 'react';

const COLORS = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
const MUTED  = '#94a3b8';

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r,
            backgroundColor: '#e2e8f0',
            animation: 'incident-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function IncidentCategoryChart({ category = [], loading }) {
    const labels = category.map(c => c.category);
    const values = category.map(c => c.count);
    const total  = values.reduce((a, b) => a + b, 0);

    const chartData = {
        labels,
        datasets: [{
            data: values,
            backgroundColor: COLORS.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff',
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.label}: ${ctx.parsed} (${total ? Math.round(ctx.parsed / total * 100) : 0}%)`,
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Per Kategori
            </span>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: 4 }).map((_, i) => <Skel key={i} h="14px" />)}
                </div>
            ) : category.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>
                    Belum ada data kategori
                </div>
            ) : (
                <>
                    <div style={{ height: '160px', position: 'relative' }}>
                        <Doughnut data={chartData} options={options} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none',
                        }}>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{total}</span>
                            <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>TOTAL</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {category.map((c, i) => (
                            <div key={c.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                    <span style={{ fontSize: '11px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.category}</span>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{c.count}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
