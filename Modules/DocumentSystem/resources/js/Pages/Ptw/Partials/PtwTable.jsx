import React, { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import TablePagination from '@/Components/TablePagination';
import DeleteConfirmModal from './Components/DeleteConfirmModal';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import SearchableSelect from '@/Components/SearchableSelect';
import { FileText, FileImage, Edit, Trash2, Download } from 'lucide-react';
import axios from 'axios';

// Ikon lampiran per ekstensi (port ide v2 define_file_icon ke React)
const fileIconStyle = (fileName = '') => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return { Icon: FileImage, color: '#7C3AED' };
    if (['xls', 'xlsx', 'csv'].includes(ext)) return { Icon: FileText, color: '#16A34A' };
    if (['doc', 'docx'].includes(ext)) return { Icon: FileText, color: '#2563EB' };
    if (['ppt', 'pptx'].includes(ext)) return { Icon: FileText, color: '#EA580C' };
    if (ext === 'pdf') return { Icon: FileText, color: '#DC2626' };
    return { Icon: FileText, color: 'var(--primary)' };
};

export default function PtwTable({
    documents,
    onOpenDrawer,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    columnFilters,
    onColumnFilterChange,
    onExport,
    exporting = false,
    onBulkDelete,
    bulkDeleting = false}) {
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const [companiesOpt, setCompaniesOpt] = useState([]);
    const [departmentsOpt, setDepartmentsOpt] = useState([]);

    // Master options untuk filter dropdown (mirip DocumentTable documentsystem)
    useEffect(() => {
        axios.get('/api/document-system/companies').then(res => {
            const list = (res.data?.result || []).map(item => ({
                id: item.id,
                name: item.company_name || item.document_code || String(item.id),
            }));
            setCompaniesOpt(list);
        }).catch(err => console.error('Failed to load companies', err));
        axios.get('/api/document-system/departments').then(res => {
            const list = (res.data?.result || []).map(item => ({
                id: item.id,
                name: item.name || item.document_code || String(item.id),
            }));
            setDepartmentsOpt(list);
        }).catch(err => console.error('Failed to load departments', err));
    }, []);

    const selectedIds = useMemo(() => [...selectedRowIds], [selectedRowIds]);
    // Filter tanggal disembunyikan sementara (backend + state tetap dipertahankan)
    const showDateFilters = false;
    const hasDateFilter = Boolean(
        columnFilters?.start_date || columnFilters?.end_date ||
        columnFilters?.inactive_start || columnFilters?.inactive_end
    );

    const resetDateFilters = () => {
        if (!onColumnFilterChange) return;
        onColumnFilterChange('start_date', '');
        onColumnFilterChange('end_date', '');
        onColumnFilterChange('inactive_start', '');
        onColumnFilterChange('inactive_end', '');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        setDeleting(true);
        try {
            await axios.post(`/api/document-system/ptw/${deleteTargetId}/delete`, {});
            setDeleteTargetId(null);
            window.location.reload();
        } catch (err) {
            console.error('Failed to delete PTW', err);
            alert('Gagal menghapus draft PTW.');
        } finally {
            setDeleting(false);
        }
    };

    const handleBulkDeleteConfirm = async () => {
        if (!onBulkDelete) return;
        const ok = await onBulkDelete(selectedIds);
        if (ok) {
            setSelectedRowIds(new Set());
            setBulkDeleteOpen(false);
        }
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={documents.length > 0 && selectedRowIds.size === documents.length}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            setSelectedRowIds(new Set(documents.map(d => d.id)));
                        } else {
                            setSelectedRowIds(new Set());
                        }
                    }}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedRowIds.has(row.original.id)}
                    onCheckedChange={(checked) => {
                        const next = new Set(selectedRowIds);
                        if (checked) {
                            next.add(row.original.id);
                        } else {
                            next.delete(row.original.id);
                        }
                        setSelectedRowIds(next);
                    }}
                />
            )
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => (
                <a
                    href={`/document-system/ptw/detail/${row.original.id}`}
                    style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
                >
                    {row.original.company?.company_name || '-'}
                </a>
            )
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => <span style={{ color: 'var(--text-secondary)' }}>{row.original.department?.name || '-'}</span>
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ color: 'var(--text-secondary)' }}>{row.original.user?.name || '-'}</span>
        },
        {
            accessorKey: 'title',
            id: 'title',
            header: 'Judul',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'document_number',
            id: 'document_number',
            header: 'ID Document',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'detail_location',
            id: 'detail_location',
            header: 'Detail Location',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'doc_created',
            id: 'doc_created',
            header: 'Date Created',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{formatDate(info.getValue())}</span>
        },
        {
            accessorKey: 'inactive_at',
            id: 'inactive_at',
            header: 'Inactive At',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{formatDate(info.getValue())}</span>
        },
        {
            id: 'status',
            header: 'Status',
            cell: info => {
                const STATUS_MAP = {
                    '1': { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1', label: 'DRAFT'          },
                    '2': { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', label: 'PENDING REVIEW'  },
                    '3': { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444', label: 'REJECTED'        },
                    '5': { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', label: 'ACTIVE'          }};
                const cfg = STATUS_MAP[String(info.row.original.status)] || STATUS_MAP['1'];
                return (
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap'
                    }}>
                        {cfg.label}
                    </span>
                );
            }
        },
        {
            id: 'attachment',
            header: 'Attachment',
            cell: ({ row }) => {
                const attachments = row.original.attachments || [];

                if (attachments.length === 0) {
                    return <span style={{ color: 'var(--text-muted)' }}>-</span>;
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {attachments.map((file, idx) => {
                            const label = file.file_name || (file.file_path ? file.file_path.split('/').pop() : 'Attachment');
                            const { Icon, color } = fileIconStyle(label);
                            return (
                                <span
                                    key={idx}
                                    onClick={() => setPreviewAttachment({ ...file, type: 'ptw' })}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer', fontSize: '10px', fontWeight: 600 }}
                                >
                                    <Icon size={12} color={color} />
                                    {label}
                                </span>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    {String(row.original.status) === '1' && (
                        <>
                            <button
                                onClick={() => window.location.href = `/document-system/ptw/edit/${row.original.id}`}
                                style={{
                                    border: '1px solid var(--border-color)',
                                    background: '#fff',
                                    borderRadius: '6px',
                                    width: '28px',
                                    height: '28px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--primary)'
                                }}
                                title="Edit"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => setDeleteTargetId(row.original.id)}
                                style={{
                                    border: '1px solid #fee2e2',
                                    background: '#fef2f2',
                                    borderRadius: '6px',
                                    width: '28px',
                                    height: '28px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--danger)'
                                }}
                                title="Hapus"
                            >
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ], [documents, selectedRowIds]);

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel()});

    const colsCount = columns.length;

    return (
        <>
        {/* Filter rentang tanggal ala v2: Active At (doc_created) & Inactive At (hidden) */}
        {showDateFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>DIBUAT DARI</label>
                <input type="date" value={columnFilters?.start_date || ''} onChange={(e) => onColumnFilterChange && onColumnFilterChange('start_date', e.target.value)} style={{ height: '36px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 10px', fontSize: '12px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>DIBUAT SAMPAI</label>
                <input type="date" value={columnFilters?.end_date || ''} onChange={(e) => onColumnFilterChange && onColumnFilterChange('end_date', e.target.value)} style={{ height: '36px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 10px', fontSize: '12px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>NONAKTIF DARI</label>
                <input type="date" value={columnFilters?.inactive_start || ''} onChange={(e) => onColumnFilterChange && onColumnFilterChange('inactive_start', e.target.value)} style={{ height: '36px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 10px', fontSize: '12px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>NONAKTIF SAMPAI</label>
                <input type="date" value={columnFilters?.inactive_end || ''} onChange={(e) => onColumnFilterChange && onColumnFilterChange('inactive_end', e.target.value)} style={{ height: '36px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 10px', fontSize: '12px', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }} />
            </div>
            {hasDateFilter && (
                <button onClick={resetDateFilters} style={{ height: '36px', padding: '0 14px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    Reset Tanggal
                </button>
            )}
            <div style={{ flex: 1 }} />
            {selectedIds.length > 0 && (
                <>
                    <button onClick={() => onExport && onExport(selectedIds)} disabled={exporting} style={{ height: '36px', padding: '0 14px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: exporting ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: exporting ? 0.7 : 1 }}>
                        <Download size={13} /> Export ({selectedIds.length})
                    </button>
                    <button onClick={() => setBulkDeleteOpen(true)} disabled={bulkDeleting} style={{ height: '36px', padding: '0 14px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: bulkDeleting ? 'not-allowed' : 'pointer', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Trash2 size={13} /> Hapus ({selectedIds.length})
                    </button>
                </>
            )}
        </div>
        )}
        {(!showDateFilters && selectedIds.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <button onClick={() => onExport && onExport(selectedIds)} disabled={exporting} style={{ height: '36px', padding: '0 14px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: exporting ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: exporting ? 0.7 : 1 }}>
                <Download size={13} /> Export ({selectedIds.length})
            </button>
            <button onClick={() => setBulkDeleteOpen(true)} disabled={bulkDeleting} style={{ height: '36px', padding: '0 14px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: bulkDeleting ? 'not-allowed' : 'pointer', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={13} /> Hapus ({selectedIds.length})
            </button>
        </div>
        )}
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
            <Table style={{ fontSize: '12px', minWidth: '1000px' }}>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                            {hg.headers.map(h => {
                                const isSearchable = ['company', 'department', 'pic', 'title', 'document_number', 'detail_location', 'status'].includes(h.id);
                                const isStatusFilter = h.id === 'status';
                                return (
                                    <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 12px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isSearchable ? '120px' : 'auto' }}>
                                            <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                                            {isSearchable && onColumnFilterChange && (
                                                isStatusFilter ? (
                                                    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '130px' }}>
                                                        <SearchableSelect
                                                            options={[
                                                                { id: '', name: 'Semua Status' },
                                                                { id: 'draft', name: 'DRAFT' },
                                                                { id: 'pending', name: 'PENDING REVIEW' },
                                                                { id: 'active', name: 'ACTIVE' },
                                                            ]}
                                                            value={columnFilters?.status || ''}
                                                            onChange={(val) => onColumnFilterChange('status', val || '')}
                                                            placeholder="Cari..."
                                                            portal={true}
                                                        />
                                                    </div>
                                                ) : (h.id === 'company' || h.id === 'department') ? (
                                                    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: '130px' }}>
                                                        <SearchableSelect
                                                            options={[
                                                                { id: '', name: h.id === 'company' ? 'Semua Company' : 'Semua Department' },
                                                                ...(h.id === 'company' ? companiesOpt : departmentsOpt),
                                                            ]}
                                                            value={columnFilters?.[h.id] || ''}
                                                            onChange={(val) => onColumnFilterChange(h.id, val || '')}
                                                            placeholder="Cari..."
                                                            portal={true}
                                                        />
                                                    </div>
                                                ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Cari..."
                                                    value={columnFilters?.[h.id] || ''}
                                                    onChange={(e) => onColumnFilterChange(h.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 8px',
                                                        minHeight: '44px',
                                                        fontSize: '12px',
                                                        fontWeight: 'normal',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        boxSizing: 'border-box',
                                                        color: 'var(--text-primary)',
                                                        backgroundColor: 'var(--card-bg)'
                                                    }}
                                                />
                                                )
                                            )}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={colsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                                Memuat data PTW...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={colsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Data PTW kosong atau tidak ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

            <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTargetId}
                deleting={deleting}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={handleDeleteConfirm}
                title="Hapus Draft PTW"
                description="Apakah Anda yakin ingin menghapus draft PTW ini? Tindakan ini tidak dapat dibatalkan."
            />

            <DeleteConfirmModal
                isOpen={bulkDeleteOpen}
                deleting={bulkDeleting}
                onClose={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDeleteConfirm}
                title={`Hapus ${selectedIds.length} PTW Terpilih`}
                description={`Apakah Anda yakin ingin menghapus ${selectedIds.length} PTW terpilih? Tindakan ini tidak dapat dibatalkan.`}
            />

            {previewAttachment && (
                <BlobPreviewModal
                    attachment={previewAttachment}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}
        </>
    );
}
