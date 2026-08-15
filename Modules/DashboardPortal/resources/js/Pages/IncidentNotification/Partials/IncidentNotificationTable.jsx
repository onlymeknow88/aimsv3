import React, { useMemo } from 'react';
import { Edit2, Trash2, Eye, EyeOff, Paperclip } from 'lucide-react';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/Components/ui/table';
import TablePagination from '@/Components/TablePagination';

function VisibleBadge({ visible }) {
    const isVisible = visible === 'true';
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
            backgroundColor: isVisible ? '#dcfce7' : '#f1f5f9',
            color: isVisible ? '#16a34a' : '#64748b',
        }}>
            {isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
            {isVisible ? 'Visible' : 'Hidden'}
        </span>
    );
}

function ActionBtns({ onEdit, onDelete, onToggleVisible, visible }) {
    const isVisible = visible === 'true';
    const btnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' };
    return (
        <div style={{ display: 'inline-flex', gap: '2px' }}>
            <button onClick={onToggleVisible} title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
                style={{ ...btnStyle, color: isVisible ? '#16a34a' : '#94a3b8' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button onClick={onEdit} title="Edit"
                style={{ ...btnStyle, color: '#3b82f6' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Edit2 size={14} />
            </button>
            <button onClick={onDelete} title="Hapus"
                style={{ ...btnStyle, color: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Trash2 size={14} />
            </button>
        </div>
    );
}

export default function IncidentNotificationTable({
    notifications, loading, error,
    selectedIds, toggleSelectAll, toggleSelectOne,
    onEdit, onDelete, onToggleVisible,
    pagination, page, setPage, limit, setLimit,
}) {
    const allSelected = notifications.length > 0 && selectedIds.length === notifications.length;

    const columns = useMemo(() => [
        {
            key: 'check', header: (
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }} />
            ),
            style: { width: '40px' },
            cell: (row) => (
                <input type="checkbox" checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelectOne(row.id)} style={{ cursor: 'pointer' }} />
            ),
        },
        { key: 'no', header: 'No', style: { width: '48px' }, cell: (_, idx) => (page - 1) * limit + idx + 1 },
        { key: 'date', header: 'Tanggal', cell: (row) => row.date?.substring(0, 10) ?? '-' },
        { key: 'case', header: 'Kasus', cell: (row) => (
            <div style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.case}>{row.case}</div>
        )},
        { key: 'category', header: 'Kategori', cell: (row) => (
            <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#2563eb' }}>{row.category}</span>
        )},
        { key: 'attc', header: 'Lampiran', style: { width: '80px', textAlign: 'center' }, cell: (row) => (
            row.url ? (
                <a href={row.url} target="_blank" rel="noreferrer" title="Lihat lampiran" style={{ color: '#3b82f6', display: 'inline-flex', alignItems: 'center' }}>
                    <Paperclip size={14} />
                </a>
            ) : <span style={{ color: '#cbd5e1' }}>—</span>
        )},
        { key: 'visible', header: 'Status', cell: (row) => <VisibleBadge visible={row.visible} /> },
        {
            key: 'actions', header: 'Aksi', style: { width: '110px', textAlign: 'center' },
            cell: (row) => (
                <ActionBtns
                    visible={row.visible}
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row)}
                    onToggleVisible={() => onToggleVisible(row)}
                />
            ),
        },
    ], [allSelected, selectedIds, page, limit, toggleSelectAll, toggleSelectOne, onEdit, onDelete, onToggleVisible]);

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            {columns.map(col => (
                                <TableHead key={col.key} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', ...(col.style ?? {}) }}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '13px' }}>
                                    Memuat data…
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#ef4444', fontSize: '13px' }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : notifications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '13px' }}>
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        ) : notifications.map((row, idx) => (
                            <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {columns.map(col => (
                                    <TableCell key={col.key} style={{ padding: '12px 16px', ...(col.style ?? {}) }}>
                                        {col.cell(row, idx)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(val) => { setLimit(Number(val)); setPage(1); }}
                />
            )}
        </div>
    );
}
