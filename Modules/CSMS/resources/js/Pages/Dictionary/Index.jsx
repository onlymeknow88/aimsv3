import { BookOpen, Plus, RefreshCw, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import axios from 'axios';
import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

import useDictionary from './Hooks/useDictionary';
import DictionaryTable from './Partials/DictionaryTable';

const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm     = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function DictionaryIndex() {
    const {
        items, pagination, loading,
        search, setSearch,
        limit, setLimit,
        page, setPage,
        refresh
    } = useDictionary();

    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ term: '', definition: '' });
    const [creating, setCreating]     = useState(false);

    return (
        <CSMSLayout>
            <Head title="Kamus CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Kamus CSMS</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Referensi istilah dan definisi aspek K3 CSMS</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari istilah..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah Istilah
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <DictionaryTable items={items} loading={loading} />
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
            {showCreate && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Tambah Istilah Kamus CSMS</h3>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelSm}>Istilah <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={createForm.term} onChange={e => setCreateForm(f => ({ ...f, term: e.target.value }))}
                                    placeholder="Contoh: CSMS, PJO, PICA..." style={inputSm} />
                            </div>
                            <div>
                                <label style={labelSm}>Definisi <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea value={createForm.definition} onChange={e => setCreateForm(f => ({ ...f, definition: e.target.value }))}
                                    placeholder="Tuliskan definisi istilah secara jelas dan lengkap..." rows={4}
                                    style={{ ...inputSm, resize: 'vertical' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={() => { setShowCreate(false); setCreateForm({ term: '', definition: '' }); }}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button disabled={creating || !createForm.term.trim() || !createForm.definition.trim()}
                                onClick={() => {
                                    setCreating(true);
                                    axios.post('/api/csms/dictionaries', createForm)
                                    .then(() => { setShowCreate(false); setCreateForm({ term: '', definition: '' }); refresh(); })
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
