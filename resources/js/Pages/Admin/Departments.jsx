import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Departments({ departments = [], companies = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [companyId, setCompanyId] = useState('');

    const openCreateModal = () => {
        setEditId(null);
        setName('');
        setCode('');
        setCompanyId(companies[0]?.id || '');
        setModalOpen(true);
    };

    const openEditModal = (dept) => {
        setEditId(dept.id);
        setName(dept.department_name);
        setCode(dept.department_code);
        setCompanyId(dept.company_id);
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { department_name: name, department_code: code, company_id: companyId };
        if (editId) {
            router.put(`/admin/departments/${editId}`, payload, {
                onSuccess: () => setModalOpen(false)
            });
        } else {
            router.post('/admin/departments', payload, {
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus departemen ini?')) {
            router.delete(`/admin/departments/${id}`);
        }
    };

    return (
        <AdminLayout title="Departments">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Departments</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Manajemen divisi dan departemen kerja.</p>
                    </div>
                    <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={16} /> Tambah Departemen
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>DEPARTEMEN</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>KODE</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>PERUSAHAAN</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map(dept => (
                                <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>{dept.department_name}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#475569' }}><code>{dept.department_code}</code></td>
                                    <td style={{ padding: '14px 20px', fontSize: '13.5px', color: '#1e293b' }}>{dept.company?.company_name || '-'}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button onClick={() => openEditModal(dept)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(dept.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {departments.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Belum ada data departemen.</td>
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
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{editId ? 'Edit Departemen' : 'Tambah Departemen'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>PERUSAHAAN</label>
                                <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>NAMA DEPARTEMEN</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: K3LH" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>KODE DEPARTEMEN</label>
                                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: HSE" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
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
