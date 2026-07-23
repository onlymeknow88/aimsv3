import { BarChart2, CheckCircle, Clock, FileText, RefreshCw, XCircle } from 'lucide-react';
import React from 'react';

const C = {
    primary:  '#153B73',
    blue:     '#2563eb',
    orange:   '#FF8C24',
    yellow:   '#f59e0b',
    gray:     '#94a3b8',
    border:   '#e2e8f0',
    bgCard:   '#fff',
};

const KPI_CONFIG = [
    { key: 'totalBidding',  label: 'Total Bidding',  icon: FileText,    color: C.primary  },
    { key: 'totalPB',       label: 'Post Bidding',   icon: BarChart2,   color: C.blue     },
    { key: 'totalRenewal',  label: 'Renewal',        icon: RefreshCw,   color: C.blue     },
    { key: 'totalApproved', label: 'Approved',       icon: CheckCircle, color: C.orange   },
    { key: 'totalOnReview', label: 'On Review',      icon: Clock,       color: C.yellow   },
    { key: 'totalDraft',    label: 'Draft',          icon: XCircle,     color: C.gray     },
];

function SkeletonCard() {
    return (
        <div style={{
            backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'csms-widget-pulse 1.8s infinite ease-in-out',
        }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '60%' }} />
                <div style={{ height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '40%' }} />
            </div>
        </div>
    );
}

export default function CsmsKpiCards({ summary, loading }) {
    if (loading) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '20px',
            }}>
                {KPI_CONFIG.map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
        }}>
            {KPI_CONFIG.map(kpi => {
                const Icon = kpi.icon;
                const value = summary?.[kpi.key] ?? 0;
                return (
                    <div key={kpi.key} style={{
                        backgroundColor: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: `${kpi.color}18`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Icon size={18} color={kpi.color} />
                        </div>
                        <div>
                            <span style={{
                                fontSize: '10px', fontWeight: 700,
                                color: C.gray, textTransform: 'uppercase',
                                letterSpacing: '0.5px', display: 'block', marginBottom: '2px',
                            }}>
                                {kpi.label}
                            </span>
                            <strong style={{
                                fontSize: '22px', fontWeight: 800,
                                color: C.primary, lineHeight: 1,
                            }}>
                                {value.toLocaleString('id-ID')}
                            </strong>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}