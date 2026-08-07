import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function ApprovalTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    onViewDetail,
    onApprove,
    onReject,
    loading = false,
}) {
    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        if (checked) {
            onSelectionChange(documents.map(d => d.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id, checked) => {
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(x => x !== id));
        }
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.original.id, checked)}
                />
            ),
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                    {row.original.company?.company_name || row.original.company?.document_code || '-'}
                </span>
            ),
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.department?.name || '-'}
                </span>
            ),
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.owner?.name || '-'}
                </span>
            ),
        },
        {
            id: 'module',
            header: 'Modul',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.module?.index ? `${row.original.mapping.category.module.index}. ` : ''}
                    {row.original.mapping?.category?.module?.name || '-'}
                </span>
            ),
        },
        {
            id: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.index ? `${row.original.mapping.category.index}. ` : ''}
                    {row.original.mapping?.category?.name || '-'}
                </span>
            ),
        },
        {
            id: 'document_level',
            header: 'Document Type',
            cell: ({ row }) => (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {row.original.document_level || '-'}
                </span>
            ),
        },
        {
            id: 'mapping',
            header: 'Mapping',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.index ? `${row.original.mapping.index}. ` : ''}
                    {row.original.mapping?.name || '-'}
                </span>
            ),
        },
        {
            id: 'document_number',
            header: 'No. Dokumen',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                    {row.original.document_number || '-'}
                </span>
            ),
        },
        {
            id: 'title',
            header: 'Judul Dokumen',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.original.title || '-'}
                </span>
            ),
        },
        {
            id: 'revision',
            header: 'Revisi',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {row.original.revision || 0}.0
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onViewDetail(row.original)}
                        style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px' }}
                    >
                        Detail
                    </button>
                    <button
                        onClick={() => onApprove(row.original)}
                        style={{ border: 'none', background: 'var(--success)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}
                    >
                        Setuju
                    </button>
                    <button
                        onClick={() => onReject(row.original)}
                        style={{ border: 'none', background: 'var(--danger)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}
                    >
                        Tolak
                    </button>
                </div>
            ),
        }
    ], [isAllSelected, selectedIds, documents, onViewDetail, onApprove, onReject]);

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Memuat data persetujuan...
            </div>
        );
    }

    return (
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Table style={{ fontSize: '12px', minWidth: '900px' }}>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--table-header-bg)' }}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '12px 16px' }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                Tidak ada dokumen yang memerlukan persetujuan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
