import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

const PICA_STATUS_COLORS = {
    'Open':     { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'Closed':   { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    'Overdue':  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

export default function PicaIndex() {
    const [picas, setPicas]           = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);

    const doFetch = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ search, status, limit, page });
        fetch(`/api/csms/picas?${params}`)
            .then(r => r.json())
            .then(d => {
                setPicas(d?.data?.data ?? []);
                setPagination({ current_page: d?.data?.current_page ?? 1, last_page: d?.data?.last_page ?? 1, total: d?.data?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, status, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return (
        <CSMSLayout>
            <Head title="PICA CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>PICA — Tindak Lanjut Temuan</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Monitoring tindakan perbaikan atas temuan CSMS</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari temuan..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Semua Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <button onClick={doFetch} style={btnStyle}><RefreshCw size={14} /></button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
                    ) : picas.length === 0 ? (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <AlertTriangle size={40} style={{ color: 'var(--border-color)', marginBottom: '12px' }} />
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Belum ada data PICA.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                        <TableHead style={thStyle}>No</TableHead>
                                        <TableHead style={thStyle}>Temuan</TableHead>
                                        <TableHead style={thStyle}>Perusahaan</TableHead>
                                        <TableHead style={thStyle}>Due Date</TableHead>
                                        <TableHead style={thStyle}>Status</TableHead>
                                        <TableHead style={thStyle}>PIC</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {picas.map((p, i) => {
                                        const sc = PICA_STATUS_COLORS[p.status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
                                        return (
                                            <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)', maxWidth: '300px' }}>{p.description ?? '-'}</TableCell>
                                                <TableCell style={tdStyle}>{p.company_name ?? '-'}</TableCell>
                                                <TableCell style={{ ...tdStyle, color: p.status === 'Overdue' ? '#ef4444' : 'var(--text-secondary)' }}>
                                                    {p.due_date ? new Date(p.due_date).toLocaleDateString('id-ID') : '-'}
                                                </TableCell>
                                                <TableCell style={{ padding: '10px 12px' }}>
                                                    <span style={{ color: sc.color, backgroundColor: sc.bg, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{p.status ?? '-'}</span>
                                                </TableCell>
                                                <TableCell style={tdStyle}>{p.pic ?? '-'}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
        </CSMSLayout>
    );
}
