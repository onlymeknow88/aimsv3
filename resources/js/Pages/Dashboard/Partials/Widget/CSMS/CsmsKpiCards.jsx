import { BarChart2, CheckCircle, Clock, FileText, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
    );
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isMobile;
}

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
    { key: 'totalBidding',  label: 'Total Bidding',  icon: FileText,    gradient: 'linear-gradient(135deg, #153B73, #1E4E96)', sub: 'Total kontraktor terdaftar'   },
    { key: 'totalPB',       label: 'Post Bidding',   icon: BarChart2,   gradient: 'linear-gradient(135deg, #1d4ed8, #2563eb)', sub: 'Penilaian kelayakan CSMS'     },
    { key: 'totalRenewal',  label: 'Renewal',        icon: RefreshCw,   gradient: 'linear-gradient(135deg, #0369a1, #0284c7)', sub: 'Perpanjangan sertifikat'      },
    { key: 'totalApproved', label: 'Approved',       icon: CheckCircle, gradient: 'linear-gradient(135deg, #b45309, #d97706)', sub: 'Sertifikat disetujui'         },
    { key: 'totalOnReview', label: 'On Review',      icon: Clock,       gradient: 'linear-gradient(135deg, #a16207, #ca8a04)', sub: 'Sedang dalam proses review'   },
    { key: 'totalDraft',    label: 'Draft',          icon: XCircle,     gradient: 'linear-gradient(135deg, #475569, #64748b)', sub: 'Belum disubmit'              },
];

function SkeletonCard() {
    return (
        <div style={{
            background: '#e2e8f0',
            borderRadius: '12px', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            animation: 'csms-widget-pulse 1.8s infinite ease-in-out',
            minHeight: '90px',
        }}>
            <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px', width: '50%' }} />
            <div style={{ height: '28px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px', width: '35%' }} />
            <div style={{ height: '9px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px', width: '65%' }} />
        </div>
    );
}

export default function CsmsKpiCards({ summary, loading }) {
    const isMobile = useIsMobile(640);
    const isTablet = useIsMobile(900);

    const cols = isMobile ? '1fr' : isTablet ? '1fr 1fr 1fr' : 'repeat(3, 1fr)';
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: cols,
        gap: '12px',
        marginBottom: '20px',
    };

    if (loading) {
        return (
            <div style={gridStyle}>
                {KPI_CONFIG.map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    return (
        <div style={gridStyle}>
            {KPI_CONFIG.map((kpi) => {
                const Icon = kpi.icon;
                const value = summary?.[kpi.key] ?? 0;
                return (
                    <div key={kpi.key} style={{
                        background: kpi.gradient,
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        color: '#fff',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon size={13} style={{ color: 'rgba(255,255,255,0.75)' }} />
                            <span style={{
                                fontSize: '11px', fontWeight: 700,
                                color: 'rgba(255,255,255,0.85)',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>
                                {kpi.label}
                            </span>
                        </div>
                        <span style={{
                            fontSize: '32px', fontWeight: 800,
                            lineHeight: 1, color: '#fff',
                        }}>
                            {value.toLocaleString('id-ID')}
                        </span>
                        <span style={{
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.6)',
                        }}>
                            {kpi.sub}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
