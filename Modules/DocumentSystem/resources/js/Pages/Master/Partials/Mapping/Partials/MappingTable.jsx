import React from 'react';
import { Search, RefreshCw, Plus, Edit2, Trash2 } from 'lucide-react';
import useMapping from '../Hooks/useMapping';
import MappingModal from './MappingModal';
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

export default function MappingTable() {
    const {
        mappings,
        categories,
        loading,
        error,
        search,
        setSearch,
        fetchMappings,
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
    } = useMapping();

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daftar Mapping</h3>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari mapping..."
                            style={{ ...inputStyle, paddingLeft: '34px', width: '200px' }}
                        />
                    </div>

                    <button
                        onClick={fetchMappings}
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
                        <Plus size={16} /> Tambah Mapping
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
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Nama Mapping</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Kategori</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Modul</TableHead>
                            <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center' }}>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                    Memuat data mapping...
                                </TableCell>
                            </TableRow>
                        ) : mappings.length > 0 ? (
                            mappings.map(map => (
                                <TableRow key={map.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <TableCell style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{map.index}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', fontWeight: 600 }}>{map.name}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', color: '#475569' }}>{map.category?.name || '-'}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', color: '#64748b' }}>{map.category?.module?.name || '-'}</TableCell>
                                    <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button
                                                onClick={() => openEditModal(map)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(map)}
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
                                    Tidak ada data mapping.
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
            <MappingModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editId={editId}
                form={form}
                setField={setField}
                submitting={submitting}
                formError={formError}
                categories={categories}
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
