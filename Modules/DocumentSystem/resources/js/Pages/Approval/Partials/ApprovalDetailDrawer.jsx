import React from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function ApprovalDetailDrawer({ doc, open, onClose, onApprove, onReject }) {
    if (!open || !doc) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ width: '400px', backgroundColor: 'var(--card-bg)', padding: '24px', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Detail Dokumen Approval</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>NO. DOKUMEN</span><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JUDUL</span><span style={{ fontWeight: 600 }}>{doc.title}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>LEVEL</span><span>{doc.document_level}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>DESKRIPSI</span><span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{doc.description || '-'}</span></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => onApprove(doc)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--success)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>✓ Setuju</button>
                    <button onClick={() => onReject(doc)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>✕ Tolak</button>
                </div>
            </div>
        </div>
    );
}
