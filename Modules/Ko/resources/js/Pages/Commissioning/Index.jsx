import { Plus, RefreshCw, Search, Wrench } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import KoLayout from '../../Layouts/KoLayout';
import TablePagination from '@/Components/TablePagination';
import useCommissioning from './Hooks/useCommissioning';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function CommissioningIndex() {
    const { items, pagination, loading, search, setSearch, limit, setLimit, page, setPage, refresh } = useCommissioning();

    return (
        <KoLayout>
            <Head title="Komisioning KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Wrench size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Komisioning</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Pelaksanaan komisioning unit terverifikasi</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari..."
                        style={{ width: '260px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                <a href="/ko/commissionings/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
                    <Plus size={14} /> Buat Komisioning
                </a>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={thStyle}>Number</TableHead>
                            <TableHead style={thStyle}>Kriteria Perusahaan</TableHead>
                            <TableHead style={thStyle}>SPIP Desc</TableHead>
                            <TableHead style={thStyle}>Call Sign</TableHead>
                            <TableHead style={thStyle}>Waktu Komisioning</TableHead>
                            <TableHead style={thStyle}>Jadwal Komisioning</TableHead>
                            <TableHead style={thStyle}>Komisioning Selanjutnya</TableHead>
                            <TableHead style={thStyle}>Periode</TableHead>
                            <TableHead style={thStyle}>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !items.length ? (
                            <TableRow><TableCell colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada komisioning.</TableCell></TableRow>
                        ) : (
                            items.map(c => {
                                const p = c.ko_proposal ?? {};
                                const u = p.ko_unit ?? {};
                                return (
                                    <TableRow key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <TableCell style={{ ...tdStyle, fontWeight: 700 }}>
                                            <a href={`/ko/commissionings/${c.ko_proposal_id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{p.number ?? '-'}</a>
                                        </TableCell>
                                        <TableCell style={tdStyle}>{p.company?.company_name ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{u.ko_spip_unit?.name ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{u.call_sign ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{c.date ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{p.internal_komisioning_schedule ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{p.next_commissioning ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{p.commissioning_period ?? '-'}</TableCell>
                                        <TableCell style={tdStyle}>{c.status ?? '-'}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
        </KoLayout>
    );
}
