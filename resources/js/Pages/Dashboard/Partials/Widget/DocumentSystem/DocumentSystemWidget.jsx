import React, { useCallback, useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import axios from 'axios';
import DocumentSystemDoughnut from './DocumentSystemDoughnut';
import DocumentSystemSummary from './DocumentSystemSummary';

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
    const [stats,   setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    const fetchStats = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(false);
        try {
            // Normalise array values to comma-separated strings for the query
            const params = {};
            if (currentFilters.years)     params.years     = Array.isArray(currentFilters.years)     ? currentFilters.years.join(',')     : currentFilters.years;
            if (currentFilters.months)    params.months    = Array.isArray(currentFilters.months)    ? currentFilters.months.join(',')    : currentFilters.months;
            if (currentFilters.companies) params.companies = Array.isArray(currentFilters.companies) ? currentFilters.companies.join(',') : currentFilters.companies;

            const res = await axios.get('/api/portal/document-system/stats', { params });
            if (res.data?.meta?.code === 200) {
                setStats(res.data.data);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Re-fetch whenever filters change
    useEffect(() => {
        fetchStats(filters);
    }, [
        filters?.years,
        filters?.months,
        filters?.companies,
        fetchStats,
    ]);

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
                    <FileText size={16} style={{ color: '#00552F' }} />
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
            `}</style>

            {/* ── Content ──────────────────────────────────────────────────── */}
            {error ? (
                <ErrorState onRetry={() => fetchStats(filters)} />
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 8fr)',
                    gap: '24px',
                    alignItems: 'start',
                }}>
                    {/* Left — summary stats */}
                    <DocumentSystemSummary stats={stats} loading={loading} />

                    {/* Right — doughnut charts + category bar */}
                    <DocumentSystemDoughnut stats={stats} loading={loading} />
                </div>
            )}
        </div>
    );
}