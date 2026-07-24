import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Paperclip, Send, Upload } from 'lucide-react';

const STATUS_STEPS = [
    { key: 'Draft',         label: 'Draft' },
    { key: 'On Review PJA', label: 'Review PJA' },
    { key: 'On Review CRS', label: 'Review CRS' },
    { key: 'Open',          label: 'Open' },
    { key: 'Closed',        label: 'Closed' },
];

function ApprovalTimeline({ currentStatus }) {
    let currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    if (currentStatus === 'Overdue') {
        currentIdx = STATUS_STEPS.findIndex(s => s.key === 'Open');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATUS_STEPS.map((step, idx) => {
                const done    = idx < currentIdx;
                const active  = idx === currentIdx;
                return (
                    <div key={step.key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '50%', zIndex: 1,
                                backgroundColor: done ? '#10b981' : active ? 'var(--primary)' : '#e2e8f0',
                                border: `2px solid ${done ? '#10b981' : active ? 'var(--primary)' : '#e2e8f0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {done && <CheckCircle size={10} color="#fff" />}
                                {active && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                                <div style={{ width: '2px', height: '22px', backgroundColor: done ? '#10b981' : '#e2e8f0' }} />
                            )}
                        </div>
                        <div style={{ paddingTop: '1px', paddingBottom: '10px' }}>
                            <div style={{ fontSize: '11px', fontWeight: active ? 700 : 600, color: done ? '#10b981' : active ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                {step.label}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function DetailActivity({ doc, onRefresh, onPreviewFile, handleApproval, actionLoading }) {
    const [description, setDescription] = useState('');
    const [files, setFiles]             = useState([]);
    const [submitting, setSubmitting]   = useState(false);
    const [error, setError]             = useState(null);

    if (!doc) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;
        setSubmitting(true);
        setError(null);
        const fd = new FormData();
        fd.append('description', description);
        files.forEach(f => fd.append('files[]', f));
        try {
            await axios.post(`/api/pica/documents/${doc.id}/activities`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDescription('');
            setFiles([]);
            onRefresh && onRefresh();
        } catch {
            setError('Gagal menyimpan aktivitas.');
        } finally {
            setSubmitting(false);
        }
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

    const renderActionButtons = () => {
        const btn = (label, action, bg, color = '#fff', border = 'none') => (
            <button
                key={action}
                onClick={() => handleApproval && handleApproval(action)}
                disabled={actionLoading === action}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 14px', backgroundColor: bg, color, border,
                    borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                {actionLoading === action ? '...' : label}
            </button>
        );

        const hasActions = ['Draft', 'On Review PJA', 'On Review CRS', 'Open', 'Overdue'].includes(doc.status);
        if (!hasActions) return null;

        return (
            <div style={card}>
                <h4 style={sectionTitle}>Aksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {doc.status === 'Draft' && (
                        <>
                            <a
                                href={`/pica/edit/${doc.id}`}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '9px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid var(--border-color)',
                                    borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%',
                                    boxSizing: 'border-box', textDecoration: 'none'
                                }}
                            >
                                Edit PICA
                            </a>
                            {btn('Submit PICA', 'submit', '#1d4ed8')}
                        </>
                    )}
                    {doc.status === 'On Review PJA' && (
                        <>
                            {btn('Approve PJA', 'approve_pja', '#10b981')}
                            {btn('Reject PJA', 'reject_pja', '#ef4444')}
                        </>
                    )}
                    {doc.status === 'On Review CRS' && (
                        <>
                            {btn('Approve CRS', 'approve_crs', '#10b981')}
                            {btn('Reject CRS', 'reject_crs', '#ef4444')}
                        </>
                    )}
                    {['Open', 'Overdue'].includes(doc.status) && (
                        btn('Selesaikan PICA (Close)', 'close', '#10b981')
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Alur Persetujuan */}
            <div style={card}>
                <h4 style={sectionTitle}>Alur Persetujuan</h4>
                <ApprovalTimeline currentStatus={doc.status} />
            </div>

            {/* Aksi Card */}
            {renderActionButtons()}

            {/* Riwayat Aktivitas */}
            <div style={card}>
                <h4 style={sectionTitle}>Timeline Aktivitas</h4>
                
                {/* Activity list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(!doc.activities || doc.activities.length === 0) ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0', margin: 0 }}>Belum ada aktivitas.</p>
                    ) : (
                        [...doc.activities].reverse().map(act => (
                            <div key={act.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '10px', fontSize: '11px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                                    {act.description}
                                </div>
                                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Clock size={9} />
                                    {act.user?.name ?? 'User'} • {act.created_at ? new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                                </div>
                                {act.files?.length > 0 && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {act.files.map(f => (
                                            <button key={f.id} type="button"
                                                onClick={() => onPreviewFile && onPreviewFile({ id: f.id, type: 'pica_activity', name: f.file, file_name: f.file ? f.file.split('/').pop() : 'Lampiran' })}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 600, color: 'var(--primary)', background: 'rgba(21,59,115,0.05)', cursor: 'pointer', border: '1px solid rgba(21,59,115,0.15)', padding: '3px 8px', borderRadius: '4px', width: 'fit-content' }}>
                                                <Paperclip size={9} />
                                                {f.file ? f.file.split('/').pop() : 'Lampiran'}
                                                {f.size ? ` (${f.size})` : ''}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add activity form */}
            {['Open', 'Overdue'].includes(doc.status) && (
                <div style={card}>
                    <h4 style={sectionTitle}>Tambah Aktivitas</h4>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Tulis catatan tindak lanjut..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', minHeight: '72px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
                        />

                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '8px' }}>
                            <Upload size={12} />
                            <span>Upload file lampiran</span>
                            <input type="file" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
                        </label>
                        {files.length > 0 && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                {files.map((f, i) => <div key={i}>{f.name}</div>)}
                            </div>
                        )}

                        {error && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px' }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting || !description.trim()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', width: '100%', justifyContent: 'center' }}
                        >
                            <Send size={12} />
                            {submitting ? 'Menyimpan...' : 'Kirim Aktivitas'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}