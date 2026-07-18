import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function JsaTable({ documents, onOpenDrawer, loading = false }) {
    const columns = useMemo(() => [
        {
            accessorKey: 'title',
            id: 'title',
            header: 'Judul',
            cell: info => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{info.getValue()}</span>
        },
        {
            accessorKey: 'work_type',
            id: 'work_type',
            header: 'Jenis Pekerjaan',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'location',
            id: 'location',
            header: 'Lokasi',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: 'Status',
            cell: info => {
                const isActive = String(info.getValue()) === '5';
                return (
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        color: isActive ? '#10B981' : '#6366F1',
                        padding: '2px 8px',
                        borderRadius: '10px'
                    }}>
                        {isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <button
                    onClick={() => window.location.href = `/document-system/jsa/edit/${row.original.id}`}
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
            )
        }
    ], [onOpenDrawer]);

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    const colsCount = columns.length;

    return (
        <Table style={{ fontSize: '12px' }}>
            <TableHeader>
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id}>
                        {hg.headers.map(h => (
                            <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                        ))}
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
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={colsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Data JSA kosong.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
