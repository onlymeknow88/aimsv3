import { AlertCircle, Check, ChevronRight, Plus, Save, Shield } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function RolePermission({ modules = [], selectedModuleId, roles = [], menus = [], permissions = [] }) {
    const [selectedModule, setSelectedModule] = useState(selectedModuleId);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleSlug, setNewRoleSlug] = useState('');
    const [updating, setUpdating] = useState(false);
    const [localPermissions, setLocalPermissions] = useState({});
    const [changedKeys, setChangedKeys] = useState(new Set());

    // Filter roles dan menus dari props
    const handleModuleChange = (moduleId) => {
        setSelectedModule(moduleId);
        router.get(window.location.pathname, { module_id: moduleId }, { preserveState: true });
    };

    // init localPermissions from server props
    React.useEffect(() => {
        const map = {};
        permissions.forEach(p => {
            const baseKey = `${p.role_id}::${p.menu_id}`;
            map[`${baseKey}::can_view`] = Boolean(p.can_view);
            map[`${baseKey}::can_create`] = Boolean(p.can_create);
            map[`${baseKey}::can_edit`] = Boolean(p.can_edit);
            map[`${baseKey}::can_delete`] = Boolean(p.can_delete);
            map[`${baseKey}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    }, [permissions]);

    const getPermissionValue = (roleId, menuId, field) => {
        const key = `${roleId}::${menuId}::${field}`;
        if (key in localPermissions) return localPermissions[key];
        // fallback: false
        return false;
    };

    // Toggle checkbox only updates local state and marks change
    const handleTogglePermission = (roleId, menuId, field) => {
        const key = `${roleId}::${menuId}::${field}`;
        const newMap = { ...localPermissions, [key]: !localPermissions[key] };
        setLocalPermissions(newMap);
        const newSet = new Set(changedKeys);
        newSet.add(key);
        setChangedKeys(newSet);
    };

    const handleCancelChanges = () => {
        // reset to server props
        const map = {};
        permissions.forEach(p => {
            const baseKey = `${p.role_id}::${p.menu_id}`;
            map[`${baseKey}::can_view`] = Boolean(p.can_view);
            map[`${baseKey}::can_create`] = Boolean(p.can_create);
            map[`${baseKey}::can_edit`] = Boolean(p.can_edit);
            map[`${baseKey}::can_delete`] = Boolean(p.can_delete);
            map[`${baseKey}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    };

    const handleSaveChanges = async () => {
        if (changedKeys.size === 0) return;
        setUpdating(true);
        try {
            const changes = [];
            changedKeys.forEach(key => {
                const parts = key.split('::');
                const roleId = parts[0];
                const menuId = parts[1];
                const field = parts.slice(2).join('::');
                changes.push({ role_id: roleId, menu_id: menuId, field: field, value: Boolean(localPermissions[key]) });
            });

            await axios.post('/admin/role-permissions/bulk-update', { changes });
            router.reload({ preserveScroll: true });
        } catch (err) {
            console.error('Gagal menyimpan perubahan permissions', err);
            setUpdating(false);
        }
    };

    // Tambah role baru
    const handleAddRoleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/role-permissions/roles', {
            module_id: selectedModule,
            name: newRoleName,
            slug: newRoleSlug
        }, {
            onSuccess: () => {
                setShowAddRoleModal(false);
                setNewRoleName('');
                setNewRoleSlug('');
            }
        });
    };

    return (
        <AdminLayout title="Role & Permission Matrix">
            <Head title="Role & Permission Matrix" />

            <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={24} style={{ color: '#153B73' }} />
                            AIMS Role & Permission Matrix
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Kelola izin, peranan (roles), dan menu akses modul secara dinamis dari interface React.</p>
                    </div>

                    <button
                        onClick={() => setShowAddRoleModal(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#153B73',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(21, 59, 115, 0.15)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 0.9}
                        onMouseLeave={(e) => e.target.style.opacity = 1}
                    >
                        <Plus size={16} />
                        Tambah Role Baru
                    </button>
                </div>

                {/* Module Selector Panel */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                        PILIH MODUL AIMS
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {modules.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => handleModuleChange(m.id)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    border: selectedModule === m.id ? '2px solid #153B73' : '1px solid #cbd5e1',
                                    backgroundColor: selectedModule === m.id ? '#f0f5ff' : '#fff',
                                    color: selectedModule === m.id ? '#153B73' : '#475569',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permission Matrix Table Container */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Permission Matrix Panel</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {updating && <span style={{ fontSize: '12px', color: '#153B73', fontWeight: 600 }}>Menyimpan ke database...</span>}
                            <button onClick={handleCancelChanges} disabled={changedKeys.size === 0 || updating} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', cursor: changedKeys.size === 0 ? 'not-allowed' : 'pointer' }}>Batal</button>
                            <button onClick={handleSaveChanges} disabled={changedKeys.size === 0 || updating} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: changedKeys.size === 0 ? '#9fb3d6' : '#153B73', color: '#fff', cursor: changedKeys.size === 0 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                                <Save size={14} style={{ marginRight: '8px' }} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#475569', width: '250px' }} rowSpan="2">MENU / SUB-MENU</th>
                                    {roles.map(role => (
                                        <th key={role.id} colSpan="5" style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 700, color: '#475569', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: 850, color: '#0f172a', fontSize: '13px' }}>{role.name}</div>
                                            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}><code>{role.slug}</code></div>
                                        </th>
                                    ))}
                                </tr>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    {roles.map(role => (
                                        <React.Fragment key={`sub-${role.id}`}>
                                            <th style={{ padding: '8px', fontSize: '9.5px', fontWeight: 800, color: '#64748b', textAlign: 'center', borderRight: 'none' }}>VIEW</th>
                                            <th style={{ padding: '8px', fontSize: '9.5px', fontWeight: 800, color: '#64748b', textAlign: 'center', borderRight: 'none' }}>ADD</th>
                                            <th style={{ padding: '8px', fontSize: '9.5px', fontWeight: 800, color: '#64748b', textAlign: 'center', borderRight: 'none' }}>EDIT</th>
                                            <th style={{ padding: '8px', fontSize: '9.5px', fontWeight: 800, color: '#64748b', textAlign: 'center', borderRight: 'none' }}>DEL</th>
                                            <th style={{ padding: '8px', fontSize: '9.5px', fontWeight: 800, color: '#64748b', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>APP</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map(menu => {
                                    const isSubMenu = menu.parent_id !== null;
                                    return (
                                        <tr key={menu.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isSubMenu ? '#fafcfd' : '#fff' }}>
                                            <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: isSubMenu ? 500 : 700, color: isSubMenu ? '#475569' : '#0f172a', paddingLeft: isSubMenu ? '40px' : '20px' }}>
                                                {isSubMenu ? `↳ ${menu.name}` : menu.name}
                                            </td>

                                            {roles.map(role => {
                                                const hasView = getPermissionValue(role.id, menu.id, 'can_view');
                                                const hasCreate = getPermissionValue(role.id, menu.id, 'can_create');
                                                const hasEdit = getPermissionValue(role.id, menu.id, 'can_edit');
                                                const hasDelete = getPermissionValue(role.id, menu.id, 'can_delete');
                                                const hasApp = getPermissionValue(role.id, menu.id, 'can_approval');

                                                return (
                                                    <React.Fragment key={`${menu.id}-${role.id}`}>
                                                        <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={hasView}
                                                                onChange={() => handleTogglePermission(role.id, menu.id, 'can_view')}
                                                                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '15px', height: '15px' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={hasCreate}
                                                                onChange={() => handleTogglePermission(role.id, menu.id, 'can_create')}
                                                                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '15px', height: '15px' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={hasEdit}
                                                                onChange={() => handleTogglePermission(role.id, menu.id, 'can_edit')}
                                                                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '15px', height: '15px' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={hasDelete}
                                                                onChange={() => handleTogglePermission(role.id, menu.id, 'can_delete')}
                                                                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '15px', height: '15px' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '10px 4px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={hasApp}
                                                                onChange={() => handleTogglePermission(role.id, menu.id, 'can_approval')}
                                                                style={{ accentColor: '#2563eb', cursor: 'pointer', width: '15px', height: '15px' }}
                                                            />
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Tambah Role Modal */}
            {showAddRoleModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Tambah Role Baru</h3>
                            <button onClick={() => setShowAddRoleModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>

                        <form onSubmit={handleAddRoleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>NAMA ROLE</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoleName}
                                    onChange={(e) => {
                                        setNewRoleName(e.target.value);
                                        // Auto slugify
                                        setNewRoleSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, ''));
                                    }}
                                    placeholder="Contoh: Admin Safety"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '13px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SLUG ROLE</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoleSlug}
                                    onChange={(e) => setNewRoleSlug(e.target.value)}
                                    placeholder="Contoh: admin_safety"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '13px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddRoleModal(false)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#153B73', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                >
                                    Simpan Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
