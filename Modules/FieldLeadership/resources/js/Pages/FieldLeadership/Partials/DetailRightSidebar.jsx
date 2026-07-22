import { Activity, CheckCircle, Clock, Paperclip, RotateCcw, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { approveLabel, canApprove, canReturn } from '../Hooks/useApproval';

import BlobPreviewModal from '@/Components/BlobPreviewModal';
import ConfirmationModal from '@/Components/ConfirmationModal';

const STATUS_STEPS = [
    { key: 'Open',               label: 'Open' },
    { key: 'On Review PICA',     label: 'Review PICA' },
    { key: 'On Review PJA',      label: 'Review PJA' },
    { key: 'On Review Approval', label: 'Approval' },
    { key: 'Closed',             label: 'Closed' },
];

function ApprovalTimeline({ currentStatus }) {
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STATUS_STEPS.map((step, idx) => {
                const done    = idx < currentIdx;
                const active  = idx === currentIdx;
                const pending = idx > currentIdx;
                return (
                    <div key={step.key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingBottom: idx < STATUS_STEPS.length - 1 ? '0' : '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', zIndex: 1,
                                backgroundColor: done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0',
                                border: `2px solid ${done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {done && <CheckCircle size={11} color="#fff" />}
                                {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                                <div style={{ width: '2px', height: '28px', backgroundColor: done ? 'var(--success)' : '#e2e8f0' }} />
                            )}
                        </div>
                        <div style={{ paddingTop: '2px', paddingBottom: '14px' }}>
                            <div style={{ fontSize: '11px', fontWeight: active ? 700 : 600, color: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--text-muted)' }}>
                                {step.label}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function DetailRightSidebar({ obs, activities, approval }) {
    const [returnComment, setReturnComment] = useState('');
    const [returnFiles,   setReturnFiles]   = useState([]);
    const [showModal,     setShowModal]     = useState(false);
    const [previewFile,   setPreviewFile]   = useState(null);

    const handleReturn = async () => {
        if (!returnComment.trim()) { alert('Catatan pengembalian wajib diisi.'); return; }
        await approval.returnWithComment(obs.status, returnComment, returnFiles);
        setShowModal(false);
        setReturnComment('');
        setReturnFiles([]);
    };

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Alur Persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline currentStatus={obs.status} />
            </div>

            {/* Approval Actions */}
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {obs.status === 'Open' && (
                        <button onClick={() => approval.requestSubmit()} disabled={approval.loading}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: approval.loading ? 'not-allowed' : 'pointer', opacity: approval.loading ? 0.7 : 1 }}>
                            <Send size={12} /> Submit untuk Review
                        </button>
                    )}
                    {canApprove(obs.status) && obs.status !== 'Open' && (
                        <button onClick={() => approval.requestApprove(obs.status)} disabled={approval.loading}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', backgroundColor: 'var(--success)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: approval.loading ? 'not-allowed' : 'pointer', opacity: approval.loading ? 0.7 : 1 }}>
                            <CheckCircle size={12} /> {approveLabel(obs.status)}
                        </button>
                    )}
                    {canReturn(obs.status) && (
                        <button onClick={() => setShowModal(true)} disabled={approval.loading}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#fff', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: approval.loading ? 'not-allowed' : 'pointer', opacity: approval.loading ? 0.7 : 1 }}>
                            <RotateCcw size={12} /> Return with Comment
                        </button>
                    )}
                    {obs.status === 'Closed' && !canReturn(obs.status) && (
                        <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '6px' }}>
                            ✓ Field Leadership telah ditutup
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Log */}
            <div style={card}>
                <h4 style={sectionTitle}>Riwayat Aktivitas</h4>
                {!activities?.length ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '11px' }}>Belum ada aktivitas.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activities.map(act => (
                            <div key={act.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '10px', fontSize: '11px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{act.description}</div>
                                <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Clock size={9} />
                                    {act.created_at ? new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : ''}
                                </div>
                                {act.files && act.files.length > 0 && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {act.files.map(f => (
                                            <button
                                                key={f.id}
                                                type="button"
                                                onClick={() => setPreviewFile({
                                                    id: f.id,
                                                    type: 'fl_activity',
                                                    file_name: f.file ? f.file.split('/').pop() : 'Lampiran',
                                                    file_type: f.type_file || '',
                                                })}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    fontSize: '10px', fontWeight: 600, color: 'var(--primary)',
                                                    background: 'rgba(21,59,115,0.05)', cursor: 'pointer',
                                                    border: '1px solid rgba(21,59,115,0.15)',
                                                    padding: '3px 8px', borderRadius: '4px',
                                                }}
                                            >
                                                <Paperclip size={9} />
                                                {f.file ? f.file.split('/').pop() : 'Lampiran'}
                                                {f.size ? ` (${f.size})` : ''}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Return with Comment Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Return with Comment</h3>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Dokumen akan dikembalikan ke langkah sebelumnya.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Catatan Pengembalian <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <textarea
                                    value={returnComment}
                                    onChange={e => setReturnComment(e.target.value)}
                                    rows={5}
                                    placeholder="Tulis alasan atau catatan pengembalian secara detail..."
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Lampiran Bukti (Opsional)
                                </label>
                                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '14px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                    <input type="file" multiple id="return-files" onChange={e => setReturnFiles(prev => [...prev, ...Array.from(e.target.files || [])])} style={{ display: 'none' }} />
                                    <label htmlFor="return-files" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                                        <Paperclip size={13} /> Pilih File
                                    </label>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, Gambar, dll.</div>
                                </div>
                                {returnFiles.length > 0 && (
                                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {returnFiles.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '11px' }}>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.name}</span>
                                                <button onClick={() => setReturnFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={() => { setShowModal(false); setReturnComment(''); setReturnFiles([]); }} disabled={approval.loading}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                Batal
                            </button>
                            <button onClick={handleReturn} disabled={approval.loading || !returnComment.trim()}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: approval.loading || !returnComment.trim() ? '#94a3b8' : 'var(--danger)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: (approval.loading || !returnComment.trim()) ? 'not-allowed' : 'pointer' }}>
                                {approval.loading ? 'Memproses...' : 'Return Dokumen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewFile && (
                <BlobPreviewModal
                    attachment={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}

            {/* ConfirmationModal untuk Submit & Approve */}
            {approval.pendingApproval && (
                <ConfirmationModal
                    isOpen={!!approval.pendingApproval}
                    type="review"
                    title={approval.pendingApproval.action === 'submit'
                        ? 'Submit untuk Review?'
                        : `${approveLabel(approval.pendingApproval.currentStatus)}?`
                    }
                    description={approval.pendingApproval.action === 'submit'
                        ? 'Dokumen akan dikirim ke reviewer untuk proses verifikasi.'
                        : 'Tindakan ini akan memajukan status dokumen ke tahap berikutnya.'
                    }
                    confirmText={approval.pendingApproval.action === 'submit' ? 'Submit' : 'Setujui'}
                    cancelText="Batal"
                    loading={approval.loading}
                    onConfirm={() => approval.confirmApproval()}
                    onCancel={() => approval.cancelApproval()}
                />
            )}
        </div>
    );
}
