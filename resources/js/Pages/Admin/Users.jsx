import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Users({ 
    users = [], 
    companies = [], 
    departments = [], 
    sections = [], 
    roles = [], 
    modules = [] 
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);

    const openCreateModal = () => {
        setEditId(null);
        setName('');
        setEmail('');
        setPassword('');
        setCompanyId(companies[0]?.id || '');
        setDepartmentId(departments[0]?.id || '');
        setSectionId(sections[0]?.id || '');
        setSelectedRoles([]);
        setSelectedModules([]);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditId(user.id);
        setName(user.name);
        setEmail(user.email);
        setPassword('');
        setCompanyId(user.employee?.company_id || '');
        setDepartmentId(user.employee?.department_id || '');
        setSectionId(user.employee?.section_id || '');
        
        const roleIds = user.document_roles ? user.document_roles.map(r => r.id) : [];
        setSelectedRoles(roleIds);

        // Cari modul-modul apa saja yang dimiliki user berdasarkan role-role ini
        const activeModuleIds = [];
        roleIds.forEach(rid => {
            const roleObj = roles.find(r => r.id === rid);
            if (roleObj && !activeModuleIds.includes(roleObj.module_id)) {
                activeModuleIds.push(roleObj.module_id);
            }
        });
        setSelectedModules(activeModuleIds);
        
        setModalOpen(true);
    };

    const handleModuleCheckboxChange = (moduleId) => {
        if (selectedModules.includes(moduleId)) {
            // Uncheck modul: hapus modul dari state dan uncheck semua role di dalam modul tersebut
            setSelectedModules(selectedModules.filter(id => id !== moduleId));
            const moduleRolesIds = roles.filter(r => r.module_id === moduleId).map(r => r.id);
            setSelectedRoles(selectedRoles.filter(id => !moduleRolesIds.includes(id)));
        } else {
            // Check modul: tambahkan modul ke state
            setSelectedModules([...selectedModules, moduleId]);
        }
    };

    const handleRoleCheckboxChange = (roleId) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name,
            email,
            password,
            company_id: companyId,
            department_id: departmentId,
            section_id: sectionId,
            role_ids: selectedRoles
        };

        if (editId) {
            router.put(`/admin/users/${editId}`, payload, {
                onSuccess: () => setModalOpen(false)
            });
        } else {
            router.post('/admin/users', payload, {
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user & employee ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout title="Users & Employees">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Users & Employee</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Manajemen data akun login user beserta data karyawan.</p>
                    </div>
                    <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={16} /> Tambah User
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>USER INFO</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>AFILIASI</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>ROLES</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{user.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>
                                        <div>{user.employee?.company?.company_name || '-'}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                            {user.employee?.department?.department_name || '-'} / {user.employee?.section?.section_name || '-'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {user.document_roles && user.document_roles.map(role => (
                                                <span key={role.id} style={{ padding: '2px 8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                                                    {role.name}
                                                </span>
                                            ))}
                                            {(!user.document_roles || user.document_roles.length === 0) && (
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button onClick={() => openEditModal(user)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '640px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{editId ? 'Edit Akun Karyawan' : 'Tambah Akun Karyawan'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>NAMA KARYAWAN</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>EMAIL</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>PASSWORD {editId && '(Kosongkan jika tidak ingin diubah)'}</label>
                                <input type="password" required={!editId} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>PERUSAHAAN</label>
                                    <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                                        <option value="">Pilih...</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>DEPARTEMEN</label>
                                    <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                                        <option value="">Pilih...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SECTION</label>
                                    <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                                        <option value="">Pilih...</option>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.section_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Roles List Selection */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '10px' }}>PILIH PERAN / MODULE ROLES</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    {modules.map(mod => {
                                        const modRoles = roles.filter(r => r.module_id === mod.id);
                                        const isModuleChecked = selectedModules.includes(mod.id);

                                        return (
                                            <div key={mod.id} style={{ borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}>
                                                {/* Header Modul dengan Checkbox */}
                                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px', cursor: 'pointer' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isModuleChecked} 
                                                        onChange={() => handleModuleCheckboxChange(mod.id)} 
                                                        style={{ accentColor: '#2563eb', width: '14px', height: '14px', cursor: 'pointer' }}
                                                    />
                                                    {mod.name}
                                                </label>

                                                {/* Daftar Role hanya muncul jika modul dicentang */}
                                                {isModuleChecked && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '4px', paddingLeft: '22px' }}>
                                                        {modRoles.map(role => (
                                                            <label key={role.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', transition: 'all 0.15s' }}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={selectedRoles.includes(role.id)} 
                                                                    onChange={() => handleRoleCheckboxChange(role.id)} 
                                                                    style={{ accentColor: '#2563eb', width: '15px', height: '15px', cursor: 'pointer' }}
                                                                />
                                                                {role.name}
                                                            </label>
                                                        ))}
                                                        {modRoles.length === 0 && (
                                                            <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Belum ada role di modul ini</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
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
