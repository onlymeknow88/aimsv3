import { Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { Line } from 'react-chartjs-2';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const PRIMARY     = '#153B73';

function MiniCalendar({ coeEvents = [] }) {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const eventDates = useMemo(() => {
        const map = new Map(); // key = 'YYYY-MM-DD', value = color
        coeEvents.forEach(evt => {
            if (!evt.start_date) return;
            const color = evt.category_color ?? PRIMARY;
            const start = new Date(evt.start_date);
            const end   = evt.end_date ? new Date(evt.end_date) : start;
            const cur   = new Date(start);
            while (cur <= end) {
                const key = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
                // Jika ada multiple event di tanggal yang sama, pakai warna pertama
                if (!map.has(key)) map.set(key, color);
                cur.setDate(cur.getDate() + 1);
            }
        });
        return map;
    }, [coeEvents]);

    const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
    const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

    const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday  = (d) => d && today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
    const getEventColor = (d) => {
        if (!d) return null;
        const key = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        return eventDates.get(key) ?? null;
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8', display: 'flex', alignItems: 'center', borderRadius: '6px' }}>
                    <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8', display: 'flex', alignItems: 'center', borderRadius: '6px' }}>
                    <ChevronRight size={16} />
                </button>
            </div>
            {/* Day names */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                {DAY_NAMES.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '6px 0' }}>{d}</div>
                ))}
            </div>
            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells.map((d, i) => {
                    const eventColor = getEventColor(d);
                    return (
                        <div key={i} style={{
                            position: 'relative', textAlign: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '8px 4px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: isToday(d) ? 800 : 400,
                            color: isToday(d) ? '#fff' : d ? '#0f172a' : 'transparent',
                            backgroundColor: isToday(d) ? PRIMARY : eventColor ? `${eventColor}18` : 'transparent',
                        }}>
                            {d ?? ''}
                            {eventColor && (
                                <div style={{
                                    position: 'absolute', bottom: '3px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '4px', height: '4px', borderRadius: '50%',
                                    backgroundColor: isToday(d) ? '#fff' : eventColor,
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * CalendarOfEventStats
 *
 * Widget statistik dan chart untuk Calendar of Event.
 * Menampilkan KPI, chart bulanan, dan breakdown by category.
 */
export default function CalendarOfEventStats({ stats, loading, coeEvents = [] }) {
    if (loading) {
        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '32px',
            }}>
                <style>{`
                    @keyframes coe-pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.4; }
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <Calendar size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        CALENDAR OF EVENT
                    </h4>
                </div>

                {/* Skeleton loading */}
                <style>{`
                    .coe-skel-row2 {
                        display: grid;
                        grid-template-columns: 200px 1fr 260px;
                        gap: 16px;
                        margin-top: 16px;
                    }
                    @media (max-width: 1024px) {
                        .coe-skel-row2 { grid-template-columns: 1fr 1fr; }
                    }
                    @media (max-width: 640px) {
                        .coe-skel-row2 { grid-template-columns: 1fr; }
                    }
                `}</style>

                {/* Row 1 skeleton: KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            padding: '16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            animation: 'coe-pulse 1.5s infinite',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                        }}>
                            <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '40%' }} />
                            <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '60%' }} />
                            <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '999px' }} />
                        </div>
                    ))}
                </div>

                {/* Row 2 skeleton: Complete/OnGoing + Chart + Category */}
                <div className="coe-skel-row2">
                    {/* Complete & OnGoing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[1, 2].map(i => (
                            <div key={i} style={{
                                padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px',
                                animation: 'coe-pulse 1.5s infinite', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                            }}>
                                <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '50%' }} />
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0' }} />
                            </div>
                        ))}
                    </div>
                    {/* Chart */}
                    <div style={{
                        padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px',
                        animation: 'coe-pulse 1.5s infinite',
                    }}>
                        <div style={{ height: '200px', backgroundColor: '#f1f5f9', borderRadius: '8px' }} />
                    </div>
                    {/* By Category */}
                    <div style={{
                        padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px',
                        animation: 'coe-pulse 1.5s infinite', display: 'flex', flexDirection: 'column', gap: '12px',
                    }}>
                        <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '50%' }} />
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '60%' }} />
                                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default stats jika tidak ada data
    const defaultStats = {
        ytd: { value: 0, trend: 0 },
        thisMonth: { actual: 0, target: 0, trend: 0 },
        thisYear: { actual: 0, target: 0, trend: 0 },
        complete: { value: 0, target: 0 },
        onGoing: { value: 0, target: 0 },
        chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            actual: Array(12).fill(0),
            target: Array(12).fill(0),
        },
        byCategory: {
            urgent: 0,
            important: 0,
            medium: 0,
            low: 0,
        },
    };

    const data = stats ?? defaultStats;

    // Chart config
    const chartConfig = {
        labels: data.chartData.labels,
        datasets: [
            {
                label: 'Actual',
                data: data.chartData.actual,
                borderColor: '#153B73',
                backgroundColor: 'rgba(21, 59, 115, 0.08)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Target',
                data: data.chartData.target,
                borderColor: '#FF8C24',
                backgroundColor: 'rgba(255, 140, 36, 0.08)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 11 }, boxWidth: 12 },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 10 } } },
        },
    };

    const getTrendColor = (trend) => trend >= 0 ? '#2FBF71' : '#EF4444';
    const getTrendBg   = (trend) => trend >= 0 ? 'rgba(47,191,113,0.12)' : 'rgba(239,68,68,0.12)';
    const getTrendIcon = (trend) => trend >= 0 ? '▲' : '▼';

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    CALENDAR OF EVENT
                </h4>
            </div>

            {/* 2 kolom 1 row: Mini Calendar kiri | Semua konten kanan */}
            <style>{`
                .coe-main-grid {
                    display: grid;
                    grid-template-columns: 420px 1fr;
                    gap: 20px;
                    align-items: start;
                }
                .coe-right-col {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .coe-kpi-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .coe-status-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                @media (max-width: 900px) {
                    .coe-main-grid { grid-template-columns: 1fr; }
                    .coe-kpi-row   { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 640px) {
                    .coe-kpi-row { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="coe-main-grid">
                {/* Kolom kiri: Mini Calendar */}
                <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', boxSizing: 'border-box' }}>
                    <MiniCalendar coeEvents={coeEvents} />
                </div>

                {/* Kolom kanan: KPI + Complete/OnGoing + Chart + By Category */}
                <div className="coe-right-col">

                    {/* KPI Row: YTD + This Month + This Year */}
                    <div className="coe-kpi-row">
                        {/* YTD Card */}
                        <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #153B73, #1E4E96)', color: '#fff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>YTD</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>{data.ytd.value}</h2>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: getTrendColor(data.ytd.trend), backgroundColor: getTrendBg(data.ytd.trend), padding: '2px 8px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    {getTrendIcon(data.ytd.trend)} {Math.abs(data.ytd.trend)}% VS LY
                                </span>
                            </div>
                            <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', backgroundColor: '#FF8C24', borderRadius: '999px', width: `${data.ytd.value > 0 ? 60 : 0}%`, transition: 'width 0.6s ease' }} />
                            </div>
                        </div>

                        {/* This Month */}
                        <div style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 6px 0', fontWeight: 600 }}>Event this month</p>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                <div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#153B73', margin: 0 }}>{data.thisMonth.actual}</h3>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: getTrendColor(data.thisMonth.trend), backgroundColor: getTrendBg(data.thisMonth.trend), padding: '1px 5px', borderRadius: '999px' }}>
                                        {getTrendIcon(data.thisMonth.trend)} {Math.abs(data.thisMonth.trend)}%
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#94a3b8', margin: 0 }}>{data.thisMonth.target}</h3>
                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Target</span>
                                </div>
                            </div>
                        </div>

                        {/* This Year */}
                        <div style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 6px 0', fontWeight: 600 }}>Event this year</p>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                <div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#153B73', margin: 0 }}>{data.thisYear.actual}</h3>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: getTrendColor(data.thisYear.trend), backgroundColor: getTrendBg(data.thisYear.trend), padding: '1px 5px', borderRadius: '999px' }}>
                                        {getTrendIcon(data.thisYear.trend)} {Math.abs(data.thisYear.trend)}%
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#94a3b8', margin: 0 }}>{data.thisYear.target}</h3>
                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Target</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complete & OnGoing */}
                    <div className="coe-status-row">
                        <div style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 6px 0', fontWeight: 600 }}>Complete</p>
                            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#2FBF71', margin: '0 0 4px 0' }}>
                                {Math.round((data.complete.value / (data.complete.target || 1)) * 100)}%
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '10px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#2FBF71' }} />
                                <span style={{ color: '#0f172a', fontWeight: 600 }}>Actual</span>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#cbd5e1' }} />
                                <span style={{ color: '#64748b' }}>Target</span>
                            </div>
                        </div>
                        <div style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 6px 0', fontWeight: 600 }}>On Going</p>
                            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#FF8C24', margin: '0 0 4px 0' }}>
                                {Math.round((data.onGoing.value / (data.onGoing.target || 1)) * 100)}%
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '10px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#FF8C24' }} />
                                <span style={{ color: '#0f172a', fontWeight: 600 }}>Actual</span>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#cbd5e1' }} />
                                <span style={{ color: '#64748b' }}>Target</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart + By Category — 1 row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px', alignItems: 'start' }}>
                        <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <div style={{ height: '160px' }}>
                                <Line data={chartConfig} options={chartOptions} />
                            </div>
                        </div>
                        <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: 600 }}>By Category</p>
                                <a href="/coe/calendar" style={{ fontSize: '10px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Show all</a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {data.byCategory && data.byCategory.length > 0 ? (
                                    data.byCategory.map(cat => (
                                        <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color || '#94a3b8', flexShrink: 0 }} />
                                                <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                                <div style={{ width: '50px', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${cat.percent}%`, height: '100%', backgroundColor: cat.color || '#94a3b8', borderRadius: '3px' }} />
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', minWidth: '24px', textAlign: 'right' }}>{cat.count}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontSize: '11px' }}>Belum ada kategori.</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>{/* end coe-right-col */}
            </div>{/* end coe-main-grid */}
        </div>
    );
}
