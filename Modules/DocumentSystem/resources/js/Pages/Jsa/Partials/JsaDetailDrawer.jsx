import React from 'react';
import { X } from 'lucide-react';

export default function JsaDetailDrawer({ jsa, open, onClose }) {
    if (!open || !jsa) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ width: '440px', backgroundColor: 'var(--card-bg)', padding: '24px', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Detail JSA</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JUDUL</span><span style={{ fontWeight: 700 }}>{jsa.title}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JENIS PEKERJAAN</span><span>{jsa.work_type}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>LOKASI</span><span>{jsa.location}</span></div>
                </div>
            </div>
        </div>
    );
}
