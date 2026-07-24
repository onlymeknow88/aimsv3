import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

import { Doughnut } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const MUTED  = '#64748b';
const BORDER = '#e2e8f0';
const BG     = '#f8fafc';
const COLORS = ['#153B73', '#ef4444', '#91BA5F', '#FF8C24'];

const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '72%',
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
    },
};

function DonutItem({ item, idx, loading }) {
    const color = COLORS[idx % COLORS.length];
    const data  = {
        labels: ['Actual', 'Remaining'],
        datasets: [{
            data: [item.actual, item.target],
            backgroundColor: [color, '#e8edf3'],
            borderWidth: 2, borderColor: '#fff',
        }],
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: BG, borderRadius: '10px' }}>
            {loading ? (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite', flexShrink: 0 }} />
            ) : (
                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                    <Doughnut data={data} options={donutOpts} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color, lineHeight: 1 }}>{item.actual}%</div>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px', lineHeight: 1.3 }}>
                    {item.name}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 800, color, lineHeight: 1 }}>{item.actual}%</span>
                {!loading && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.count ?? 0} records</span>}
            </div>
        </div>
    );
}

export default function CsmsDonutCharts({ progress = [], loading }) {
    const items = loading
        ? [{ name: '...', actual: 0, target: 0 }, { name: '...', actual: 0, target: 0 }, { name: '...', actual: 0, target: 0 }, { name: '...', actual: 0, target: 0 }]
        : progress;

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>Status Sertifikat</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {items.map((item, i) => <DonutItem key={i} item={item} idx={i} loading={loading} />)}
            </div>
        </div>
    );
}
