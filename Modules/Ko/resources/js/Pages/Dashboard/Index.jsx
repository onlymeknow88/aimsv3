import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { HardHat, RefreshCw } from 'lucide-react';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import KoLayout from '../../Layouts/KoLayout';
import useDashboard from './Hooks/useDashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 10 } }, grid: { color: '#f1f5f9' } },
    },
};

export default function DashboardIndex() {
    const [year, setYear] = useState(new Date().getFullYear());
    const { stats, loading, refresh } = useDashboard(year);

    const statuses = Object.entries(stats.by_status ?? {});
    const monthly = stats.monthly ?? [];
    const chartData = {
        labels: monthly.map(m => `Bln ${m.month}`),
        datasets: [
            { label: 'Total', data: monthly.map(m => m.target), backgroundColor: '#1E4E96' },
            { label: 'Completed', data: monthly.map(m => m.actual), backgroundColor: '#2FBF71' },
        ],
    };

    return (
        <KoLayout>
            <Head title="Dashboard KO" />

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardHat size={18} style={{ color: 'var(--primary)' }} />
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Dashboard KO</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Monitoring proposal & komisioning unit</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Proposal</span>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{loading ? '-' : stats.total}</div>
                </div>
                {statuses.map(([status, count]) => (
                    <div key={status} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{status}</span>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{count}</div>
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Proposal per Bulan ({year})</h3>
                <div style={{ height: '300px' }}>
                    {loading ? 'Memuat...' : <Bar data={chartData} options={barOpts} />}
                </div>
            </div>
        </KoLayout>
    );
}
