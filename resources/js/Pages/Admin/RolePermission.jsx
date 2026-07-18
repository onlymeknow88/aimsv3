import { AlertCircle, Check, Plus, Save, Shield, X, Loader2, RotateCcw, Lock, Eye, FilePlus2, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

// ─── Permission columns config ────────────────────────────────────────────────
const PERMISSION_COLS = [
    { field: 'can_view',     label: 'View',     icon: Eye,        color: '#6366f1' },
    { field: 'can_create',   label: 'Create',   icon: FilePlus2,  color: '#10b981' },
    { field: 'can_edit',     label: 'Edit',     icon: Pencil,     color: '#f59e0b' },
    { field: 'can_delete',   label: 'Delete',   icon: Trash2,     color: '#ef4444' },
    { field: 'can_approval', label: 'Approval', icon: ShieldCheck, color: '#8b5cf6' },
];

// ─── Checkbox cell ────────────────────────────────────────────────────────────
function PermCheckbox({ checked, changed, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: checked ? 'none' : `1.5px solid ${changed ? '#f59e0b' : '#cbd5e1'}`,
                backgroundColor: checked
                    ? (changed ? '#f59e0b' : '#2563eb')
                    : (changed ? '#fffbeb' : '#f8fafc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                margin: '0 auto',
                flexShrink: 0,
                outline: 'none',
            }}
            title={checked ? 'Diizinkan — klik untuk cabut' : 'Tidak diizinkan — klik untuk beri akses'}
        >
            {checked && <Check size={13} style={{ color: '#fff', strokeWidth: 3 }} />}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RolePermission({ modules = [], selectedModuleId, roles = [], menus = [], permissions = [] }) {
    const [selectedModule, setSelectedModule] = useState(selectedModuleId);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleSlug, setNewRoleSlug] = useState('');
    const [editRoleName, setEditRoleName] = useState('');
    const [editRoleSlug, setEditRoleSlug] = useState('');
    const [updating, setUpdating] = useState(false);
    const [localPermissions, setLocalPermissions] = useState({});
    const [changedKeys, setChangedKeys] = useState(new Set());
    const [saveSuccess, setSaveSuccess] = useState(false);

    const makeSlug = (value) =>
        value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');

    const handleModuleChange = (moduleId) => {
        setSelectedModule(moduleId);
        router.get(window.location.pathname, { module_id: moduleId }, { preserveState: true });
    };

    React.useEffect(() => {
        const map = {};
        permissions.forEach(p => {
            const base = `${p.role_id}::${p.menu_id}`;
            map[`${base}::can_view`]     = Boolean(p.can_view);
            map[`${base}::can_create`]   = Boolean(p.can_create);
            map[`${base}::can_edit`]     = Boolean(p.can_edit);
            map[`${base}::can_delete`]   = Boolean(p.can_delete);
            map[`${base}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    }, [permissions]);

    const getPermValue = (roleId, menuId, field) =>
        Boolean(localPermissions[`${roleId}::${menuId}::${field}`]);

    const handleToggle = (roleId, menuId, field) => {
        const key = `${roleId}::${menuId}::${field}`;
        setLocalPermissions(prev => ({ ...prev, [key]: !prev[key] }));
        setChangedKeys(prev => new Set(prev).add(key));
    };

    const handleCancel = () => {
        const map = {};
        permissions.forEach(p => {
            const base = `${p.role_id}::${p.menu_id}`;
            map[`${base}::can_view`]     = Boolean(p.can_view);
            map[`${base}::can_create`]   = Boolean(p.can_create);
            map[`${base}::can_edit`]     = Boolean(p.can_edit);
            map[`${base}::can_delete`]   = Boolean(p.can_delete);
            map[`${base}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    };

    const handleSave = async () => {
        if (changedKeys.size === 0) return;
        setUpdating(true);
        try {
            const changes = [...changedKeys].map(key => {
                const parts = key.split('::');
                return {
                    role_id: parts[0],
                    menu_id: parts[1],
                    field:   parts.slice(2).join('::'),
                    value:   Boolean(localPermissions[key]),
                };
            });
            await axios.post('/admin/role-permissions/bulk-update', { changes });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
            setChangedKeys(new Set());
            router.reload({ preserveScroll: true });
        } catch (err) {
            console.error('Gagal menyimpan permissions', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleAddRole = (e) => {
        e.preventDefault();
        router.post('/admin/role-permissions/roles', {
            module_id: selectedModule,
            name: newRoleName,
            slug: newRoleSlug,
        }, {
            onSuccess: () => {
                setShowAddRoleModal(false);
                setNewRoleName('');
                setNewRoleSlug('');
            },
        });
    };

    const openEditRoleModal = (role) => {
        setEditingRole(role);
        setEditRoleName(role.name);
        setEditRoleSlug(role.slug);
    };

    const closeEditRoleModal = () => {
        setEditingRole(null);
        setEditRoleName('');
        setEditRoleSlug('');
    };

    const handleEditRole = (e) => {
        e.preventDefault();
        if (!editingRole) return;

        router.put(`/admin/role-permissions/roles/${editingRole.id}`, {
            module_id: selectedModule,
            name: editRoleName,
            slug: editRoleSlug,
        }, {
            preserveScroll: true,
            onSuccess: closeEditRoleModal,
        });
    };

    const handleDeleteRole = (roleId, roleName) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus role "${roleName}"?\n\nPerhatian:\n- Semua permission role ini akan dihapus\n- User yang memiliki role ini akan kehilangan akses`)) {
            return;
        }

        router.delete(`/admin/role-permissions/roles/${roleId}`, {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Delete error:', errors);
            },
        });
    };

    // Group menus: parents with children
    const parentMenus  = menus.filter(m => !m.parent_id);
    const childMenus   = menus.filter(m =>  m.parent_id);
    const getChildren  = (parentId) => childMenus.filter(c => c.parent_id === parentId);
    const hasChanges   = changedKeys.size > 0;
    const selectedMod  = modules.find(m => m.id === selectedModule);

    return (
        <AdminLayout title="Role & Permission">
            <Head title="Role & Permission Matrix" />

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Page Header ─────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(21,59,115,0.25)' }}>
                                <Shield size={20} style={{ color: '#fff' }} />
                            </div>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                Role & Permission Matrix
                            </h1>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '13px', marginLeft: '52px' }}>
                            Kelola izin dan hak akses per role untuk setiap modul AIMS.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddRoleModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, #1d4ed8, #153B73)',
                            color: '#fff', border: 'none',
                            padding: '10px 20px', borderRadius: '10px',
                            fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(21,59,115,0.3)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(21,59,115,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(21,59,115,0.3)'; }}
                    >
                        <Plus size={16} /> Tambah Role
                    </button>
                </div>

                {/* ── Module Tab Selector ──────────────────────────────── */}
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Pilih Modul
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {modules.map(m => {
                            const active = selectedModule === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => handleModuleChange(m.id)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '99px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: active ? 'none' : '1.5px solid #e2e8f0',
                                        background: active
                                            ? 'linear-gradient(135deg, #1d4ed8, #153B73)'
                                            : '#fff',
                                        color: active ? '#fff' : '#64748b',
                                        cursor: 'pointer',
                                        boxShadow: active ? '0 3px 10px rgba(21,59,115,0.25)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#153B73'; e.currentTarget.style.color = '#153B73'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; } }}
                                >
                                    {m.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Permission Matrix Card ────────────────────────────── */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                    {/* Card Header */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Lock size={15} style={{ color: '#153B73' }} />
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                                Permission Matrix
                            </span>
                            {selectedMod && (
                                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 10px', borderRadius: '99px' }}>
                                    {selectedMod.name}
                                </span>
                            )}
                            {hasChanges && (
                                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#fffbeb', color: '#b45309', padding: '2px 10px', borderRadius: '99px', border: '1px solid #fde68a' }}>
                                    {changedKeys.size} perubahan belum disimpan
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Saving indicator */}
                            {updating && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#153B73', fontWeight: 600 }}>
                                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    Menyimpan...
                                </span>
                            )}
                            {saveSuccess && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                                    <Check size={13} /> Tersimpan!
                                </span>
                            )}

                            {/* Cancel */}
                            <button
                                onClick={handleCancel}
                                disabled={!hasChanges || updating}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 14px', borderRadius: '8px',
                                    border: '1.5px solid #e2e8f0',
                                    backgroundColor: '#fff',
                                    color: hasChanges ? '#475569' : '#cbd5e1',
                                    fontSize: '12px', fontWeight: 600,
                                    cursor: hasChanges && !updating ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <RotateCcw size={12} /> Reset
                            </button>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || updating}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 18px', borderRadius: '8px',
                                    border: 'none',
                                    background: hasChanges && !updating
                                        ? 'linear-gradient(135deg, #1d4ed8, #153B73)'
                                        : '#e2e8f0',
                                    color: hasChanges && !updating ? '#fff' : '#94a3b8',
                                    fontSize: '12px', fontWeight: 700,
                                    cursor: hasChanges && !updating ? 'pointer' : 'not-allowed',
                                    boxShadow: hasChanges && !updating ? '0 3px 10px rgba(21,59,115,0.25)' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Save size={13} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {menus.length === 0 || roles.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
                            <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                                {menus.length === 0 ? 'Belum ada menu di modul ini.' : 'Belum ada role di modul ini.'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Tambahkan menu melalui halaman AIMS Menu atau tambah role melalui tombol di atas.
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: `${280 + roles.length * 5 * 52}px` }}>
                                <thead>
                                    {/* Row 1: Menu col + Role names */}
                                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <th
                                            rowSpan="2"
                                            style={{
                                                padding: '14px 20px',
                                                fontSize: '11px', fontWeight: 700, color: '#475569',
                                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                                width: '280px', minWidth: '200px',
                                                borderRight: '2px solid #e2e8f0',
                                                verticalAlign: 'middle',
                                            }}
                                        >
                                            Menu / Sub-Menu
                                        </th>
                                        {roles.map(role => (
                                            <th
                                                key={role.id}
                                                colSpan={PERMISSION_COLS.length}
                                                style={{
                                                    padding: '12px 8px 6px',
                                                    textAlign: 'center',
                                                    borderRight: '1px solid #e2e8f0',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    position: 'relative',
                                                }}
                                            >
                                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', padding: '0 48px' }}>{role.name}</div>
                                                <code style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>{role.slug}</code>

                                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '2px' }}>
                                                    <button
                                                        onClick={() => openEditRoleModal(role)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#2563eb',
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }}
                                                        title="Edit role ini"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRole(role.id, role.name)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }}
                                                        title="Hapus role ini"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>

                                    {/* Row 2: Permission sub-headers */}
                                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        {roles.map(role => (
                                            <React.Fragment key={`sub-${role.id}`}>
                                                {PERMISSION_COLS.map((col, ci) => {
                                                    const Icon = col.icon;
                                                    const isLast = ci === PERMISSION_COLS.length - 1;
                                                    return (
                                                        <th
                                                            key={col.field}
                                                            style={{
                                                                padding: '6px 4px 10px',
                                                                textAlign: 'center',
                                                                width: '52px',
                                                                borderRight: isLast ? '1px solid #e2e8f0' : 'none',
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                                <Icon size={11} style={{ color: col.color }} />
                                                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                                    {col.label}
                                                                </span>
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {parentMenus.map((menu, mIdx) => {
                                        const children = getChildren(menu.id);
                                        const isEven = mIdx % 2 === 0;

                                        return (
                                            <React.Fragment key={menu.id}>
                                                {/* Parent Menu Row */}
                                                <tr style={{ backgroundColor: isEven ? '#fff' : '#fafcff', borderBottom: children.length > 0 ? 'none' : '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '13px 20px', borderRight: '2px solid #e2e8f0' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#153B73', flexShrink: 0 }} />
                                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{menu.name}</span>
                                                        </div>
                                                        <code style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '14px' }}>{menu.slug}</code>
                                                    </td>

                                                    {roles.map(role => (
                                                        <React.Fragment key={`${menu.id}-${role.id}`}>
                                                            {PERMISSION_COLS.map((col, ci) => {
                                                                const isLast = ci === PERMISSION_COLS.length - 1;
                                                                const key = `${role.id}::${menu.id}::${col.field}`;
                                                                const val = getPermValue(role.id, menu.id, col.field);
                                                                const changed = changedKeys.has(key);
                                                                return (
                                                                    <td key={col.field} style={{ padding: '10px 4px', textAlign: 'center', borderRight: isLast ? '1px solid #e2e8f0' : 'none' }}>
                                                                        <PermCheckbox
                                                                            checked={val}
                                                                            changed={changed}
                                                                            onChange={() => handleToggle(role.id, menu.id, col.field)}
                                                                        />
                                                                    </td>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    ))}
                                                </tr>

                                                {/* Child / Hook Rows */}
                                                {children.map((child, cIdx) => (
                                                    <tr
                                                        key={child.id}
                                                        style={{
                                                            backgroundColor: isEven ? '#f8fafc' : '#f5f8fe',
                                                            borderBottom: cIdx === children.length - 1 ? '1px solid #f1f5f9' : '1px solid #f0f4f8',
                                                        }}
                                                    >
                                                        <td style={{ padding: '10px 20px', borderRight: '2px solid #e2e8f0', paddingLeft: '40px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ color: '#cbd5e1', fontSize: '11px' }}>└</span>
                                                                <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#475569' }}>{child.name}</span>
                                                            </div>
                                                            <code style={{ fontSize: '10px', color: '#cbd5e1', marginLeft: '18px' }}>{child.slug}</code>
                                                        </td>

                                                        {roles.map(role => (
                                                            <React.Fragment key={`${child.id}-${role.id}`}>
                                                                {PERMISSION_COLS.map((col, ci) => {
                                                                    const isLast = ci === PERMISSION_COLS.length - 1;
                                                                    const key = `${role.id}::${child.id}::${col.field}`;
                                                                    const val = getPermValue(role.id, child.id, col.field);
                                                                    const changed = changedKeys.has(key);
                                                                    return (
                                                                        <td key={col.field} style={{ padding: '8px 4px', textAlign: 'center', borderRight: isLast ? '1px solid #e2e8f0' : 'none' }}>
                                                                            <PermCheckbox
                                                                                checked={val}
                                                                                changed={changed}
                                                                                onChange={() => handleToggle(role.id, child.id, col.field)}
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                            </React.Fragment>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Legend */}
                    {menus.length > 0 && roles.length > 0 && (
                        <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>LEGEND:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Check size={11} style={{ color: '#fff', strokeWidth: 3 }} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Diizinkan</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc' }} />
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Tidak diizinkan</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Check size={11} style={{ color: '#fff', strokeWidth: 3 }} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Perubahan belum disimpan</span>
                            </div>
                            <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8' }}>
                                {roles.length} role · {menus.length} menu
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Add Role Modal ───────────────────────────────────────── */}
            {showAddRoleModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={15} style={{ color: '#fff' }} />
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Tambah Role Baru</h3>
                            </div>
                            <button
                                onClick={() => setShowAddRoleModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddRole}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                        Nama Role <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newRoleName}
                                        onChange={e => {
                                            setNewRoleName(e.target.value);
                                            setNewRoleSlug(makeSlug(e.target.value));
                                        }}
                                        placeholder="Contoh: Admin Safety"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                        Slug Role <span style={{ color: '#ef4444' }}>*</span>
                                        <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>(auto dari nama)</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newRoleSlug}
                                        onChange={e => setNewRoleSlug(e.target.value)}
                                        placeholder="Contoh: admin_safety"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'ui-monospace, monospace', outline: 'none', boxSizing: 'border-box', color: '#475569', transition: 'border-color 0.15s' }}
                                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddRoleModal(false)}
                                    style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(21,59,115,0.25)' }}
                                >
                                    Simpan Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Edit Role Modal ──────────────────────────────────────── */}
            {editingRole && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Pencil size={15} style={{ color: '#fff' }} />
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Edit Role</h3>
                            </div>
                            <button
                                onClick={closeEditRoleModal}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleEditRole}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                        Nama Role <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editRoleName}
                                        onChange={e => {
                                            setEditRoleName(e.target.value);
                                            setEditRoleSlug(makeSlug(e.target.value));
                                        }}
                                        placeholder="Contoh: Admin Safety"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                        Slug Role <span style={{ color: '#ef4444' }}>*</span>
                                        <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>(auto dari nama)</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editRoleSlug}
                                        onChange={e => setEditRoleSlug(e.target.value)}
                                        placeholder="Contoh: admin_safety"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'ui-monospace, monospace', outline: 'none', boxSizing: 'border-box', color: '#475569', transition: 'border-color 0.15s' }}
                                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                                <button
                                    type="button"
                                    onClick={closeEditRoleModal}
                                    style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(21,59,115,0.25)' }}
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           <style dangerouslySetInnerHTML={{ __html: `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Tampilkan tombol aksi role saat th di-hover */
    th:hover button[title="Edit role ini"],
    th:hover button[title="Hapus role ini"] {
        opacity: 1 !important;
    }
`}} />
        </AdminLayout>
    );
}
