import { HardHat, RefreshCw } from 'lucide-react';

import CsmsCategoryProgress from './CsmsCategoryProgress';
import CsmsDetail from './CsmsDetail';
import CsmsDonutCharts from './CsmsDonutCharts';
import CsmsMonthlyChart from './CsmsMonthlyChart';
import CsmsSummary from './CsmsSummary';
import React from 'react';
import useCsmsWidget from './Hooks/useCsmsWidget';

const P      = '#153B73';
const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const BG     = '#f8fafc';

const CSS = `
    @keyframes csms-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
    @keyframes csms-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .csms-grid-top {
        display: grid;
        grid-template-columns: minmax(240px, 1fr) minmax(0, 2.5fr);
        gap: 24px;
        align-items: stretch;
        margin-bottom: 24px;
    }
    .csms-grid-bottom {
        display: grid;
        grid-template-columns: 1fr 1.2fr 1fr;
        gap: 24px;
        align-items: start;
        padding-top: 24px;
        border-top: 1px solid #f1f5f9;
    }
    @media (max-width: 900px) {
        .csms-grid-top { grid-template-columns: 1fr; }
        .csms-grid-bottom { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 640px) {
        .csms-grid-bottom { grid-template-columns: 1fr; }
    }
`;

// ── Root Widget ───────────────────────────────────────────────────────────────
export default function CsmsWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useCsmsWidget(filters);
    const isEmpty = !loading && !error && (stats?.summary?.ytd ?? 0) === 0;

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
                    <HardHat size={16} style={{ color: P, flexShrink: 0 }} />
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #1e293b)', margin: 0, textTransform: 'uppercase', letterSpacing: '.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        CSMS — Contractor Safety Management
                    </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {loading && <RefreshCw size={13} style={{ color: MUTED, animation: 'csms-spin 1s linear infinite' }} />}
                    <a href="/csms/dashboard" style={{ fontSize: '11px', fontWeight: 600, color: P, textDecoration: 'none', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${BORDER}`, backgroundColor: BG }}>
                        Lihat Detail →
                    </a>
                </div>
            </div>

            {error ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px', color: MUTED }}>
                    <HardHat size={28} style={{ color: '#e2e8f0' }} />
                    <span style={{ fontSize: '13px' }}>Gagal memuat data CSMS</span>
                    <button onClick={refetch} style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${BORDER}`, backgroundColor: '#fff', color: '#475569', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={12} /> Coba Lagi
                    </button>
                </div>
            ) : isEmpty ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '40px', color: MUTED }}>
                    <HardHat size={28} style={{ color: '#e2e8f0' }} />
                    <span style={{ fontSize: '13px' }}>Belum ada data CSMS untuk periode ini.</span>
                </div>
            ) : (
                <>
                    {/* Row 1: Summary + Detail */}
                    <div className="csms-grid-top">
                        <CsmsSummary summary={stats?.summary} loading={loading} />
                        <CsmsDetail  detail={stats?.detail ?? []} summary={stats?.summary} loading={loading} />
                    </div>

                    {/* Row 2: Donut + Chart + Category */}
                    <div className="csms-grid-bottom">
                        <CsmsDonutCharts    progress={stats?.progress ?? []} loading={loading} />
                        <CsmsMonthlyChart   monthly={stats?.monthly ?? []} loading={loading} />
                        <CsmsCategoryProgress category={stats?.category ?? []} loading={loading} />
                    </div>
                </>
            )}
        </div>
    );
}
