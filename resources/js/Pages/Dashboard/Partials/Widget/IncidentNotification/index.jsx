import { AlertTriangle, RefreshCw } from 'lucide-react';

import IncidentCategoryChart from './IncidentCategoryChart';
import IncidentMonthlyChart from './IncidentMonthlyChart';
import IncidentSummary from './IncidentSummary';
import React from 'react';
import useIncidentWidget from './Hooks/useIncidentWidget';

const P      = '#dc2626';
const BORDER = '#e2e8f0';

const CSS = `
    @keyframes incident-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
    @keyframes incident-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .incident-grid {
        display: grid;
        grid-template-columns: minmax(220px, 1fr) minmax(0, 1.8fr) minmax(0, 1.2fr);
        gap: 24px;
        align-items: start;
    }
    @media (max-width: 900px) {
        .incident-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 640px) {
        .incident-grid { grid-template-columns: 1fr; }
    }
`;

function ErrorState({ onRetry }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '12px', padding: '48px 20px', color: '#94a3b8',
        }}>
            <AlertTriangle size={32} style={{ color: '#fca5a5' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data Incident Notification</span>
            <button
                onClick={onRetry}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', backgroundColor: '#fff',
                    color: '#475569', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}
            >
                <RefreshCw size={12} /> Coba Lagi
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '48px 20px', color: '#94a3b8',
        }}>
            <AlertTriangle size={28} style={{ color: '#fca5a5' }} />
            <span style={{ fontSize: '13px' }}>Belum ada data Incident Notification.</span>
        </div>
    );
}

export default function IncidentNotificationWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useIncidentWidget(filters);
    const isEmpty = !loading && !error && (stats?.summary?.total ?? 0) === 0;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: `1px solid var(--border-color, ${BORDER})`,
            borderRadius: '16px', padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            marginBottom: '32px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden',
        }}>
            <style>{CSS}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <AlertTriangle size={16} style={{ color: P, flexShrink: 0 }} />
                    <h4 style={{
                        fontSize: '13px', fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)', margin: 0,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        Incident Notification
                    </h4>
                </div>

                {loading && (
                    <RefreshCw
                        size={14}
                        style={{ color: '#94a3b8', animation: 'incident-spin 1s linear infinite', flexShrink: 0 }}
                    />
                )}
            </div>

            {error ? (
                <ErrorState onRetry={refetch} />
            ) : isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    <div className="incident-grid">
                        <IncidentSummary  summary={stats?.summary}        loading={loading} />
                        <IncidentMonthlyChart monthly={stats?.monthly ?? []} loading={loading} />
                        <IncidentCategoryChart category={stats?.category ?? []} loading={loading} />
                    </div>

                    {/* Recent Incidents Table */}
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: '10px' }}>
                            Incident Terbaru
                        </span>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        {['No', 'Tanggal', 'Kasus', 'Kategori'].map(h => (
                                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: '11px', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i}>
                                                {Array.from({ length: 4 }).map((_, j) => (
                                                    <td key={j} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                                                        <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'incident-pulse 1.8s infinite ease-in-out' }} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (stats?.recent ?? []).length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8' }}>Tidak ada data</td>
                                        </tr>
                                    ) : (stats?.recent ?? []).map((item, idx) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '8px 12px', color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                                            <td style={{ padding: '8px 12px', color: '#475569', whiteSpace: 'nowrap' }}>{item.date}</td>
                                            <td style={{ padding: '8px 12px', color: '#0f172a', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.case}>{item.case}</td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                                    {item.category ?? '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
