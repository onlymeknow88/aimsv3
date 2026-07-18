import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, RefreshCw, AlertCircle, FolderOpen } from 'lucide-react';
import useAimsMenu from './Hooks/useAimsMenu';
import AimsMenuTable from './Partials/AimsMenuTable';

export default function Index() {
    const {
        menus,
        modules,
        loading,
        error,
        filterModule,
        setFilterModule,
        fetchAll,
        totalChildren,
        modalOpen,
        editId,
        form,
        submitting,
        formError,
        availableParents,
        openCreate,
        openEdit,
        closeModal,
        handleFormChange,
        handleSubmit,
        handleDelete,
    } = useAimsMenu();

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '6px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#0f172a',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    };

    return (
        <AdminLayout title="AIMS Menu">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Header ──────────────────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>AIMS Menu</h1>
                        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                            Kelola struktur menu dan folder hooks untuk setiap modul.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Module Filter */}
                        <select
                            value={filterModule}
                            onChange={e => setFilterModule(e.target.value)}
                            style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: '#334155', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="">Semua Modul</option>
                            {modules.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>

                        {/* Refresh */}
                        <button
                            onClick={fetchAll}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        {/* Tambah */}
                        <button
                            onClick={openCreate}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            <Plus size={16} /> Tambah Menu
                        </button>
                    </div>
                </div>

                {/* ── Error Banner ─────────────────────────────────────────── */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '13px' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {/* ── Table Card ───────────────────────────────────────────── */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <AimsMenuTable
                        menus={menus}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* ── Summary ──────────────────────────────────────────────── */}
                {!loading && menus.length > 0 && (
                    <p style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>
                        {menus.length} folder/menu parent · {totalChildren} sub-menu (hooks)
                    </p>
                )}
            </div>

            {/* ── Modal Create / Edit ──────────────────────────────────────── */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', overflow: 'hidden' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FolderOpen size={16} style={{ color: '#2563eb' }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                    {editId ? 'Edit Menu' : 'Tambah Menu Baru'}
                                </h3>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Form Error */}
                                {formError && (
                                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <AlertCircle size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
                                        {formError}
                                    </div>
                                )}

                                {/* Modul */}
                                <div>
                                    <label style={labelStyle}>Modul <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select
                                        required
                                        value={form.module_id}
                                        onChange={e => handleFormChange('module_id', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">— Pilih Modul —</option>
                                        {modules.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Parent Menu */}
                                <div>
                                    <label style={labelStyle}>
                                        Parent Menu{' '}
                                        <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opsional — untuk sub-menu / hook)</span>
                                    </label>
                                    <select
                                        value={form.parent_id}
                                        onChange={e => handleFormChange('parent_id', e.target.value)}
                                        style={{ ...inputStyle, color: form.parent_id ? '#0f172a' : '#94a3b8' }}
                                        disabled={!form.module_id}
                                    >
                                        <option value="">— Tidak ada (menu utama / folder) —</option>
                                        {availableParents.map(m => (
                                            <option key={m.id} value={m.id}>📁 {m.name}</option>
                                        ))}
                                    </select>
                                    {form.parent_id && (
                                        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>
                                            Menu ini akan menjadi <strong>hook / sub-item</strong> di dalam folder yang dipilih.
                                        </p>
                                    )}
                                </div>

                                {/* Order + Nama */}
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>Order</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.order_by}
                                            onChange={e => handleFormChange('order_by', e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Nama Menu <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Contoh: Document System"
                                            value={form.name}
                                            onChange={e => handleFormChange('name', e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Slug */}
                                <div>
                                    <label style={labelStyle}>
                                        Slug <span style={{ color: '#ef4444' }}>*</span>{' '}
                                        <span style={{ color: '#94a3b8', fontWeight: 400 }}>(auto dari nama)</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="contoh: document-system"
                                        value={form.slug}
                                        onChange={e => handleFormChange('slug', e.target.value)}
                                        style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: '13px' }}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{ padding: '9px 24px', borderRadius: '8px', border: 'none', backgroundColor: submitting ? '#93c5fd' : '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
                                >
                                    {submitting ? 'Menyimpan...' : (editId ? 'Perbarui Menu' : 'Simpan Menu')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
