import React from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCircle({ size = 120 }) {
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            animation: 'docdoughnut-pulse 1.8s infinite ease-in-out',
            flexShrink: 0,
        }} />
    );
}

function SkeletonBlock({ width = '100%', height = '14px' }) {
    return (
        <div style={{
            width,
            height,
            borderRadius: '6px',
            backgroundColor: '#e2e8f0',
            animation: 'docdoughnut-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Single doughnut gauge ─────────────────────────────────────────────────────
function DonutGauge({ label, percent, color, trackColor = '#f1f5f9' }) {
    const data = {
        datasets: [{
            data: [percent, 100 - percent],
            backgroundColor: [color, trackColor],
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
            tooltip: { enabled: false },
        },
        animation: { duration: 800, easing: 'easeInOutQuart' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
                <Doughnut data={data} options={options} />
                {/* Center label */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color, lineHeight: 1 }}>
                        {percent}%
                    </span>
                </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>
                {label}
            </span>
        </div>
    );
}

// ── Bar chart for category breakdown ─────────────────────────────────────────
function CategoryBar({ breakdown }) {
    const labels  = breakdown.map(b => b.name);
    const values  = breakdown.map(b => b.value);
    const maxVal  = Math.max(...values, 1);

    const data = {
        labels,
        datasets: [{
            label: 'Dokumen Aktif',
            data: values,
            backgroundColor: ['#00552F', '#91BA5F', '#3b7a57'],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.x} dokumen`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: maxVal + Math.ceil(maxVal * 0.2),
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 11 }, color: '#94a3b8' },
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' }, color: '#475569' },
            },
        },
        animation: { duration: 800, easing: 'easeInOutQuart' },
    };

    return (
        <div style={{ height: '120px', width: '100%' }}>
            <Bar data={data} options={options} />
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DocumentSystemDoughnut({ stats, loading }) {
    return (
        <>
            <style>{`
                @keyframes docdoughnut-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ── Donut gauges row ──────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    {loading ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <SkeletonCircle size={110} />
                                <SkeletonBlock width="70px" height="12px" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <SkeletonCircle size={110} />
                                <SkeletonBlock width="70px" height="12px" />
                            </div>
                        </>
                    ) : (
                        <>
                            <DonutGauge
                                label="Aktif"
                                percent={stats?.donut?.active?.actual ?? 0}
                                color="#00552F"
                            />
                            <DonutGauge
                                label="Obsolete"
                                percent={stats?.donut?.obsolete?.actual ?? 0}
                                color="#91BA5F"
                                trackColor="#f1f5f9"
                            />
                        </>
                    )}
                </div>

                {/* ── Divider ───────────────────────────────────────────────── */}
                <div style={{ borderTop: '1px solid #e2e8f0' }} />

                {/* ── Category breakdown bar chart ──────────────────────────── */}
                <div>
                    <span style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '12px',
                    }}>
                        Kategori Dokumen Aktif
                    </span>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[80, 55, 40].map((w, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <SkeletonBlock width="90px" height="12px" />
                                    <SkeletonBlock width={`${w}%`} height="18px" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CategoryBar breakdown={stats?.category_breakdown ?? []} />
                    )}
                </div>

            </div>
        </>
    );
}