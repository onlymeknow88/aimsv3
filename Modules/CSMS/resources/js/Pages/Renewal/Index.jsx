import { Eye, RefreshCw, RotateCcw, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import StatusBadge from '../Bidding/Partials/Components/StatusBadge';
import TablePagination from '@/Components/TablePagination';
import useBidding from '../Bidding/Hooks/useBidding';

const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function RenewalIndex() {
    const { biddings, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh } = useBidding('Renewal');

    return (
        <CSMSLayout>
            <Head title="Renewal CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <RotateCcw size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Renewal CSMS</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Perpanjangan dokumen & sertifikat CSMS</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari perusahaan..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Semua Status</option>
                        <option value="On Review OHS">On Review OHS</option>
                        <option value="Approved">Approved</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <button onClick={refresh} style={btnStyle}><RefreshCw size={14} /></button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
                    ) : biddings.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Tidak ada data renewal.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                        <TableHead style={thStyle}>No</TableHead>
                                        <TableHead style={thStyle}>Nama Perusahaan</TableHead>
                                        <TableHead style={thStyle}>No. Lisensi</TableHead>
                                        <TableHead style={thStyle}>No. Dokumen CSMS</TableHead>
                                        <TableHead style={thStyle}>Kategori Risiko</TableHead>
                                        <TableHead style={thStyle}>Status</TableHead>
                                        <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {biddings.map((b, i) => (
                                        <TableRow key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <TableCell style={tdStyle}>{i + 1}</TableCell>
                                            <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{b.company_name}</TableCell>
                                            <TableCell style={tdStyle}>{b.license_number}</TableCell>
                                            <TableCell style={tdStyle}>{b.csms_doc_number ?? '-'}</TableCell>
                                            <TableCell style={tdStyle}>{b.risk_category ?? '-'}</TableCell>
                                            <TableCell style={{ padding: '10px 12px' }}><StatusBadge status={b.status} /></TableCell>
                                            <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <a href={`/csms/post-bidding/detail/${b.id}`}
                                                    style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', color: 'var(--primary)', textDecoration: 'none' }}>
                                                    <Eye size={13} />
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
        </CSMSLayout>
    );
}
