import { CheckCircle, Clock, Paperclip, RotateCcw, Send, ShieldCheck, UserCheck, X } from 'lucide-react';
import React, { useState } from 'react';

import BlobPreviewModal from '@/Components/BlobPreviewModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { canReturn } from '../Hooks/useApproval';

const STATUS_STEPS = [
    { key: 'Open',          label: 'Open' },
    { key: 'On Review PJA', label: 'Review PJA' },
    { key: 'Pending CRS',   label: 'Pending CRS' },
    { key: 'On Review CRS', label: 'Verifikasi CRS' },
    { key: 'Closed',        label: 'Closed' },
];

function ApprovalTimeline({ currentStatus }) {
    const isSpecial = ['Not Followed Up'].includes(currentStatus);
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {isSpecial && (
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', padding: '6px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '8px' }}>
                    ✗ Tidak Ditindaklanjuti
                </div>
            )}
            {STATUS_STEPS.map((step, idx) => {
                const done    = idx < currentIdx;
                const active  = idx === currentIdx;
                return (
                    <div key={step.key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
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

const btnBase = (bg, color = '#fff', border = 'none') => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '9px 14px', backgroundColor: bg, color, border,
    borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%',
});

export default function DetailRightSidebar({ obs, activities, approval }) {
    const [returnComment,   setReturnComment]   = useState('');
    const [returnFiles,     setReturnFiles]     = useState([]);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [previewFile,     setPreviewFile]     = useState(null);
    // PJA Review
    const [pjaAreaSuitable, setPjaAreaSuitable] = useState(true);
    const [pjaReason,       setPjaReason]       = useState('');
    // CRS Action
    const [crsAction, setCrsAction] = useState('approve');
    const [crsReason, setCrsReason] = useState('');
    // CRS Verify
    const [crsVerifyAction, setCrsVerifyAction] = useState('approve');
    const [crsVerifyReason, setCrsVerifyReason] = useState('');

    const handleReturn = async () => {
        if (!returnComment.trim()) { alert('Catatan pengembalian wajib diisi.'); return; }
        await approval.returnWithComment(obs.status, returnComment, returnFiles);
        setShowReturnModal(false);
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
    const modalOverlay = {
        position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, padding: '16px',
    };
    const modalBox = {
        backgroundColor: '#fff', borderRadius: '14px', width: '100%',
        maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    };
    const modalHeader = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 20px', borderBottom: '1px solid var(--border-color)',
    };
    const modalBody   = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' };
    const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' };
    const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
    const textareaStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' };
    const btnCancel   = { padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Alur Persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline currentStatus={obs.status} />
            </div>

            {/* Aksi */}
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {obs.status === 'Open' && (
                        <button onClick={() => approval.requestSubmit()} disabled={approval.loading}
                            style={{ ...btnBase('var(--primary)'), opacity: approval.loading ? 0.7 : 1 }}>
                            <Send size={12} /> Submit untuk Review
                        </button>
                    )}

                    {obs.status === 'On Review PJA' && (
                        <button onClick={() => approval.requestPjaReview()} disabled={approval.loading}
                            style={{ ...btnBase('#2d7ff9'), opacity: approval.loading ? 0.7 : 1 }}>
                            <UserCheck size={12} /> Review sebagai PJA
                        </button>
                    )}

                    {obs.status === 'Pending CRS' && (
                        <button onClick={() => approval.requestCrsAction()} disabled={approval.loading}
                            style={{ ...btnBase('#7c3aed'), opacity: approval.loading ? 0.7 : 1 }}>
                            <ShieldCheck size={12} /> Aksi CRS
                        </button>
                    )}

                    {obs.status === 'On Review CRS' && (
                        <button onClick={() => approval.requestCrsVerify()} disabled={approval.loading}
                            style={{ ...btnBase('var(--success)'), opacity: approval.loading ? 0.7 : 1 }}>
                            <ShieldCheck size={12} /> Verifikasi CRS
                        </button>
                    )}

                    {canReturn(obs.status) && (
                        <button onClick={() => setShowReturnModal(true)} disabled={approval.loading}
                            style={{ ...btnBase('#fff', 'var(--danger)', '1px solid var(--danger)'), opacity: approval.loading ? 0.7 : 1 }}>
                            <RotateCcw size={12} /> Return with Comment
                        </button>
                    )}

                    {obs.status === 'Not Followed Up' && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                            ✗ Perbaikan tidak ditindaklanjuti
                        </div>
                    )}

                    {obs.status === 'Closed' && (
                        <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '6px' }}>
                            ✓ Field Leadership telah ditutup (Case Closed)
                        </div>
                    )}

                    {approval.error && (
                        <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                            {approval.error}
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
                                {act.files?.length > 0 && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {act.files.map(f => (
                                            <button key={f.id} type="button"
                                                onClick={() => setPreviewFile({ id: f.id, type: 'fl_activity', file_name: f.file ? f.file.split('/').pop() : 'Lampiran', file_type: f.type_file || '' })}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 600, color: 'var(--primary)', background: 'rgba(21,59,115,0.05)', cursor: 'pointer', border: '1px solid rgba(21,59,115,0.15)', padding: '3px 8px', borderRadius: '4px' }}>
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

            {/* ── PJA Review Modal ── */}
            {approval.pjaReviewModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalHeader}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Review PJA</h3>
                            <button onClick={() => approval.cancelPjaReview()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={modalBody}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Apakah area kerja sesuai dengan PJA yang ditunjuk?</p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={pjaAreaSuitable === true} onChange={() => setPjaAreaSuitable(true)} /> Ya, area sesuai
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={pjaAreaSuitable === false} onChange={() => setPjaAreaSuitable(false)} /> Tidak sesuai
                                </label>
                            </div>
                            {!pjaAreaSuitable && (
                                <div>
                                    <label style={labelSm}>Alasan / Catatan</label>
                                    <textarea value={pjaReason} onChange={e => setPjaReason(e.target.value)} rows={3}
                                        placeholder="Jelaskan mengapa area tidak sesuai PJA..." style={textareaStyle} />
                                </div>
                            )}
                        </div>
                        <div style={modalFooter}>
                            <button onClick={() => approval.cancelPjaReview()} style={btnCancel}>Batal</button>
                            <button onClick={() => approval.confirmPjaReview(pjaAreaSuitable, pjaReason)} disabled={approval.loading}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', backgroundColor: '#2d7ff9', color: '#fff', opacity: approval.loading ? 0.7 : 1 }}>
                                {approval.loading ? 'Memproses...' : 'Konfirmasi Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CRS Action Modal ── */}
            {approval.crsActionModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalHeader}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Aksi CRS — Pergantian PJA</h3>
                            <button onClick={() => approval.cancelCrsAction()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={modalBody}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={crsAction === 'approve'} onChange={() => setCrsAction('approve')} /> Setujui & Ganti PJA
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={crsAction === 'reject'} onChange={() => setCrsAction('reject')} /> Tidak ditindaklanjuti
                                </label>
                            </div>
                            <div>
                                <label style={labelSm}>Alasan / Catatan</label>
                                <textarea value={crsReason} onChange={e => setCrsReason(e.target.value)} rows={3}
                                    placeholder="Tuliskan alasan atau catatan CRS..." style={textareaStyle} />
                            </div>
                        </div>
                        <div style={modalFooter}>
                            <button onClick={() => approval.cancelCrsAction()} style={btnCancel}>Batal</button>
                            <button onClick={() => approval.confirmCrsAction(crsAction, null, crsReason)} disabled={approval.loading}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', backgroundColor: crsAction === 'approve' ? '#7c3aed' : 'var(--danger)', color: '#fff', opacity: approval.loading ? 0.7 : 1 }}>
                                {approval.loading ? 'Memproses...' : (crsAction === 'approve' ? 'Setujui' : 'Tidak Ditindaklanjuti')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CRS Verify Modal ── */}
            {approval.crsVerifyModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalHeader}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Verifikasi CRS — Perbaikan Sesuai?</h3>
                            <button onClick={() => approval.cancelCrsVerify()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={modalBody}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Apakah tindakan perbaikan yang dilakukan PJA sudah sesuai?</p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={crsVerifyAction === 'approve'} onChange={() => setCrsVerifyAction('approve')} /> Ya, sesuai → Case Closed
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="radio" checked={crsVerifyAction === 'reject'} onChange={() => setCrsVerifyAction('reject')} /> Tidak, kembalikan ke PJA
                                </label>
                            </div>
                            <div>
                                <label style={labelSm}>Catatan (opsional)</label>
                                <textarea value={crsVerifyReason} onChange={e => setCrsVerifyReason(e.target.value)} rows={3}
                                    placeholder="Tuliskan catatan verifikasi..." style={textareaStyle} />
                            </div>
                        </div>
                        <div style={modalFooter}>
                            <button onClick={() => approval.cancelCrsVerify()} style={btnCancel}>Batal</button>
                            <button onClick={() => approval.confirmCrsVerify(crsVerifyAction, crsVerifyReason)} disabled={approval.loading}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', backgroundColor: crsVerifyAction === 'approve' ? 'var(--success)' : 'var(--danger)', color: '#fff', opacity: approval.loading ? 0.7 : 1 }}>
                                {approval.loading ? 'Memproses...' : (crsVerifyAction === 'approve' ? 'Case Closed' : 'Kembalikan ke PJA')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Return with Comment Modal ── */}
            {showReturnModal && (
                <div style={modalOverlay}>
                    <div style={{ ...modalBox, maxWidth: '500px' }}>
                        <div style={modalHeader}>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Return with Comment</h3>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Dokumen akan dikembalikan ke langkah sebelumnya.</p>
                            </div>
                            <button onClick={() => setShowReturnModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelSm}>Catatan Pengembalian <span style={{ color: 'var(--danger)' }}>*</span></label>
                                <textarea value={returnComment} onChange={e => setReturnComment(e.target.value)} rows={5}
                                    placeholder="Tulis alasan atau catatan pengembalian secara detail..."
                                    style={{ ...textareaStyle, padding: '10px 12px', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelSm}>Lampiran Bukti (Opsional)</label>
                                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '14px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                    <input type="file" multiple id="return-files"
                                        onChange={e => setReturnFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                                        style={{ display: 'none' }} />
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
                                                <button onClick={() => setReturnFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={modalFooter}>
                            <button onClick={() => { setShowReturnModal(false); setReturnComment(''); setReturnFiles([]); }} disabled={approval.loading} style={btnCancel}>
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
                <BlobPreviewModal attachment={previewFile} onClose={() => setPreviewFile(null)} />
            )}

            {/* Confirmation Modal untuk Submit */}
            {approval.pendingApproval && (
                <ConfirmationModal
                    isOpen={!!approval.pendingApproval}
                    type="review"
                    title="Submit untuk Review?"
                    description="Dokumen akan dikirim ke reviewer. Pastikan semua data sudah benar sebelum melanjutkan."
                    confirmText="Submit"
                    cancelText="Batal"
                    loading={approval.loading}
                    onConfirm={() => approval.confirmApproval()}
                    onCancel={() => approval.cancelApproval()}
                />
            )}
        </div>
    );
}
