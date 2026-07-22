import { Plus, RefreshCw, Search, Trash2, UserCog } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import CSMSLayout from '../../Layouts/CSMSLayout';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

const STATUS_COLORS = {
    'Draft':    { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
    'Active':   { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    'On Going': { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'Inactive': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

function PjoStatusBadge({ status }) {
    const s = STATUS_COLORS[status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    return <span style={{ color: s.color, backgroundColor: s.bg, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{status ?? '-'}</span>;
}

export default function PjoIndex() {
    const [pjos, setPjos]             = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);
    const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
    const [deleting, setDeleting]       = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const doFetch = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ search, status, limit, page });
        fetch(`/api/csms/pjos?${params}`)
            .then(r => r.json())
            .then(d => {
                setPjos(d?.data?.data ?? []);
                setPagination({ current_page: d?.data?.current_page ?? 1, last_page: d?.data?.last_page ?? 1, total: d?.data?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, status, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    const confirmDelete = () => {
        setDeleting(true);
        fetch(`/api/csms/pjos/${deleteModal.item.id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
        })
        .then(() => { setDeleteModal({ open: false, item: null }); doFetch(); })
        .catch(e => setDeleteError(e?.message ?? 'Gagal menghapus'))
        .finally(() => setDeleting(false));
    };

    return (
        <CSMSLayout>
            <Head title="PJO CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <UserCog size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>PJO — Penanggung Jawab Operasional</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Pengelolaan data PJO kontraktor</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama PJO..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Semua Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="On Going">On Going</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <button onClick={doFetch} style={btnStyle}><RefreshCw size={14} /></button>
                    <a href="/csms/pjo/create" style={{ ...btnStyle, backgroundColor: 'var(--primary)', color: '#fff', border: 'none', textDecoration: 'none' }}>
                        <Plus size={14} /> Tambah PJO
                    </a>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
                    ) : pjos.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Tidak ada data PJO.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                        <TableHead style={thStyle}>No</TableHead>
                                        <TableHead style={thStyle}>No. PJO</TableHead>
                                        <TableHead style={thStyle}>Nama PJO</TableHead>
                                        <TableHead style={thStyle}>Perusahaan</TableHead>
                                        <TableHead style={thStyle}>Telepon</TableHead>
                                        <TableHead style={thStyle}>Tgl. Pengajuan</TableHead>
                                        <TableHead style={thStyle}>Status</TableHead>
                                        <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pjos.map((p, i) => (
                                        <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <TableCell style={tdStyle}>{i + 1}</TableCell>
                                            <TableCell style={tdStyle}>{p.number_pjo ?? '-'}</TableCell>
                                            <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</TableCell>
                                            <TableCell style={tdStyle}>{p.company_name_resolved ?? '-'}</TableCell>
                                            <TableCell style={tdStyle}>{p.phone ?? '-'}</TableCell>
                                            <TableCell style={tdStyle}>{p.date_submission ? new Date(p.date_submission).toLocaleDateString('id-ID') : '-'}</TableCell>
                                            <TableCell style={{ padding: '10px 12px' }}><PjoStatusBadge status={p.status} /></TableCell>
                                            <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <button title="Hapus" onClick={() => { setDeleteModal({ open: true, item: p }); setDeleteError(''); }}
                                                        style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ef4444' }}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                itemName={deleteModal.item?.name}
                deleting={deleting}
                errorMessage={deleteError}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ open: false, item: null })}
            />
        </CSMSLayout>
    );
}
