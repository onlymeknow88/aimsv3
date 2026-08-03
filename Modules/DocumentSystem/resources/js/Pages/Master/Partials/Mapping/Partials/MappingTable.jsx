import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Edit2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import MappingModal from './MappingModal';
import React, { useMemo } from 'react';
import TablePagination from '@/Components/TablePagination';
import useMapping from '../Hooks/useMapping';

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

const filterInputStyle = {
    ...inputStyle,
    fontSize: '12px',
    padding: '5px 8px',
};

export default function MappingTable() {
    const {
        mappings,
        categories,
        loading,
        error,
        search,
        setSearch,
        filterName,
        setFilterName,
        filterCategory,
        setFilterCategory,
        filterModule,
        setFilterModule,
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

    const columns = useMemo(() => [
        {
            id: 'index',
            header: 'Index',
            accessorKey: 'index',
            enableColumnFilter: false,
        },
        {
            id: 'name',
            header: 'Nama Mapping',
            accessorKey: 'name',
            enableColumnFilter: true,
            filterValue: filterName,
            onFilterChange: setFilterName,
            filterPlaceholder: 'Filter nama...',
        },
        {
            id: 'category',
            header: 'Kategori',
            accessorFn: row => row.category?.name ?? '-',
            enableColumnFilter: true,
            filterValue: filterCategory,
            onFilterChange: setFilterCategory,
            filterPlaceholder: 'Filter kategori...',
        },
        {
            id: 'module',
            header: 'Modul',
            accessorFn: row => row.category?.module?.name ?? '-',
            enableColumnFilter: true,
            filterValue: filterModule,
            onFilterChange: setFilterModule,
            filterPlaceholder: 'Filter modul...',
        },
        {
            id: 'actions',
            header: 'Aksi',
            enableColumnFilter: false,
            cell: ({ row }) => (
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                        onClick={() => openEditModal(row.original)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                        title="Edit"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => openDeleteModal(row.original)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                        title="Hapus"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ], [filterName, filterCategory, filterModule, openEditModal, openDeleteModal]);

    const table = useReactTable({
        data: mappings,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
    });

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Daftar Mapping</h3>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Global Search */}
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 14px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            color: '#475569',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>

                    <button
                        onClick={openCreateModal}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #1d4ed8, #153B73)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 3px 10px rgba(21,59,115,0.25)',
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
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <Table>
                        <TableHeader>
                            {/* Column label row */}
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={`label-${headerGroup.id}`} style={{ backgroundColor: '#f8fafc' }}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                fontWeight: 700,
                                                fontSize: '11px',
                                                color: '#475569',
                                                textTransform: 'uppercase',
                                                padding: '14px 16px',
                                                textAlign: header.column.id === 'actions' ? 'center' : undefined,
                                            }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                            {/* Column filter row */}
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={`filter-${headerGroup.id}`} style={{ backgroundColor: '#f1f5f9' }}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={`filter-cell-${header.id}`} style={{ padding: '6px 8px' }}>
                                            {header.column.columnDef.enableColumnFilter ? (
                                                <input
                                                    value={header.column.columnDef.filterValue ?? ''}
                                                    onChange={e => header.column.columnDef.onFilterChange(e.target.value)}
                                                    placeholder={header.column.columnDef.filterPlaceholder}
                                                    style={filterInputStyle}
                                                />
                                            ) : null}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                        Memuat data mapping...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    padding: '14px 16px',
                                                    ...(cell.column.id === 'index' && { fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }),
                                                    ...(cell.column.id === 'name' && { fontWeight: 600 }),
                                                    ...(cell.column.id === 'category' && { color: '#475569' }),
                                                    ...(cell.column.id === 'module' && { color: '#64748b' }),
                                                    ...(cell.column.id === 'actions' && { textAlign: 'center' }),
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                        Tidak ada data mapping.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={setLimit}
                />
            </div>

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
