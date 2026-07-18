import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/Components/ui/table';
import { Edit2, Trash2, FolderOpen, FileText, ChevronRight } from 'lucide-react';

// ─── Badge helper ─────────────────────────────────────────────────────────────

function Badge({ children, color = 'blue' }) {
    const colors = {
        blue:  { bg: '#eff6ff', text: '#1d4ed8' },
        green: { bg: '#f0fdf4', text: '#15803d' },
        amber: { bg: '#fffbeb', text: '#b45309' },
        gray:  { bg: '#f8fafc', text: '#475569' },
    };
    const { bg, text } = colors[color] || colors.blue;
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '99px',
            backgroundColor: bg,
            color: text,
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
        }}>
            {children}
        </span>
    );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionBtns({ onEdit, onDelete }) {
    return (
        <div style={{ display: 'inline-flex', gap: '2px' }}>
            <button
                onClick={onEdit}
                title="Edit"
                className="nav-hover"
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#3b82f6', padding: '5px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Edit2 size={14} />
            </button>
            <button
                onClick={onDelete}
                title="Hapus"
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ef4444', padding: '5px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AimsMenuTable({ menus = [], loading = false, onEdit, onDelete }) {
    // Flatten tree → rows with type marker for rendering
    const rows = useMemo(() => {
        const flat = [];
        menus.forEach(menu => {
            flat.push({ ...menu, _type: 'parent' });
            (menu.children || []).forEach(child => {
                flat.push({ ...child, _type: 'child', _parentName: menu.name });
            });
        });
        return flat;
    }, [menus]);

    const columns = useMemo(() => [
        {
            id: 'name',
            header: 'Menu / Folder',
            cell: ({ row }) => {
                const item = row.original;
                if (item._type === 'parent') {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FolderOpen size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
                                {item.name}
                            </span>
                        </div>
                    );
                }
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '24px' }}>
                        <ChevronRight size={11} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <FileText size={13} style={{ color: '#64748b', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: '#334155' }}>{item.name}</span>
                    </div>
                );
            },
        },
        {
            id: 'module',
            header: 'Modul',
            cell: ({ row }) => {
                const item = row.original;
                if (item._type === 'child') {
                    return <span style={{ fontSize: '12px', color: '#94a3b8' }}>└ {item._parentName}</span>;
                }
                return item.module_name
                    ? <Badge color="blue">{item.module_name}</Badge>
                    : <span style={{ color: '#cbd5e1' }}>—</span>;
            },
        },
        {
            id: 'order_by',
            header: 'Order',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                    {row.original.order_by ?? 0}
                </span>
            ),
        },
        {
            id: 'slug',
            header: 'Slug',
            cell: ({ row }) => (
                <code style={{
                    fontSize: '11.5px',
                    backgroundColor: row.original._type === 'parent' ? '#f1f5f9' : '#f8fafc',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    color: '#475569',
                    fontFamily: 'ui-monospace, monospace',
                }}>
                    {row.original.slug}
                </code>
            ),
        },
        {
            id: 'children_count',
            header: 'Sub-menu',
            cell: ({ row }) => {
                const item = row.original;
                if (item._type === 'child') {
                    return <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>;
                }
                const count = item.children?.length || 0;
                return count > 0
                    ? <Badge color="green">{count} hooks</Badge>
                    : <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>;
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div style={{ textAlign: 'right' }}>
                    <ActionBtns
                        onEdit={() => onEdit(row.original)}
                        onDelete={() => onDelete(row.original)}
                    />
                </div>
            ),
        },
    ], [onEdit, onDelete]);

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 50 } },
    });

    const visibleCount = table.getVisibleFlatColumns().length;

    return (
        <Table style={{ fontSize: '13px' }}>
            <TableHeader>
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id} style={{ backgroundColor: '#f8fafc' }}>
                        {hg.headers.map(h => (
                            <TableHead
                                key={h.id}
                                style={{
                                    fontWeight: 700,
                                    fontSize: '11px',
                                    color: '#475569',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    padding: '14px 16px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>

            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                            Memuat data menu...
                        </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => {
                        const isParent = row.original._type === 'parent';
                        return (
                            <TableRow
                                key={row.id}
                                style={{
                                    backgroundColor: isParent ? '#fafafa' : '#ffffff',
                                    borderBottom: isParent ? '1px solid #f1f5f9' : '1px solid #f8fafc',
                                }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell
                                        key={cell.id}
                                        style={{ padding: isParent ? '12px 16px' : '10px 16px' }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={visibleCount} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                            Belum ada menu. Klik "Tambah Menu" untuk mulai.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
