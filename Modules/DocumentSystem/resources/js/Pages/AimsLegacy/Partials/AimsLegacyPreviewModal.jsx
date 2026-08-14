import React from 'react';
import { X } from 'lucide-react';

export default function AimsLegacyPreviewModal({ isOpen, onClose, fileData }) {
    if (!isOpen || !fileData) return null;

    const { FileName, FileType, FileBase } = fileData;

    // Decode base64 to Blob URL
    const base64Content = FileBase.includes(',') ? FileBase.split(',')[1] : FileBase;
    const byteCharacters = atob(base64Content.trim());
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    let mime = 'application/octet-stream';
    if (FileType && FileType.toLowerCase() === 'pdf') {
        mime = 'application/pdf';
    } else if (FileType && FileType.includes('/')) {
        mime = FileType;
    }

    const blob = new Blob([byteArray], { type: mime });
    const fileUrl = URL.createObjectURL(blob);

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '1024px', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            Preview Dokumen
                        </h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {FileName || 'Dokumen AIMS'}
                        </span>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', color: 'var(--text-secondary)' }}
                    >
                        <X size={16} />
                    </button>
                </div>
                {/* Body / Iframe PDF */}
                <div style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative' }}>
                    {mime === 'application/pdf' ? (
                        <iframe 
                            src={`${fileUrl}#toolbar=0`} 
                            style={{ width: '100%', height: '100%', border: 'none' }} 
                            title={FileName || 'PDF Preview'} 
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-secondary)' }}>
                            <span>Preview tidak didukung untuk tipe berkas ini.</span>
                            <a 
                                href={fileUrl} 
                                download={FileName || 'document'} 
                                style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                            >
                                Unduh Berkas
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
