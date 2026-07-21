import { HardHat, RefreshCw } from 'lucide-react';

import FieldLeadershipCategoryProgress from './FieldLeadershipCategoryProgress';
import FieldLeadershipDetail from './FieldLeadershipDetail';
import FieldLeadershipDonutCharts from './FieldLeadershipDonutCharts';
import FieldLeadershipMonthlyChart from './FieldLeadershipMonthlyChart';
import FieldLeadershipSummary from './FieldLeadershipSummary';
import React from 'react';
import useFieldLeadership from './useFieldLeadership';

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <>
            <style>{`
                @keyframes flswidget-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
            `}</style>
            {/* Row 1: summary + detail */}
            <div className="flswidget-grid-top">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: '12px', padding: '14px 16px',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                            animation: 'flswidget-pulse 1.5s infinite',
                        }}>
                            <div style={{ height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '60%' }} />
                            <div style={{ height: '26px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '40%' }} />
                            <div style={{ height: '8px',  backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                        </div>
                    ))}
                </div>
                <div style={{
                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '12px', overflow: 'hidden',
                    animation: 'flswidget-pulse 1.5s infinite',
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            padding: '10px 12px', borderBottom: '1px solid #f1f5f9',
                            display: 'flex', gap: '12px',
                        }}>
                            <div style={{ flex: 1, height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                            <div style={{ width: '40px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                            <div style={{ width: '24px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                            <div style={{ width: '32px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2: bar chart */}
            <div style={{
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '12px', padding: '16px',
                animation: 'flswidget-pulse 1.5s infinite',
            }}>
                <div style={{ height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '30%', marginBottom: '16px' }} />
                <div style={{
                    height: '180px', display: 'flex', alignItems: 'flex-end', gap: '6px',
                }}>
                    {[60, 80, 45, 90, 70, 55, 75, 95, 65, 50, 85, 40].map((h, i) => (
                        <div key={i} style={{
                            flex: 1, height: `${h}%`,
                            backgroundColor: '#e2e8f0', borderRadius: '4px 4px 0 0',
                        }} />
                    ))}
                </div>
            </div>

            {/* Row 3: donuts + progress */}
            <div className="flswidget-grid-bottom">
                {[1, 2].map(i => (
                    <div key={i} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                        animation: 'flswidget-pulse 1.5s infinite',
                    }}>
                        <div style={{ width: 130, height: 130, borderRadius: '50%', backgroundColor: '#e2e8f0' }} />
                        <div style={{ width: '80px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                    </div>
                ))}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    animation: 'flswidget-pulse 1.5s infinite',
                }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '80px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                                <div style={{ width: '32px', height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

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
                @media (max-width: 900px) {
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
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardHat size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{
                        fontSize: '14.5px', fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)', margin: 0,
                    }}>
                        FIELD LEADERSHIP
                    </h4>
                </div>

                {loading && (
                    <RefreshCw
                        size={14}
                        style={{ color: '#94a3b8', animation: 'flswidget-spin 1s linear infinite' }}
                    />
                )}
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            {error ? (
                <ErrorState onRetry={refetch} />
            ) : loading ? (
                <LoadingSkeleton />
            ) : isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    {/* Row 1: Summary (left) + Detail comparison (right) */}
                    <div className="flswidget-grid-top">
                        <FieldLeadershipSummary stats={stats} loading={false} />
                        <FieldLeadershipDetail  stats={stats} loading={false} />
                    </div>

                    {/* Row 2: Monthly bar chart — full width */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px',
                    }}>
                        <FieldLeadershipMonthlyChart stats={stats} loading={false} />
                    </div>

                    {/* Row 3: Donut charts (span 2 cols) + Category progress (1 col) */}
                    <div className="flswidget-grid-bottom">
                        <div style={{ gridColumn: 'span 2' }}>
                            <FieldLeadershipDonutCharts stats={stats} loading={false} />
                        </div>
                        <FieldLeadershipCategoryProgress stats={stats} loading={false} />
                    </div>
                </>
            )}
        </div>
    );
}
