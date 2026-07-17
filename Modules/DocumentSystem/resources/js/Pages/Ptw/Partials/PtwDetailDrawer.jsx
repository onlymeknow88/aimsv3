import React from 'react';
import { X } from 'lucide-react';
import PermitTypeBadge from './Components/PermitTypeBadge';

export default function PtwDetailDrawer({ ptw, open, onClose }) {
    if (!open || !ptw) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ width: '400px', backgroundColor: 'var(--card-bg)', padding: '24px', overflow: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Detail PTW</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JUDUL</span><span style={{ fontWeight: 700 }}>{ptw.title}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>JENIS IZIN</span><PermitTypeBadge type={ptw.permit_type} /></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>LOKASI</span><span>{ptw.location}</span></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>MULAI</span><span>{ptw.start_date}</span></div>
                        <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>SELESAI</span><span>{ptw.end_date}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
