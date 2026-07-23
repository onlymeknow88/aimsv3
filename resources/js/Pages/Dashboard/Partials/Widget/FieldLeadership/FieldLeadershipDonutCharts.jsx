import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

import { Doughnut } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const FLS_PRIMARY = '#153B73';
const FLS_SECONDARY = '#FF8C24';

// ── Skeleton circle ───────────────────────────────────────────────────────────
function SkeletonCircle({ size = 130 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            animation: 'flsdonut-pulse 1.8s infinite ease-in-out',
            flexShrink: 0,
        }} />
    );
}

function SkeletonBlock({ width = '100%', height = '12px' }) {
    return (
        <div style={{
            width, height, borderRadius: '6px',
            backgroundColor: '#e2e8f0',
            animation: 'flsdonut-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Single donut gauge with center text ───────────────────────────────────────
function DonutGauge({ label, completePercent, loading }) {
    const ongoing = Math.max(0, 100 - completePercent);

    const data = {
        datasets: [{
            data: [completePercent, ongoing],
            backgroundColor: [FLS_PRIMARY, FLS_SECONDARY],
            borderWidth: 0,
            hoverOffset: 0,
        }],
    };

    const options = {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const labels = ['Complete', 'Ongoing'];
                        return ` ${labels[ctx.dataIndex]}: ${ctx.parsed}%`;
                    },
                },
            },
        },
        animation: { duration: 800, easing: 'easeInOutQuart' },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <SkeletonCircle size={130} />
                <SkeletonBlock width="70px" height="11px" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: 'min(130px, 40vw)', height: 'min(130px, 40vw)' }}>
                <Doughnut data={data} options={options} />
                {/* Center percentage text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: FLS_PRIMARY, lineHeight: 1 }}>
                        {completePercent}%
                    </span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                        COMPLETE
                    </span>
                </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>
                {label}
            </span>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: FLS_PRIMARY, display: 'inline-block' }} />
                    Complete {completePercent}%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: FLS_SECONDARY, display: 'inline-block' }} />
                    Ongoing {ongoing}%
                </span>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FieldLeadershipDonutCharts({ stats, loading }) {
    const donutActual = stats?.donutChartByActual ?? {
        target: { complete: 0, ongoing: 100 },
        actual: { complete: 0, ongoing: 100 },
    };

    return (
        <>
            <style>{`
                @keyframes flsdonut-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
                .flsdonut-row {
                    display: flex;
                    gap: 24px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
            `}</style>

            <div>
                <span style={{
                    display: 'block', fontSize: '11px', fontWeight: 700,
                    color: '#475569', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '16px',
                }}>
                    Target vs Aktual
                </span>

                <div className="flsdonut-row">
                    <DonutGauge
                        label="Target Achievement"
                        completePercent={donutActual.target?.complete ?? 0}
                        loading={loading}
                    />
                    <DonutGauge
                        label="Actual Achievement"
                        completePercent={donutActual.actual?.complete ?? 0}
                        loading={loading}
                    />
                </div>
            </div>
        </>
    );
}
