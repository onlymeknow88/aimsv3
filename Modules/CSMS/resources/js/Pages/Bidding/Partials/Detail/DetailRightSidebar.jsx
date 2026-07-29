import { Archive, Ban, CheckCircle, Clock, Download, FileText, Paperclip, RefreshCw, RotateCcw, Send, ShieldCheck, RefreshCcw, X } from 'lucide-react';
import React, { useState } from 'react';

import ConfirmationModal from '@/Components/ConfirmationModal';
import axios from 'axios';

const APPROVAL_STEPS = [
    { key: 'Draft',              label: 'Draft' },
    { key: 'On Review OHS',      label: 'Review OHS' },
    { key: 'On Review D/H OHS',  label: 'Review D/H OHS' },
    { key: 'On Review KTT',      label: 'Review KTT' },
    { key: 'Approved',           label: 'Approved' },
];

function ApprovalTimeline({ status }) {
    const currentIdx = APPROVAL_STEPS.findIndex(s => s.key === status);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {APPROVAL_STEPS.map((step, idx) => {
                const done   = idx < currentIdx;
                const active = idx === currentIdx;
                return (
                    <div key={step.key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', zIndex: 1,
                                backgroundColor: done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0',
                                border: `2px solid ${done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {done   && <CheckCircle size={11} color="#fff" />}
                                {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                            </div>
                            {idx < APPROVAL_STEPS.length - 1 && (
                                <div style={{ width: '2px', height: '28px', backgroundColor: done ? 'var(--success)' : '#e2e8f0' }} />
                            )}
                        </div>
                        <div style={{ paddingTop: '2px', paddingBottom: '14px' }}>
                            <div style={{ fontSize: '11px', fontWeight: active ? 700 : 600, color: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--text-muted, #94a3b8)' }}>
                                {step.label}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
};

const sectionTitle = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
    marginBottom: '12px', textTransform: 'uppercase',
};

const btnBase = (bg, color = '#fff', border = 'none') => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '9px 14px', backgroundColor: bg, color, border,
    borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%',
});

const modalOverlay = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 9999, padding: '16px',
};
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' };
const modalBody   = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' };
const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const textareaStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' };
const btnCancel   = { padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' };

const REVIEW_STATUSES = ['On Review OHS', 'On Review D/H OHS', 'On Review KTT'];

export default function DetailRightSidebar({ bidding, onApproval }) {
    // Approval modal
    const [modal, setModal]           = useState({ open: false, action: null });
    const [comment, setComment]       = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError]           = useState('');

    // Action states
    const [renewing, setRenewing]                             = useState(false);
    const [showRenewConfirm, setShowRenewConfirm]             = useState(false);
    const [deactivating, setDeactivating]                     = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm]   = useState(false);
    const [syncing, setSyncing]                               = useState(false);
    const [showSyncConfirm, setShowSyncConfirm]               = useState(false);
    const [obsoleting, setObsoleting]                         = useState(false);
    const [showObsoleteConfirm, setShowObsoleteConfirm]       = useState(false);

    const openModal  = (action) => { setModal({ open: true, action }); setComment(''); setError(''); };
    const closeModal = () => setModal({ open: false, action: null });

    // Approval submit/approve/reject
    const confirmAction = () => {
        setProcessing(true);
        setError('');
        axios.post(`/api/csms/approval/${bidding.id}`, { action: modal.action, comment })
            .then(res => {
                const d = res.data;
                if (d?.meta?.code === 200 || d?.meta?.status === 'success') {
                    closeModal();
                    if (onApproval) onApproval();
                } else {
                    setError(d?.meta?.message ?? 'Gagal memproses approval.');
                }
            })
            .catch(err => setError(err.response?.data?.meta?.message ?? 'Terjadi kesalahan jaringan.'))
            .finally(() => setProcessing(false));
    };

    // Renewal
    const handleRenew = () => {
        setRenewing(true);
        axios.post(`/api/csms/biddings/${bidding.id}/renew`)
            .then(res => {
                const renewalId = res.data?.result?.id;
                window.location.href = renewalId
                    ? `/csms/renewal/create/${renewalId}`
                    : '/csms/renewal/lists';
            })
            .catch(err => {
                setShowRenewConfirm(false);
                alert(err.response?.data?.message || 'Gagal mengajukan perpanjangan.');
            })
            .finally(() => setRenewing(false));
    };

    // Deactivate
    const handleDeactivate = () => {
        setDeactivating(true);
        const backLink = bidding.criteria === 'PostBidding' ? '/csms/post-bidding/lists' : '/csms/renewal/lists';
        axios.post(`/api/csms/biddings/${bidding.id}/deactivate`)
            .then(() => { window.location.href = backLink; })
            .catch(err => {
                setShowDeactivateConfirm(false);
                alert(err.response?.data?.message || 'Gagal menonaktifkan.');
            })
            .finally(() => setDeactivating(false));
    };

    // Sync to Company backoffice
    const handleSync = () => {
        setSyncing(true);
        axios.post(`/api/csms/biddings/${bidding.id}/sync-company`)
            .then(() => {
                setShowSyncConfirm(false);
                if (onApproval) onApproval();
            })
            .catch(err => {
                setShowSyncConfirm(false);
                alert(err.response?.data?.meta?.message || 'Gagal sinkronisasi ke backoffice.');
            })
            .finally(() => setSyncing(false));
    };

    // Obsolete
    const handleObsolete = () => {
        setObsoleting(true);
        const backLink = bidding.criteria === 'PostBidding' ? '/csms/post-bidding/lists' : '/csms/bidding/lists';
        axios.post(`/api/csms/biddings/${bidding.id}/obsolete`)
            .then(() => { window.location.href = backLink; })
            .catch(err => {
                setShowObsoleteConfirm(false);
                alert(err.response?.data?.message || 'Gagal meng-obsolete data.');
            })
            .finally(() => setObsoleting(false));
    };

    const isPostBidding        = bidding.criteria === 'PostBidding';
    const isRenewal            = bidding.criteria === 'Renewal';
    const showRenewButton      = isPostBidding && bidding.status === 'Approved';
    const showDeactivateButton = (isPostBidding || isRenewal) && bidding.status === 'Approved';
    const showObsoleteButton   = ['PostBidding', 'Renewal', 'Bidding'].includes(bidding.criteria) && bidding.status !== 'Obsolete' && !bidding.is_obsolate;
    const showCertButton       = isPostBidding && bidding.status === 'Approved' && bidding.requested === 'Approved' && bidding.published === 'Publish';
    const showExportButton     = isPostBidding;
    const showEditButton       = bidding.status === 'Draft';
    // Show sync button for Approved PostBidding that has no company_id yet (not yet synced to backoffice)
    const showSyncButton       = isPostBidding && bidding.status === 'Approved' && bidding.requested === 'Approved' && !bidding.company_id;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Alur Persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline status={bidding.status} />
            </div>

            {/* Aksi */}
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* Approval actions */}
                    {bidding.status === 'Draft' && (
                        <button onClick={() => openModal('submit')} style={btnBase('var(--primary)')}>
                            <Send size={12} /> Submit ke OHS
                        </button>
                    )}

                    {REVIEW_STATUSES.includes(bidding.status) && (
                        <>
                            <button onClick={() => openModal('approve')} style={btnBase('var(--success)')}>
                                <CheckCircle size={12} /> Setujui
                            </button>
                            <button onClick={() => openModal('reject')} style={btnBase('#fff', 'var(--danger, #ef4444)', '1px solid var(--danger, #ef4444)')}>
                                <X size={12} /> Tolak / Kembalikan
                            </button>
                        </>
                    )}

                    {/* Edit button */}
                    {showEditButton && (
                        <a href={
                            isPostBidding
                                ? `/csms/post-bidding/edit/${bidding.id}`
                                : isRenewal
                                    ? `/csms/renewal/create/${bidding.id}`
                                    : `/csms/bidding/edit/${bidding.id}`
                        }
                            style={{ ...btnBase('#fff', 'var(--accent)', '1px solid var(--accent)'), textDecoration: 'none' }}>
                            Edit Data
                        </a>
                    )}

                    {/* Certificate download */}
                    {showCertButton && (
                        <button onClick={() => window.open(`/api/csms/post-biddings/${bidding.id}/certificate`, '_blank')}
                            style={btnBase('var(--success)')}>
                            <Download size={12} /> Download Sertifikat
                        </button>
                    )}

                    {/* Export questionnaire */}
                    {showExportButton && (
                        <button onClick={() => window.open(`/api/csms/post-biddings/${bidding.id}/export-questionnaire`, '_blank')}
                            style={btnBase('#3b82f6')}>
                            <FileText size={12} /> Export Kuesioner
                        </button>
                    )}

                    {/* Renewal */}
                    {showRenewButton && (
                        <button onClick={() => setShowRenewConfirm(true)} disabled={renewing}
                            style={{ ...btnBase('#0ea5e9'), opacity: renewing ? 0.7 : 1 }}>
                            <RefreshCw size={12} style={{ animation: renewing ? 'spin 1s linear infinite' : 'none' }} />
                            {renewing ? 'Memproses...' : 'Ajukan Perpanjangan'}
                        </button>
                    )}

                    {/* Sync to Backoffice */}
                    {showSyncButton && (
                        <button onClick={() => setShowSyncConfirm(true)} disabled={syncing}
                            style={{ ...btnBase('#7c3aed'), opacity: syncing ? 0.7 : 1 }}>
                            <RefreshCcw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                            {syncing ? 'Menyinkronkan...' : 'Sync ke Backoffice'}
                        </button>
                    )}

                    {/* Deactivate */}
                    {showDeactivateButton && (
                        <button onClick={() => setShowDeactivateConfirm(true)} disabled={deactivating}
                            style={{ ...btnBase('var(--danger, #ef4444)'), opacity: deactivating ? 0.7 : 1 }}>
                            <Ban size={12} /> Nonaktifkan
                        </button>
                    )}

                    {/* Obsolete */}
                    {showObsoleteButton && (
                        <button onClick={() => setShowObsoleteConfirm(true)} disabled={obsoleting}
                            style={{ ...btnBase('#78716c'), opacity: obsoleting ? 0.7 : 1 }}>
                            <Archive size={12} /> Obsolete
                        </button>
                    )}

                    {/* Approved state */}
                    {bidding.status === 'Approved' && !showRenewButton && !showDeactivateButton && (
                        <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '6px' }}>
                            ✓ Telah disetujui (Approved)
                        </div>
                    )}

                    {error && (
                        <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Approval Modal ── */}
            {modal.open && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalHeader}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                                {modal.action === 'submit' ? 'Submit ke OHS' :
                                 modal.action === 'approve' ? 'Setujui Dokumen' : 'Tolak Dokumen'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={modalBody}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                {modal.action === 'submit'
                                    ? 'Dokumen akan dikirim ke OHS untuk ditinjau. Pastikan semua data sudah benar.'
                                    : modal.action === 'approve'
                                    ? 'Konfirmasi persetujuan. Dokumen akan dilanjutkan ke tahap berikutnya.'
                                    : 'Dokumen akan dikembalikan ke status sebelumnya.'}
                            </p>
                            <div>
                                <label style={labelSm}>
                                    Catatan {modal.action === 'reject' ? <span style={{ color: 'var(--danger)' }}>*</span> : '(opsional)'}
                                </label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                                    placeholder="Tambahkan catatan..." style={textareaStyle} />
                            </div>
                            {error && (
                                <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                                    {error}
                                </div>
                            )}
                        </div>
                        <div style={modalFooter}>
                            <button onClick={closeModal} style={btnCancel}>Batal</button>
                            <button onClick={confirmAction} disabled={processing || (modal.action === 'reject' && !comment.trim())}
                                style={{
                                    padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                                    backgroundColor: modal.action === 'approve' || modal.action === 'submit' ? 'var(--primary)' : '#ef4444',
                                    color: '#fff', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1,
                                }}>
                                {processing ? 'Memproses...' : modal.action === 'submit' ? 'Submit' : modal.action === 'approve' ? 'Setujui' : 'Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirmation Modals ── */}
            <ConfirmationModal
                isOpen={showRenewConfirm}
                type="generic"
                title="Ajukan Perpanjangan?"
                description="Data Post Bidding ini akan diajukan sebagai Renewal CSMS baru."
                confirmText="Ya, Ajukan"
                cancelText="Batal"
                loading={renewing}
                onConfirm={handleRenew}
                onCancel={() => setShowRenewConfirm(false)}
            />

            <ConfirmationModal
                isOpen={showDeactivateConfirm}
                type="generic"
                title="Nonaktifkan CSMS Kontraktor?"
                description="Kualifikasi CSMS kontraktor ini akan dinonaktifkan (status Inactive)."
                confirmText="Ya, Nonaktifkan"
                cancelText="Batal"
                loading={deactivating}
                onConfirm={handleDeactivate}
                onCancel={() => setShowDeactivateConfirm(false)}
            />

            <ConfirmationModal
                isOpen={showSyncConfirm}
                type="generic"
                title="Sync ke Backoffice?"
                description="Data perusahaan dari PostBidding ini akan disinkronkan ke tabel companies backoffice. Jika perusahaan belum terdaftar, akan dibuat otomatis."
                confirmText={syncing ? 'Menyinkronkan...' : 'Ya, Sync'}
                cancelText="Batal"
                loading={syncing}
                onConfirm={handleSync}
                onCancel={() => setShowSyncConfirm(false)}
            />

            <ConfirmationModal
                isOpen={showObsoleteConfirm}
                type="generic"
                title="Obsolete Data CSMS?"
                description="Data ini akan ditandai sebagai Obsolete dan tidak akan muncul pada daftar aktif. Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Obsolete"
                cancelText="Batal"
                loading={obsoleting}
                onConfirm={handleObsolete}
                onCancel={() => setShowObsoleteConfirm(false)}
            />
        </div>
    );
}
