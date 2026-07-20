import React, { useState } from 'react';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Search, RefreshCw, Plus, Edit2, Trash2, Video, FileText, Play, Eye, EyeOff } from 'lucide-react';
import DashboardPortalLayout from "../../../Layouts/DashboardPortalLayout";
import TablePagination from "@/Components/TablePagination";
import useSlideshow from "../Hooks/useSlideshow";
import FileDropzone from '@/Components/FileDropzone';
import ConfirmationModal from '@/Components/ConfirmationModal';
import SlideshowModal from './SlideshowModal';

const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
};

export default function SlideshowIndex() {
    const {
        slideshows,
        loading,
        error,
        search,
        setSearch,
        fetchSlideshows,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        modalOpen,
        editId,
        form,
        setField,
        submitting,
        formError,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        deleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
    } = useSlideshow();

    const [previewVideo, setPreviewVideo] = useState(null);

    return (
        <DashboardPortalLayout>
            <Head title="Slideshow - Dashboard Portal" />
            
            <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--primary)", margin: 0 }}>
                    Daftar SlideShow (Video)
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "4px" }}>
                    Kelola video promosi keselamatan untuk tayangan banner portal utama AIMS.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                {/* Header / Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Video Slides</h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari video..."
                                style={{ ...inputStyle, paddingLeft: '34px', width: '200px' }}
                            />
                        </div>

                        <button
                            onClick={fetchSlideshows}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "9px 14px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                                color: "#475569",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        <button
                            onClick={openCreateModal}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "linear-gradient(135deg, #1d4ed8, #153B73)",
                                color: "#fff",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(21,59,115,0.25)",
                            }}
                        >
                            <Plus size={16} /> Tambah Video
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
                <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHeader>
                                <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', width: '80px', textAlign: 'center' }}>Visible</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Nama Video</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Deskripsi</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', width: '200px' }}>Attachment / File</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center', width: '120px' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Memuat data slideshow...
                                        </TableCell>
                                    </TableRow>
                                ) : slideshows.length > 0 ? (
                                    slideshows.map(slide => (
                                        <TableRow key={slide.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    {slide.visible === 'true' ? (
                                                        <Eye size={18} style={{ color: '#16a34a' }} title="Visible" />
                                                    ) : (
                                                        <EyeOff size={18} style={{ color: '#94a3b8' }} title="Hidden" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', fontWeight: 600 }}>{slide.name}</TableCell>
                                            <TableCell style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>
                                                {slide.description || '-'}
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                {slide.blob_url ? (
                                                    <button 
                                                        onClick={() => setPreviewVideo(slide)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: 0 }}
                                                    >
                                                        <Play size={12} fill="currentColor" /> Preview Video
                                                    </button>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>Tidak ada file</span>
                                                )}
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => openEditModal(slide)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(slide)}
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
                                        <TableCell colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Tidak ada data slideshow.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <TablePagination
                        pagination={pagination}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={setLimit}
                    />
                </div>

                {/* Video Preview Modal */}
                {previewVideo && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Preview: {previewVideo.name}</h3>
                                <button onClick={() => setPreviewVideo(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                            </div>
                            <video key={previewVideo.blob_url} width="100%" height="auto" controls autoPlay style={{ borderRadius: '8px' }}>
                                <source src={previewVideo.blob_url} type="video/mp4" />
                                Browser Anda tidak mendukung pemutaran video.
                            </video>
                        </div>
                    </div>
                )}

                {/* Form Create/Edit Modal */}
                <SlideshowModal
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
                    title="Hapus Slideshow"
                    description={`Apakah Anda yakin ingin menghapus video slideshow "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    isDestructive={true}
                    isLoading={deleting}
                />
            </div>
        </DashboardPortalLayout>
    );
}
