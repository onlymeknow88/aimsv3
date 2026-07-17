import React from 'react';
import { X, FileText, Download } from 'lucide-react';

export default function DocumentPreviewModal({ doc, onClose, onDownload }) {
    if (!doc) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '90%', maxWidth: '640px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={18} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Preview Dokumen</h3>
                    </div>
                    <X size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onClose} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>NO. DOKUMEN</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number || '-'}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>LEVEL</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{doc.document_level}</span>
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>JUDUL</span>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{doc.title}</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>DESKRIPSI</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{doc.description || '-'}</span>
                    </div>
                </div>

                <button onClick={() => onDownload(doc)} style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Download size={14} /> Download File
                </button>
            </div>
        </div>
    );
}
