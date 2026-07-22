import { Mail, Plus, RefreshCw, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import axios from 'axios';
import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

import useLetter from './Hooks/useLetter';
import LetterTable from './Partials/LetterTable';

const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm     = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function LetterIndex() {
    const {
        letters, pagination, loading,
        search, setSearch,
        limit, setLimit,
        page, setPage,
        refresh
    } = useLetter();

    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ title: '', status: 'Active' });
    const [creating, setCreating]     = useState(false);

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
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah Surat
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <LetterTable letters={letters} loading={loading} />
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
                                    axios.post('/api/csms/letters', createForm)
                                    .then(() => { setShowCreate(false); setCreateForm({ title: '', status: 'Active' }); refresh(); })
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
