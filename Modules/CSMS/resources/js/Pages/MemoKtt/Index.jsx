import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, RefreshCw, Search, X } from 'lucide-react';

import axios from 'axios';
import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import TablePagination from '@/Components/TablePagination';

import useMemoKtt from './Hooks/useMemoKtt';
import MemoKttTable from './Partials/MemoKttTable';

const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox    = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const labelSm     = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm     = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function MemoKttIndex() {
    const {
        memos, pagination, loading,
        search, setSearch,
        limit, setLimit,
        page, setPage,
        refresh
    } = useMemoKtt();

    const [showCreate, setShowCreate] = useState(false);
    const [companies, setCompanies]   = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [createForm, setCreateForm] = useState({
        memo_number: '',
        title: '',
        ccow_id: '',
        ktt_id: '',
        ktt_name: '',
        date: '',
        description: '',
        status: 'Active'
    });
    const [creating, setCreating]     = useState(false);

    useEffect(() => {
        axios.get('/api/csms/master-data')
            .then(res => {
                setCompanies(res.data?.result?.companies ?? []);
            })
            .catch(() => {});
    }, []);

    const ccows = companies.filter(c => c.type === 'Internal');

    const handleCcowChange = (ccowId) => {
        const selected = ccows.find(c => c.id === ccowId);
        setCreateForm(f => ({
            ...f,
            ccow_id: ccowId,
            ktt_id: selected?.user_id ?? '',
            ktt_name: selected?.user_name ?? ''
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (idx) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <CSMSLayout>
            <Head title="Memo KTT" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <FileText size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Memo KTT</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Komunikasi memo internal dari Kepala Teknik Tambang</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari no. / judul memo..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={() => setShowCreate(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah Memo
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <MemoKttTable memos={memos} loading={loading} />
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
            {/* Create Modal */}
            {showCreate && (
                <div style={modalOverlay}>
                    <div style={{ ...modalBox, maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Tambah Memo KTT</h3>
                            <button onClick={() => { setShowCreate(false); setSelectedFiles([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>No. Memo <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input value={createForm.memo_number} onChange={e => setCreateForm(f => ({ ...f, memo_number: e.target.value }))}
                                        placeholder="MEMO/KTT/2025/XXX" style={inputSm} />
                                </div>
                                <div>
                                    <label style={labelSm}>Judul Memo <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Judul Memo" style={inputSm} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>CCOW <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select value={createForm.ccow_id} onChange={e => handleCcowChange(e.target.value)} style={inputSm}>
                                        <option value="">-- Pilih CCOW --</option>
                                        {ccows.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelSm}>Initiator KTT</label>
                                    <input value={createForm.ktt_name} disabled placeholder="Pilih CCOW terlebih dahulu" style={{ ...inputSm, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>Tanggal Memo <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="date" value={createForm.date} onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))} style={inputSm} />
                                </div>
                                <div>
                                    <label style={labelSm}>Status</label>
                                    <select value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))}
                                        style={inputSm}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelSm}>Deskripsi / Catatan</label>
                                <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Keterangan tambahan memo..." rows={3} style={{ ...inputSm, resize: 'vertical' }} />
                            </div>

                            <div>
                                <label style={labelSm}>Upload File Memo</label>
                                <input type="file" multiple onChange={handleFileChange} style={{ fontSize: '12px' }} />
                                {selectedFiles.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {selectedFiles.map((f, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                                                    <FileText size={14} color="var(--primary)" /> {f.name}
                                                </span>
                                                <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} style={{ color: '#ef4444' }} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={() => { setShowCreate(false); setCreateForm({ memo_number: '', title: '', ccow_id: '', ktt_id: '', ktt_name: '', date: '', description: '', status: 'Active' }); setSelectedFiles([]); }}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button disabled={creating || !createForm.memo_number.trim() || !createForm.title.trim() || !createForm.ccow_id || !createForm.date}
                                onClick={() => {
                                    setCreating(true);
                                    const fd = new FormData();
                                    fd.append('memo_number', createForm.memo_number);
                                    fd.append('title', createForm.title);
                                    fd.append('ccow_id', createForm.ccow_id);
                                    fd.append('ktt_id', createForm.ktt_id);
                                    fd.append('date', createForm.date);
                                    fd.append('description', createForm.description || '');
                                    fd.append('status', createForm.status || 'Active');
                                    selectedFiles.forEach(file => {
                                        fd.append('files[]', file);
                                    });

                                    axios.post('/api/csms/memo-ktts', fd)
                                    .then(() => {
                                        setShowCreate(false);
                                        setCreateForm({ memo_number: '', title: '', ccow_id: '', ktt_id: '', ktt_name: '', date: '', description: '', status: 'Active' });
                                        setSelectedFiles([]);
                                        refresh();
                                    })
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
