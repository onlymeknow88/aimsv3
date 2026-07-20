import React from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

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
function ProgressBar({ percent, color = '#00552F' }) {
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

// ── Main component ────────────────────────────────────────────────────────────
export default function DocumentSystemSummary({ stats, loading }) {
    if (loading) {
        return (
            <>
                <style>{`
                    @keyframes docsummary-pulse {
                        0%, 100% { opacity: 1; }
                        50%       { opacity: 0.45; }
                    }
                `}</style>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* YTD skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <SkeletonBlock width="60%" height="12px" />
                        <SkeletonBlock height="10px" radius="999px" />
                        <SkeletonBlock width="40%" height="11px" />
                    </div>
                    {/* Monthly skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <SkeletonBlock width="50%" height="12px" />
                        <SkeletonBlock height="10px" radius="999px" />
                        <SkeletonBlock height="10px" radius="999px" />
                    </div>
                    {/* Yearly skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <SkeletonBlock width="50%" height="12px" />
                        <SkeletonBlock height="10px" radius="999px" />
                        <SkeletonBlock height="10px" radius="999px" />
                    </div>
                </div>
            </>
        );
    }

    const ytd            = stats?.ytd            ?? { target: 0, actual: 0 };
    const summaryMonthly = stats?.summary_monthly ?? {};
    const summaryYearly  = stats?.summary_yearly  ?? {};

    const ytdPercent = ytd.target > 0 ? Math.round((ytd.actual / ytd.target) * 100) : 0;

    return (
        <>
            <style>{`
                @keyframes docsummary-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ── YTD Target vs Actual ─────────────────────────────────── */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={13} style={{ color: '#00552F' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            YTD Target vs Aktual
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '26px', fontWeight: 800, color: '#00552F', lineHeight: 1 }}>
                            {ytd.actual.toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                            Target: <strong style={{ color: '#475569' }}>{ytd.target.toLocaleString('id-ID')}</strong>
                        </span>
                    </div>

                    <ProgressBar percent={ytdPercent} color="#00552F" />

                    <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
                        {ytdPercent}% dari target tahun ini
                    </span>
                </div>

                {/* ── Monthly Comparison ───────────────────────────────────── */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Perbandingan Bulanan
                        </span>
                        {summaryMonthly.this_month_mark && (
                            <TrendBadge mark={summaryMonthly.this_month_mark} />
                        )}
                    </div>

                    <ComparisonRow
                        label="Bulan Ini"
                        done={summaryMonthly.this_month_done   ?? 0}
                        target={summaryMonthly.this_month_target ?? 0}
                        percent={summaryMonthly.this_month_percent ?? 0}
                    />
                    <ComparisonRow
                        label="Bulan Lalu"
                        done={summaryMonthly.past_month_done   ?? 0}
                        target={summaryMonthly.past_month_target ?? 0}
                        percent={summaryMonthly.past_month_percent ?? 0}
                    />
                </div>

                {/* ── Yearly Comparison ────────────────────────────────────── */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Perbandingan Tahunan
                        </span>
                        {summaryYearly.this_year_mark && (
                            <TrendBadge mark={summaryYearly.this_year_mark} />
                        )}
                    </div>

                    <ComparisonRow
                        label="Tahun Ini"
                        done={summaryYearly.this_year_done   ?? 0}
                        target={summaryYearly.this_year_target ?? 0}
                        percent={summaryYearly.this_year_percent ?? 0}
                    />
                    <ComparisonRow
                        label="Tahun Lalu"
                        done={summaryYearly.past_year_done   ?? 0}
                        target={summaryYearly.past_year_target ?? 0}
                        percent={summaryYearly.past_year_percent ?? 0}
                    />
                </div>

            </div>
        </>
    );
}