import React from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import PicaLayout from '../../Layouts/PicaLayout';
import useDashboard from './Hooks/useDashboard';

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

function PieChartCard({ title, data }) {
    const total = (data?.open ?? 0) + (data?.closed ?? 0) + (data?.overdue ?? 0);
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                    { label: 'Open',    value: data?.open    ?? 0, ...COLORS.open },
                    { label: 'Closed',  value: data?.closed  ?? 0, ...COLORS.closed },
                    { label: 'Overdue', value: data?.overdue ?? 0, ...COLORS.overdue },
                ].map(item => {
                    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                        <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.label}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.value} ({pct}%)</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                    );
                })}
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Total: {total}</div>
            </div>
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
                <PieChartCard title="Field Leadership" data={charts?.['Field Leadership']} />
                <PieChartCard title="Inspeksi KPLH" data={charts?.['Inspeksi KPLH']} />
                <PieChartCard title="Audit" data={charts?.['Audit']} />
            </div>
        </PicaLayout>
    );
}

