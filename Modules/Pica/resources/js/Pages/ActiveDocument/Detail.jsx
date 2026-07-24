import React, { useCallback, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import StatusBadge from './Partials/StatusBadge';
import DetailSidebar from './Partials/Detail/DetailSidebar';
import DetailInfo from './Partials/Detail/DetailInfo';
import DetailActivity from './Partials/Detail/DetailActivity';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function DetailPica() {
    const { id } = usePage().props;
    const [doc, setDoc]             = useState(null);
    const [loading, setLoading]     = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [previewFile, setPreviewFile]     = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmTitle, setConfirmTitle]         = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const [confirmType, setConfirmType]           = useState('generic');
    const [approvalAction, setApprovalAction]     = useState('');

    const [showRejectModal, setShowRejectModal]   = useState(false);
    const [rejectAction, setRejectAction]         = useState('');
    const [rejectComment, setRejectComment]       = useState('');
    const [rejectFiles, setRejectFiles]           = useState([]);
    const [isMobile, setIsMobile]                 = useState(false);

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

    const handleApproval = (action) => {
        if (action.includes('reject')) {
            setRejectAction(action);
            setRejectComment('');
            setRejectFiles([]);
            setShowRejectModal(true);
        } else {
            setApprovalAction(action);
            if (action === 'submit') {
                setConfirmTitle('Kirim Dokumen PICA?');
                setConfirmDescription('Dokumen akan dikirim ke PJA untuk proses review.');
                setConfirmType('draft');
            } else if (action === 'approve_pja') {
                setConfirmTitle('Setujui Dokumen (PJA)?');
                setConfirmDescription('Apakah Anda yakin ingin menyetujui dokumen ini sebagai PJA? Dokumen akan diteruskan ke CRS.');
                setConfirmType('review');
            } else if (action === 'approve_crs') {
                setConfirmTitle('Setujui Dokumen (CRS)?');
                setConfirmDescription('Apakah Anda yakin ingin menyetujui dokumen ini sebagai CRS?');
                setConfirmType('review');
            } else if (action === 'close') {
                setConfirmTitle('Selesaikan PICA (Close)?');
                setConfirmDescription('Apakah Anda yakin ingin menyelesaikan temuan PICA ini? Status dokumen akan diubah menjadi Closed.');
                setConfirmType('generic');
            }
            setShowConfirmModal(true);
        }
    };

    const submitApproval = async () => {
        setActionLoading(approvalAction);
        try {
            await axios.post(`/api/pica/documents/${id}/approval`, { action: approvalAction });
            setShowConfirmModal(false);
            fetchDoc();
        } catch {}
        finally { setActionLoading(null); }
    };

    const submitReject = async () => {
        if (!rejectComment.trim()) return;
        setActionLoading(rejectAction);
        const fd = new FormData();
        fd.append('action', rejectAction);
        fd.append('comment', rejectComment);
        rejectFiles.forEach(f => fd.append('files[]', f));

        try {
            await axios.post(`/api/pica/documents/${id}/approval`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowRejectModal(false);
            fetchDoc();
        } catch {}
        finally { setActionLoading(null); }
    };

    const handlePreviewFile = (file) => {
        setPreviewFile({
            ...file,
            type: 'pica',
            name: file.file,
            file_name: file.file ? file.file.split('/').pop() : 'File'
        });
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
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: isMobile ? '20px 16px' : '40px 20px' }}>
            <Head title={`PICA — ${doc.identity_id ?? 'Detail'}`} />

            {/* Top Bar Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{doc.identity_id}</span>
                    <StatusBadge status={doc.status} />
                </div>
            </div>

            {/* 3-Column Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 280px',
                gap: isMobile ? '16px' : '24px',
                alignItems: 'start',
            }}>
                <div style={{ order: isMobile ? 2 : 1 }}>
                    <DetailSidebar doc={doc} />
                </div>
                <div style={{ order: isMobile ? 1 : 2 }}>
                    <DetailInfo doc={doc} onPreviewFile={handlePreviewFile} />
                </div>
                <div style={{ order: isMobile ? 3 : 3 }}>
                    <DetailActivity doc={doc} onRefresh={fetchDoc} onPreviewFile={handlePreviewFile} handleApproval={handleApproval} actionLoading={actionLoading} />
                </div>
            </div>

            {/* File Preview Modal */}
            <BlobPreviewModal attachment={previewFile} onClose={() => setPreviewFile(null)} />

            {/* Confirmation Modal (Submit, Approve, Close) */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                type={confirmType}
                title={confirmTitle}
                description={confirmDescription}
                confirmText="Ya, Lanjutkan"
                cancelText="Batal"
                onConfirm={submitApproval}
                onCancel={() => setShowConfirmModal(false)}
                loading={actionLoading === approvalAction}
            />

            {/* Rejection Modal (Reject PJA, Reject CRS) */}
            {showRejectModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '450px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px 0', textTransform: 'capitalize' }}>
                            {rejectAction.replace('_', ' ')}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                            Tulis alasan penolakan/pengembalian dokumen.
                        </p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                Catatan Alasan <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                value={rejectComment}
                                onChange={e => setRejectComment(e.target.value)}
                                placeholder="Tulis alasan penolakan di sini..."
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                File Lampiran Pendukung
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={e => setRejectFiles(Array.from(e.target.files))}
                                style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', width: '100%' }}
                            />
                            {rejectFiles.length > 0 && (
                                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    {rejectFiles.map((f, i) => <div key={i}>{f.name}</div>)}
                                </div>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => { setShowRejectModal(false); setRejectComment(''); setRejectFiles([]); }} 
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: 'var(--text-secondary)' }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={submitReject} 
                                disabled={actionLoading || !rejectComment.trim()}
                                style={{ 
                                    padding: '8px 20px', 
                                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    cursor: !rejectComment.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {actionLoading ? 'Memproses...' : 'Ya, Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}