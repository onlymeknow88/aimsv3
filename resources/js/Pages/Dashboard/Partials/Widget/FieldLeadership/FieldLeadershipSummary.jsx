import { HardHat, TrendingDown, TrendingUp } from 'lucide-react';

import React from 'react';

// ── FLS brand colors ──────────────────────────────────────────────────────────
const FLS_PRIMARY   = 'var(--primary)';
const FLS_SECONDARY = '#FF8C24';

// ── Skeleton block ────────────────────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = '14px', radius = '6px' }) {
    return (
        <div style={{
            width, height, borderRadius: radius,
            backgroundColor: '#e2e8f0',
            animation: 'flssummary-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ percent, color = FLS_PRIMARY }) {
    const clamped = Math.min(100, Math.max(0, percent));
    return (
        <div style={{
            height: '8px', backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '999px', overflow: 'hidden', width: '100%',
        }}>
            <div style={{
                width: `${clamped}%`, height: '100%',
                backgroundColor: color, borderRadius: '999px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
        </div>
    );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, done, target, mark, loading }) {
    const percent = target > 0 ? Math.round((done / target) * 100) : 0;
    const isUp    = mark === 'up';

    if (loading) {
        return (
            <div style={{
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '12px', padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                animation: 'flssummary-pulse 1.5s infinite',
            }}>
                <SkeletonBlock width="60%" height="11px" />
                <SkeletonBlock width="45%" height="26px" />
                <SkeletonBlock height="8px" radius="999px" />
                <SkeletonBlock width="50%" height="11px" />
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
            <span style={{
                fontSize: '11px', fontWeight: 600, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
                {label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color: FLS_PRIMARY, lineHeight: 1 }}>
                    {done.toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    / {target.toLocaleString('id-ID')} target
                </span>
            </div>
            {/* Progress bar with FLS secondary color on light bg */}
            <div style={{
                height: '8px', backgroundColor: '#e2e8f0',
                borderRadius: '999px', overflow: 'hidden',
            }}>
                <div style={{
                    width: `${percent}%`, height: '100%',
                    backgroundColor: FLS_SECONDARY, borderRadius: '999px',
                    transition: 'width 0.6s ease',
                }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{percent}% selesai</span>
                {mark && (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        fontSize: '10px', fontWeight: 700,
                        color: isUp ? '#065f46' : '#991b1b',
                    }}>
                        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isUp ? 'Naik' : 'Turun'} vs LY
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FieldLeadershipSummary({ stats, loading }) {
    const ytd            = stats?.ytd            ?? { target: 0, actual: 0 };
    const summaryMonthly = stats?.summary_monthly ?? {};
    const summaryYearly  = stats?.summary_yearly  ?? {};
    const ytdPercent     = ytd.target > 0 ? Math.round((ytd.actual / ytd.target) * 100) : 0;

    return (
        <>
            <style>{`
                @keyframes flssummary-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.45; }
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* ── YTD card ─────────────────────────────────────────────── */}
                {loading ? (
                    <div style={{
                        background: FLS_PRIMARY, borderRadius: '12px',
                        padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px',
                        animation: 'flssummary-pulse 1.5s infinite',
                    }}>
                        <SkeletonBlock width="50%" height="11px" />
                        <SkeletonBlock width="35%" height="36px" />
                        <SkeletonBlock height="8px" radius="999px" />
                    </div>
                ) : (
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), #1E4E96)',
                        borderRadius: '12px', padding: '16px 20px',
                        display: 'flex', flexDirection: 'column', gap: '8px', color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <HardHat size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            <span style={{
                                fontSize: '11px', fontWeight: 700,
                                color: 'rgba(255,255,255,0.8)',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>
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
                        <ProgressBar percent={ytdPercent} color={FLS_SECONDARY} />
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>
                            {ytdPercent}% dari target tahun ini
                        </span>
                    </div>
                )}

                {/* ── This Month ───────────────────────────────────────────── */}
                <KpiCard
                    label="Bulan Ini"
                    done={summaryMonthly.this_month_done   ?? 0}
                    target={summaryMonthly.this_month_target ?? 0}
                    mark={summaryMonthly.this_month_mark}
                    loading={loading}
                />

                {/* ── This Year ────────────────────────────────────────────── */}
                <KpiCard
                    label="Tahun Ini"
                    done={summaryYearly.this_year_done   ?? 0}
                    target={summaryYearly.this_year_target ?? 0}
                    mark={summaryYearly.this_year_mark}
                    loading={loading}
                />
            </div>
        </>
    );
}
