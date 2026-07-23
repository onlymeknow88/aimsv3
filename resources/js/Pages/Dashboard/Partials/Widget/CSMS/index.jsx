import { HardHat, RefreshCw } from 'lucide-react';

import CsmsBarChart from './CsmsBarChart';
import CsmsDonutStatus from './CsmsDonutStatus';
import CsmsKpiCards from './CsmsKpiCards';
import React from 'react';
import useCsmsWidget from './Hooks/useCsmsWidget';

const C = {
    primary:   '#153B73',
    border:    '#e2e8f0',
    textMuted: '#64748b',
};

function ErrorState({ onRetry }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '12px', padding: '48px 20px', color: C.textMuted,
        }}>
            <HardHat size={32} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data CSMS</span>
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
            gap: '8px', padding: '48px 20px', color: C.textMuted,
        }}>
            <HardHat size={28} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>Belum ada data CSMS untuk periode ini.</span>
        </div>
    );
}

/**
 * CSMS Widget — ditampilkan di main dashboard portal AIMS.
 *
 * Menampilkan:
 * - 6 KPI cards (Bidding, Post Bidding, Renewal, Approved, On Review, Draft)
 * - Donut chart status sertifikat (Valid vs Expired)
 * - Bar chart trend Post Bidding & Renewal per bulan
 *
 * Props:
 *   filters — { years } dari global dashboard filter
 */
export default function CsmsWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useCsmsWidget(filters);

    const isEmpty = !loading && !error && (
        (stats?.summary?.totalBidding ?? 0) === 0 &&
        (stats?.summary?.totalPB      ?? 0) === 0
    );

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
                @keyframes csms-widget-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.4; }
                }
                @keyframes csms-widget-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .csms-widget-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 16px;
                }
                @media (max-width: 900px) {
                    .csms-widget-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardHat size={16} style={{ color: C.primary }} />
                    <h4 style={{
                        fontSize: '14.5px', fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)', margin: 0,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                    }}>
                        CSMS — Contractor Safety Management
                    </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {loading && (
                        <RefreshCw
                            size={14}
                            style={{ color: C.textMuted, animation: 'csms-widget-spin 1s linear infinite' }}
                        />
                    )}
                    <a
                        href="/csms/dashboard"
                        style={{
                            fontSize: '11px', fontWeight: 600,
                            color: C.primary, textDecoration: 'none',
                            padding: '4px 10px', borderRadius: '6px',
                            border: `1px solid ${C.border}`,
                            backgroundColor: '#f8fafc',
                        }}
                    >
                        Lihat Detail →
                    </a>
                </div>
            </div>

            {/* Content */}
            {error ? (
                <ErrorState onRetry={refetch} />
            ) : isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    {/* KPI Cards — 3 kolom x 2 baris */}
                    <CsmsKpiCards summary={stats?.summary} loading={loading} />

                    {/* Bottom: donut (kiri) + bar charts (kanan) */}
                    <div className="csms-widget-grid">
                        <CsmsDonutStatus donut={stats?.donutPJO} loading={loading} />
                        <CsmsBarChart stats={stats} loading={loading} />
                    </div>
                </>
            )}
        </div>
    );
}
