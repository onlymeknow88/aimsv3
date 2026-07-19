import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import TablePagination from '@/Components/TablePagination';

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
}) {
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.original.department?.company?.company_name || '-'}
                </span>
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
            id: 'status',
            header: 'Status',
            cell: info => {
                const STATUS_MAP = {
                    '1': { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1', label: 'DRAFT'  },
                    '5': { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', label: 'ACTIVE' },
                };
                const cfg = STATUS_MAP[String(info.row.original.status)] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b', label: String(info.row.original.status || 'DRAFT') };
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
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => window.location.href = `/document-system/ptw/detail/${row.original.id}`}
                        style={{
                            border: '1px solid var(--border-color)',
                            background: '#fff',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}
                    >
                        Detail
                    </button>
                    {String(row.original.status) === '1' && (
                        <>
                            <button
                                onClick={() => window.location.href = `/document-system/ptw/edit/${row.original.id}`}
                                style={{
                                    border: '1px solid var(--border-color)',
                                    background: '#fff',
                                    borderRadius: '4px',
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)'
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Apakah Anda yakin ingin menghapus draft PTW ini?')) {
                                        axios.delete(`/api/document-system/ptw/${row.original.id}`).then(() => {
                                            window.location.reload();
                                        });
                                    }
                                }}
                                style={{
                                    border: '1px solid #fee2e2',
                                    background: '#fef2f2',
                                    borderRadius: '4px',
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: 'var(--danger)'
                                }}
                            >
                                Delete
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
        getCoreRowModel: getCoreRowModel(),
    });

    const colsCount = columns.length;

    return (
        <>
            <Table style={{ fontSize: '12px' }}>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                            {hg.headers.map(h => {
                                const isSearchable = ['company', 'department', 'pic', 'title', 'document_number', 'detail_location', 'status'].includes(h.id);
                                return (
                                    <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 12px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isSearchable ? '120px' : 'auto' }}>
                                            <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                                            {isSearchable && onColumnFilterChange && (
                                                <input
                                                    type="text"
                                                    placeholder="Cari..."
                                                    value={columnFilters?.[h.id] || ''}
                                                    onChange={(e) => onColumnFilterChange(h.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        fontWeight: 'normal',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '4px',
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                        color: '#334155',
                                                        backgroundColor: '#fff'
                                                    }}
                                                />
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
                                    <TableCell key={cell.id}>
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

            <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />
        </>
    );
}
