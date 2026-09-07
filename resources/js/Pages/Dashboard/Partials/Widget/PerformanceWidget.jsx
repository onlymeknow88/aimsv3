import { Bar } from 'react-chartjs-2';
import { RefreshCw } from 'lucide-react';
import {
    BarElement, CategoryScale, Chart as ChartJS,
    Legend, LinearScale, Tooltip,
} from 'chart.js';
import React from 'react';

import useWidgetStats from '../../Hooks/useWidgetStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const COLORS = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623'];
const MUTED  = 'var(--text-secondary)';

function SkeletonBarChart() {
    const bars = [60, 85, 45, 70, 55, 90];
    return (
        <div className="skeleton-dashboard" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ width: '140px', height: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 8px' }}>
                {bars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', backgroundColor: '#e2e8f0' }} />
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                ))}
            </div>
        </div>
    );
}

/**
 * Bar chart — sumbu X = nama metric, setiap dataset = 1 bulan/record
 */
function PerformanceBarChart({ labels = [], datasets = [], loading }) {
    const chartData = {
        labels,
        datasets: datasets.map((ds, i) => ({
            label:              ds.label,
            data:               ds.data,
            backgroundColor:    ds.borderColor ?? COLORS[i % COLORS.length],
            borderRadius:       4,
            borderWidth:        0,
            barPercentage:      0.8,
            categoryPercentage: 0.7,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 }, color: MUTED, boxWidth: 12, padding: 8 },
            },
            tooltip: {
                callbacks: {
                    title: ctx => ctx[0].label,
                    label: ctx => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(4)}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#334155', fontWeight: 600 },
            },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: MUTED, callback: v => Number(v).toFixed(2) },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
                <SkeletonBarChart />
            ) : labels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: '13px' }}>Belum ada data</div>
            ) : (
                <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                    <Bar data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}

/**
 * Widget generik untuk chart performance (Safety / Health).
 * Hanya berbeda title, ikon, warna aksen, dan endpoint.
 */
export default function PerformanceWidget({
    title,
    subtitle,
    icon: Icon,
    accentColor,
    endpoint,
    filters = {},
}) {
    const { stats, loading, error, refetch } = useWidgetStats(endpoint, filters);
    const isEmpty = !loading && !error && (stats?.datasets ?? []).length === 0;

    return (
        <section aria-label={title} style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px', padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            width: '100%', boxSizing: 'border-box',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} aria-hidden="true" style={{ color: accentColor }} />
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #1e293b)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        {title}
                    </h2>
                </div>
                {loading && <RefreshCw size={14} aria-hidden="true" style={{ color: 'var(--text-secondary)', animation: 'dashboard-spin 1s linear infinite' }} aria-label="Memuat" />}
            </div>

            {error ? (
                <div role="alert" style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: '13px' }}>
                    Gagal memuat data.{' '}
                    <button type="button" onClick={refetch} style={{ color: accentColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, minHeight: '44px', padding: '6px 12px' }}>Coba lagi</button>
                </div>
            ) : isEmpty ? (
                <div style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: '13px' }}>Belum ada data {title}.</div>
            ) : (
                <>
                    {subtitle && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: '12px' }}>
                            {subtitle}
                        </span>
                    )}
                    <PerformanceBarChart
                        labels={stats?.labels ?? []}
                        datasets={stats?.datasets ?? []}
                        loading={loading}
                    />
                </>
            )}
        </section>
    );
}
