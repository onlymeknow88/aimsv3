import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const PICA_STATUS_COLORS = {
    'Open':    { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'Closed':  { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    'Overdue': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

function PicaStatusBadge({ status }) {
    const s = PICA_STATUS_COLORS[status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    return (
        <span style={{ color: s.color, backgroundColor: s.bg, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
            {status ?? '-'}
        </span>
    );
}

export default function PicaTable({ picas, loading, onUpdate }) {
    const columns = useMemo(() => [
        {
            id: 'no',
            header: 'No',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.index + 1}</span>,
        },
        {
            id: 'temuan',
            header: 'Temuan',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'normal', maxWidth: '300px', display: 'block' }}>
                    {row.original.description ?? '-'}
                </span>
            ),
        },
        {
            id: 'perusahaan',
            header: 'Perusahaan',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.original.company_name ?? '-'}</span>,
        },
        {
            id: 'ccow',
            header: 'CCOW',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.original.bidding?.ccow_name ?? '-'}</span>,
        },
        {
            id: 'checklist',
            header: 'Item Checklist',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'normal', maxWidth: '200px', display: 'block' }}>
                    {row.original.checklist?.crtiteria ?? '-'}
                </span>
            ),
        },
        {
            id: 'due_date',
            header: 'Due Date',
            cell: ({ row }) => {
                const p = row.original;
                const isOverdue = p.status === 'Overdue';
                return (
                    <span style={{ fontSize: '12px', color: isOverdue ? '#ef4444' : 'var(--text-secondary)', fontWeight: isOverdue ? 600 : 400 }}>
                        {p.due_date ? new Date(p.due_date).toLocaleDateString('id-ID') : '-'}
                    </span>
                );
            },
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <PicaStatusBadge status={row.original.status} />,
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row.original.pic ?? '-'}</span>,
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const p = row.original;
                if (p.status === 'Closed') return null;
                return (
                    <button
                        onClick={() => onUpdate && onUpdate(p)}
                        style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                            backgroundColor: 'rgba(47,191,113,0.08)', color: '#2FBF71',
                            border: '1px solid rgba(47,191,113,0.3)', cursor: 'pointer',
                        }}
                    >
                        Closed
                    </button>
                );
            },
        },
    ], [onUpdate]);

    const table = useReactTable({
        data: picas,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Table style={{ fontSize: '12px', minWidth: '900px' }}>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id} style={{ backgroundColor: '#f8fafc' }}>
                            {hg.headers.map(h => (
                                <TableHead key={h.id} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={visibleColsCount} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} style={{ padding: '10px 12px' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={visibleColsCount} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada data PICA.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
