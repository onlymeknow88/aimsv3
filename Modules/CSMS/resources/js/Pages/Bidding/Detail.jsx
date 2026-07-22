import React, { useState, useEffect, useCallback } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, ArrowLeft, Edit } from 'lucide-react';
import DetailLeftSidebar  from './Partials/Detail/DetailLeftSidebar';
import DetailCenter       from './Partials/Detail/DetailCenter';
import DetailRightSidebar from './Partials/Detail/DetailRightSidebar';

const STATUS_CONFIG = {
    'Draft':             { text: 'DRAFT',             color: '#64748b',        bg: 'rgba(100,116,139,0.1)' },
    'On Review OHS':     { text: 'ON REVIEW OHS',     color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review D/H OHS': { text: 'ON REVIEW D/H OHS', color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review KTT':     { text: 'ON REVIEW KTT',     color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'Approved':          { text: 'APPROVED',           color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'   },
    'Inactive':          { text: 'INACTIVE',           color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
};

export default function BiddingDetail() {
    const { id } = usePage().props;
    const [data,     setData]     = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const loadDetail = useCallback(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`/api/csms/biddings/${id}`)
            .then(res => {
                if (res.data?.result) setData(res.data.result);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { loadDetail(); }, [loadDetail]);

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Head title="Detail Bidding CSMS" />
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail Bidding CSMS...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Head title="Detail Bidding CSMS" />
                <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Data bidding tidak ditemukan.</p>
                <a href="/csms/bidding/lists" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
            </div>
        );
    }

    const { bidding, checklists = [] } = data;
    const status  = STATUS_CONFIG[bidding.status] ?? { text: bidding.status, color: '#64748b', bg: '#f1f5f9' };
    const canEdit = bidding.status === 'Draft';

    const isPostBidding = bidding.criteria === 'PostBidding';
    const backLink = isPostBidding ? '/csms/post-bidding/lists' : '/csms/bidding/lists';
    const backText = isPostBidding ? 'Kembali ke Post Bidding' : 'Kembali ke Bidding';
    const editLink = isPostBidding ? `/csms/post-bidding/edit/${id}` : `/csms/bidding/edit/${id}`;

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={`Detail Bidding: ${bidding.company_name ?? ''}`} />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href={backLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> {backText}
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: status.bg, color: status.color, padding: '2px 10px', borderRadius: '12px' }}>
                        {status.text}
                    </span>
                    {canEdit && (
                        <a href={editLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
                            <Edit size={12} /> Edit
                        </a>
                    )}
                </div>
            </div>

            {/* 3-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 280px', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>
                <aside style={{ order: isMobile ? 2 : 1 }}>
                    <DetailLeftSidebar bidding={bidding} />
                </aside>
                <main style={{ order: isMobile ? 1 : 2 }}>
                    <DetailCenter bidding={bidding} checklists={checklists} />
                </main>
                <aside style={{ order: 3 }}>
                    <DetailRightSidebar bidding={bidding} onApproval={loadDetail} />
                </aside>
            </div>
        </div>
    );
}