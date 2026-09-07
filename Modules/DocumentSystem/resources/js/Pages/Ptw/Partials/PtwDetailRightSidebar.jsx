import { CheckCircle, Clock, Edit, RotateCcw, Send, ShieldCheck } from 'lucide-react';
import React from 'react';

const STATUS_STEPS = [
    { key: '1', label: 'Draft' },
    { key: '2', label: 'Review' },
    { key: '5', label: 'Active' },
];

const matchActivity = (activities, keywords) =>
    (activities || []).find(a => keywords.some(k => (a.activity || '').toLowerCase().includes(k)));

function ApprovalTimeline({ document }) {
    const status = String(document.status);
    const currentIdx = Math.max(0, STATUS_STEPS.findIndex(s => s.key === status));

    const formatDt = (dt) => dt ? new Date(dt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

    const submitted = matchActivity(document.activities, ['review', 'submit']);
    const approved  = matchActivity(document.activities, ['approved', 'aktif']);

    const stepDetails = {
        '1': { user: document.user?.name || '—', time: formatDt(document.doc_created) },
        '2': submitted ? { user: submitted.user?.name || 'System', time: formatDt(submitted.created_at) } : null,
        '5': approved ? { user: approved.user?.name || 'System', time: formatDt(approved.created_at) } : null,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATUS_STEPS.map((step, idx) => {
                const done    = idx < currentIdx;
                const active  = idx === currentIdx;
                const details = stepDetails[step.key];

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
                                <div style={{ width: '2px', height: '36px', backgroundColor: done ? 'var(--success)' : '#e2e8f0' }} />
                            )}
                        </div>
                        <div style={{ paddingTop: '2px', paddingBottom: '14px' }}>
                            <div style={{ fontSize: '11px', fontWeight: active ? 700 : 600, color: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--text-muted)' }}>
                                {step.label}
                            </div>
                            {details?.time && (
                                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>By: {details.user}</span>
                                    <span>{details.time}</span>
                                </div>
                            )}
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

export default function PtwDetailRightSidebar({
    document, canApprove, isDraft, isPendingReview, isActive,
    actionLoading, actionError,
    onSubmit, onApprove, onReject, onRenew, onDeactivate, onReactivate,
}) {
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

            {/* Alur persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline document={document} />
            </div>

            {/* Aksi */}
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {isDraft && (
                        <button onClick={onSubmit} disabled={actionLoading}
                            style={{ ...btnBase('var(--primary)'), opacity: actionLoading ? 0.7 : 1 }}>
                            <Send size={12} /> Submit untuk Review
                        </button>
                    )}

                    {isPendingReview && canApprove && (
                        <>
                            <button onClick={onApprove} disabled={actionLoading}
                                style={{ ...btnBase('var(--success)'), opacity: actionLoading ? 0.7 : 1 }}>
                                <ShieldCheck size={12} /> Approve & Publish
                            </button>
                            <button onClick={onReject} disabled={actionLoading}
                                style={{ ...btnBase('#fff', 'var(--danger)', '1px solid var(--danger)'), opacity: actionLoading ? 0.7 : 1 }}>
                                <RotateCcw size={12} /> Reject & Return
                            </button>
                        </>
                    )}

                    {isActive && (
                        <button onClick={onRenew} disabled={actionLoading}
                            style={{ ...btnBase('var(--primary)'), opacity: actionLoading ? 0.7 : 1 }}>
                            <Edit size={12} /> Update PTW (Revisi)
                        </button>
                    )}

                    {isActive && !document.inactive_at && (
                        <button onClick={onDeactivate} disabled={actionLoading}
                            style={{ ...btnBase('#fff', 'var(--danger)', '1px solid var(--danger)'), opacity: actionLoading ? 0.7 : 1 }}>
                            Nonaktifkan
                        </button>
                    )}

                    {isActive && document.inactive_at && (
                        <button onClick={onReactivate} disabled={actionLoading}
                            style={{ ...btnBase('#fff', 'var(--primary)', '1px solid var(--primary)'), opacity: actionLoading ? 0.7 : 1 }}>
                            Aktifkan Ulang
                        </button>
                    )}

                    {!isDraft && !isPendingReview && !isActive && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textAlign: 'center', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                            Tidak ada aksi tersedia.
                        </div>
                    )}

                    {actionError && (
                        <div style={{ fontSize: '11px', color: 'var(--danger)', padding: '6px 8px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
                            {actionError}
                        </div>
                    )}
                </div>
            </div>

            {/* Riwayat aktivitas */}
            <div style={card}>
                <h4 style={sectionTitle}>Riwayat Aktivitas</h4>
                {!document.activities?.length ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '11px' }}>Belum ada aktivitas.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {document.activities.map(act => (
                            <div key={act.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '10px', fontSize: '11px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{act.activity}</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Oleh: {act.user?.name || 'System'}</div>
                                {act.notes && (
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '4px', fontStyle: 'italic', lineHeight: 1.4 }}>
                                        {act.notes}
                                    </div>
                                )}
                                <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Clock size={9} />
                                    {act.created_at ? new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
