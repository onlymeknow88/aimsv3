import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ApproveModal({ doc, open, onClose, onSubmit, loading }) {
    const [level, setLevel] = useState('1');
    const [notes, setNotes] = useState('');
    if (!open || !doc) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Setujui Dokumen</h3>
                    <X size={16} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Setujui: <strong>{doc.title}</strong></p>
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>LEVEL APPROVAL</label>
                    <select value={level} onChange={e => setLevel(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                        <option value="1">Level 1 - CRS (Chief of Safety)</option>
                        <option value="2">Level 2 - PJA (Project Manager)</option>
                    </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>CATATAN (OPSIONAL)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontFamily: 'inherit' }} />
                </div>
                <button disabled={loading} onClick={() => onSubmit(doc.id, level, notes)} style={{ width: '100%', padding: '10px', backgroundColor: 'var(--success)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Menyimpan...' : '✓ Konfirmasi Setuju'}
                </button>
            </div>
        </div>
    );
}
