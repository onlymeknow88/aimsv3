import { Bar, Line } from 'react-chartjs-2';
import { BarChart2, RefreshCw } from 'lucide-react';
import {
    BarElement, CategoryScale,
    Chart as ChartJS, Filler, Legend,
    LineElement, LinearScale, PointElement, Tooltip,
} from 'chart.js';
import React from 'react';
import useProductionWidget from './Hooks/useProductionWidget';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Legend, Tooltip);

const COLORS = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623'];
const MUTED  = '#94a3b8';
const P      = '#153B73';

const CSS = `
    @keyframes prod-ytd-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
    @keyframes prod-ytd-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .prod-ytd-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        align-items: start;
    }
    .prod-ytd-grid > div {
        min-width: 0;
        overflow: hidden;
    }
    @media (max-width: 640px) {
        .prod-ytd-grid { grid-template-columns: 1fr; }
    }
`;

function Skel({ h = '12px' }) {
    return <div style={{ width: '100%', height: h, borderRadius: '4px', backgroundColor: '#e2e8f0', animation: 'prod-ytd-pulse 1.8s infinite ease-in-out' }} />;
}

function SkeletonHorizontalBar() {
    const bars = [80, 60, 90, 70];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skel h="12px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
                {bars.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '36px', height: '10px', borderRadius: '4px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />
                        <div style={{ width: `${w}%`, height: '20px', borderRadius: '4px', backgroundColor: '#e2e8f0', animation: `prod-ytd-pulse 1.8s infinite ease-in-out` }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkeletonLineChart() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skel h="12px" />
            <div style={{ height: '220px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%', height: '2px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
            </div>
        </div>
    );
}

/**
 * Horizontal bar chart — label = tahun, datasets = per kategori
 * Sesuai aimsv2 horizontal-bar-chart
 */
function YearlyHorizontalBarChart({ yearly = [], loading }) {
    const labels = yearly.map(y => String(y.year));

    const CATEGORY_NAMES = ['Coal Shiping', 'Waste Removal', 'Coal Mining', 'Coal Hauling', 'Coal Barged'];

    const datasets = CATEGORY_NAMES.map((name, i) => ({
        label: name,
        data: yearly.map(y => {
            const cat = (y.category ?? []).find(c => c.name === name);
            return cat ? Number(cat.total) : 0;
        }),
        backgroundColor: COLORS[i],
        borderRadius: 3,
        borderWidth: 0,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
    }));

    const options = {
        indexAxis: 'y', // horizontal bar
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
                    label: ctx => ` ${ctx.dataset.label}: ${Number(ctx.parsed.x).toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: {
                stacked: false,
                grid: { color: '#f1f5f9' },
                ticks: {
                    font: { size: 10 }, color: MUTED,
                    callback: v => {
                        if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
                        if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
                        return v;
                    },
                },
                beginAtZero: true,
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 12 }, color: '#334155', fontWeight: 600 },
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Production per Tahun
            </span>
            {loading ? (
                <SkeletonHorizontalBar />
            ) : yearly.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>Belum ada data</div>
            ) : (
                <div style={{ position: 'relative', height: `${Math.max(200, yearly.length * 60 + 80)}px`, width: '100%' }}>
                    <Bar data={{ labels, datasets }} options={options} />
                </div>
            )}
        </div>
    );
}

/**
 * Line chart trend bulanan — sesuai aimsv2 chart-line
 * Single line, label = bulan, data = total per bulan
 */
function MonthlyLineChart({ monthly = [], loading }) {
    const labels = monthly.map(m => m.month);
    const values = monthly.map(m => Number(m.total));

    const chartData = {
        labels,
        datasets: [{
            label: 'Total Production',
            data: values,
            borderColor: P,
            backgroundColor: 'rgba(21, 59, 115, 0.08)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: P,
            fill: true,
            tension: 0.3,
        }],
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
                    title: ctx => `Bulan: ${ctx[0].label}`,
                    label: ctx => ` Total: ${Number(ctx.parsed.y).toLocaleString('id-ID')} BCM/MT`,
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
                    font: { size: 10 }, color: MUTED,
                    callback: v => {
                        if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
                        if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
                        return v;
                    },
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
                <SkeletonLineChart />
            ) : monthly.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>Belum ada data</div>
            ) : (
                <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                    <Line data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}

export default function ProductionYtdWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useProductionWidget(filters);
    const isEmpty = !loading && !error && (stats?.summary?.ytd ?? 0) === 0;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px', padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            marginBottom: '32px', width: '100%', boxSizing: 'border-box',
        }}>
            <style>{CSS}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart2 size={16} style={{ color: P, flexShrink: 0 }} />
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #1e293b)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        Production YTD
                    </h4>
                </div>
                {loading && <RefreshCw size={14} style={{ color: '#94a3b8', animation: 'prod-ytd-spin 1s linear infinite' }} />}
            </div>

            {error ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                    Gagal memuat data.{' '}
                    <button onClick={refetch} style={{ color: P, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Coba lagi</button>
                </div>
            ) : isEmpty ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>Belum ada data Production YTD.</div>
            ) : (
                <div className="prod-ytd-grid">
                    <YearlyHorizontalBarChart yearly={stats?.yearly ?? []} loading={loading} />
                    <MonthlyLineChart monthly={stats?.monthly ?? []} loading={loading} />
                </div>
            )}
        </div>
    );
}
