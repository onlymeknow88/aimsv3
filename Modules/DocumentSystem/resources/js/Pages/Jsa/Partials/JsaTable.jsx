import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Edit, Trash2 } from 'lucide-react';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import TablePagination from '@/Components/TablePagination';

export default function JsaTable({
    documents,
    onOpenDrawer,
    onDelete,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    columnFilters,
    onColumnFilterChange,
}) {
    const [previewAttachment, setPreviewAttachment] = useState(null);
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
                <a
                    href={`/document-system/jsa/detail/${row.original.id}`}
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
            accessorKey: 'revision',
            id: 'revision',
            header: 'Revisi No.',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{!info.getValue() || info.getValue() === '' || info.getValue() === null ? '0.0' : `${info.getValue()}.0`}</span>
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
                    '1': { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1', label: 'DRAFT'          },
                    '2': { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', label: 'PENDING REVIEW'  },
                    '3': { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444', label: 'REJECTED'        },
                    '5': { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', label: 'ACTIVE'          },
                };
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
                    return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>;
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {attachments.map(att => {
                            const fileName = att.file_name || att.file_path?.split('/').pop() || 'File';
                            return (
                                <span
                                    key={att.id}
                                    onClick={() => setPreviewAttachment({
                                        ...att,
                                        file_name: fileName,
                                        type: 'jsa'
                                    })}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--primary)',
                                        textDecoration: 'underline',
                                        textDecorationStyle: 'dotted',
                                        cursor: 'pointer',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={`Klik untuk preview: ${fileName}`}
                                >
                                    <FileText size={11} style={{ flexShrink: 0 }} />
                                    {fileName}
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
            cell: ({ row }) => {
                const isActive = String(row.original.status) === '5';
                if (isActive) return null;
                return (
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => window.location.href = `/document-system/jsa/edit/${row.original.id}`}
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
                        {onDelete && (
                            <button
                                onClick={() => onDelete(row.original.id)}
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
                                    color: '#ef4444'
                                }}
                                title="Hapus"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                );
            }
        }
    ], [onOpenDrawer, previewAttachment, selectedRowIds, documents, onDelete]);

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const colsCount = columns.length;

    return (
        <>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
            <Table style={{ fontSize: '12px', minWidth: '1000px' }}>
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
                                Memuat data JSA...
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
                                Data JSA kosong atau tidak ditemukan.
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

            {previewAttachment && (
                <BlobPreviewModal
                    attachment={previewAttachment}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}
        </>
    );
}
