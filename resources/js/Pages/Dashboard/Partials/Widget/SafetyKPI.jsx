import React from 'react';
import { Calendar, Clock, HardHat, TrendingDown, TrendingUp, Users } from 'lucide-react';

const KPI_CONFIG = [
    {
        key: 'project_to_date',
        markKey: 'project_to_date_mark',
        title: 'PROJECT TO DATE',
        unit: 'Hari',
        icon: Calendar,
        color: '#2563eb',
    },
    {
        key: 'manhours',
        markKey: 'manhours_mark',
        title: 'MANHOURS',
        unit: 'Jam',
        icon: Clock,
        color: '#ea580c',
    },
    {
        key: 'day_after_last_lti',
        markKey: 'day_after_last_lti_mark',
        title: 'DAY AFTER LAST LTI',
        unit: 'Hari',
        icon: HardHat,
        color: '#16a34a',
    },
    {
        key: 'manpower',
        markKey: 'manpower_mark',
        title: 'MANPOWER',
        unit: 'Orang',
        icon: Users,
        color: '#7c3aed',
    },
];

function SkeletonCard() {
    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
            animation: 'kpi-pulse 1.8s infinite ease-in-out',
        }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '60%' }} />
                <div style={{ height: '22px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '80%' }} />
                <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '50%' }} />
            </div>
        </div>
    );
}

export default function SafetyKPI({ generalStats, loading }) {
    return (
        <>
            <style>{`
                @keyframes kpi-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
            }}>
                {loading
                    ? KPI_CONFIG.map((_, i) => <SkeletonCard key={i} />)
                    : KPI_CONFIG.map((kpi) => {
                        const Icon = kpi.icon;
                        const value = generalStats?.[kpi.key];
                        const mark = generalStats?.[kpi.markKey];
                        const isUp = mark === 'UP';
                        const hasData = value !== null && value !== undefined;

                        return (
                            <div
                                key={kpi.key}
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: 'var(--shadow-sm)',
                                    position: 'relative',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: `${kpi.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: kpi.color,
                                    flexShrink: 0,
                                }}>
                                    <Icon size={24} />
                                </div>

                                {/* Content */}
                                <div>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        marginBottom: '4px',
                                        letterSpacing: '0.5px',
                                    }}>
                                        {kpi.title}
                                    </span>

                                    <h3 style={{
                                        fontSize: '22px',
                                        fontWeight: 800,
                                        color: 'var(--text-primary)',
                                        margin: '0 0 4px 0',
                                        lineHeight: 1,
                                    }}>
                                        {hasData
                                            ? `${Number(value).toLocaleString('id-ID')} ${kpi.unit}`
                                            : <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Belum ada data</span>
                                        }
                                    </h3>

                                    {/* Trend indicator */}
                                    {hasData && mark && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '11.5px',
                                            fontWeight: 600,
                                            color: isUp ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)',
                                        }}>
                                            {isUp
                                                ? <TrendingUp size={12} />
                                                : <TrendingDown size={12} />
                                            }
                                            {isUp ? 'Naik dari periode lalu' : 'Turun dari periode lalu'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}