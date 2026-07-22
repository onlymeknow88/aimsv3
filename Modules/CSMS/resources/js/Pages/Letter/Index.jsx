import { Mail, Plus, RefreshCw, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm     = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function LetterIndex() {
    const [letters, setLetters]       = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading]       = useState(false);
    const [search, setSearch]         = useState('');
    const [limit, setLimit]           = useState(10);
    const [page, setPage]             = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ title: '', status: 'Active' });
    const [creating, setCreating]     = useState(false);

    const doFetch = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ search, limit, page });
        fetch(`/api/csms/letters?${params}`)
            .then(r => r.json())
            .then(d => {
                setLetters(d?.data?.data ?? []);
                setPagination({ current_page: d?.data?.current_page ?? 1, last_page: d?.data?.last_page ?? 1, total: d?.data?.total ?? 0 });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, limit, page]);

    useEffect(() => { doFetch(); }, [doFetch]);

    return (
        <CSMSLayout>
            <Head title="Surat Edaran" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Mail size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Surat Edaran</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Dokumen surat edaran kepada kontraktor</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari judul surat..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={doFetch} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah Surat
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
                    ) : letters.length === 0 ? (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <Mail size={40} style={{ color: 'var(--border-color)', marginBottom: '12px' }} />
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Belum ada Surat Edaran.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                        <TableHead style={thStyle}>No</TableHead>
                                        <TableHead style={thStyle}>Judul Surat</TableHead>
                                        <TableHead style={thStyle}>Status</TableHead>
                                        <TableHead style={thStyle}>Tanggal</TableHead>
                                        <TableHead style={thStyle}>Lampiran</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {letters.map((l, i) => (
                                        <TableRow key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <TableCell style={tdStyle}>{i + 1}</TableCell>
                                            <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{l.title}</TableCell>
                                            <TableCell style={tdStyle}>
                                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: l.status === 'Active' ? 'rgba(47,191,113,0.08)' : 'rgba(100,116,139,0.1)', color: l.status === 'Active' ? '#2FBF71' : '#64748b' }}>
                                                    {l.status}
                                                </span>
                                            </TableCell>
                                            <TableCell style={tdStyle}>{l.created_at ? new Date(l.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                            <TableCell style={tdStyle}>{l.files_count ?? 0} file</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
            {showCreate && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Tambah Surat Edaran</h3>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelSm}>Judul Surat <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Surat Edaran No. XXX/CSMS/2025" style={inputSm} />
                            </div>
                            <div>
                                <label style={labelSm}>Status</label>
                                <select value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))} style={inputSm}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={() => { setShowCreate(false); setCreateForm({ title: '', status: 'Active' }); }}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button disabled={creating || !createForm.title.trim()}
                                onClick={() => {
                                    setCreating(true);
                                    fetch('/api/csms/letters', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
                                        body: JSON.stringify(createForm),
                                    }).then(() => { setShowCreate(false); setCreateForm({ title: '', status: 'Active' }); doFetch(); })
                                    .finally(() => setCreating(false));
                                }}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
                                {creating ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CSMSLayout>
    );
}
