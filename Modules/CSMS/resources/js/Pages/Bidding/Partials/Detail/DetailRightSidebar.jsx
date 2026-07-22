import React, { useState } from 'react';
import { CheckCircle, Clock, Send, X } from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';

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

const REVIEW_STATUSES = ['On Review OHS', 'On Review D/H OHS', 'On Review KTT'];

export default function DetailRightSidebar({ bidding, onApproval }) {
    const [modal, setModal]       = useState({ open: false, action: null });
    const [comment, setComment]   = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError]       = useState('');

    const openModal = (action) => { setModal({ open: true, action }); setComment(''); setError(''); };
    const closeModal = () => setModal({ open: false, action: null });

    const confirmAction = () => {
        setProcessing(true);
        setError('');
        fetch(`/api/csms/approval/${bidding.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content,
            },
            body: JSON.stringify({ action: modal.action, comment }),
        })
        .then(r => r.json())
        .then(d => {
            if (d?.meta?.code === 200 || d?.data) {
                closeModal();
                if (onApproval) onApproval();
            } else {
                setError(d?.message ?? 'Gagal memproses approval.');
            }
        })
        .catch(() => setError('Terjadi kesalahan jaringan.'))
        .finally(() => setProcessing(false));
    };

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

                    {bidding.status === 'Draft' && (
                        <button onClick={() => openModal('submit')}
                            style={btnBase('var(--primary)')}>
                            <Send size={12} /> Submit ke OHS
                        </button>
                    )}

                    {REVIEW_STATUSES.includes(bidding.status) && (
                        <>
                            <button onClick={() => openModal('approve')}
                                style={btnBase('var(--success)')}>
                                <CheckCircle size={12} /> Setujui
                            </button>
                            <button onClick={() => openModal('reject')}
                                style={btnBase('#fff', 'var(--danger, #ef4444)', '1px solid var(--danger, #ef4444)')}>
                                <X size={12} /> Tolak / Kembalikan
                            </button>
                        </>
                    )}

                    {bidding.status === 'Approved' && (
                        <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: 'rgba(47,191,113,0.08)', borderRadius: '6px' }}>
                            ✓ Bidding telah disetujui (Approved)
                        </div>
                    )}

                    {bidding.status === 'Draft' && (
                        <a href={`/csms/bidding/edit/${bidding.id}`}
                            style={{ ...btnBase('#fff', 'var(--accent)', '1px solid var(--accent)'), textDecoration: 'none' }}>
                            Edit Data
                        </a>
                    )}

                    {error && (
                        <div style={{ fontSize: '11px', color: 'var(--danger, #ef4444)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Approval Modal */}
            {modal.open && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999, padding: '16px',
                }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                                {modal.action === 'submit' ? 'Submit ke OHS' :
                                 modal.action === 'approve' ? 'Setujui Dokumen' : 'Tolak Dokumen'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                {modal.action === 'submit'
                                    ? 'Dokumen akan dikirim ke OHS untuk ditinjau. Pastikan semua data sudah benar.'
                                    : modal.action === 'approve'
                                    ? 'Konfirmasi persetujuan. Dokumen akan dilanjutkan ke tahap berikutnya.'
                                    : 'Dokumen akan dikembalikan ke status Draft.'}
                            </p>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Catatan {modal.action === 'reject' ? <span style={{ color: 'var(--danger, #ef4444)' }}>*</span> : '(opsional)'}
                                </label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                                    placeholder="Tambahkan catatan..."
                                    style={{ width: '100%', padding: '10px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            {error && (
                                <div style={{ fontSize: '11px', color: 'var(--danger, #ef4444)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                                    {error}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={closeModal} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
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
        </div>
    );
}