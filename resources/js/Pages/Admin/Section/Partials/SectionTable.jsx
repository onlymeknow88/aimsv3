import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/Components/ui/table';
import { Edit2, Trash2 } from 'lucide-react';

// ── Action buttons ────────────────────────────────────────────────────────────
function ActionBtns({ onEdit, onDelete }) {
    return (
        <div style={{ display: 'inline-flex', gap: '2px' }}>
            <button onClick={onEdit} title="Edit"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Edit2 size={14} />
            </button>
            <button onClick={onDelete} title="Hapus"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Trash2 size={14} />
            </button>
        </div>
    );
}

function RelationSummary({ items = [], getLabel }) {
    if (!items.length) {
        return <span style={{ color: '#cbd5e1', fontSize: '12px' }}>-</span>;
    }

    const shown = items.slice(0, 2);
    const extra = items.length - shown.length;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {shown.map((item) => (
                <span
                    key={item.id}
                    style={{
                        display: 'inline-flex',
                        maxWidth: '150px',
                        padding: '3px 7px',
                        borderRadius: '999px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '11px',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={getLabel(item)}
                >
                    {getLabel(item)}
                </span>
            ))}
            {extra > 0 && (
                <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, padding: '3px 0' }}>
                    +{extra}
                </span>
            )}
        </div>
    );
}

export default function SectionTable({ sections = [], onEdit, onDelete, loading = false }) {
    const columns = useMemo(() => [
        { accessorKey: 'name', header: 'Nama Section' },
        {
            id: 'department',
            header: 'Departemen',
            cell: ({ row }) => row.original.department?.name || '-',
        },
        {
            id: 'area_locations',
            header: 'Area Location',
            cell: ({ row }) => (
                <RelationSummary
                    items={row.original.area_locations || []}
                    getLabel={(location) => location.name}
                />
            ),
        },
        {
            id: 'area_managers',
            header: 'Area Manager',
            cell: ({ row }) => (
                <RelationSummary
                    items={row.original.area_managers || []}
                    getLabel={(manager) => manager.user?.name || manager.user?.email || 'Manager tanpa user'}
                />
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ textAlign: 'right' }}>
                    <ActionBtns onEdit={() => onEdit(row.original)} onDelete={() => onDelete(row.original)} />
                </div>
            ),
        },
    ], [onEdit, onDelete]);

    const table = useReactTable({
        data: sections,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    const visibleCount = table.getVisibleFlatColumns().length;

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id} style={{ backgroundColor: '#f8fafc' }}>
                        {hg.headers.map(h => (
                            <TableHead key={h.id} style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Memuat data section...</TableCell></TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow><TableCell colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>Belum ada section. Klik "Tambah Section" untuk mulai.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    );
}
