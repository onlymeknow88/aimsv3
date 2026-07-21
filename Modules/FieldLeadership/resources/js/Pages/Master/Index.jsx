import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { Database, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import axios from 'axios';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

// ── Reusable Modal ────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, saving, children }) {
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
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
    const [modal, setModal]   = useState(null);
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
                            <tr key={item.id || idx} style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
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
const TABS = ['limit-parameter', 'jenis-kta-tta', 'potensi-konsekuensi'];
const TAB_LABELS = {
    'limit-parameter': 'Limit Parameter',
    'jenis-kta-tta': 'Jenis KTA / TTA',
    'potensi-konsekuensi': 'Potensi Konsekuensi'
};

export default function Index() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = TABS.includes(tabParam) ? tabParam : 'limit-parameter';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [limitParams, setLimitParams] = useState([]);
    const [ktaTta, setKtaTta]           = useState([]);
    const [potency, setPotency]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null); // { id, type, label }
    const [deleting, setDeleting]           = useState(false);

    useEffect(() => {
        if (tabParam && TABS.includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [lim, kta, pot] = await Promise.all([
                axios.get('/api/field-leadership/masters/limit-parameters').catch(() => ({ data: { result: null } })),
                axios.get('/api/field-leadership/masters/kta-tta').catch(() => ({ data: { result: [] } })),
                axios.get('/api/field-leadership/masters/potencies').catch(() => ({ data: { result: [] } })),
            ]);
            // limit-parameters returns a single object (single-row table), normalise to array for display
            const limResult = lim.data?.result ?? lim.data ?? null;
            setLimitParams(limResult ? (Array.isArray(limResult) ? limResult : [limResult]) : []);
            setKtaTta(Array.isArray(kta.data?.result) ? kta.data.result : []);
            setPotency(Array.isArray(pot.data?.result) ? pot.data.result : []);
        } catch (err) {
            console.error('Master data fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Limit Parameter — single-row upsert (no id needed, no delete)
    const saveLimitParam = async (form, id) => {
        await axios.put('/api/field-leadership/masters/limit-parameters', form);
        fetchAll();
    };
    const deleteLimitParam = async () => {
        // single-row table — delete not supported
        alert('Parameter tidak dapat dihapus. Gunakan Edit untuk mengubah nilai.');
    };

    // KTA/TTA CRUD
    const saveKtaTta = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/masters/kta-tta/${id}`, form);
        else    await axios.post('/api/field-leadership/masters/kta-tta', form);
        fetchAll();
    };
    const deleteKtaTta = async (id) => {
        setPendingDelete({ id, type: 'kta-tta', label: 'Jenis KTA/TTA' });
    };
    const confirmDeleteKtaTta = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/field-leadership/masters/kta-tta/${pendingDelete.id}`);
            fetchAll();
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    // Potency CRUD
    const savePotency = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/masters/potencies/${id}`, form);
        else    await axios.post('/api/field-leadership/masters/potencies', form);
        fetchAll();
    };
    const deletePotency = async (id) => {
        setPendingDelete({ id, type: 'potency', label: 'Potensi Konsekuensi' });
    };
    const confirmDeletePotency = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/field-leadership/masters/potencies/${pendingDelete.id}`);
            fetchAll();
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    return (
        <FieldLeadershipLayout>
            <Head title="Master Library — Field Leadership" />

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Database size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Master Library</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Kelola data referensi &amp; parameter modul Field Leadership.</p>
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

            {activeTab === 'limit-parameter' && (
                <MasterTab title="Limit Parameter" data={limitParams} loading={loading}
                    fields={[
                        { key: 'max_item_member',             label: 'Maks. Anggota Tim',        placeholder: '5' },
                        { key: 'max_item_positive_condition', label: 'Maks. Kondisi Positif',     placeholder: '5' },
                        { key: 'max_item_risk_condition',     label: 'Maks. Kondisi Risiko',      placeholder: '10' },
                        { key: 'max_item_corrective_action',  label: 'Maks. Tindakan Perbaikan',  placeholder: '5' },
                    ]}
                    onSave={saveLimitParam} onDelete={deleteLimitParam} />
            )}

            {activeTab === 'jenis-kta-tta' && (
                <MasterTab title="Jenis KTA / TTA" data={ktaTta} loading={loading}
                    fields={[
                        { key: 'code', label: 'Kode', placeholder: 'Misal: KTA-01' },
                        { key: 'name', label: 'Nama KTA / TTA', placeholder: 'Misal: Tidak Memakai APD' },
                        { key: 'type', label: 'Tipe', type: 'select', options: ['KTA', 'TTA'] },
                    ]}
                    onSave={saveKtaTta} onDelete={deleteKtaTta} />
            )}

            {activeTab === 'potensi-konsekuensi' && (
                <MasterTab title="Potensi Konsekuensi" data={potency} loading={loading}
                    fields={[
                        { key: 'code', label: 'Kode', placeholder: 'Misal: P-01' },
                        { key: 'name', label: 'Nama Potensi', placeholder: 'Misal: Luka Ringan / Cedera' },
                    ]}
                    onSave={savePotency} onDelete={deletePotency} />
            )}

            <DeleteConfirmModal
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={pendingDelete?.type === 'kta-tta' ? confirmDeleteKtaTta : confirmDeletePotency}
                deleting={deleting}
                title={`Hapus ${pendingDelete?.label ?? 'Data'}`}
                description={`Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`}
            />
        </FieldLeadershipLayout>
    );
}
