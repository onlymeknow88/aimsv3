import { ChevronDown, ChevronUp } from 'lucide-react';

import React from 'react';

const FLS_PRIMARY = 'var(--primary)';

// ── Skeleton block ────────────────────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = '14px', radius = '6px' }) {
    return (
        <div style={{
            width, height, borderRadius: radius,
            backgroundColor: '#e2e8f0',
            animation: 'flsdetail-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Trend icon ────────────────────────────────────────────────────────────────
function TrendIcon({ mark }) {
    const isUp = mark === 'up';
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '2px',
            fontSize: '11px', fontWeight: 700,
            color: isUp ? '#065f46' : '#991b1b',
        }}>
            {isUp
                ? <ChevronUp   size={13} strokeWidth={2.5} />
                : <ChevronDown size={13} strokeWidth={2.5} />
            }
            {isUp ? '▲' : '▼'}
        </span>
    );
}

// ── Single comparison row ─────────────────────────────────────────────────────
function ComparisonRow({ label, done, percent, mark, isHeader = false, loading }) {
    if (loading) {
        return (
            <tr>
                <td style={{ padding: '8px 12px' }}><SkeletonBlock width="80%" height="11px" /></td>
                <td style={{ padding: '8px 12px' }}><SkeletonBlock width="40px" height="11px" /></td>
                <td style={{ padding: '8px 12px' }}><SkeletonBlock width="24px" height="11px" /></td>
                <td style={{ padding: '8px 12px' }}><SkeletonBlock width="32px" height="11px" /></td>
            </tr>
        );
    }

    return (
        <tr style={{ backgroundColor: isHeader ? 'rgba(0,85,47,0.04)' : 'transparent' }}>
            <td style={{
                padding: '8px 12px', fontSize: '12px',
                fontWeight: isHeader ? 600 : 400,
                color: isHeader ? '#1e293b' : '#64748b',
            }}>
                {label}
            </td>
            <td style={{
                padding: '8px 12px', fontSize: '13px',
                fontWeight: 700, color: isHeader ? FLS_PRIMARY : '#475569',
                textAlign: 'right',
            }}>
                {(done ?? 0).toLocaleString('id-ID')}
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                {mark ? <TrendIcon mark={mark} /> : <span style={{ color: '#e2e8f0' }}>—</span>}
            </td>
            <td style={{
                padding: '8px 12px', fontSize: '12px',
                fontWeight: 600, color: '#94a3b8', textAlign: 'right',
            }}>
                {percent ?? 0}%
            </td>
        </tr>
    );
}

// ── Section header row ────────────────────────────────────────────────────────
function SectionHeader({ label }) {
    return (
        <tr>
            <td colSpan={4} style={{
                padding: '6px 12px 2px',
                fontSize: '10px', fontWeight: 700,
                color: FLS_PRIMARY, textTransform: 'uppercase', letterSpacing: '0.6px',
                borderBottom: `2px solid ${FLS_PRIMARY}`,
            }}>
                {label}
            </td>
        </tr>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FieldLeadershipDetail({ stats, loading }) {
    const monthly = stats?.summary_monthly ?? {};
    const yearly  = stats?.summary_yearly  ?? {};

    return (
        <>
            <style>{`
                @keyframes flsdetail-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
                .flsdetail-table { width: 100%; border-collapse: collapse; }
                .flsdetail-table tr:not(:last-child) td {
                    border-bottom: 1px solid #f1f5f9;
                }
            `}</style>

            <div style={{
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '12px', overflow: 'hidden',
            }}>
                {/* Column header */}
                <table className="flsdetail-table">
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9' }}>
                            <th style={{
                                padding: '8px 12px', fontSize: '10px', fontWeight: 700,
                                color: '#94a3b8', textAlign: 'left',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>Periode</th>
                            <th style={{
                                padding: '8px 12px', fontSize: '10px', fontWeight: 700,
                                color: '#94a3b8', textAlign: 'right',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>Aktual</th>
                            <th style={{
                                padding: '8px 12px', fontSize: '10px', fontWeight: 700,
                                color: '#94a3b8', textAlign: 'center',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>Tren</th>
                            <th style={{
                                padding: '8px 12px', fontSize: '10px', fontWeight: 700,
                                color: '#94a3b8', textAlign: 'right',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Monthly section */}
                        <SectionHeader label="Bulanan" />
                        <ComparisonRow
                            label="Bulan Ini"
                            done={monthly.this_month_done}
                            percent={monthly.this_month_percent}
                            mark={monthly.this_month_mark}
                            isHeader
                            loading={loading}
                        />
                        <ComparisonRow
                            label="Bulan Lalu"
                            done={monthly.past_month_done}
                            percent={monthly.past_month_percent}
                            mark={monthly.past_month_mark}
                            loading={loading}
                        />

                        {/* Yearly section */}
                        <SectionHeader label="Tahunan" />
                        <ComparisonRow
                            label="Tahun Ini"
                            done={yearly.this_year_done}
                            percent={yearly.this_year_percent}
                            mark={yearly.this_year_mark}
                            isHeader
                            loading={loading}
                        />
                        <ComparisonRow
                            label="Tahun Lalu"
                            done={yearly.past_year_done}
                            percent={yearly.past_year_percent}
                            mark={yearly.past_year_mark}
                            loading={loading}
                        />
                    </tbody>
                </table>
            </div>
        </>
    );
}
