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
import {
    BarChart2,
    CheckCircle,
    Clock,
    FileText,
    Filter,
    HardHat,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import CSMSLayout from '../../Layouts/CSMSLayout';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Colour tokens — matches Dashboard.jsx portal (#153B73 primary, #FF8C24 accent)
const C = {
    primary:     '#153B73',
    primaryLight:'#1E4E96',
    green:       '#00552F',
    lightGreen:  '#91BA5F',
    red:         '#ef4444',
    orange:      '#FF8C24',
    blue:        '#2563eb',
    purple:      '#7c3aed',
    cyan:        '#06b6d4',
    gray:        '#94a3b8',
    yellow:      '#f59e0b',
    border:      '#e2e8f0',
    bgCard:      '#fff',
    bgInner:     '#f8fafc',
    textPrimary: '#1e293b',
    textMuted:   '#64748b',
};

// Chart options
const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { color: C.textMuted, font: { size: 11 }, boxWidth: 12, padding: 16 } },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: C.textMuted, font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { color: C.textMuted, font: { size: 10 } }, grid: { color: '#f1f5f9' } },
    },
};

const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { intersect: true } },
};

// Dataset builders
function bar2(series, c1 = C.primary, c2 = C.orange) {
    if (!series?.length) return { labels: [], datasets: [] };
    return {
        labels: series.map(d => d.month),
        datasets: [
            { label: series[0]?.label  ?? 'S1', backgroundColor: c1, borderRadius: 3, data: series.map(d => d.count)  },
            { label: series[0]?.label2 ?? 'S2', backgroundColor: c2, borderRadius: 3, data: series.map(d => d.count2) },
        ],
    };
}
function bar3(series, c1 = C.primary, c2 = C.orange, c3 = C.lightGreen) {
    if (!series?.length) return { labels: [], datasets: [] };
    return {
        labels: series.map(d => d.month),
        datasets: [
            { label: series[0]?.label  ?? 'S1', backgroundColor: c1, borderRadius: 3, data: series.map(d => d.count)  },
            { label: series[0]?.label2 ?? 'S2', backgroundColor: c2, borderRadius: 3, data: series.map(d => d.count2) },
            { label: series[0]?.label3 ?? 'S3', backgroundColor: c3, borderRadius: 3, data: series.map(d => d.count3) },
        ],
    };
}
function bar4(series) {
    if (!series?.length) return { labels: [], datasets: [] };
    return {
        labels: series.map(d => d.month),
        datasets: [
            { label: series[0]?.label  ?? 'S1', backgroundColor: C.primary,    borderRadius: 3, data: series.map(d => d.count)  },
            { label: series[0]?.label2 ?? 'S2', backgroundColor: C.orange,     borderRadius: 3, data: series.map(d => d.count2) },
            { label: series[0]?.label3 ?? 'S3', backgroundColor: C.lightGreen, borderRadius: 3, data: series.map(d => d.count3) },
            { label: series[0]?.label4 ?? 'S4', backgroundColor: C.cyan,       borderRadius: 3, data: series.map(d => d.count4) },
        ],
    };
}

// Skeleton
function Skel({ w = '100%', h = '14px', r = '6px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, backgroundColor: '#e2e8f0', animation: 'csms-pulse 1.8s infinite ease-in-out' }} />;
}

// Progress bar
function ProgressBar({ percent, color = C.primary }) {
    return (
        <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, percent))}%`, height: '100%', backgroundColor: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
        </div>
    );
}

// KPI Card — matches SafetyKPI.jsx style
function KpiCard({ label, value, icon, color, loading }) {
    const Icon = icon;
    if (loading) {
        return (
            <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', animation: 'csms-pulse 1.8s infinite' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Skel w="60%" h="11px" />
                    <Skel w="40%" h="24px" />
                </div>
            </div>
        );
    }
    return (
        <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
            </div>
            <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>{label}</span>
                <h3 style={{ fontSize: '26px', fontWeight: 800, color: C.textPrimary, margin: 0, lineHeight: 1 }}>{value ?? '-'}</h3>
            </div>
        </div>
    );
}

// Widget wrapper — matches DocumentSystemWidget / FieldLeadership style
function Widget({ title, icon, loading, children }) {
    const Icon = icon;
    return (
        <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color={C.primary} />
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: C.textPrimary, margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{title}</h4>
                </div>
                {loading && <RefreshCw size={14} style={{ color: C.gray, animation: 'csms-spin 1s linear infinite' }} />}
            </div>
            {children}
        </div>
    );
}

// Chart card inside widget
function ChartCard({ title, height = 260, loading, children }) {
    return (
        <div style={{ backgroundColor: C.bgInner, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            {title && <p style={{ fontSize: '11px', fontWeight: 700, color: C.textMuted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>{title}</p>}
            <div style={{ height }}>
                {loading
                    ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Skel w="80%" h="140px" r="8px" /></div>
                    : children
                }
            </div>
        </div>
    );
}

// Error state
function ErrorState({ onRetry }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '48px 20px', color: C.gray }}>
            <HardHat size={32} style={{ color: '#e2e8f0' }} />
            <span style={{ fontSize: '13px' }}>Gagal memuat data dashboard</span>
            <button onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, backgroundColor: C.bgCard, color: '#475569', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                <RefreshCw size={12} /> Coba Lagi
            </button>
        </div>
    );
}

// Donut PJO widget
function DonutPJO({ donut, loading }) {
    const actual = donut?.actual ?? 0;
    const target = donut?.target ?? 0;

    // Always provide data so chart renders even when values are 0
    const donutChartData = {
        labels: ['Valid / Approved', 'Expired / Inactive'],
        datasets: [{
            data: actual === 0 && target === 0 ? [1, 0] : [actual, target],
            backgroundColor: [C.primary, C.orange],
            borderWidth: 2,
            borderColor: ['#fff', '#fff'],
        }],
    };

    const items = [
        { color: C.primary, label: 'Valid / Approved',   val: actual },
        { color: C.orange,  label: 'Expired / Inactive', val: target },
    ];

    return (
        <Widget title="Persentase Evaluasi PJO" icon={FileText} loading={loading}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <Skel w="200px" h="200px" r="50%" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                        <Skel w="180px" h="14px" /><Skel w="140px" h="10px" />
                        <Skel w="180px" h="14px" /><Skel w="140px" h="10px" />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap', padding: '8px 0' }}>
                    {/* Donut chart */}
                    <div style={{ position: 'relative', width: '200px', height: '200px', flexShrink: 0 }}>
                        <Doughnut data={donutChartData} options={donutOpts} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: C.primary, lineHeight: 1 }}>{actual}%</div>
                            <div style={{ fontSize: '10px', color: C.textMuted, fontWeight: 700, letterSpacing: '0.5px', marginTop: '4px' }}>VALID</div>
                        </div>
                    </div>

                    {/* Legend + progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '220px' }}>
                        {items.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500, flex: 1 }}>{item.label}</span>
                                    <strong style={{ fontSize: '20px', fontWeight: 800, color: C.primary }}>{item.val}%</strong>
                                </div>
                                <ProgressBar percent={item.val} color={item.color} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Widget>
    );
}

// Main Dashboard
export default function Dashboard() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);
    const [year,    setYear]    = useState(String(new Date().getFullYear()));
    const [years,   setYears]   = useState([String(new Date().getFullYear())]);

    const fetchStats = (selectedYear) => {
        setLoading(true);
        setError(false);
        axios.get(`/api/csms/dashboard-stats?year=${selectedYear}`)
            .then(res => {
                const result = res.data?.result ?? null;
                setData(result);
                if (result?.availableYears?.length) {
                    const ys = result.availableYears.map(String);
                    setYears(ys.includes(String(new Date().getFullYear())) ? ys : [String(new Date().getFullYear()), ...ys]);
                }
            })
            .catch(() => { setData(null); setError(true); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchStats(year); }, [year]);

    const s = data?.summary ?? {};

    const kpiCards = [
        { label: 'Total Bidding', value: s.totalBidding,  icon: FileText,    color: C.primary      },
        { label: 'Post Bidding',  value: s.totalPB,        icon: BarChart2,   color: C.primaryLight },
        { label: 'Renewal',       value: s.totalRenewal,   icon: RefreshCw,   color: C.blue         },
        { label: 'Approved',      value: s.totalApproved,  icon: CheckCircle, color: C.orange       },
        { label: 'On Review',     value: s.totalOnReview,  icon: Clock,       color: C.yellow       },
        { label: 'Draft',         value: s.totalDraft,     icon: XCircle,     color: C.gray         },
    ];

    return (
        <CSMSLayout>
            <style>{`
                @keyframes csms-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes csms-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .csms-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                @media (max-width: 768px) {
                    .csms-grid-2 { grid-template-columns: 1fr; }
                }
            `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>Dashboard CSMS</h2>
                        <p style={{ fontSize: '13px', color: C.textMuted, marginTop: '4px', marginBottom: 0 }}>
                            Contractor Safety Management System — Ringkasan kelayakan K3 kontraktor
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={14} color={C.gray} />
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            aria-label="Filter tahun"
                            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', border: `1px solid ${C.border}`, backgroundColor: C.bgCard, color: C.textPrimary, cursor: 'pointer', fontWeight: 600 }}
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* KPI Cards — matches SafetyKPI.jsx */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {kpiCards.map((c, i) => <KpiCard key={i} {...c} loading={loading} />)}
                </div>

                {error ? (
                    <ErrorState onRetry={() => fetchStats(year)} />
                ) : (
                    <>
                        {/* Donut PJO */}
                        <DonutPJO donut={data?.donutPJO} loading={loading} />

                        {/* Evaluasi PJO + Approved KTT */}
                        <Widget title="Evaluasi PJO & Approved KTT" icon={CheckCircle} loading={false}>
                            <div className="csms-grid-2">
                                <ChartCard title="Evaluasi PJO" loading={loading}><Bar data={bar2(data?.evaluatedPJO)} options={barOpts} /></ChartCard>
                                <ChartCard title="Approved KTT" loading={loading}><Bar data={bar2(data?.approvedKTT)} options={barOpts} /></ChartCard>
                            </div>
                        </Widget>

                        {/* Post Bidding + Perpanjangan */}
                        <Widget title="Post Bidding & Perpanjangan" icon={FileText} loading={false}>
                            <div className="csms-grid-2">
                                <ChartCard title="Post Bidding" loading={loading}><Bar data={bar2(data?.postBidding)} options={barOpts} /></ChartCard>
                                <ChartCard title="Perpanjangan (Renewal)" loading={loading}><Bar data={bar2(data?.renewal)} options={barOpts} /></ChartCard>
                            </div>
                        </Widget>

                        {/* Status Ijin + Tingkat Resiko */}
                        <Widget title="Status Ijin & Tingkat Resiko" icon={BarChart2} loading={false}>
                            <div className="csms-grid-2">
                                <ChartCard title="Status Ijin Perusahaan" loading={loading}><Bar data={bar2(data?.biddingValid, C.primary, C.orange)} options={barOpts} /></ChartCard>
                                <ChartCard title="Tingkat Resiko" loading={loading}><Bar data={bar3(data?.riskLevel, C.primary, C.orange, C.red)} options={barOpts} /></ChartCard>
                            </div>
                        </Widget>

                        {/* PICA */}
                        <Widget title="PICA" icon={BarChart2} loading={false}>
                            <ChartCard title="Open / Outstanding / Closed" height={300} loading={loading}>
                                <Bar data={bar3(data?.picaCount, C.primary, C.orange, C.lightGreen)} options={barOpts} />
                            </ChartCard>
                        </Widget>

                        {/* Klasifikasi Kontraktor */}
                        <Widget title="Klasifikasi Kontraktor" icon={HardHat} loading={false}>
                            <ChartCard height={300} loading={loading}>
                                <Bar data={bar4(data?.contractorClassification)} options={barOpts} />
                            </ChartCard>
                        </Widget>

                        {/* Kompetensi PJO */}
                        <Widget title="Kompetensi PJO — SPV: POP / POM / POU" icon={HardHat} loading={false}>
                            <ChartCard height={300} loading={loading}>
                                <Bar data={bar3(data?.spvStats, C.primary, C.blue, C.orange)} options={barOpts} />
                            </ChartCard>
                        </Widget>
                    </>
                )}
            </div>
        </CSMSLayout>
    );
}
