import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Edit2, Eye, EyeOff, ExternalLink, FileText, Image, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import DashboardPortalLayout from '../../../Layouts/DashboardPortalLayout';
import TablePagination from '@/Components/TablePagination';
import ConfirmationModal from '@/Components/ConfirmationModal';
import useNewsAndUpdate from '../Hooks/useNewsAndUpdate';
import NewsAndUpdateModal from './NewsAndUpdateModal';

const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
};

export default function NewsAndUpdateTable() {
    const {
        news, loading, error,
        search, setSearch,
        fetchNews,
        pagination, page, setPage, limit, setLimit,
        modalOpen, editId, form, setField, submitting, formError,
        openCreateModal, openEditModal, closeModal, handleSubmit,
        deleteTarget, deleting, deleteError,
        openDeleteModal, closeDeleteModal, confirmDelete,
    } = useNewsAndUpdate();

    const [previewNews, setPreviewNews] = useState(null);

    return (
        <DashboardPortalLayout>
            <Head title="News & Update - Dashboard Portal" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                    News &amp; Update
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
                    Kelola berita, pengumuman, dan newsletter yang ditampilkan di portal dashboard AIMS.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                {/* Header / Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daftar Berita &amp; Pengumuman</h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari berita..."
                                style={{ ...inputStyle, paddingLeft: '34px', width: '200px' }}
                            />
                        </div>

                        <button
                            onClick={fetchNews}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        <button
                            onClick={openCreateModal}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(21,59,115,0.25)' }}
                        >
                            <Plus size={16} /> Tambah Berita
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                {/* Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHeader>
                                <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', width: '80px', textAlign: 'center' }}>Visible</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Judul</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Deskripsi</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', width: '160px' }}>Attachment</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Dibuat Oleh</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center', width: '100px' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Memuat data news and update...
                                        </TableCell>
                                    </TableRow>
                                ) : news.length > 0 ? (
                                    news.map(item => (
                                        <TableRow key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            {/* Visible */}
                                            <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    {item.visible === 'true'
                                                        ? <Eye size={18} style={{ color: '#16a34a' }} title="Visible" />
                                                        : <EyeOff size={18} style={{ color: '#94a3b8' }} title="Hidden" />
                                                    }
                                                </div>
                                            </TableCell>
                                            {/* Title */}
                                            <TableCell style={{ padding: '14px 16px', fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>
                                                {item.title}
                                                {item.slug && (
                                                    <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginTop: '2px' }}>
                                                        /{item.slug}
                                                    </span>
                                                )}
                                            </TableCell>
                                            {/* Description */}
                                            <TableCell style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', maxWidth: '280px' }}>
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.description || '-'}
                                                </div>
                                            </TableCell>
                                            {/* Attachment */}
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                {item.blob_url ? (
                                                    (() => {
                                                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(item.attc || item.blob_url || '');
                                                        const isPdf = /\.pdf$/i.test(item.attc || item.blob_url || '');
                                                        if (isImage) {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <img
                                                                        src={item.blob_url}
                                                                        alt={item.title}
                                                                        onClick={() => setPreviewNews(item)}
                                                                        onError={e => { e.target.style.display = 'none'; }}
                                                                        style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                                                                    />
                                                                    <span style={{ fontSize: '11px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }} title={item.attc}>
                                                                        {item.attc}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <a
                                                                href={item.blob_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: isPdf ? '#ef4444' : 'var(--primary)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                                            >
                                                                {isPdf ? <FileText size={12} /> : <ExternalLink size={12} />}
                                                                {item.attc || 'Lihat File'}
                                                            </a>
                                                        );
                                                    })()
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>Tidak ada file</span>
                                                )}
                                            </TableCell>
                                            {/* Created By */}
                                            <TableCell style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>
                                                {item.user?.name || '-'}
                                            </TableCell>
                                            {/* Actions */}
                                            <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(item)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Belum ada data news and update.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <TablePagination
                        pagination={pagination}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={setLimit}
                    />
                </div>

                {/* Image Preview Modal */}
                {previewNews && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Preview: {previewNews.title}</h3>
                                <button onClick={() => setPreviewNews(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '12px', border: '1px dashed #e2e8f0', minHeight: '300px' }}>
                                <img
                                    src={previewNews.blob_url}
                                    alt={previewNews.title}
                                    style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <a
                                    href={previewNews.blob_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
                                >
                                    <ExternalLink size={12} /> Buka di tab baru
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Modal */}
                <NewsAndUpdateModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editId={editId}
                    form={form}
                    setField={setField}
                    submitting={submitting}
                    formError={formError}
                />

                {/* Delete Confirm Modal */}
                <ConfirmationModal
                    isOpen={!!deleteTarget}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title="Hapus News & Update"
                    description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    isDestructive={true}
                    isLoading={deleting}
                />
            </div>
        </DashboardPortalLayout>
    );
}
