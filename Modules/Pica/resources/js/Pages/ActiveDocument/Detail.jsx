import React, { useCallback, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import StatusBadge from './Partials/StatusBadge';
import DetailSidebar from './Partials/Detail/DetailSidebar';
import DetailInfo from './Partials/Detail/DetailInfo';
import DetailActivity from './Partials/Detail/DetailActivity';

export default function DetailPica() {
    const { id } = usePage().props;
    const [doc, setDoc]             = useState(null);
    const [loading, setLoading]     = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [previewFile, setPreviewFile]     = useState(null);
    const [previewUrl, setPreviewUrl]       = useState(null);

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

    const handlePreviewFile = async (file) => {
        setPreviewFile(file);
        try {
            const res = await axios.get(`/api/pica/files/${file.id}/preview`);
            setPreviewUrl(res.data?.result?.url ?? null);
        } catch {}
    };

    const actionButtons = () => {
        if (!doc) return null;
        const btn = (label, action, color = '#1d4ed8', bg = 'rgba(29,78,216,0.1)') => (
            <button
                key={action}
                onClick={() => handleApproval(action)}
                disabled={actionLoading === action}
                style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', backgroundColor: bg, color, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
                {actionLoading === action ? '...' : label}
            </button>
        );
        switch (doc.status) {
            case 'Draft':         return [<a key="edit" href={`/pica/edit/${id}`} style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>Edit</a>, btn('Submit', 'submit', '#2FBF71', 'rgba(47,191,113,0.1)')];
            case 'On Review PJA': return [btn('Approve PJA', 'approve_pja', '#2FBF71', 'rgba(47,191,113,0.1)'), btn('Reject PJA', 'reject_pja', '#ef4444', 'rgba(239,68,68,0.08)')];
            case 'On Review CRS': return [btn('Approve CRS', 'approve_crs', '#2FBF71', 'rgba(47,191,113,0.1)'), btn('Reject CRS', 'reject_crs', '#ef4444', 'rgba(239,68,68,0.08)')];
            case 'Open':
            case 'Overdue':       return [btn('Close', 'close', '#2FBF71', 'rgba(47,191,113,0.1)')];
            default:              return null;
        }
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
            <Head title={`PICA — ${doc.identity_id ?? 'Detail'}`} />

            {/* Top Bar */}
            <div style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90, flexWrap: 'wrap', gap: '10px' }}>
                <a href="/pica/active-document" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                    <ArrowLeft size={14} /> Kembali ke PICA
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={15} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{doc.identity_id}</span>
                    <StatusBadge status={doc.status} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {actionButtons()}
                </div>
            </div>

            {/* 3-Column Grid */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: '16px', alignItems: 'start' }}>
                <DetailSidebar doc={doc} />
                <DetailInfo doc={doc} onPreviewFile={handlePreviewFile} />
                <DetailActivity doc={doc} onRefresh={fetchDoc} />
            </div>

            {/* File Preview Modal */}
            {previewFile && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{previewFile.file?.split('/').pop() ?? 'Preview'}</h3>
                            <button onClick={() => { setPreviewFile(null); setPreviewUrl(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>✕</button>
                        </div>
                        {previewUrl ? (
                            /\.(jpg|jpeg|png|gif|webp)$/i.test(previewFile.file ?? '') ? (
                                <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }} />
                            ) : (
                                <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>Buka file di tab baru</a>
                            )
                        ) : (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat preview...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}