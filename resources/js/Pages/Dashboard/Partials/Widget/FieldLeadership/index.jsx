import { HardHat, RefreshCw } from 'lucide-react';

import FieldLeadershipCategoryProgress from './FieldLeadershipCategoryProgress';
import FieldLeadershipDetail from './FieldLeadershipDetail';
import FieldLeadershipDonutCharts from './FieldLeadershipDonutCharts';
import FieldLeadershipMonthlyChart from './FieldLeadershipMonthlyChart';
import FieldLeadershipSummary from './FieldLeadershipSummary';
import React from 'react';
import useFieldLeadership from './useFieldLeadership';

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '12px', padding: '48px 20px', color: '#94a3b8',
        }}>
            <HardHat size={32} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data Field Leadership</span>
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

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '48px 20px', color: '#94a3b8',
        }}>
            <HardHat size={28} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>
                Belum ada data Field Leadership untuk periode ini.
            </span>
        </div>
    );
}

// ── Main widget ───────────────────────────────────────────────────────────────
/**
 * FieldLeadership Widget
 *
 * Props:
 *   filters — { years, months, companies } dari global dashboard filter.
 *             Masing-masing bisa comma-separated string atau array.
 */
export default function FieldLeadership({ filters = {} }) {
    const { stats, loading, error, refetch } = useFieldLeadership(filters);

    const isEmpty = !loading && !error && (stats?.summary_all ?? 0) === 0;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            marginBottom: '32px',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
        }}>
            <style>{`
                @keyframes flswidget-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                /* Row 1: 2 kolom — summary (1fr) | detail (2fr) */
                .flswidget-grid-top {
                    display: grid;
                    grid-template-columns: minmax(200px, 1fr) minmax(0, 2fr);
                    gap: 24px;
                    align-items: start;
                    margin-bottom: 24px;
                }
                /* Row 3: 3 kolom — donut-pair (span 2) | progress (1) */
                .flswidget-grid-bottom {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 24px;
                    align-items: start;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #f1f5f9;
                }
                @media (max-width: 768px) {
                    .flswidget-grid-top {
                        grid-template-columns: 1fr;
                    }
                    .flswidget-grid-bottom {
                        grid-template-columns: 1fr;
                    }
                    .flswidget-grid-bottom > div[style*='span 2'] {
                        grid-column: span 1;
                    }
                }
            `}</style>

            {/* ── Widget header ──────────────────────────────────────────── */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px',
                gap: '8px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <HardHat size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <h4 style={{
                        fontSize: '13px', fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)', margin: 0,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        Field Leadership
                    </h4>
                </div>

                {loading && (
                    <RefreshCw
                        size={14}
                        style={{ color: '#94a3b8', animation: 'flswidget-spin 1s linear infinite', flexShrink: 0 }}
                    />
                )}
            </div>

            {error ? (
                <ErrorState onRetry={refetch} />
            ) : isEmpty ? (
                <EmptyState />
            ) : (
                <FieldLeadershipSummary stats={stats} loading={loading} />
            )}
        </div>
    );
}
