import { Doughnut } from 'react-chartjs-2';
import { BarChart2, RefreshCw } from 'lucide-react';
import {
    ArcElement,
    Chart as ChartJS, Legend, Tooltip,
} from 'chart.js';
import React from 'react';
import useProductionWidget from './Hooks/useProductionWidget';

ChartJS.register(ArcElement, Legend, Tooltip);

const COLORS = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623'];
const MUTED  = '#94a3b8';
const P      = '#1d4ed8';

const CSS = `
    @keyframes prod-mtd-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
    @keyframes prod-mtd-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .prod-mtd-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        align-items: start;
    }
    .prod-mtd-grid > div {
        min-width: 0;
        overflow: hidden;
    }
    @media (max-width: 640px) {
        .prod-mtd-grid { grid-template-columns: 1fr; }
    }
`;

function Skel({ h = '12px', w = '100%' }) {
    return <div style={{ width: w, height: h, borderRadius: '4px', backgroundColor: '#e2e8f0', animation: 'prod-mtd-pulse 1.8s infinite ease-in-out' }} />;
}

function SkeletonDoughnut() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '12px', height: '160px', display: 'none' }} />
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <div style={{ width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'prod-mtd-pulse 1.8s infinite ease-in-out' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />
                        <Skel h="10px" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkeletonProgress() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <div style={{ width: '160px', height: '160px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'prod-mtd-pulse 1.8s infinite ease-in-out' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <div style={{ width: '100%', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: 2 }).map((_, i) => <Skel key={i} h="14px" />)}
            </div>
        </div>
    );
}

/**
 * Doughnut chart per kategori MTD
 */
function CategoryDoughnut({ mtdCategory = [], loading }) {
    const labels = mtdCategory.map(c => c.category);
    const values = mtdCategory.map(c => Number(c.total ?? 0));
    const total  = values.reduce((a, b) => a + b, 0);

    const chartData = {
        labels,
        datasets: [{
            data: values,
            backgroundColor: COLORS.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 4,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: { size: 10 },
                    color: MUTED,
                    boxWidth: 10,
                    padding: 8,
                    generateLabels: (chart) => {
                        const data = chart.data;
                        return (data.labels ?? []).map((label, i) => ({
                            text: `${label}: ${Number(data.datasets[0].data[i]).toLocaleString('id-ID')}`,
                            fillStyle: COLORS[i % COLORS.length],
                            strokeStyle: '#fff',
                            lineWidth: 2,
                            index: i,
                        }));
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.label}: ${Number(ctx.parsed).toLocaleString('id-ID')} (${total ? Math.round(ctx.parsed / total * 100) : 0}%)`,
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                MTD per Kategori
            </span>
            {loading ? (
                <SkeletonDoughnut />
            ) : total === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: '12px' }}>Belum ada data MTD</div>
            ) : (
                <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                    <Doughnut data={chartData} options={options} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none',
                        paddingBottom: '60px',
                    }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                            {total >= 1_000_000
                                ? (total / 1_000_000).toFixed(1) + 'M'
                                : total >= 1_000
                                    ? (total / 1_000).toFixed(1) + 'K'
                                    : total.toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>MTD TOTAL</span>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Doughnut chart actual vs target (MTD / YTD %)
 */
function ProgressDoughnut({ progress, summary, loading }) {
    const actual = progress?.actual ?? 0;

    const chartData = {
        labels: ['Actual', 'Remaining'],
        datasets: [{
            data: [actual, Math.max(0, 100 - actual)],
            backgroundColor: [P, '#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
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
                Actual vs Target
            </span>
            {loading ? (
                <SkeletonProgress />
            ) : (
                <>
                    <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                        <Doughnut data={chartData} options={options} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            pointerEvents: 'none',
                        }}>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: P }}>{actual.toFixed(1)}%</span>
                            <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>ACTUAL</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                        {[
                            { label: 'MTD',    value: Number(summary?.mtd ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 2 }), color: P },
                            { label: `YTD ${summary?.year ?? ''}`, value: Number(summary?.ytd ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 2 }), color: '#64748b' },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#475569' }}>{item.label}</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function ProductionMtdWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useProductionWidget(filters);
    const isEmpty = !loading && !error && (stats?.summary?.mtd ?? 0) === 0;

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
                        Production MTD
                    </h4>
                </div>
                {loading && <RefreshCw size={14} style={{ color: '#94a3b8', animation: 'prod-mtd-spin 1s linear infinite' }} />}
            </div>

            {error ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                    Gagal memuat data.{' '}
                    <button onClick={refetch} style={{ color: P, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Coba lagi</button>
                </div>
            ) : isEmpty ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>Belum ada data Production MTD.</div>
            ) : (
                <div className="prod-mtd-grid">
                    <CategoryDoughnut mtdCategory={stats?.mtdCategory ?? []} loading={loading} />
                    <ProgressDoughnut progress={stats?.progress} summary={stats?.summary} loading={loading} />
                </div>
            )}
        </div>
    );
}
