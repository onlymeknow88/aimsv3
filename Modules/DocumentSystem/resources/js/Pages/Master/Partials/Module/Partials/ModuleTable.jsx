import React from 'react';
import { Search, RefreshCw, Plus, Edit2, Trash2 } from 'lucide-react';
import useModule from '../Hooks/useModule';
import ModuleModal from './ModuleModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

import TablePagination from '@/Components/TablePagination';

// Form field helpers
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

export default function ModuleTable() {
    const {
        modules,
        loading,
        error,
        search,
        setSearch,
        fetchModules,
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
    } = useModule();

    const getPageNumbers = () => {
        if (!pagination) return [];
        const pages = [];
        const { current_page, last_page } = pagination;
        let startPage = Math.max(1, current_page - 2);
        let endPage = Math.min(last_page, current_page + 2);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("ellipsis");
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < last_page) {
            if (endPage < last_page - 1) pages.push("ellipsis");
            pages.push(last_page);
        }
        return pages;
    };

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daftar Modul</h3>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari modul..."
                            style={{ ...inputStyle, paddingLeft: '34px', width: '200px' }}
                        />
                    </div>

                    <button
                        onClick={fetchModules}
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
                        <Plus size={16} /> Tambah Modul
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
            <div style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Index</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Nama Modul</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center' }}>Generate No. Dokumen</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center' }}>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                    Memuat data modul...
                                </TableCell>
                            </TableRow>
                        ) : modules.length > 0 ? (
                            modules.map(mod => (
                                <TableRow key={mod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <TableCell style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{mod.index}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', fontWeight: 600 }}>{mod.name}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        {mod.has_document_number ? (
                                            <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>Ya</span>
                                        ) : (
                                            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>Tidak</span>
                                        )}
                                    </TableCell>
                                    <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button
                                                onClick={() => openEditModal(mod)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(mod)}
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
                                <TableCell colSpan={4} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                    Tidak ada data modul.
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

            {/* Modals */}
            <ModuleModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editId={editId}
                form={form}
                setField={setField}
                submitting={submitting}
                formError={formError}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={deleteTarget?.name}
                deleting={deleting}
                errorMessage={deleteError}
            />
        </div>
    );
}
