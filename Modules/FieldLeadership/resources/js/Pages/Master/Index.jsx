import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { Database, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import axios from 'axios';

// ── Reusable Modal ────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, saving, children }) {
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                </div>
                <div style={{ padding: '20px' }}>{children}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer' }}>Batal</button>
                    <button onClick={onSave} disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: saving ? '#94a3b8' : 'var(--primary)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                        <Save size={12} />{saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Reusable Master Tab ───────────────────────────────────────────────────────
function MasterTab({ title, data, loading, fields, onSave, onDelete }) {
    const [modal, setModal]   = useState(null); // null | { mode: 'create'|'edit', item: {} }
    const [form, setForm]     = useState({});
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setForm({}); setModal({ mode: 'create' }); };
    const openEdit   = (item) => { setForm({ ...item }); setModal({ mode: 'edit', item }); };
    const closeModal = () => setModal(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(form, modal?.item?.id);
            closeModal();
        } catch (err) {
            alert('Gagal menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
                <button onClick={openCreate}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', border: 'none', borderRadius: '6px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    <Plus size={12} /> Tambah
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</div>
            ) : data.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Belum ada data.</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            {fields.map(f => <th key={f.key} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</th>)}
                            <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={item.id} style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
                                {fields.map(f => <td key={f.key} style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>{item[f.key] ?? '—'}</td>)}
                                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                                        <button onClick={() => openEdit(item)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '5px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <Pencil size={11} /> Edit
                                        </button>
                                        <button onClick={() => onDelete(item.id)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', border: 'none', borderRadius: '5px', backgroundColor: 'var(--danger)', fontSize: '11px', cursor: 'pointer', color: '#fff' }}>
                                            <Trash2 size={11} /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modal && (
                <Modal title={modal.mode === 'create' ? `Tambah ${title}` : `Edit ${title}`} onClose={closeModal} onSave={handleSave} saving={saving}>
                    {fields.map(f => (
                        <div key={f.key} style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{f.label}</label>
                            {f.type === 'select' ? (
                                <select value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                                    <option value="">Pilih...</option>
                                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input type="text" value={form[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder ?? ''}
                                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                            )}
                        </div>
                    ))}
                </Modal>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TABS = ['categories', 'kta-tta', 'potency'];
const TAB_LABELS = { 'categories': 'Kategori', 'kta-tta': 'KTA & TTA', 'potency': 'Potensi & Konsekuensi' };

export default function Index() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const initialTab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'categories';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [categories, setCategories] = useState([]);
    const [ktaTta, setKtaTta]         = useState([]);
    const [potency, setPotency]       = useState([]);
    const [loading, setLoading]       = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [cat, kta, pot] = await Promise.all([
                axios.get('/api/field-leadership/master/categories'),
                axios.get('/api/field-leadership/master/kta-tta'),
                axios.get('/api/field-leadership/master/potency'),
            ]);
            setCategories(cat.data?.result ?? []);
            setKtaTta(kta.data?.result ?? []);
            setPotency(pot.data?.result ?? []);
        } catch (err) {
            console.error('Master data fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Category CRUD
    const saveCategory = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/master/categories/${id}`, form);
        else    await axios.post('/api/field-leadership/master/categories', form);
        fetchAll();
    };
    const deleteCategory = async (id) => {
        if (!confirm('Hapus kategori ini?')) return;
        await axios.delete(`/api/field-leadership/master/categories/${id}`);
        fetchAll();
    };

    // KTA/TTA CRUD
    const saveKtaTta = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/master/kta-tta/${id}`, form);
        else    await axios.post('/api/field-leadership/master/kta-tta', form);
        fetchAll();
    };
    const deleteKtaTta = async (id) => {
        if (!confirm('Hapus KTA/TTA ini?')) return;
        await axios.delete(`/api/field-leadership/master/kta-tta/${id}`);
        fetchAll();
    };

    // Potency CRUD
    const savePotency = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/master/potency/${id}`, form);
        else    await axios.post('/api/field-leadership/master/potency', form);
        fetchAll();
    };
    const deletePotency = async (id) => {
        if (!confirm('Hapus potensi ini?')) return;
        await axios.delete(`/api/field-leadership/master/potency/${id}`);
        fetchAll();
    };

    return (
        <FieldLeadershipLayout>
            <Head title="Master Data — Field Leadership" />

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Database size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Master Data</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Kelola data referensi untuk modul Field Leadership.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid var(--border-color)', paddingBottom: '0' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ padding: '10px 20px', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: '-2px', backgroundColor: 'transparent', fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', borderRadius: '6px 6px 0 0', transition: 'all 0.2s ease' }}>
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            {activeTab === 'categories' && (
                <MasterTab title="Kategori" data={categories} loading={loading}
                    fields={[{ key: 'name', label: 'Nama Kategori', placeholder: 'Misal: Keselamatan' }]}
                    onSave={saveCategory} onDelete={deleteCategory} />
            )}

            {activeTab === 'kta-tta' && (
                <MasterTab title="KTA & TTA" data={ktaTta} loading={loading}
                    fields={[
                        { key: 'code', label: 'Kode', placeholder: 'Misal: KTA-01' },
                        { key: 'name', label: 'Nama', placeholder: 'Misal: Tidak Memakai APD' },
                        { key: 'type', label: 'Tipe', type: 'select', options: ['Kondisi Tidak Aman', 'Tindakan Tidak Aman'] },
                    ]}
                    onSave={saveKtaTta} onDelete={deleteKtaTta} />
            )}

            {activeTab === 'potency' && (
                <MasterTab title="Potensi & Konsekuensi" data={potency} loading={loading}
                    fields={[
                        { key: 'code', label: 'Kode', placeholder: 'Misal: P-01' },
                        { key: 'name', label: 'Nama', placeholder: 'Misal: Luka Ringan' },
                    ]}
                    onSave={savePotency} onDelete={deletePotency} />
            )}

        </FieldLeadershipLayout>
    );
}
