import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    ClipboardList,
    HardHat,
    ShieldAlert,
    Timer,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import { Head } from '@inertiajs/react';
import useFieldLeadership from '@/Pages/Dashboard/Partials/Widget/FieldLeadership/useFieldLeadership';

// ── FLS colors ────────────────────────────────────────────────────────────────
const FLS_PRIMARY   = 'var(--primary)';
const FLS_SECONDARY = '#FF8C24';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, count, icon: Icon, color, bg, href }) {
    return (
        <a
            href={href}
            style={{
                textDecoration: 'none',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div>
                <span style={{
                    fontSize: '11px', fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                    {title}
                </span>
                <h3 style={{
                    fontSize: '32px', fontWeight: 800,
                    color: 'var(--text-primary)', margin: '6px 0 0 0', lineHeight: 1,
                }}>
                    {count}
                </h3>
            </div>
            <div style={{
                padding: '12px', borderRadius: '10px',
                backgroundColor: bg, color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={26} />
            </div>
        </a>
    );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ percent, color = FLS_PRIMARY }) {
    const p = Math.min(100, Math.max(0, percent));
    return (
        <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
                width: `${p}%`, height: '100%',
                backgroundColor: color, borderRadius: '999px',
                transition: 'width 0.6s ease',
            }} />
        </div>
    );
}

// ── Category row ─────────────────────────────────────────────────────────────
function CategoryRow({ label, count, total, color }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {count} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({pct}%)</span>
                </span>
            </div>
            <ProgressBar percent={pct} color={color} />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Index({ stats: serverStats = {} }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Gunakan stats dari server (via Inertia props) untuk stat cards
    const s = serverStats;
    const total = s.total ?? 0;

    const statCards = [
        {
            title: 'Total Observasi',
            count: total,
            icon: ClipboardList,
            color: FLS_PRIMARY,
            bg: 'rgba(0,85,47,0.08)',
            href: '/field-leadership/observations',
        },
        {
            title: 'Open',
            count: s.open ?? 0,
            icon: AlertCircle,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.08)',
            href: '/field-leadership/observations',
        },
        {
            title: 'Closed',
            count: s.closed ?? 0,
            icon: CheckCircle2,
            color: FLS_SECONDARY,
            bg: 'rgba(145,186,95,0.08)',
            href: '/field-leadership/observations',
        },
        {
            title: 'Overdue',
            count: s.overdue ?? 0,
            icon: XCircle,
            color: '#ef4444',
            bg: 'rgba(239,68,68,0.08)',
            href: '/field-leadership/observations',
        },
    ];

    // Widget stats (YTD) via API hook — sama seperti di dashboard
    const { stats: widgetStats, loading } = useFieldLeadership({});
    const ytd     = widgetStats?.ytd             ?? { target: 0, actual: 0 };
    const ytdPct  = ytd.target > 0 ? Math.round((ytd.actual / ytd.target) * 100) : 0;

    return (
        <FieldLeadershipLayout>
            <Head title="Field Leadership" />

            {/* ── Page header ────────────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <HardHat size={22} style={{ color: FLS_PRIMARY }} />
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: FLS_PRIMARY, margin: 0 }}>
                        Field Leadership
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                    Monitor dan kelola observasi Planned Task Observation, Take Time Talk, dan Hazard Report.
                </p>
            </div>

            {/* ── YTD summary banner ──────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary), #1E4E96)',
                borderRadius: '14px',
                padding: '20px 24px',
                marginBottom: '28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Year to Date — Target vs Aktual
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                        <span style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1 }}>
                            {loading ? '—' : ytd.actual.toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                            / {loading ? '—' : ytd.target.toLocaleString('id-ID')} target
                        </span>
                    </div>
                    <div style={{ marginTop: '10px', width: '240px' }}>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${ytdPct}%`, height: '100%',
                                backgroundColor: FLS_SECONDARY, borderRadius: '999px',
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', display: 'block' }}>
                            {ytdPct}% dari target tahun ini
                        </span>
                    </div>
                </div>
                <a
                    href="/field-leadership/observations/create"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#fff', color: FLS_PRIMARY,
                        padding: '10px 20px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                        transition: 'opacity 0.2s ease',
                    }}
                >
                    + Buat Observasi
                </a>
            </div>

            {/* ── Stat cards ─────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
            }}>
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            {/* ── Category breakdown ─────────────────────────────────── */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '28px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <BarChart3 size={16} style={{ color: FLS_PRIMARY }} />
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Breakdown per Kategori
                    </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <CategoryRow
                        label="Planned Task Observation (PTO)"
                        count={s.pto ?? 0}
                        total={total}
                        color={FLS_PRIMARY}
                    />
                    <CategoryRow
                        label="Take Time Talk (TTT)"
                        count={s.ttt ?? 0}
                        total={total}
                        color={FLS_SECONDARY}
                    />
                    <CategoryRow
                        label="Hazard Report (HR)"
                        count={s.hr ?? 0}
                        total={total}
                        color="#E87722"
                    />
                </div>
            </div>

            {/* ── Quick links ────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '16px',
            }}>
                {[
                    { label: 'Lihat Semua Observasi', href: '/field-leadership/observations', icon: ClipboardList },
                    { label: 'Risk Finding',           href: '/field-leadership/risks',        icon: ShieldAlert },
                    { label: 'Master Data',            href: '/field-leadership/master',       icon: Timer },
                ].map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            backgroundColor: 'var(--card-bg)',
                            border: `1px solid var(--border-color)`,
                            borderRadius: '10px', padding: '14px 18px',
                            textDecoration: 'none',
                            fontSize: '13px', fontWeight: 600,
                            color: 'var(--text-primary)',
                            transition: 'border-color 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = FLS_PRIMARY}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                        <link.icon size={16} style={{ color: FLS_PRIMARY }} />
                        {link.label}
                    </a>
                ))}
            </div>
        </FieldLeadershipLayout>
    );
}
