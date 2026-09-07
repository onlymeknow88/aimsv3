import React from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PicaLayout from '../../Layouts/PicaLayout';
import useDashboard from './Hooks/useDashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

// Donut custom ala CSMS: cutout 72%, legend custom di kanan/bawah, total di tengah
const DONUT_COLORS = { open: '#36A2EB', closed: '#FF6384', overdue: '#FFCD56' };

const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { intersect: true, mode: 'index' } },
};

const COLORS = {
    open:    { color: '#FF8C24', bg: 'rgba(255,140,36,0.1)' },
    overdue: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    closed:  { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    draft:   { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

function SummaryCard({ label, value, color, bg }) {
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color }}>{value ?? '-'}</span>
        </div>
    );
}

function PieChartCard({ title, data, loading }) {
    const open = data?.open ?? 0;
    const closed = data?.closed ?? 0;
    const overdue = data?.overdue ?? 0;
    const total = open + closed + overdue;
    const chartData = {
        labels: ['Open', 'Closed', 'Overdue'],
        datasets: [{
            label: title,
            data: [open, closed, overdue],
            backgroundColor: [DONUT_COLORS.open, DONUT_COLORS.closed, DONUT_COLORS.overdue],
            borderWidth: 2,
            borderColor: '#fff',
        }],
    };
    const items = [
        { label: 'Open',    value: open,    color: DONUT_COLORS.open },
        { label: 'Closed',  value: closed,  color: DONUT_COLORS.closed },
        { label: 'Overdue', value: overdue, color: DONUT_COLORS.overdue },
    ];
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>{title}</h3>
            {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat...</div>
            ) : total === 0 ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>Belum ada data</div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Donut + teks total di tengah (custom ala DoughnutChartTextCenter aims) */}
                    <div style={{ position: 'relative', width: '220px', height: '220px', flexShrink: 0, margin: '0 auto' }}>
                        <Doughnut data={chartData} options={donutOpts} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{total}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.5px', marginTop: '4px' }}>TOTAL</div>
                        </div>
                    </div>
                    {/* Legend custom + count */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '160px' }}>
                        {items.map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color, flexShrink: 0 }} />
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, flex: 1 }}>{item.label}</span>
                                <strong style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardIndex() {
    const { summary, charts, loading, refresh } = useDashboard();

    return (
        <PicaLayout>
            <Head title="Dashboard PICA" />

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Dashboard PICA</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                            {summary?.last_update ? `Update: ${new Date(summary.last_update).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}` : 'Monitoring tindakan perbaikan'}
                        </p>
                    </div>
                </div>
                <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <SummaryCard label="Open"    value={summary?.total_open}    color={COLORS.open.color}    />
                <SummaryCard label="Overdue" value={summary?.total_overdue} color={COLORS.overdue.color} />
                <SummaryCard label="Closed"  value={summary?.total_closed}  color={COLORS.closed.color}  />
                <SummaryCard label="Draft"   value={summary?.total_draft}   color={COLORS.draft.color}   />
            </div>

            {/* Charts per source */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <PieChartCard title="Field Leadership Chart" data={charts?.['Field Leadership']} loading={loading} />
                <PieChartCard title="Inspeksi KPLH Chart" data={charts?.['Inspeksi KPLH']} loading={loading} />
                <PieChartCard title="Audit Chart" data={charts?.['Audit']} loading={loading} />
            </div>
        </PicaLayout>
    );
}

