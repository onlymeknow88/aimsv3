import { ChevronDown, ChevronUp, FileText, TrendingDown, TrendingUp } from 'lucide-react';

import React from 'react';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = '14px', radius = '6px' }) {
    return (
        <div style={{
            width,
            height,
            borderRadius: radius,
            backgroundColor: '#e2e8f0',
            animation: 'docsummary-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ percent, color = '#153B73' }) {
    const clamped = Math.min(100, Math.max(0, percent));
    return (
        <div style={{
            height: '10px',
            backgroundColor: '#f1f5f9',
            borderRadius: '999px',
            overflow: 'hidden',
            width: '100%',
        }}>
            <div style={{
                width: `${clamped}%`,
                height: '100%',
                backgroundColor: color,
                borderRadius: '999px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
        </div>
    );
}

// ── Trend badge ───────────────────────────────────────────────────────────────
function TrendBadge({ mark }) {
    const isUp = mark === 'up';
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: isUp ? '#ecfdf5' : '#fef2f2',
            color: isUp ? '#065f46' : '#991b1b',
        }}>
            {isUp ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {isUp ? 'Naik' : 'Turun'}
        </span>
    );
}

// ── Comparison row ────────────────────────────────────────────────────────────
function ComparisonRow({ label, done, target, percent }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                    {done} <span style={{ fontWeight: 400, color: '#94a3b8' }}>/ {target}</span>
                </span>
            </div>
            <ProgressBar percent={percent} color="#91BA5F" />
            <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>{percent}% selesai</span>
        </div>
    );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, actual, target, mark, color = '#153B73', loading }) {
    const isUp = mark === 'up';
    const percent = target > 0 ? Math.round((actual / target) * 100) : 0;

    if (loading) {
        return (
            <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                animation: 'docsummary-pulse 1.5s infinite',
            }}>
                <SkeletonBlock width="60%" height="11px" />
                <SkeletonBlock width="40%" height="28px" />
                <SkeletonBlock height="10px" radius="999px" />
                <SkeletonBlock width="50%" height="11px" />
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </span>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>
                    {actual.toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    / {target.toLocaleString('id-ID')} target
                </span>
            </div>

            <ProgressBar percent={percent} color={color} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{percent}% selesai</span>
                {mark && (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isUp ? '#065f46' : '#991b1b',
                    }}>
                        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isUp ? 'Naik' : 'Turun'} VS LY
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DocumentSystemSummary({ stats, loading }) {
    const ytd            = stats?.ytd            ?? { target: 0, actual: 0 };
    const summaryMonthly = stats?.summary_monthly ?? {};
    const summaryYearly  = stats?.summary_yearly  ?? {};
    const ytdPercent     = ytd.target > 0 ? Math.round((ytd.actual / ytd.target) * 100) : 0;

    return (
        <>
            <style>{`
                @keyframes docsummary-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* ── YTD — besar di atas ──────────────────────────────────── */}
                {loading ? (
                    <div style={{
                        backgroundColor: '#00552F',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        animation: 'docsummary-pulse 1.5s infinite',
                    }}>
                        <SkeletonBlock width="50%" height="11px" />
                        <SkeletonBlock width="35%" height="36px" />
                        <SkeletonBlock height="8px" radius="999px" />
                    </div>
                ) : (
                    <div style={{
                        background: 'linear-gradient(135deg, #153B73, #1E4E96)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                YTD — Target vs Aktual
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>
                                {ytd.actual.toLocaleString('id-ID')}
                            </span>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                / {ytd.target.toLocaleString('id-ID')} target
                            </span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${ytdPercent}%`,
                                height: '100%',
                                backgroundColor: '#FF8C24',
                                borderRadius: '999px',
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>
                            {ytdPercent}% dari target tahun ini
                        </span>
                    </div>
                )}

                {/* ── This Month ───────────────────────────────────────────── */}
                <KpiCard
                    label="Bulan Ini"
                    actual={summaryMonthly.this_month_done   ?? 0}
                    target={summaryMonthly.this_month_target ?? 0}
                    mark={summaryMonthly.this_month_mark}
                    color="#153B73"
                    loading={loading}
                />

                {/* ── This Year ────────────────────────────────────────────── */}
                <KpiCard
                    label="Tahun Ini"
                    actual={summaryYearly.this_year_done   ?? 0}
                    target={summaryYearly.this_year_target ?? 0}
                    mark={summaryYearly.this_year_mark}
                    color="#153B73"
                    loading={loading}
                />

            </div>
        </>
    );
}
