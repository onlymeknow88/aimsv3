import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, Download, FileText, User } from 'lucide-react';

/**
 * News Detail — halaman detail News & Update dari widget main dashboard.
 * Berdiri sendiri (tanpa layout dashboard), data dikirim server-side (props)
 * dengan fresh SAS URI untuk attachment.
 */
export default function NewsDetail({ news }) {
    if (!news) return null;

    const fileName = news.attc || news.blob_url || '';
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);
    const hasAttachment = !!news.blob_url;
    const fileExt = fileName.split('.').pop()?.toUpperCase() || 'FILE';

    // Warna aksen badge berdasarkan tipe file
    const accentColor = isPdf ? '#ef4444' : isImage ? '#16a34a' : '#3b82f6';
    const accentBg = isPdf ? '#fef3f2' : isImage ? '#f0fdf4' : '#eff6ff';
    // Proxy endpoint agar file ter-download paksa (blob URL bersifat cross-origin)
    const downloadUrl = `/api/portal/news/${news.id}/download`;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-color, #f4f6fa)',
            padding: '32px 24px',
            boxSizing: 'border-box',
        }}>
            <Head title={`${news.title} - AIMS`} />

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                {/* Back button */}
                <button
                    onClick={() => window.history.back()}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: '8px',
                        border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)',
                        fontSize: '12px', fontWeight: 600, color: '#475569',
                        cursor: 'pointer', marginBottom: '16px',
                    }}
                >
                    <ArrowLeft size={14} /> Kembali
                </button>

                <article style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '32px',
                }}>
                    {/* Hero image untuk attachment gambar */}
                    {hasAttachment && isImage && (
                        <div style={{ height: '320px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                            <img
                                src={news.blob_url}
                                alt={news.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    )}

                    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Badge tipe attachment */}
                        {hasAttachment && (
                            <div style={{ display: 'flex' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    backgroundColor: accentBg, borderRadius: '6px', padding: '4px 10px',
                                }}>
                                    <FileText size={12} style={{ color: accentColor }} />
                                    <span style={{ fontSize: '11px', color: accentColor, fontWeight: 700 }}>
                                        {isPdf ? 'PDF' : fileExt}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <h1 style={{
                            fontSize: '22px', fontWeight: 800,
                            color: 'var(--text-primary)', margin: 0, lineHeight: 1.4,
                        }}>
                            {news.title}
                        </h1>

                        {/* Metadata row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            {news.post_at && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                                    <Calendar size={12} />
                                    <span style={{ fontSize: '12px' }}>{news.post_at}</span>
                                </div>
                            )}
                            {news.author && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                                    <User size={12} />
                                    <span style={{ fontSize: '12px' }}>{news.author}</span>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                        {/* Description */}
                        {news.description ? (
                            <div style={{
                                fontSize: '14px',
                                color: '#334155',
                                lineHeight: 1.75,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {news.description}
                            </div>
                        ) : (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                                Tidak ada deskripsi untuk berita ini.
                            </p>
                        )}

                        {/* Attachment card + download */}
                        {hasAttachment && (
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '8px',
                                        backgroundColor: accentBg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <FileText size={18} style={{ color: accentColor }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0, wordBreak: 'break-all' }}>
                                            {news.attc || 'Attachment'}
                                        </p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
                                            {isPdf ? 'Dokumen PDF' : `${fileExt} File`}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={downloadUrl}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: 'none', flexShrink: 0,
                                        background: 'linear-gradient(135deg, #1d4ed8, #153B73)',
                                        fontSize: '12px', fontWeight: 600, color: '#fff',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <Download size={14} /> Download
                                </a>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
}
