import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function useIsMobile(bp = 640) {
    const [v, setV] = useState(typeof window !== 'undefined' ? window.innerWidth <= bp : false);
    useEffect(() => {
        const h = () => setV(window.innerWidth <= bp);
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, [bp]);
    return v;
}

const C = {
    primary:    '#153B73',
    orange:     '#FF8C24',
    green:      '#16a34a',
    border:     '#e2e8f0',
    bgInner:    '#f8fafc',
    textMuted:  '#64748b',
    textPrimary:'#1e293b',
};

const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
        },
    },
};

function ProgressBar({ percent, color }) {
    return (
        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
                width: `${Math.min(100, Math.max(0, percent))}%`,
                height: '100%', backgroundColor: color,
                borderRadius: '999px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            }} />
        </div>
    );
}

export default function CsmsDonutStatus({ donut, loading }) {
    const isMobile = useIsMobile(640);
    const valid   = donut?.actual ?? 0;
    const expired = donut?.target ?? 0;
    const total   = valid + expired;

    const chartData = {
        labels: ['Valid / Approved', 'Expired / Inactive'],
        datasets: [{
            data: total === 0 ? [1, 0] : [valid, expired],
            backgroundColor: [C.primary, C.orange],
            borderWidth: 3,
            borderColor: '#fff',
            hoverBorderColor: '#fff',
            hoverOffset: 4,
        }],
    };

    const items = [
        {
            color: C.primary,
            label: 'Valid / Approved',
            val: valid,
            sub: 'Sertifikat aktif',
        },
        {
            color: C.orange,
            label: 'Expired / Inactive',
            val: expired,
            sub: 'Perlu perpanjangan',
        },
    ];

    if (loading) {
        return (
            <div style={{
                backgroundColor: C.bgInner, border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '16px',
                animation: 'csms-widget-pulse 1.8s infinite',
            }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#e2e8f0' }} />
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2].map(i => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%' }} />
                            <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: C.bgInner, border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: isMobile ? '12px' : '16px 20px',
            display: 'flex', flexDirection: 'column',
            width: '100%', boxSizing: 'border-box', overflowX: 'hidden',
        }}>
            {/* Title */}
            <p style={{
                fontSize: '10px', fontWeight: 700, color: C.textMuted,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                margin: '0 0 16px',
            }}>
                Status Sertifikat CSMS
            </p>

            {/* Donut — centered */}
            <div style={{
                display: 'flex', justifyContent: 'center',
                marginBottom: '16px',
            }}>
                <div style={{ position: 'relative', width: isMobile ? '140px' : '160px', height: isMobile ? '140px' : '160px', maxWidth: '100%' }}>
                    <Doughnut data={chartData} options={donutOpts} />
                    {/* Center label */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center', pointerEvents: 'none',
                    }}>
                        <div style={{
                            fontSize: '32px', fontWeight: 800,
                            color: C.primary, lineHeight: 1,
                        }}>
                            {valid}%
                        </div>
                        <div style={{
                            fontSize: '10px', fontWeight: 700,
                            color: C.textMuted, letterSpacing: '0.6px',
                            marginTop: '4px',
                        }}>
                            VALID
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {items.map((item, i) => (
                    <div key={i} style={{
                        display: 'flex', flexDirection: 'column',
                        padding: '12px 0',
                        borderTop: `1px solid ${C.border}`,
                    }}>
                        {/* Label row */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '10px', marginBottom: '8px',
                        }}>
                            <div style={{
                                width: '14px', height: '14px', borderRadius: '4px',
                                backgroundColor: item.color, flexShrink: 0,
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '12px', fontWeight: 600,
                                    color: C.textPrimary,
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {item.label}
                                </div>
                                <div style={{ fontSize: '10px', color: C.textMuted, marginTop: '1px' }}>
                                    {item.sub}
                                </div>
                            </div>
                            <strong style={{
                                fontSize: '22px', fontWeight: 800,
                                color: item.color, flexShrink: 0,
                            }}>
                                {item.val}%
                            </strong>
                        </div>
                        {/* Progress bar */}
                        <ProgressBar percent={item.val} color={item.color} />
                    </div>
                ))}
            </div>
        </div>
    );
}
