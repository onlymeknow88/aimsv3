import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Pagination, PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import { Eye } from 'lucide-react';

const STATUS_CONFIG = {
    'Open':                 { text: 'OPEN',             color: 'var(--accent)',   bg: 'rgba(255,140,36,0.08)' },
    'On Review PICA':       { text: 'ON REVIEW PICA',   color: 'var(--info)',     bg: 'rgba(45,127,249,0.08)' },
    'On Review PJA':        { text: 'ON REVIEW PJA',    color: 'var(--info)',     bg: 'rgba(45,127,249,0.08)' },
    'On Review Approval':   { text: 'ON REVIEW APPRVL', color: 'var(--accent)',   bg: 'rgba(255,140,36,0.08)' },
    'Overdue':              { text: 'OVERDUE',           color: 'var(--danger)',   bg: 'rgba(239,68,68,0.08)'  },
    'Closed':               { text: 'CLOSED',            color: 'var(--success)',  bg: 'rgba(34,197,94,0.08)'  },
};

const TYPE_CONFIG = {
    'Planned Task Observation': { text: 'PTO', color: 'var(--primary)', bg: 'rgba(21,59,115,0.08)' },
    'Take Time Talk':           { text: 'TTT', color: '#7c3aed',        bg: 'rgba(124,58,237,0.08)' },
    'Hazard Report':            { text: 'HR',  color: 'var(--danger)',   bg: 'rgba(239,68,68,0.08)'  },
};

export default function ObservationsTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    visibleColumns,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    columnFilters,
    onColumnFilterChange,
    onView,
}) {
    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        onSelectionChange(checked ? documents.map(d => d.id) : []);
    };

    const handleSelectRow = (id, checked) => {
        onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter(x => x !== id));
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />,
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(c) => handleSelectRow(row.original.id, c)}
                />
            ),
        },
        {
            id: 'date',
            header: 'Tanggal',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {row.original.date
                        ? new Date(row.original.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                </span>
            ),
        },
        {
            id: 'type',
            header: 'Tipe',
            cell: ({ row }) => {
                const cfg = TYPE_CONFIG[row.original.type] ?? { text: row.original.type, color: '#64748b', bg: '#f1f5f9' };
                return (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '10px' }}>
                        {cfg.text}
                    </span>
                );
            },
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.company_name || '—'}</span>,
        },
        {
            id: 'department',
            header: 'Departemen',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.department_name || '—'}</span>,
        },
        {
            id: 'job',
            header: 'Pekerjaan',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.job || '—'}</span>,
        },
        {
            id: 'created_by',
            header: 'Dibuat Oleh',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.created_by_name || '—'}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const cfg = STATUS_CONFIG[row.original.status] ?? { text: row.original.status, color: '#64748b', bg: '#f1f5f9' };
                return (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '10px' }}>
                        {cfg.text}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <button
                    onClick={() => onView?.(row.original)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        backgroundColor: 'transparent', border: '1px solid var(--border-color)',
                        borderRadius: '6px', padding: '4px 10px',
                        fontSize: '11px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer',
                    }}
                >
                    <Eye size={12} /> Detail
                </button>
            ),
        },
    ], [selectedIds, isAllSelected]);

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            date:        visibleColumns['Tanggal']    ?? true,
            type:        visibleColumns['Tipe']       ?? true,
            company:     visibleColumns['Company']    ?? true,
            department:  visibleColumns['Departemen'] ?? true,
            job:         visibleColumns['Pekerjaan']  ?? true,
            created_by:  visibleColumns['Dibuat Oleh']?? true,
            status:      visibleColumns['Status']     ?? true,
            actions:     visibleColumns['Aksi']       ?? true,
        };
    }, [visibleColumns]);

    const table = useReactTable({
        data: documents,
        columns,
        state: { columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    const getPageNumbers = () => {
        if (!pagination) return [];
        const { current_page, last_page } = pagination;
        const pages = [];
        const start = Math.max(1, current_page - 2);
        const end   = Math.min(last_page, current_page + 2);
        if (start > 1) { pages.push(1); if (start > 2) pages.push('ellipsis'); }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < last_page) { if (end < last_page - 1) pages.push('ellipsis'); pages.push(last_page); }
        return pages;
    };

    const searchableIds = ['company', 'department', 'job'];

    return (
        <>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
                <Table style={{ fontSize: '12px', minWidth: '900px' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => {
                                    const isSearchable = searchableIds.includes(h.id);
                                    return (
                                        <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 12px', verticalAlign: 'top' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isSearchable ? '120px' : 'auto' }}>
                                                <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                                                {isSearchable && onColumnFilterChange && (
                                                    <input
                                                        type="text"
                                                        placeholder="Cari..."
                                                        value={columnFilters?.[h.id] || ''}
                                                        onChange={e => onColumnFilterChange(h.id, e.target.value)}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{ width: '100%', padding: '4px 8px', fontSize: '11px', fontWeight: 'normal', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', boxSizing: 'border-box', color: '#334155', backgroundColor: '#fff' }}
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
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                                    Memuat data observasi...
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
                                <TableCell colSpan={visibleColsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Belum ada data observasi.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', fontSize: '13px', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div>Halaman <strong>{pagination.current_page}</strong> dari <strong>{pagination.last_page}</strong> (Total <strong>{pagination.total}</strong>)</div>
                        {onLimitChange && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px' }}>Baris:</span>
                                <select value={limit} onChange={e => onLimitChange(Number(e.target.value))}
                                    style={{ padding: '4px 24px 4px 8px', border: '1.5px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                                    {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => onPageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    style={{ opacity: pagination.current_page === 1 ? 0.5 : 1, cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer' }} />
                            </PaginationItem>
                            {getPageNumbers().map((p, idx) => p === 'ellipsis'
                                ? <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                                : <PaginationItem key={p}><PaginationLink isActive={p === pagination.current_page} onClick={() => onPageChange(p)}>{p}</PaginationLink></PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext onClick={() => onPageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    style={{ opacity: pagination.current_page === pagination.last_page ? 0.5 : 1, cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer' }} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}
