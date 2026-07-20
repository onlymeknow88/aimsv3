import React, { useState } from 'react';
import { ArrowRight, Calendar, FileText, Newspaper } from 'lucide-react';
import NewsUpdateDetailModal from './NewsUpdateDetailModal';

// Skeleton loader untuk 1 card
function SkeletonCard() {
    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'news-pulse 1.8s infinite ease-in-out',
        }}>
            <div style={{ height: '140px', backgroundColor: '#f1f5f9' }} />
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '80%' }} />
                <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '50%' }} />
            </div>
        </div>
    );
}

// Thumbnail fallback jika tidak ada gambar
function ThumbnailPlaceholder() {
    return (
        <div style={{
            height: '140px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
        }}>
            <Newspaper size={32} />
        </div>
    );
}

export default function NewsUpdate({ newsItems = [], loading }) {
    const [selectedNewsId, setSelectedNewsId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (e, id) => {
        e.preventDefault();
        setSelectedNewsId(id);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedNewsId(null);
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px',
        }}>
            <style>{`
                @keyframes news-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .news-card-link:hover .news-card-inner {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                }
                .news-card-inner {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Newspaper size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>NEWS &amp; UPDATE</h4>
                </div>
                <a
                    href="/dashboard-portal/news-and-update"
                    style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                    Lihat Semua <ArrowRight size={12} />
                </a>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
            }}>
                {loading ? (
                    // Skeleton 6 cards
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : newsItems.length > 0 ? (
                    newsItems.map(item => (
                        <a
                            key={item.id}
                            href={`/dashboard-portal/news-and-update/${item.id}`}
                            className="news-card-link"
                            onClick={(e) => handleCardClick(e, item.id)}
                            style={{ textDecoration: 'none', display: 'block' }}
                        >
                            <div
                                className="news-card-inner"
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Thumbnail — deteksi tipe dari attc atau blob_url */}
                                {(() => {
                                    const fileName = item.attc || item.blob_url || '';
                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                                    const isPdf = /\.pdf$/i.test(fileName);

                                    if (item.blob_url && isImage) {
                                        return (
                                            <div style={{ height: '140px', overflow: 'hidden' }}>
                                                <img
                                                    src={item.blob_url}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#f1f5f9'; }}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                        );
                                    }

                                    if (item.blob_url && isPdf) {
                                        return (
                                            <div style={{ height: '140px', backgroundColor: '#fef3f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                                                <FileText size={28} style={{ color: '#ef4444' }} />
                                                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>PDF</span>
                                            </div>
                                        );
                                    }

                                    if (item.blob_url) {
                                        // file lain yang ada di blob
                                        return (
                                            <div style={{ height: '140px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                                                <FileText size={28} style={{ color: '#3b82f6' }} />
                                                <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {fileName.split('.').pop()?.toUpperCase() || 'File'}
                                                </span>
                                            </div>
                                        );
                                    }

                                    return <ThumbnailPlaceholder />;
                                })()}

                                {/* Content */}
                                <div style={{ padding: '12px 14px' }}>
                                    <h5 style={{
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        margin: '0 0 6px 0',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {item.title}
                                    </h5>
                                    {item.post_at && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                            <Calendar size={10} />
                                            <span style={{ fontSize: '11px' }}>{item.post_at}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '40px',
                        color: '#94a3b8',
                        fontSize: '13px',
                    }}>
                        Belum ada berita atau pengumuman.
                    </div>
                )}
            </div>

            {/* News Detail Modal */}
            <NewsUpdateDetailModal
                newsId={selectedNewsId}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
