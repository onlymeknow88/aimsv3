import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Search, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import useRisks from './Hooks/useRisks';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
    Pagination, PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const RISK_STATUS_CONFIG = {
    'Open':   { text: 'OPEN',   color: 'var(--accent)',  bg: 'rgba(255,140,36,0.08)' },
    'Closed': { text: 'CLOSED', color: 'var(--success)', bg: 'rgba(34,197,94,0.08)'  },
    'Overdue':{ text: 'OVERDUE',color: 'var(--danger)',  bg: 'rgba(239,68,68,0.08)'  },
};

function RisksTable({ documents, visibleColumns, loading, pagination, onPageChange, limit, onLimitChange }) {
    const columns = useMemo(() => [
        {
            id: 'fl_date',
            header: 'Tgl FL',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.fl_date ? new Date(row.original.fl_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>,
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.company_name || '—'}</span>,
        },
        {
            id: 'risk_condition',
            header: 'Kondisi Risiko',
            cell: ({ row }) => <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.original.risk_condition}</span>,
        },
        {
            id: 'category',
            header: 'Kategori',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.category_name}</span>,
        },
        {
            id: 'kta',
            header: 'KTA/TTA',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.kta_name}</span>,
        },
        {
            id: 'repair_action',
            header: 'Tindakan Perbaikan',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.repair_action}</span>,
        },
        {
            id: 'due_date',
            header: 'Due Date',
            cell: ({ row }) => {
                if (!row.original.due_date) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
                const due  = new Date(row.original.due_date);
                const past = due < new Date() && row.original.status !== 'Closed';
                return <span style={{ fontSize: '12px', fontWeight: 600, color: past ? 'var(--danger)' : 'var(--text-primary)' }}>{due.toLocaleDateString('id-ID')}</span>;
            },
        },
        {
            id: 'supervisor',
            header: 'Supervisor',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.supervisor || '—'}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const cfg = RISK_STATUS_CONFIG[row.original.status] ?? { text: row.original.status || '—', color: '#64748b', bg: '#f1f5f9' };
                return <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '10px' }}>{cfg.text}</span>;
            },
        },
    ], []);

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            fl_date:       visibleColumns['Tgl FL']             ?? true,
            company:       visibleColumns['Company']            ?? true,
            risk_condition:visibleColumns['Kondisi Risiko']     ?? true,
            category:      visibleColumns['Kategori']           ?? true,
            kta:           visibleColumns['KTA/TTA']            ?? true,
            repair_action: visibleColumns['Tindakan Perbaikan'] ?? true,
            due_date:      visibleColumns['Due Date']           ?? true,
            supervisor:    visibleColumns['Supervisor']         ?? true,
            status:        visibleColumns['Status']             ?? true,
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

    return (
        <>
            <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
                <Table style={{ fontSize: '12px', minWidth: '1000px' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 12px' }}>
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Memuat data risk finding...</TableCell></TableRow>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={visibleColsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data risk finding.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', fontSize: '13px', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                            <PaginationItem><PaginationPrevious onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} style={{ opacity: pagination.current_page === 1 ? 0.5 : 1, cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer' }} /></PaginationItem>
                            {getPageNumbers().map((p, idx) => p === 'ellipsis' ? <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem> : <PaginationItem key={p}><PaginationLink isActive={p === pagination.current_page} onClick={() => onPageChange(p)}>{p}</PaginationLink></PaginationItem>)}
                            <PaginationItem><PaginationNext onClick={() => onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} style={{ opacity: pagination.current_page === pagination.last_page ? 0.5 : 1, cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer' }} /></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}

export default function Index() {
    const { docs, loading, search, setSearch, page, setPage, limit, setLimit, pagination, columnFilters, setColumnFilters } = useRisks();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth <= 768);
        fn(); window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const [visibleColumns, setVisibleColumns] = useState({
        'Tgl FL': true, 'Company': true, 'Kondisi Risiko': true, 'Kategori': true,
        'KTA/TTA': true, 'Tindakan Perbaikan': true, 'Due Date': true,
        'Supervisor': true, 'Status': true,
    });
    const toggleColumn = col => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));

    const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

    return (
        <FieldLeadershipLayout>
            <Head title="Risk Finding" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Risk Finding</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Daftar temuan risiko dari seluruh observasi Field Leadership.</p>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <select value={columnFilters.status} onChange={e => setColumnFilters(prev => ({ ...prev, status: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                    <option value="">Semua Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Overdue">Overdue</option>
                </select>
                <input type="date" value={columnFilters.date_from} onChange={e => setColumnFilters(prev => ({ ...prev, date_from: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                <input type="date" value={columnFilters.date_to} onChange={e => setColumnFilters(prev => ({ ...prev, date_to: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kondisi risiko, tindakan..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger style={btnStyle}><SlidersHorizontal size={14} /> Columns</DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md p-1">
                        <DropdownMenuLabel style={{ padding: '8px 12px' }}>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.keys(visibleColumns).map(col => (
                            <DropdownMenuCheckboxItem key={col} checked={visibleColumns[col]} onCheckedChange={() => toggleColumn(col)} style={{ padding: '8px 12px', cursor: 'pointer' }}>{col}</DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <RisksTable documents={docs} visibleColumns={visibleColumns} loading={loading} pagination={pagination}
                    onPageChange={setPage} limit={limit} onLimitChange={setLimit} />
            </div>
        </FieldLeadershipLayout>
    );
}
