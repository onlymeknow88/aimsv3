import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

import React from 'react';

ChartJS.register(
    ArcElement, BarElement, CategoryScale, Filler,
    Legend, LineElement, LinearScale, PointElement, Tooltip
);

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
            <div style={{ position: 'relative', width: 'min(170px, 45vw)', height: 'min(170px, 45vw)' }}>
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
                    <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>
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

// ── Monthly line chart: actual vs target ────────────────────────────────────
function MonthlyLineChart({ summaryMonthly, summaryYearly }) {
    // Build 12-month labels dengan actual & target dari summary
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed

    // Isi data kumulatif dari Jan sampai bulan ini
    // Bulan sebelumnya pakai past_month, bulan ini pakai this_month
    const thisMonthDone   = summaryMonthly?.this_month_done   ?? 0;
    const thisMonthTarget = summaryMonthly?.this_month_target ?? 0;
    const pastMonthDone   = summaryMonthly?.past_month_done   ?? 0;
    const pastMonthTarget = summaryMonthly?.past_month_target ?? 0;

    const actualData = months.map((_, i) => {
        if (i === currentMonth)     return thisMonthDone;
        if (i === currentMonth - 1) return pastMonthDone;
        if (i < currentMonth - 1)   return null; // tidak ada data historis
        return null;
    });

    const targetData = months.map((_, i) => {
        if (i === currentMonth)     return thisMonthTarget;
        if (i === currentMonth - 1) return pastMonthTarget;
        if (i < currentMonth - 1)   return null;
        return null;
    });

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Actual',
                data: actualData,
                borderColor: '#153B73',
                backgroundColor: 'rgba(21, 59, 115, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#153B73',
                spanGaps: false,
            },
            {
                label: 'Target',
                data: targetData,
                borderColor: '#FF8C24',
                backgroundColor: 'rgba(255, 140, 36, 0.08)',
                fill: true,
                tension: 0.4,
                borderDash: [4, 4],
                pointRadius: 4,
                pointBackgroundColor: '#FF8C24',
                spanGaps: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 }, boxWidth: 12, padding: 12 },
            },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y ?? 0} dokumen`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: '#f8fafc' },
                ticks: { font: { size: 10 }, color: '#94a3b8' },
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#94a3b8', precision: 0 },
            },
        },
        animation: { duration: 800, easing: 'easeInOutQuart' },
    };

    return (
        <div style={{ height: '170px', width: '100%' }}>
            <Line data={data} options={options} />
        </div>
    );
}

// ── Bar chart for category breakdown ─────────────────────────────────────────
function CategoryBar({ breakdown }) {
    const labels = breakdown.map(b => b.name);
    const values  = breakdown.map(b => b.value);
    const maxVal  = Math.max(...values, 1);
    const colors  = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623'];

    // Render sebagai list bar manual agar tidak ada space kosong
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {breakdown.map((cat, i) => {
                const pct = Math.round((cat.value / maxVal) * 100);
                return (
                    <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{cat.name}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{cat.value}</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: colors[i % colors.length],
                                borderRadius: '999px',
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                    </div>
                );
            })}
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
                .docdoughnut-grid {
                    display: grid;
                    grid-template-columns: 1fr minmax(180px, 220px);
                    gap: 20px;
                    align-items: start;
                }
                .docdoughnut-donuts {
                    display: flex;
                    gap: 24px;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .docdoughnut-grid {
                        grid-template-columns: 1fr;
                    }
                    .docdoughnut-donuts {
                        gap: 16px;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ── 2 kolom: kiri (donut + chart), kanan (kategori) ── */}
                <div className="docdoughnut-grid">

                    {/* Kolom kiri: donut atas + line chart bawah */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Baris donut */}
                        <div className="docdoughnut-donuts">
                            {loading ? (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <SkeletonCircle size={170} />
                                            <SkeletonBlock width="60px" height="11px" />
                                        </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                        <SkeletonCircle size={170} />
                                        <SkeletonBlock width="60px" height="11px" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <DonutGauge
                                        label="Aktif"
                                        percent={stats?.donut?.active?.actual ?? 0}
                                        color="#153B73"
                                    />
                                    <DonutGauge
                                        label="Obsolete"
                                        percent={stats?.donut?.obsolete?.actual ?? 0}
                                        color="#FF8C24"
                                        trackColor="#f1f5f9"
                                    />
                                </>
                            )}
                        </div>

                        {/* Line chart di bawah donut */}
                        <div>
                            <span style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '8px',
                            }}>
                                Aktual vs Target Bulanan
                            </span>
                            {loading ? (
                                <SkeletonBlock width="100%" height="150px" />
                            ) : (
                                <MonthlyLineChart
                                    summaryMonthly={stats?.summary_monthly}
                                    summaryYearly={stats?.summary_yearly}
                                />
                            )}
                        </div>
                    </div>

                    {/* Kolom kanan: kategori */}
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
                            Kategori Aktif
                        </span>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[90, 60, 40].map((w, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <SkeletonBlock width="80px" height="11px" />
                                        <SkeletonBlock width={`${w}%`} height="8px" radius="999px" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CategoryBar breakdown={stats?.category_breakdown ?? []} />
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
