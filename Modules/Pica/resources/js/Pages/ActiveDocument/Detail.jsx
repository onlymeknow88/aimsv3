import React, { useCallback, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import StatusBadge from './Partials/StatusBadge';
import ApprovalTimeline from './Partials/Detail/ApprovalTimeline';
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
    const [isMobile, setIsMobile]   = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
        const btn = (label, action, color = 'var(--primary)', bg = 'rgba(21,59,115,0.08)') => (
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
            case 'Draft':         return [<a key="edit" href={`/pica/edit/${id}`} style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>Edit</a>, btn('Submit', 'submit', 'var(--success)', 'rgba(34,197,94,0.1)')];
            case 'On Review PJA': return [btn('Approve PJA', 'approve_pja', 'var(--success)', 'rgba(34,197,94,0.1)'), btn('Reject PJA', 'reject_pja', 'var(--danger)', 'rgba(239,68,68,0.08)')];
            case 'On Review CRS': return [btn('Approve CRS', 'approve_crs', 'var(--success)', 'rgba(34,197,94,0.1)'), btn('Reject CRS', 'reject_crs', 'var(--danger)', 'rgba(239,68,68,0.08)')];
            case 'Open':
            case 'Overdue':       return [btn('Close', 'close', 'var(--success)', 'rgba(34,197,94,0.1)')];
            default:              return null;
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Head title="Detail PICA" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail PICA...</span>
        </div>
    );

    if (!doc) return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Head title="Detail PICA" />
            <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Dokumen PICA tidak ditemukan.</p>
            <a href="/pica/active-document" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
        </div>
    );

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={`PICA — ${doc.identity_id ?? 'Detail'}`} />

            {/* Top Bar Header — gaya FieldLeadership Detail */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <a href="/pica/active-document" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                }}>
                    <ArrowLeft size={16} /> Kembali ke PICA
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{doc.identity_id}</span>
                    <StatusBadge status={doc.status} />
                    {actionButtons()}
                </div>
            </div>

            {/* 3-Column Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 280px',
                gap: isMobile ? '16px' : '24px',
                alignItems: 'start',
            }}>
                {/* LEFT SIDEBAR */}
                <aside style={{ order: isMobile ? 2 : 1 }}>
                    <DetailSidebar doc={doc} />
                </aside>

                {/* CENTER */}
                <main style={{ order: isMobile ? 1 : 2 }}>
                    <DetailInfo doc={doc} onPreviewFile={handlePreviewFile} />
                </main>

                {/* RIGHT SIDEBAR */}
                <aside style={{ order: isMobile ? 3 : 3 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ApprovalTimeline doc={doc} />
                        <DetailActivity doc={doc} onRefresh={fetchDoc} />
                    </div>
                </aside>
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
        </div>
    );
}