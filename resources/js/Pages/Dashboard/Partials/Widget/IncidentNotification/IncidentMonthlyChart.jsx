import { Bar } from 'react-chartjs-2';
import React from 'react';

const P      = '#dc2626';
const BORDER = '#e2e8f0';
const MUTED  = '#94a3b8';

function Skel({ h = '12px' }) {
    return (
        <div style={{
            width: '100%', height: h, borderRadius: '4px',
            backgroundColor: '#e2e8f0',
            animation: 'incident-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

export default function IncidentMonthlyChart({ monthly = [], loading }) {
    const labels  = monthly.map(m => m.month);
    const values  = monthly.map(m => m.count);

    const chartData = {
        labels,
        datasets: [{
            label: 'Incident',
            data: values,
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
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
                    label: ctx => ` ${ctx.parsed.y} incident`,
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
                ticks: { font: { size: 11 }, color: MUTED, stepSize: 1 },
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
                    {Array.from({ length: 4 }).map((_, i) => <Skel key={i} h="14px" />)}
                </div>
            ) : (
                <div style={{ height: '180px' }}>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
