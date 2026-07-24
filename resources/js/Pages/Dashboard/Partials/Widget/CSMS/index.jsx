import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { HardHat, RefreshCw } from 'lucide-react';

import React from 'react';
import useCsmsWidget from './Hooks/useCsmsWidget';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const P      = '#153B73';
const P2     = '#1E4E96';
const G      = '#91BA5F';
const O      = '#FF8C24';
const R      = '#ef4444';
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
`;

function Skel({ w = '100%', h = '12px', r = '4px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r,
            backgroundColor: '#e2e8f0',
            animation: 'csms-pulse 1.8s infinite ease-in-out',
        }} />
    );
}

function ProgressBar({ pct, color = P }) {
    return (
        <div style={{ height: '6px', backgroundColor: '#e8edf3', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
                width: `${Math.min(100, Math.max(0, pct))}%`,
                height: '100%', backgroundColor: color,
                borderRadius: '999px', transition: 'width .6s ease',
            }} />
        </div>
    );
}

// ── 1. Summary ────────────────────────────────────────────────────────────────
function Summary({ summary, loading }) {
    const total    = (summary?.totalBidding ?? 0) + (summary?.totalPB ?? 0) + (summary?.totalRenewal ?? 0);
    const approved = summary?.totalApproved ?? 0;
    const pct      = total > 0 ? Math.round(approved / total * 100) : 0;

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>YTD</p>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Skel h="36px" w="60%" /><Skel h="6px" r="999px" /><Skel h="10px" w="40%" />
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: P, lineHeight: 1, marginBottom: '8px' }}>
                        {total.toLocaleString('id-ID')}
                    </div>
                    <ProgressBar pct={pct} color={G} />
                    <p style={{ fontSize: '11px', color: MUTED, margin: '6px 0 0' }}>{pct}% approved</p>
                </>
            )}
        </div>
    );
}

// ── 2. Detail ─────────────────────────────────────────────────────────────────
// Layout horizontal 3 kolom seperti aimsv2: Bidding | Extension | Qualification
const DETAIL_COLORS = [P, O, G];

function Detail({ detail = [], summary, loading }) {
    const ytd = summary?.ytd ?? 0;

    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: 0 }}>Detail Kategori</p>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: MUTED }}>YTD</div>
                    {loading
                        ? <Skel w="40px" h="20px" />
                        : <div style={{ fontSize: '20px', fontWeight: 800, color: P, lineHeight: 1 }}>{ytd.toLocaleString('id-ID')}</div>
                    }
                </div>
            </div>
            {/* 3 kolom horizontal seperti aimsv2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {loading
                    ? [1,2,3].map(i => (
                        <div key={i} style={{ backgroundColor: BG, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Skel h="10px" w="60%" />
                            <Skel h="28px" w="50%" />
                            <Skel h="8px" r="999px" />
                            <Skel h="10px" w="40%" />
                        </div>
                    ))
                    : detail.map((row, i) => {
                        const isUp  = row.this_year_mark === 'up';
                        const color = DETAIL_COLORS[i % DETAIL_COLORS.length];
                        return (
                            <div key={i} style={{ backgroundColor: BG, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.4px' }}>{row.name}</span>
                                <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{(row.this_year ?? 0).toLocaleString('id-ID')}</span>
                                <ProgressBar pct={row.this_year_percent ?? 0} color={color} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: MUTED }}>{row.this_year_percent ?? 0}% dari YTD</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700,
                                        padding: '1px 6px', borderRadius: '999px',
                                        backgroundColor: isUp ? '#ecfdf5' : '#fef2f2',
                                        color: isUp ? '#065f46' : '#991b1b',
                                    }}>
                                        {isUp ? '▲' : '▼'} VS LY
                                    </span>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

// ── 3. Dougnut ────────────────────────────────────────────────────────────────
const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '72%',
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
    },
};

const DONUT_COLORS = [P, R, G, O];

function DonutItem({ item, idx, loading }) {
    const color = DONUT_COLORS[idx % 4];
    const chartData = {
        labels: ['Actual', 'Remaining'],
        datasets: [{ data: [item.actual, item.target], backgroundColor: [color, '#e8edf3'], borderWidth: 2, borderColor: '#fff' }],
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            {loading ? (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite' }} />
            ) : (
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <Doughnut data={chartData} options={donutOpts} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color, lineHeight: 1 }}>{item.actual}%</div>
                    </div>
                </div>
            )}
            <span style={{ fontSize: '10px', fontWeight: 600, color: MUTED, textAlign: 'center', lineHeight: 1.3, maxWidth: '90px' }}>{item.name}</span>
        </div>
    );
}

function Dougnut({ progress = [], loading }) {
    const items = loading ? [{name:'...',actual:0,target:0},{name:'...',actual:0,target:0},{name:'...',actual:0,target:0},{name:'...',actual:0,target:0}] : progress;
    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 16px' }}>Status Sertifikat</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {items.map((item, i) => <DonutItem key={i} item={item} idx={i} loading={loading} />)}
            </div>
        </div>
    );
}

// ── 4. Chart ──────────────────────────────────────────────────────────────────
const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { color: MUTED, font: { size: 10 }, boxWidth: 10, padding: 10 } },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: MUTED, font: { size: 9 } } },
        y: { beginAtZero: true, ticks: { color: MUTED, font: { size: 9 } }, grid: { color: '#f1f5f9' } },
    },
};

function buildBar(series, c1, c2) {
    if (!series?.length) return { labels: [], datasets: [] };
    return {
        labels: series.map(d => d.month),
        datasets: [
            { label: series[0]?.label  ?? 'S1', backgroundColor: c1, borderRadius: 3, data: series.map(d => d.count)  },
            { label: series[0]?.label2 ?? 'S2', backgroundColor: c2, borderRadius: 3, data: series.map(d => d.count2) },
        ],
    };
}

// Monthly chart — 1 bar saja seperti aimsv2 ($monthly)
function buildMonthly(monthly) {
    if (!monthly?.length) return { labels: [], datasets: [] };
    return {
        labels: monthly.map(d => d.month),
        datasets: [{ label: 'Total', backgroundColor: P, borderRadius: 4, data: monthly.map(d => d.count) }],
    };
}

function Chart({ stats, loading }) {
    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 12px' }}>Monthly</p>
            <div style={{ height: '220px' }}>
                {loading
                    ? <div style={{ height: '100%', backgroundColor: '#e2e8f0', borderRadius: '6px', animation: 'csms-pulse 1.8s infinite' }} />
                    : <Bar data={buildMonthly(stats?.monthly)} options={barOpts} />
                }
            </div>
        </div>
    );
}

// ── 5. Progress ───────────────────────────────────────────────────────────────
const CAT_COLORS = [P, G, O, P2, R];

function Progress({ category = [], loading }) {
    return (
        <div style={{ backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 14px' }}>By Category</p>
            {loading ? (
                [1,2,3].map(i => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                        <Skel h="10px" w="60%" />
                        <div style={{ marginTop: '6px' }}><Skel h="6px" r="999px" /></div>
                    </div>
                ))
            ) : category.length === 0 ? (
                <p style={{ fontSize: '12px', color: MUTED, textAlign: 'center', padding: '16px 0', margin: 0 }}>Belum ada data</p>
            ) : (
                category.map((item, i) => (
                    <div key={i} style={{ marginBottom: i === category.length - 1 ? 0 : '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '10px', color: MUTED }}>{item.count}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: CAT_COLORS[i % CAT_COLORS.length], backgroundColor: CAT_COLORS[i % CAT_COLORS.length] + '18', padding: '1px 6px', borderRadius: '999px' }}>
                                    {item.value}%
                                </span>
                            </div>
                        </div>
                        <ProgressBar pct={item.value} color={CAT_COLORS[i % CAT_COLORS.length]} />
                    </div>
                ))
            )}
        </div>
    );
}

// ── Root Widget ───────────────────────────────────────────────────────────────
export default function CsmsWidget({ filters = {} }) {
    const { stats, loading, error, refetch } = useCsmsWidget(filters);
    const isEmpty = !loading && !error &&
        (stats?.summary?.totalBidding ?? 0) === 0 &&
        (stats?.summary?.totalPB ?? 0) === 0;

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardHat size={16} style={{ color: P }} />
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #1e293b)', margin: 0, textTransform: 'uppercase', letterSpacing: '.3px' }}>
                        CSMS — Contractor Safety Management
                    </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(0, 2fr)', gap: '16px', marginBottom: '16px', alignItems: 'start' }}>
                        <Summary summary={stats?.summary} loading={loading} />
                        <Detail  detail={stats?.detail ?? []} summary={stats?.summary} loading={loading} />
                    </div>

                    {/* Row 2: Dougnut + Chart + Progress */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'start' }}>
                        <Dougnut  progress={stats?.progress ?? []} loading={loading} />
                        <Chart    stats={stats} loading={loading} />
                        <Progress category={stats?.category ?? []} loading={loading} />
                    </div>
                </>
            )}
        </div>
    );
}
