import React, { useMemo } from 'react';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import TablePagination from '@/Components/TablePagination';

const fmt = (val) => val != null ? Number(val).toFixed(4) : '—';

function VisibleBadge({ visible }) {
    const isVisible = visible === 'true';
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: isVisible ? '#dcfce7' : '#f1f5f9', color: isVisible ? '#16a34a' : '#64748b' }}>
            {isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
            {isVisible ? 'Visible' : 'Hidden'}
        </span>
    );
}

export default function HealthPerformanceTable({ records, loading, error, selectedIds, toggleSelectAll, toggleSelectOne, onEdit, onDelete, onToggleVisible, pagination, page, setPage, limit, setLimit }) {
    const allSelected = records.length > 0 && selectedIds.length === records.length;

    const columns = useMemo(() => [
        { key: 'check', header: <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} />, style: { width: '40px' }, cell: (row) => <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelectOne(row.id)} style={{ cursor: 'pointer' }} /> },
        { key: 'no',    header: 'No',  style: { width: '48px' }, cell: (_, idx) => (page - 1) * limit + idx + 1 },
        { key: 'month', header: 'Bulan', cell: (row) => row.month?.substring(0, 7) ?? '—' },
        { key: 'rkk',   header: 'RKK', cell: (row) => fmt(row.rkk) },
        { key: 'cmr',   header: 'CMR', cell: (row) => fmt(row.cmr) },
        { key: 'mmr',   header: 'MMR', cell: (row) => fmt(row.mmr) },
        { key: 'ssr',   header: 'SSR', cell: (row) => fmt(row.ssr) },
        { key: 'asr',   header: 'ASR', cell: (row) => fmt(row.asr) },
        { key: 'visible', header: 'Status', cell: (row) => <VisibleBadge visible={row.visible} /> },
        { key: 'actions', header: 'Aksi', style: { width: '100px', textAlign: 'center' },
            cell: (row) => (
                <div style={{ display: 'inline-flex', gap: '2px' }}>
                    <button onClick={() => onToggleVisible(row)} title="Toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: row.visible === 'true' ? '#16a34a' : '#94a3b8' }}><Eye size={14} /></button>
                    <button onClick={() => onEdit(row)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#3b82f6' }}><Edit2 size={14} /></button>
                    <button onClick={() => onDelete(row)} title="Hapus" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
            ),
        },
    ], [allSelected, selectedIds, page, limit, toggleSelectAll, toggleSelectOne, onEdit, onDelete, onToggleVisible]);

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            {columns.map(col => <TableHead key={col.key} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap', ...(col.style ?? {}) }}>{col.header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Memuat data…</TableCell></TableRow>
                        : error   ? <TableRow><TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</TableCell></TableRow>
                        : records.length === 0 ? <TableRow><TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada data.</TableCell></TableRow>
                        : records.map((row, idx) => (
                            <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {columns.map(col => <TableCell key={col.key} style={{ padding: '12px 16px', fontSize: '13px', ...(col.style ?? {}) }}>{col.cell(row, idx)}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {pagination && <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={(val) => { setLimit(Number(val)); setPage(1); }} />}
        </div>
    );
}
