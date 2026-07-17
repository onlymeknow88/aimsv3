import React from 'react';
import { X } from 'lucide-react';
import StatusTimeline from './Components/StatusTimeline';
import RevisionBanner from './Components/RevisionBanner';

export default function ReviewDetailDrawer({ doc, open, onClose }) {
    if (!open || !doc) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ width: '400px', backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow-lg)', overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Detail Dokumen</h3>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>

                <RevisionBanner revision={doc.revision} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>NO. DOKUMEN</span><span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number}</span></div>
                    <div><span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JUDUL</span><span style={{ fontSize: '12px', fontWeight: 600 }}>{doc.title}</span></div>
                </div>

                <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress Alur</h4>
                    <StatusTimeline status={doc.status} />
                </div>
            </div>
        </div>
    );
}
