import { Doughnut } from 'react-chartjs-2';
import React from 'react';

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

export default function ProductionProgressChart({ progress, loading }) {
    const actual = progress?.actual ?? 0;
    const target = progress?.target ?? 0;

    const chartData = {
        labels: ['Actual', 'Remaining'],
        datasets: [{
            data: [actual, Math.max(0, 100 - actual)],
            backgroundColor: ['#1d4ed8', '#e2e8f0'],
            borderWidth: 0,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.label}: ${Number(ctx.parsed).toFixed(1)}%`,
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                MTD vs YTD Progress
            </span>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: 3 }).map((_, i) => <Skel key={i} h="14px" />)}
                </div>
            ) : (
                <>
                    <div style={{ height: '140px', position: 'relative' }}>
                        <Doughnut data={chartData} options={options} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none',
                        }}>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>
                                {actual.toFixed(1)}%
                            </span>
                            <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>ACTUAL</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                            { label: 'Actual (MTD)',   value: actual,            color: '#1d4ed8' },
                            { label: 'Remaining',      value: Math.max(0, 100 - actual), color: '#e2e8f0' },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color, flexShrink: 0, border: item.color === '#e2e8f0' ? '1px solid #cbd5e1' : 'none' }} />
                                    <span style={{ fontSize: '11px', color: '#475569' }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{item.value.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
