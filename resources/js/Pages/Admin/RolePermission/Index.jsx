import { Shield, Plus, Lock, Loader2, Check, RotateCcw, Save } from 'lucide-react';
import { Head } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import useRolePermission from './Hooks/useRolePermission';
import RolePermissionTable from './Partials/RolePermissionTable';
import RoleModal from './Partials/RoleModal';

export default function Index({ selectedModuleId }) {
    const {
        modules,
        selectedModule,
        roles,
        menus,
        loading,
        error,
        changedKeys,
        updating,
        saveSuccess,
        handleModuleChange,
        getPermValue,
        handleToggle,
        handleCancel,
        handleSave,
        // add role modal
        showAddRoleModal,
        setShowAddRoleModal,
        newRoleName,
        setNewRoleName,
        newRoleSlug,
        setNewRoleSlug,
        handleAddRole,
        makeSlug,
        // edit role modal
        editingRole,
        openEditRoleModal,
        closeEditRoleModal,
        editRoleName,
        setEditRoleName,
        editRoleSlug,
        setEditRoleSlug,
        handleEditRole,
        handleDeleteRole,
    } = useRolePermission(selectedModuleId);

    const hasChanges = changedKeys.size > 0;
    const selectedMod = modules.find((m) => m.id === selectedModule);

    return (
        <AdminLayout title="Role & Permission">
            <Head title="Role & Permission Matrix" />

            <div style={{ margin: '0 auto' }}>

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

                    {/* Table Container */}
                    {loading ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', opacity: 0.5, marginLeft: 'auto', marginRight: 'auto' }} />
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Memuat data role dan permission...</p>
                        </div>
                    ) : (
                        <RolePermissionTable
                            roles={roles}
                            menus={menus}
                            getPermValue={getPermValue}
                            onToggle={handleToggle}
                            changedKeys={changedKeys}
                            onEditRole={openEditRoleModal}
                            onDeleteRole={handleDeleteRole}
                        />
                    )}

                    {/* Legend */}
                    {!loading && menus.length > 0 && roles.length > 0 && (
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
            <RoleModal
                isOpen={showAddRoleModal}
                onClose={() => setShowAddRoleModal(false)}
                onSubmit={handleAddRole}
                name={newRoleName}
                setName={setNewRoleName}
                slug={newRoleSlug}
                setSlug={setNewRoleSlug}
                title="Tambah Role Baru"
                buttonText="Simpan Role"
                makeSlug={makeSlug}
            />

            {/* ── Edit Role Modal ──────────────────────────────────────── */}
            <RoleModal
                isOpen={!!editingRole}
                onClose={closeEditRoleModal}
                onSubmit={handleEditRole}
                name={editRoleName}
                setName={setEditRoleName}
                slug={editRoleSlug}
                setSlug={setEditRoleSlug}
                title="Edit Role"
                buttonText="Perbarui Role"
                makeSlug={makeSlug}
            />
        </AdminLayout>
    );
}
