import React, { useState } from 'react';
import { Archive, Ban, CheckCircle, RefreshCw, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const APPROVAL_STEPS = [
    { key: 'Draft',              label: 'Draft' },
    { key: 'On Review OHS',      label: 'Review OHS' },
    { key: 'On Review D/H OHS',  label: 'Review D/H OHS' },
    { key: 'On Review KTT',      label: 'Review KTT' },
    { key: 'Approved',           label: 'Approved' },
];

function ApprovalTimeline({ status }) {
    // Treat 'On Review Evaluator' equivalent to 'On Review D/H OHS'
    const normalizedStatus = status === 'On Review Evaluator' ? 'On Review D/H OHS' : status;
    const currentIdx = APPROVAL_STEPS.findIndex(s => s.key === normalizedStatus);

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
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'left' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' };
const modalBody   = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' };
const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const textareaStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' };
const btnCancel   = { padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' };

export default function DetailRightSidebar({ pjo, onApproval }) {
    const { id } = pjo;
    const auth = usePage().props.auth;
    const userRoles = auth?.roles || [];
    const isSuperAdmin = auth?.user?.role === 'super_admin';
    const isSystemAdmin = isSuperAdmin || userRoles.includes('system_admin');

    const canOhs = isSystemAdmin || userRoles.includes('csms_ohs_reviewer');
    const canEvaluator = isSystemAdmin || userRoles.includes('csms_dhohs_reviewer');
    const canKtt = isSystemAdmin || userRoles.includes('csms_ktt_reviewer');
    const hasApprovalAccess = canOhs || canEvaluator || canKtt;

    const [modal, setModal]           = useState({ open: false, action: null, targetStatus: null, targetRequested: null });
    const [comment, setComment]       = useState('');
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg]     = useState('');

    const openModal = (action, targetStatus, targetRequested) => {
        setModal({ open: true, action, targetStatus, targetRequested });
        setComment('');
        setErrorMsg('');
    };

    const closeModal = () => {
        setModal({ open: false, action: null, targetStatus: null, targetRequested: null });
    };

    const confirmAction = () => {
        setProcessing(true);
        setErrorMsg('');
        axios.put(`/api/csms/pjos/${id}`, {
            status: modal.targetStatus,
            requested: modal.targetRequested,
            comment,
            date_approved: new Date().toISOString().slice(0, 10)
        })
        .then(() => {
            closeModal();
            if (onApproval) onApproval();
        })
        .catch(err => {
            setErrorMsg(err.response?.data?.message || err.message);
        })
        .finally(() => {
            setProcessing(false);
        });
    };

    const isOngoing = ['On Review OHS', 'On Review D/H OHS', 'On Review Evaluator', 'On Review KTT'].includes(pjo.status);
    const showOhsAction = (pjo.status === 'On Review OHS') && canOhs;
    const showEvaluatorAction = (['On Review D/H OHS', 'On Review Evaluator'].includes(pjo.status)) && canEvaluator;
    const showKttAction = (pjo.status === 'On Review KTT') && canKtt;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Alur Persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline status={pjo.status} />
            </div>

            {/* Status Card & Actions */}
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {isOngoing && hasApprovalAccess ? (
                        <>
                            {/* OHS Action */}
                            {showOhsAction && (
                                <button
                                    type="button"
                                    onClick={() => openModal('submit', 'On Review D/H OHS', 'Requested Evaluator')}
                                    style={btnBase('var(--primary)')}
                                >
                                    Submit to Evaluator
                                </button>
                            )}

                            {/* Evaluator Action */}
                            {showEvaluatorAction && (
                                <button
                                    type="button"
                                    onClick={() => openModal('approve', 'On Review KTT', 'Requested KTT')}
                                    style={btnBase('var(--primary)')}
                                >
                                    Submit to KTT
                                </button>
                            )}

                            {/* KTT Action */}
                            {showKttAction && (
                                <button
                                    type="button"
                                    onClick={() => openModal('approve', 'Approved', 'Approved')}
                                    style={btnBase('#2FBF71')}
                                >
                                    Approve PJO
                                </button>
                            )}

                            {/* Return to Maker (Any Reviewer) */}
                            <button
                                type="button"
                                onClick={() => openModal('reject', 'Draft', 'Rejected')}
                                style={btnBase('rgba(239, 68, 68, 0.08)', '#ef4444', '1px solid rgba(239, 68, 68, 0.2)')}
                            >
                                Return to Maker
                            </button>
                        </>
                    ) : pjo.status === 'Approved' ? (
                        <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '6px' }}>
                            ✓ Telah disetujui (Approved)
                        </div>
                    ) : (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '8px' }}>
                            Tidak ada tindakan persetujuan saat ini.
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
                                {modal.action === 'submit' ? 'Submit ke Evaluator' :
                                 modal.targetStatus === 'Approved' ? 'Setujui PJO' :
                                 modal.action === 'approve' ? 'Submit ke KTT' : 'Return to Maker'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={modalBody}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                {modal.action === 'submit'
                                    ? 'Dokumen akan dikirim ke Evaluator untuk ditinjau. Pastikan semua data sudah benar.'
                                    : modal.targetStatus === 'Approved'
                                    ? 'Konfirmasi persetujuan PJO secara final.'
                                    : modal.action === 'approve'
                                    ? 'Konfirmasi persetujuan. Dokumen akan dilanjutkan ke KTT.'
                                    : 'Dokumen akan dikembalikan ke status Draft / Pembuat.'}
                            </p>
                            <div>
                                <label style={labelSm}>
                                    Catatan {modal.action === 'reject' ? <span style={{ color: 'var(--danger)' }}>*</span> : '(opsional)'}
                                </label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                                    placeholder="Tambahkan catatan..." style={textareaStyle} />
                            </div>
                            {errorMsg && (
                                <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                                    {errorMsg}
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
                                {processing ? 'Memproses...' : modal.action === 'submit' ? 'Submit' : modal.targetStatus === 'Approved' ? 'Setujui' : modal.action === 'approve' ? 'Setujui' : 'Kembalikan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
