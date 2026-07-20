import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Download, ExternalLink, FileText, User, X } from 'lucide-react';

/**
 * NewsUpdateDetailModal
 *
 * Props:
 *  - newsId  : string | null  — UUID of the selected news item
 *  - isOpen  : boolean        — controls visibility
 *  - onClose : () => void     — callback to clear state & hide modal
 */
export default function NewsUpdateDetailModal({ newsId, isOpen, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch detail whenever newsId changes and modal is open
    useEffect(() => {
        if (!isOpen || !newsId) return;

        let cancelled = false;
        setLoading(true);
        setError(null);
        setDetail(null);

        axios.get(`/api/portal/news/${newsId}`)
            .then(res => {
                if (!cancelled && res.data?.result) {
                    setDetail(res.data.result);
                }
            })
            .catch(() => {
                if (!cancelled) setError('Gagal memuat detail berita.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [newsId, isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine attachment type
    const fileName = detail?.attc || detail?.blob_url || '';
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);
    const hasAttachment = !!detail?.blob_url;

    return (
        <>
            <style>{`
                @keyframes nud-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes nud-slide-up {
                    from { opacity: 0; transform: scale(0.95) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .nud-backdrop {
                    animation: nud-fade-in 0.2s ease forwards;
                }
                .nud-modal {
                    animation: nud-slide-up 0.25s ease forwards;
                }
            `}</style>

            {/* Backdrop */}
            <div
                className="nud-backdrop"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.55)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                {/* Modal container — stop propagation so backdrop click doesn't fire inside */}
                <div
                    className="nud-modal"
                    onClick={e => e.stopPropagation()}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '680px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
                    }}
                >
                    {/* ── Loading state ── */}
                    {loading && (
                        <div style={{ padding: '64px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                border: '3px solid #e2e8f0',
                                borderTopColor: 'var(--primary, #1d4ed8)',
                                borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite',
                                margin: '0 auto 16px',
                            }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            Memuat detail berita...
                        </div>
                    )}

                    {/* ── Error state ── */}
                    {!loading && error && (
                        <div style={{ padding: '48px', textAlign: 'center' }}>
                            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
                            <button
                                onClick={onClose}
                                style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer', color: '#475569' }}
                            >
                                Tutup
                            </button>
                        </div>
                    )}

                    {/* ── Content ── */}
                    {!loading && detail && (
                        <>
                            {/* Media header */}
                            {hasAttachment && isImage && (
                                <div style={{ flexShrink: 0, height: '240px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={detail.blob_url}
                                        alt={detail.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    {/* Close button over image */}
                                    <button
                                        onClick={onClose}
                                        aria-label="Tutup modal"
                                        style={{
                                            position: 'absolute', top: '14px', right: '14px',
                                            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                                            border: 'none', borderRadius: '50%',
                                            width: '34px', height: '34px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#0f172a',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Header row (no image, or PDF/other) */}
                            {(!hasAttachment || !isImage) && (
                                <div style={{
                                    padding: '20px 24px 16px',
                                    borderBottom: '1px solid #f1f5f9',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexShrink: 0,
                                }}>
                                    {/* PDF / other attachment badge */}
                                    {hasAttachment && isPdf && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            backgroundColor: '#fef3f2', borderRadius: '6px',
                                            padding: '4px 10px', marginBottom: '4px',
                                        }}>
                                            <FileText size={12} style={{ color: '#ef4444' }} />
                                            <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>PDF</span>
                                        </div>
                                    )}
                                    {hasAttachment && !isPdf && !isImage && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            backgroundColor: '#eff6ff', borderRadius: '6px',
                                            padding: '4px 10px',
                                        }}>
                                            <FileText size={12} style={{ color: '#3b82f6' }} />
                                            <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700 }}>
                                                {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                                            </span>
                                        </div>
                                    )}
                                    {!hasAttachment && <span />}

                                    <button
                                        onClick={onClose}
                                        aria-label="Tutup modal"
                                        style={{
                                            border: 'none', background: '#f1f5f9', borderRadius: '50%',
                                            width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#475569', flexShrink: 0,
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Scrollable body */}
                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Title */}
                                <h2 style={{
                                    fontSize: '18px', fontWeight: 800,
                                    color: '#0f172a', margin: 0,
                                    lineHeight: 1.4,
                                }}>
                                    {detail.title}
                                </h2>

                                {/* Metadata row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                    {detail.post_at && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                                            <Calendar size={12} />
                                            <span style={{ fontSize: '12px' }}>{detail.post_at}</span>
                                        </div>
                                    )}
                                    {detail.author && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                                            <User size={12} />
                                            <span style={{ fontSize: '12px' }}>{detail.author}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                                {/* Description / body content */}
                                {detail.description ? (
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            color: '#334155',
                                            lineHeight: '1.75',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                        // dangerouslySetInnerHTML is intentionally NOT used here.
                                        // If rich HTML is needed in future, sanitize with DOMPurify first.
                                    >
                                        {detail.description}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                                        Tidak ada deskripsi untuk berita ini.
                                    </p>
                                )}

                                {/* Attachment action for PDF / other files */}
                                {hasAttachment && !isImage && (
                                    <div style={{
                                        marginTop: '8px',
                                        padding: '14px 16px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        flexWrap: 'wrap',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '8px',
                                                backgroundColor: isPdf ? '#fef3f2' : '#eff6ff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <FileText size={18} style={{ color: isPdf ? '#ef4444' : '#3b82f6' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                                                    {detail.attc || 'Attachment'}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                                                    {isPdf ? 'Dokumen PDF' : fileName.split('.').pop()?.toUpperCase() + ' File'}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <a
                                                href={detail.blob_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '7px 14px', borderRadius: '8px',
                                                    border: '1px solid #e2e8f0', backgroundColor: '#fff',
                                                    fontSize: '12px', fontWeight: 600, color: '#475569',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <ExternalLink size={12} /> Buka
                                            </a>
                                            <a
                                                href={detail.blob_url}
                                                download={detail.attc || true}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '7px 14px', borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'linear-gradient(135deg, #1d4ed8, #153B73)',
                                                    fontSize: '12px', fontWeight: 600, color: '#fff',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Download size={12} /> Download
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer — close button */}
                            <div style={{
                                padding: '16px 24px',
                                borderTop: '1px solid #f1f5f9',
                                backgroundColor: '#f8fafc',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexShrink: 0,
                            }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        padding: '9px 24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#475569',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Tutup
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}