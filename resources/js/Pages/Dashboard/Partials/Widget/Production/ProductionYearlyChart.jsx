import { Bar } from 'react-chartjs-2';
import React from 'react';

const COLORS = ['#3b82f6', '#f97316', '#22c55e', '#a855f7', '#eab308'];
const MUTED  = '#94a3b8';

function Skel({ h = '12px' }) {
    return (
        <div style={{
            width: '100%', height: h, borderRadius: '4px',
            backgroundColor: '#e2e8f0',
            animation: 'prod-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function ProductionYearlyChart({ yearly = [], loading }) {
    // yearly = [{ year, total, category: [{ name, slug, total }] }]
    const labels = yearly.map(y => y.year);

    // Build datasets per category (stacked bars like aimsv2 horizontal-bar-chart)
    const categoryNames = yearly[0]?.category?.map(c => c.name) ?? [
        'Coal Shiping', 'Waste Removal', 'Coal Mining', 'Coal Hauling', 'Coal Barged'
    ];

    const datasets = categoryNames.map((name, i) => ({
        label: name,
        data: yearly.map(y => {
            const cat = y.category?.find(c => c.name === name);
            return cat ? Number(cat.total) : 0;
        }),
        backgroundColor: COLORS[i % COLORS.length],
        borderRadius: 4,
        borderWidth: 0,
    }));

    const chartData = { labels, datasets };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 }, color: MUTED, boxWidth: 10, padding: 8 },
            },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, color: MUTED } },
            y: { stacked: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: MUTED, callback: v => Number(v).toLocaleString('id-ID') }, beginAtZero: true },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Production per Tahun
            </span>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: 4 }).map((_, i) => <Skel key={i} h="20px" />)}
                </div>
            ) : yearly.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>Belum ada data</div>
            ) : (
                <div style={{ height: `${Math.max(180, yearly.length * 50 + 60)}px` }}>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
