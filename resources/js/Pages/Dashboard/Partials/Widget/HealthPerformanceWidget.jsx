import { Bar } from 'react-chartjs-2';
import { Heart, RefreshCw } from 'lucide-react';
import {
    BarElement, CategoryScale, Chart as ChartJS,
    Legend, LinearScale, Tooltip,
} from 'chart.js';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const COLORS = ['#153B73', '#FF8C24', '#2FBF71', '#2D7FF9', '#F5A623', '#153B73'];
const MUTED  = '#94a3b8';
const P      = '#a855f7';

const CSS = `
    @keyframes health-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes health-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .health-widget-grid {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 24px;
        align-items: start;
    }
    @media (max-width: 640px) { .health-widget-grid { grid-template-columns: 1fr; } }
`;

function SkeletonBarChart() {
    const bars = [60, 85, 45, 70, 55, 90];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ width: '140px', height: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0', animation: 'health-pulse 1.8s infinite ease-in-out' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 8px' }}>
                {bars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', backgroundColor: '#e2e8f0', animation: 'health-pulse 1.8s infinite ease-in-out', animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0', animation: 'health-pulse 1.8s infinite ease-in-out' }} />
                ))}
            </div>
        </div>
    );
}

function SummaryCards({ summary = [], loading }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Nilai Terakhir
            </span>
            {loading
                ? Array.from({ length: 5 }).map((_, i) => <Skel key={i} h="52px" />)
                : summary.map((item, i) => (
                    <div key={item.key} style={{
                        padding: '10px 14px', backgroundColor: '#f8fafc',
                        borderRadius: '10px', borderLeft: `3px solid ${COLORS[i % COLORS.length]}`,
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                            {Number(item.value).toFixed(4)}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

/**
 * Line chart — sumbu X = nama metric (RKK, CMR, MMR, SSR, ASR)
 * Setiap dataset = 1 bulan — persis seperti aimsv2
 */
function PerformanceLineChart({ labels = [], datasets = [], loading }) {
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
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Health Performance
            </span>
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

export default function HealthPerformanceWidget({ filters = {} }) {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    const yearsKey = Array.isArray(filters.years) ? filters.years.join(',') : (filters.years ?? '');

    const fetchStats = useCallback(async (y) => {
        setLoading(true); setError(false);
        try {
            const params = {}; if (y) params.year = y;
            const res = await axios.get('/api/dashboard/health-performance/stats', { params });
            if (res.data?.result) setStats(res.data.result);
            else setError(true);
        } catch { setError(true); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchStats(yearsKey); }, [yearsKey, fetchStats]);

    const isEmpty = !loading && !error && (stats?.datasets ?? []).length === 0;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px', padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            width: '100%', boxSizing: 'border-box',
        }}>
            <style>{CSS}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={16} style={{ color: P }} />
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #1e293b)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        Health Performance
                    </h4>
                </div>
                {loading && <RefreshCw size={14} style={{ color: '#94a3b8', animation: 'health-spin 1s linear infinite' }} />}
            </div>

            {error ? (
                <div style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: '13px' }}>
                    Gagal memuat data.{' '}
                    <button onClick={() => fetchStats(yearsKey)} style={{ color: P, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Coba lagi</button>
                </div>
            ) : isEmpty ? (
                <div style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: '13px' }}>Belum ada data Health Performance.</div>
            ) : (
                <PerformanceLineChart
                    labels={stats?.labels ?? []}
                    datasets={stats?.datasets ?? []}
                    loading={loading}
                />
            )}
        </div>
    );
}
