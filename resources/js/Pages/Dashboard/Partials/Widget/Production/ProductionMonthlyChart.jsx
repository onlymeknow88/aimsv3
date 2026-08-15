import { Bar } from 'react-chartjs-2';
import React from 'react';

const P    = '#1d4ed8';
const MUTED = '#94a3b8';

function Skel({ h = '12px' }) {
    return (
        <div style={{
            width: '100%', height: h, borderRadius: '4px',
            backgroundColor: '#e2e8f0',
            animation: 'prod-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function ProductionMonthlyChart({ monthly = [], loading }) {
    const labels = monthly.map(y => y.month);
    const values = monthly.map(y => y.total);

    const chartData = {
        labels,
        datasets: [{
            label: 'Total Production',
            data: values,
            backgroundColor: 'rgba(29, 78, 216, 0.15)',
            borderColor: P,
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${Number(ctx.parsed.y).toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: MUTED },
            },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: {
                    font: { size: 11 }, color: MUTED,
                    callback: v => Number(v).toLocaleString('id-ID'),
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Trend Bulanan
            </span>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: 5 }).map((_, i) => <Skel key={i} h="14px" />)}
                </div>
            ) : monthly.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>Belum ada data</div>
            ) : (
                <div style={{ height: '200px' }}>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
