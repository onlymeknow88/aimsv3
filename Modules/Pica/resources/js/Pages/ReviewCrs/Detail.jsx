import React, { useCallback, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, SearchCheck } from 'lucide-react';
import axios from 'axios';
import StatusBadge from '../ActiveDocument/Partials/StatusBadge';
import DetailSidebar from '../ActiveDocument/Partials/Detail/DetailSidebar';
import DetailInfo from '../ActiveDocument/Partials/Detail/DetailInfo';
import DetailActivity from '../ActiveDocument/Partials/Detail/DetailActivity';

export default function ReviewCrsDetail() {
    const { id } = usePage().props;
    const [doc, setDoc]                     = useState(null);
    const [loading, setLoading]             = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchDoc = useCallback(() => {
        setLoading(true);
        axios.get(`/api/pica/documents/${id}`)
            .then(res => setDoc(res.data?.result ?? null))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { fetchDoc(); }, [fetchDoc]);

    const handleApproval = async (action) => {
        setActionLoading(action);
        try {
            await axios.post(`/api/pica/documents/${id}/approval`, { action });
            fetchDoc();
        } catch {}
        finally { setActionLoading(null); }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Memuat data...</span>
        </div>
    );

    if (!doc) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <span style={{ fontSize: '13px', color: '#ef4444' }}>Dokumen tidak ditemukan.</span>
        </div>
    );

    return (
        <>
            <Head title={`Review CRS — ${doc.identity_id ?? 'Detail'}`} />

            {/* Top Bar */}
            <div style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90, flexWrap: 'wrap', gap: '10px' }}>
                <a href="/pica/review-crs" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                    <ArrowLeft size={14} /> Kembali ke Review CRS
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SearchCheck size={15} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{doc.identity_id}</span>
                    <StatusBadge status={doc.status} />
                </div>
                {doc.status === 'On Review CRS' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleApproval('approve_crs')}
                            disabled={actionLoading === 'approve_crs'}
                            style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(47,191,113,0.1)', color: '#2FBF71', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {actionLoading === 'approve_crs' ? '...' : 'Approve CRS'}
                        </button>
                        <button
                            onClick={() => handleApproval('reject_crs')}
                            disabled={actionLoading === 'reject_crs'}
                            style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {actionLoading === 'reject_crs' ? '...' : 'Reject CRS'}
                        </button>
                    </div>
                )}
            </div>

            {/* 3-Column Grid */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: '16px', alignItems: 'start' }}>
                <DetailSidebar doc={doc} />
                <DetailInfo doc={doc} />
                <DetailActivity doc={doc} onRefresh={fetchDoc} />
            </div>
        </>
    );
}