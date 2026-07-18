import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function BusinessEntities({ entities = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const openCreateModal = () => {
        setEditId(null);
        setName('');
        setCode('');
        setModalOpen(true);
    };

    const openEditModal = (entity) => {
        setEditId(entity.id);
        setName(entity.name);
        setCode(entity.code);
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`/admin/business-entities/${editId}`, { name, code }, {
                onSuccess: () => setModalOpen(false)
            });
        } else {
            router.post('/admin/business-entities', { name, code }, {
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(`/admin/business-entities/${id}`);
        }
    };

    return (
        <AdminLayout title="Business Entities">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Business Entities</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Daftar dan manajemen entitas bisnis pada ekosistem AIMS.</p>
                    </div>
                    <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={16} /> Tambah Entitas
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>NAMA</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>KODE</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entities.map(entity => (
                                <tr key={entity.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{entity.name}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#475569' }}><code>{entity.code}</code></td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button onClick={() => openEditModal(entity)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(entity.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {entities.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Belum ada data entitas bisnis.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{editId ? 'Edit Entitas Bisnis' : 'Tambah Entitas Bisnis'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>NAMA ENTITAS</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Alam Tri" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>KODE</label>
                                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: AT" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
