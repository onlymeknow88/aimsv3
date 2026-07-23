import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const C = {
    primary: '#153B73',
    orange:  '#FF8C24',
    border:  '#e2e8f0',
    bgInner: '#f8fafc',
    textMuted: '#64748b',
};

const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
        legend: { display: false },
        tooltip: { intersect: true },
    },
};

function ProgressBar({ percent, color }) {
    return (
        <div style={{ height: '7px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
                width: `${Math.min(100, Math.max(0, percent))}%`,
                height: '100%', backgroundColor: color,
                borderRadius: '999px', transition: 'width 0.6s ease',
            }} />
        </div>
    );
}

export default function CsmsDonutStatus({ donut, loading }) {
    const actual = donut?.actual ?? 0;
    const target = donut?.target ?? 0;

    const chartData = {
        labels: ['Valid / Approved', 'Expired / Inactive'],
        datasets: [{
            data: actual === 0 && target === 0 ? [1, 0] : [actual, target],
            backgroundColor: [C.primary, C.orange],
            borderWidth: 2,
            borderColor: ['#fff', '#fff'],
        }],
    };

    const items = [
        { color: C.primary, label: 'Valid',   val: actual },
        { color: C.orange,  label: 'Expired', val: target },
    ];

    if (loading) {
        return (
            <div style={{
                backgroundColor: C.bgInner, border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '24px', flexWrap: 'wrap', minHeight: '140px',
                animation: 'csms-widget-pulse 1.8s infinite',
            }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e2e8f0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '11px', width: '120px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                    <div style={{ height: '7px',  width: '120px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                    <div style={{ height: '11px', width: '120px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                    <div style={{ height: '7px',  width: '120px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: C.bgInner, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '16px',
        }}>
            <p style={{
                fontSize: '10px', fontWeight: 700, color: C.textMuted,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                margin: '0 0 12px',
            }}>
                Status Sertifikat CSMS
            </p>
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '24px', flexWrap: 'wrap',
            }}>
                {/* Donut */}
                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                    <Doughnut data={chartData} options={donutOpts} />
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        textAlign: 'center', pointerEvents: 'none',
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: C.primary, lineHeight: 1 }}>
                            {actual}%
                        </div>
                        <div style={{ fontSize: '9px', color: C.textMuted, fontWeight: 700, letterSpacing: '0.5px' }}>
                            VALID
                        </div>
                    </div>
                </div>

                {/* Legend + progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '120px' }}>
                    {items.map((item, i) => (
                        <div key={i}>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                gap: '6px', marginBottom: '5px',
                            }}>
                                <div style={{
                                    width: '10px', height: '10px',
                                    borderRadius: '3px', backgroundColor: item.color, flexShrink: 0,
                                }} />
                                <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500, flex: 1 }}>
                                    {item.label}
                                </span>
                                <strong style={{ fontSize: '14px', fontWeight: 800, color: C.primary }}>
                                    {item.val}%
                                </strong>
                            </div>
                            <ProgressBar percent={item.val} color={item.color} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}