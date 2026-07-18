import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Sections({ sections = [], departments = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    const openCreateModal = () => {
        setEditId(null);
        setName('');
        setCode('');
        setDepartmentId(departments[0]?.id || '');
        setModalOpen(true);
    };

    const openEditModal = (sec) => {
        setEditId(sec.id);
        setName(sec.section_name);
        setCode(sec.section_code);
        setDepartmentId(sec.department_id);
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { section_name: name, section_code: code, department_id: departmentId };
        if (editId) {
            router.put(`/admin/sections/${editId}`, payload, {
                onSuccess: () => setModalOpen(false)
            });
        } else {
            router.post('/admin/sections', payload, {
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus section ini?')) {
            router.delete(`/admin/sections/${id}`);
        }
    };

    return (
        <AdminLayout title="Sections / Locations">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Sections</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Manajemen sub-divisi, area kerja atau lokasi spesifik K3LH.</p>
                    </div>
                    <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={16} /> Tambah Section
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>SECTIONS</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>KODE</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>DEPARTEMEN</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map(sec => (
                                <tr key={sec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{sec.section_name}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#475569' }}><code>{sec.section_code}</code></td>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#1e293b' }}>{sec.department?.department_name || '-'}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button onClick={() => openEditModal(sec)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(sec.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sections.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Belum ada data section.</td>
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
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{editId ? 'Edit Section' : 'Tambah Section'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>DEPARTEMEN</label>
                                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>NAMA SECTION</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Operation Pit A" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>KODE SECTION</label>
                                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: OP_PITA" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
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
