import React from 'react';
import { X, Download, FileText } from 'lucide-react';

export default function BlobPreviewModal({ attachment, onClose }) {
    if (!attachment) return null;

    const isActivity = attachment.type === 'activity';
    const previewUrl = `/api/document-system/attachments/${attachment.id}/preview${isActivity ? '?type=activity' : ''}`;
    const downloadUrl = `/api/document-system/attachments/${attachment.id}/download${isActivity ? '?type=activity' : ''}`;
    const fileExtension = (attachment.file_type || (attachment.name ? attachment.name.split('.').pop() : '') || '').toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={18} style={{ color: 'var(--primary)' }} />
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                Preview Lampiran
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                                {attachment.file_name || 'Unnamed File'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    maxHeight: 'calc(90vh - 140px)',
                    overflow: 'auto',
                    padding: '16px'
                }}>
                    {isPdf ? (
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '550px',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        />
                    ) : isImage ? (
                        <img
                            src={previewUrl}
                            alt={attachment.file_name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '550px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <FileText size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 8px 0' }}>
                                Pratinjau Tidak Tersedia
                            </p>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 20px 0' }}>
                                Format file ({attachment.file_type || 'unknown'}) tidak mendukung pratinjau langsung. Silakan download untuk membukanya.
                            </p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'var(--primary)',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                }}
                            >
                                <Download size={14} /> Download File
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer (Actions) */}
                {(isPdf || isImage) && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '16px 24px',
                        borderTop: '1px solid #f1f5f9',
                        backgroundColor: '#fff'
                    }}>
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textDecoration: 'none'
                            }}
                        >
                            <Download size={14} /> Download File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
