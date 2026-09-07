import { BookOpen, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import KoLayout from '../../Layouts/KoLayout';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const labelSm = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center' };

const TABS = [
    { key: 'categories', label: 'Kategori', endpoint: '/api/ko/categories', columns: ['name', 'internal_interval_year', 'contractor_interval_year'],
      fields: [
          { key: 'name', label: 'Nama', type: 'text', required: true },
          { key: 'internal_interval_year', label: 'Interval Internal (thn)', type: 'number', required: true },
          { key: 'contractor_interval_year', label: 'Interval Kontraktor (thn)', type: 'number', required: true },
      ] },
    { key: 'types', label: 'Tipe', endpoint: '/api/ko/types', columns: ['name'],
      fields: [
          { key: 'name', label: 'Nama', type: 'text', required: true },
          { key: 'ko_spip_category_id', label: 'Kategori', type: 'category', required: false },
      ] },
    { key: 'spip-units', label: 'SPIP Unit', endpoint: '/api/ko/spip-units', columns: ['name'],
      fields: [
          { key: 'name', label: 'Nama', type: 'text', required: true },
          { key: 'ko_spip_type_id', label: 'Tipe', type: 'spiptype', required: false },
      ] },
    { key: 'brands', label: 'Brand', endpoint: '/api/ko/brands', columns: ['name'],
      fields: [
          { key: 'name', label: 'Nama', type: 'text', required: false },
          { key: 'ko_spip_category_id', label: 'Kategori', type: 'category', required: false },
      ] },
];

export default function MasterIndex() {
    const [tab, setTab] = useState('categories');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [refs, setRefs] = useState({ categories: [], types: [] });

    const cfg = TABS.find(t => t.key === tab);

    const doFetch = useCallback(() => {
        setLoading(true);
        axios.get(cfg.endpoint, { params: { search: search || undefined, limit: 100 } })
            .then(res => setItems(res.data?.result?.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [tab, search]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { doFetch(); }, [doFetch]);
    useEffect(() => {
        axios.all([
            axios.get('/api/ko/categories', { params: { limit: 100 } }),
            axios.get('/api/ko/types', { params: { limit: 100 } }),
        ]).then(([c, t]) => setRefs({
            categories: c.data?.result?.data ?? [],
            types: t.data?.result?.data ?? [],
        })).catch(() => {});
    }, []);

    const openCreate = () => { setEditing(null); setForm({}); setShowModal(true); };
    const openEdit = (item) => {
        const f = {};
        cfg.fields.forEach(fd => { f[fd.key] = item[fd.key] ?? ''; });
        setEditing(item);
        setForm(f);
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditing(null); setForm({}); };
    const handleSave = () => {
        setSaving(true);
        const req = editing ? axios.put(`${cfg.endpoint}/${editing.id}`, form) : axios.post(cfg.endpoint, form);
        req.then(() => { closeModal(); doFetch(); }).finally(() => setSaving(false));
    };
    const handleDelete = (item) => {
        if (!confirm(`Hapus "${item.name}"?`)) return;
        axios.delete(`${cfg.endpoint}/${item.id}`).then(() => doFetch());
    };

    const renderField = (fd) => {
        if (fd.type === 'category') {
            return (
                <select value={form[fd.key] ?? ''} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))} style={inputSm}>
                    <option value="">-- Pilih --</option>
                    {refs.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            );
        }
        if (fd.type === 'spiptype') {
            return (
                <select value={form[fd.key] ?? ''} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))} style={inputSm}>
                    <option value="">-- Pilih --</option>
                    {refs.types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            );
        }
        return <input type={fd.type} value={form[fd.key] ?? ''} onChange={e => setForm(f => ({ ...f, [fd.key]: e.target.value }))} style={inputSm} />;
    };

    return (
        <KoLayout>
            <Head title="Master Library KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Master Library</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Referensi kategori, tipe, unit SPIP & brand</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: tab === t.key ? 'none' : '1px solid var(--border-color)', backgroundColor: tab === t.key ? 'var(--primary)' : '#fff', color: tab === t.key ? '#fff' : 'var(--text-secondary)' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..."
                        style={{ width: '260px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={doFetch} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            {cfg.columns.map(c => <TableHead key={c} style={thStyle}>{c.replace(/_/g, ' ')}</TableHead>)}
                            <TableHead style={{ ...thStyle, textAlign: 'right' }}>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !items.length ? (
                            <TableRow><TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada data.</TableCell></TableRow>
                        ) : (
                            items.map(item => (
                                <TableRow key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {cfg.columns.map(c => <TableCell key={c} style={c === cfg.columns[0] ? { ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' } : tdStyle}>{item[c] ?? '-'}</TableCell>)}
                                    <TableCell style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <button onClick={() => openEdit(item)} title="Edit" style={{ ...actionBtn, color: 'var(--primary)' }}><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(item)} title="Hapus" style={{ ...actionBtn, color: 'var(--danger, #ef4444)' }}><Trash2 size={14} /></button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{editing ? 'Edit' : 'Tambah'} {cfg.label}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {cfg.fields.map(fd => (
                                <div key={fd.key}>
                                    <label style={labelSm}>{fd.label} {fd.required && <span style={{ color: '#ef4444' }}>*</span>}</label>
                                    {renderField(fd)}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={closeModal} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button disabled={saving} onClick={handleSave}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </KoLayout>
    );
}
