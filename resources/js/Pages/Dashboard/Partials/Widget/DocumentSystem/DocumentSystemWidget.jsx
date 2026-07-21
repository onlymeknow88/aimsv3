import { FileText, RefreshCw } from 'lucide-react';

import DocumentSystemDoughnut from './DocumentSystemDoughnut';
import DocumentSystemSummary from './DocumentSystemSummary';
import React from 'react';
import useDocumentSystemWidget from './useDocumentSystemWidget';

// ── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <>
            <style>{`
                @keyframes docsys-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
            <div className="docsys-grid">
                {/* Left skeleton — 3 summary blocks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            animation: 'docsys-pulse 1.5s infinite',
                        }}>
                            <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '60%' }} />
                            <div style={{ height: '26px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '40%' }} />
                            <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '999px', width: '100%' }} />
                            <div style={{ height: '11px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '50%' }} />
                        </div>
                    ))}
                </div>

                {/* Right skeleton — charts grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Top row — 2 doughnuts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[1, 2].map(i => (
                            <div key={i} style={{
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                animation: 'docsys-pulse 1.5s infinite',
                            }}>
                                <div style={{ width: '120px', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '50%' }} />
                                <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%' }} />
                            </div>
                        ))}
                    </div>

                    {/* Bottom row — category bars */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        animation: 'docsys-pulse 1.5s infinite',
                    }}>
                        <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '50%' }} />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '4px', flex: 1 }} />
                                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '40px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '40px 20px',
            color: '#94a3b8',
        }}>
            <FileText size={32} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data dokumen</span>
            <button
                onClick={onRetry}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                <RefreshCw size={12} /> Coba Lagi
            </button>
        </div>
    );
}

// ── Main widget ───────────────────────────────────────────────────────────────
/**
 * DocumentSystemWidget
 *
 * Props:
 *   filters  — { years, months, companies } from the global dashboard filter bar
 *              Each can be a comma-separated string or an array; defaults to
 *              current year when omitted.
 */
export default function DocumentSystemWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useDocumentSystemWidget(filters);

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            marginBottom: '32px',
        }}>

            {/* ── Widget header ─────────────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)',
                        margin: 0,
                    }}>
                        DOCUMENT SYSTEM
                    </h4>
                </div>

                {/* Subtle refresh spinner while loading */}
                {loading && (
                    <RefreshCw
                        size={14}
                        style={{
                            color: '#94a3b8',
                            animation: 'docsys-spin 1s linear infinite',
                        }}
                    />
                )}
            </div>

            <style>{`
                @keyframes docsys-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .docsys-grid {
                    display: grid;
                    grid-template-columns: minmax(220px, 1fr) minmax(0, 3fr);
                    gap: 24px;
                    align-items: start;
                }
                @media (max-width: 768px) {
                    .docsys-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* ── Content ──────────────────────────────────────────────────── */}
            {error ? (
                <ErrorState onRetry={refetch} />
            ) : loading ? (
                <LoadingSkeleton />
            ) : (
                <div className="docsys-grid">
                    {/* Left — YTD + KPI cards */}
                    <DocumentSystemSummary stats={stats} loading={false} />

                    {/* Right — donuts + line chart + category */}
                    <DocumentSystemDoughnut stats={stats} loading={false} />
                </div>
            )}
        </div>
    );
}
