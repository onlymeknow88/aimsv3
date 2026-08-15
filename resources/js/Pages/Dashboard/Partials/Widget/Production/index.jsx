import { BarChart2, RefreshCw } from 'lucide-react';

import ProductionCategoryChart from './ProductionCategoryChart';
import ProductionMonthlyChart from './ProductionMonthlyChart';
import ProductionProgressChart from './ProductionProgressChart';
import ProductionSummary from './ProductionSummary';
import ProductionYearlyChart from './ProductionYearlyChart';
import React from 'react';
import useProductionWidget from './Hooks/useProductionWidget';

const P      = '#1d4ed8';
const BORDER = '#e2e8f0';

const CSS = `
    @keyframes prod-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
    @keyframes prod-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .prod-grid-top {
        display: grid;
        grid-template-columns: minmax(200px, 1fr) minmax(0, 2fr) minmax(0, 1fr);
        gap: 24px;
        align-items: start;
        margin-bottom: 24px;
    }
    .prod-grid-bottom {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
        gap: 24px;
        align-items: start;
        padding-top: 24px;
        border-top: 1px solid #f1f5f9;
    }
    @media (max-width: 900px) {
        .prod-grid-top    { grid-template-columns: 1fr 1fr; }
        .prod-grid-bottom { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
        .prod-grid-top    { grid-template-columns: 1fr; }
        .prod-grid-bottom { grid-template-columns: 1fr; }
    }
`;

function ErrorState({ onRetry }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '48px 20px', color: '#94a3b8' }}>
            <BarChart2 size={32} style={{ color: '#bfdbfe' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data Production</span>
            <button onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                <RefreshCw size={12} /> Coba Lagi
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '48px 20px', color: '#94a3b8' }}>
            <BarChart2 size={28} style={{ color: '#bfdbfe' }} />
            <span style={{ fontSize: '13px' }}>Belum ada data Production.</span>
        </div>
    );
}

export default function ProductionWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useProductionWidget(filters);
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
                    <BarChart2 size={16} style={{ color: P, flexShrink: 0 }} />
                    <h4 style={{
                        fontSize: '13px', fontWeight: 700,
                        color: 'var(--text-primary, #1e293b)', margin: 0,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        Production
                    </h4>
                </div>

                {loading && (
                    <RefreshCw size={14} style={{ color: '#94a3b8', animation: 'prod-spin 1s linear infinite', flexShrink: 0 }} />
                )}
            </div>

            {error ? (
                <ErrorState onRetry={refetch} />
            ) : isEmpty ? (
                <EmptyState />
            ) : (
                <>
                    {/* Row 1: Summary | Monthly chart | Progress doughnut */}
                    <div className="prod-grid-top">
                        <ProductionSummary
                            summary={stats?.summary}
                            category={stats?.category ?? []}
                            loading={loading}
                        />
                        <ProductionMonthlyChart
                            monthly={stats?.monthly ?? []}
                            loading={loading}
                        />
                        <ProductionProgressChart
                            progress={stats?.progress}
                            loading={loading}
                        />
                    </div>

                    {/* Row 2: Yearly horizontal bar | Category doughnut */}
                    <div className="prod-grid-bottom">
                        <ProductionYearlyChart
                            yearly={stats?.yearly ?? []}
                            loading={loading}
                        />
                        <ProductionCategoryChart
                            category={stats?.category ?? []}
                            loading={loading}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
