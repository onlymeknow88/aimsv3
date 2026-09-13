import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, FileText, Newspaper, Search } from 'lucide-react';

/**
 * News Index — halaman list News & Update dari main dashboard.
 * Standalone (tanpa layout dashboard), search + pagination via /api/portal/news/list.
 */
export default function NewsIndex() {
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    // Debounce input pencarian
    useEffect(() => {
        const t = setTimeout(() => setSearch(input.trim()), 400);
        return () => clearTimeout(t);
    }, [input]);

    // Reset ke halaman 1 saat pencarian berubah
    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axios
            .get('/api/portal/news/list', {
                params: { search, page, limit: 12 },
                signal: controller.signal,
            })
            .then(res => {
                setItems(res.data?.result?.data ?? []);
                setPagination(res.data?.result?.pagination ?? null);
            })
            .catch(err => {
                if (!axios.isCancel(err)) console.error('Failed to fetch news list:', err);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [search, page]);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-color, #f4f6fa)',
            padding: '32px 24px',
            boxSizing: 'border-box',
        }}>
            <Head title="News & Update - AIMS" />

            <style>{`
                .news-page-card > div {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .news-page-card:hover > div {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                }
            `}</style>

            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
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
                    <ChevronLeft size={14} /> Kembali
                </button>

                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '32px',
                }}>
                    {/* Header + Search */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Newspaper size={16} style={{ color: 'var(--primary)' }} />
                            <h1 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                NEWS &amp; UPDATE
                            </h1>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Cari judul atau isi berita..."
                                style={{
                                    width: '260px', maxWidth: '100%',
                                    padding: '9px 12px 9px 34px',
                                    border: '1.5px solid #e2e8f0', borderRadius: '8px',
                                    fontSize: '13px', color: '#0f172a', outline: 'none',
                                    boxSizing: 'border-box', backgroundColor: 'var(--card-bg)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '16px',
                    }}>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : items.length > 0 ? (
                            items.map(item => (
                                <a
                                    key={item.id}
                                    href={`/news/${item.id}`}
                                    className="news-page-card"
                                    style={{ textDecoration: 'none', display: 'block' }}
                                >
                                    <NewsCard item={item} />
                                </a>
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '48px',
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                            }}>
                                {search ? `Tidak ada berita yang cocok dengan "${search}".` : 'Belum ada berita atau pengumuman.'}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && pagination && pagination.total > 0 && (
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginTop: '24px', flexWrap: 'wrap', gap: '12px',
                        }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                Menampilkan halaman {pagination.page} dari {pagination.total_page} ({pagination.total} berita)
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={pagination.page <= 1}
                                    style={{ ...pageBtnStyle, opacity: pagination.page <= 1 ? 0.5 : 1, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    <ChevronLeft size={14} /> Sebelumnya
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.total_page, p + 1))}
                                    disabled={pagination.page >= pagination.total_page}
                                    style={{ ...pageBtnStyle, opacity: pagination.page >= pagination.total_page ? 0.5 : 1, cursor: pagination.page >= pagination.total_page ? 'not-allowed' : 'pointer' }}
                                >
                                    Berikutnya <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const pageBtnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px',
    border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)',
    fontSize: '12px', fontWeight: 600, color: '#475569',
};

function SkeletonCard() {
    return (
        <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'dashboard-pulse 1.8s infinite ease-in-out',
        }}>
            <div style={{ height: '140px', backgroundColor: '#f1f5f9' }} />
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '80%' }} />
                <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '50%' }} />
            </div>
        </div>
    );
}

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

function NewsCard({ item }) {
    const fileName = item.attc || item.blob_url || '';
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = /\.pdf$/i.test(fileName);

    let thumbnail;
    if (item.blob_url && isImage) {
        thumbnail = (
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
    } else if (item.blob_url) {
        thumbnail = (
            <div style={{
                height: '140px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column', gap: '8px',
                backgroundColor: isPdf ? '#fef3f2' : '#eff6ff',
            }}>
                <FileText size={28} style={{ color: isPdf ? '#ef4444' : '#3b82f6' }} />
                <span style={{
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                    color: isPdf ? '#ef4444' : '#3b82f6',
                }}>
                    {fileName.split('.').pop()?.toUpperCase() || 'File'}
                </span>
            </div>
        );
    } else {
        thumbnail = <ThumbnailPlaceholder />;
    }

    return (
        <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}>
            {thumbnail}

            <div style={{ padding: '12px 14px' }}>
                <h5 style={{
                    fontSize: '13px', fontWeight: 700,
                    color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {item.title}
                </h5>
                {item.post_at && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <Calendar size={10} />
                            <span style={{ fontSize: '11px' }}>{item.post_at}</span>
                        </div>
                        <ArrowRight size={12} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                )}
            </div>
        </div>
    );
}
