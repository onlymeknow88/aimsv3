import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RejectModal({ doc, open, onClose, onSubmit, loading }) {
    const [reason, setReason] = useState('');
    if (!open || !doc) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Tolak Dokumen</h3>
                    <X size={16} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Tolak dan kembalikan ke draft: <strong>{doc.title}</strong></p>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>ALASAN PENOLAKAN <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} required style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontFamily: 'inherit' }} placeholder="Tulis alasan penolakan dokumen..." />
                </div>
                <button disabled={loading || !reason} onClick={() => onSubmit(doc.id, reason)} style={{ width: '100%', padding: '10px', backgroundColor: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: (loading || !reason) ? 'not-allowed' : 'pointer', opacity: (loading || !reason) ? 0.6 : 1 }}>
                    {loading ? 'Menyimpan...' : '✕ Konfirmasi Tolak'}
                </button>
            </div>
        </div>
    );
}
