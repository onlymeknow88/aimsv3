import { AlertTriangle, ExternalLink, FileText, Info, LogOut, Pencil, Plus, RefreshCw, Search, Trash2, Truck, X } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import KoLayout from '../../Layouts/KoLayout';
import TablePagination from '@/Components/TablePagination';
import useUnit from './Hooks/useUnit';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const labelSm = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
const inputSm = { width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' };
const selectSm = { ...inputSm, backgroundColor: '#fff' };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' };
const modalBox = { backgroundColor: '#fff', borderRadius: '14px', width: '100%', maxWidth: '620px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center', borderRadius: '4px', transition: 'background-color 0.15s' };

function ActionTooltip({ text, children, position = 'top' }) {
    const [show, setShow] = useState(false);
    return (
        <span
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: position === 'top' ? 'calc(100% + 6px)' : 'auto',
                        top: position === 'bottom' ? 'calc(100% + 6px)' : 'auto',
                        right: '50%',
                        transform: 'translateX(50%)',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '5px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 99999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                >
                    {text}
                    <span
                        style={{
                            position: 'absolute',
                            top: position === 'top' ? '100%' : 'auto',
                            bottom: position === 'bottom' ? '100%' : 'auto',
                            right: '50%',
                            transform: 'translateX(50%)',
                            borderWidth: '4px',
                            borderStyle: 'solid',
                            borderColor: position === 'top'
                                ? '#0f172a transparent transparent transparent'
                                : 'transparent transparent #0f172a transparent',
                        }}
                    />
                </span>
            )}
        </span>
    );
}

const emptyForm = {
    ko_spip_category_id: '',
    ko_spip_type_id: '',
    ko_spip_unit_id: '',
    ko_brand_id: '',
    call_sign: '',
    identity_number: '',
    serial_number: '',
    model_unit: '',
    production_year: new Date().getFullYear().toString(),
};

export default function UnitIndex() {
    const { units, pagination, loading, search, setSearch, limit, setLimit, page, setPage, refresh, master } = useUnit();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Demob / Revoke Modal State
    const [revokeModal, setRevokeModal] = useState({ open: false, unit: null, note: '', submitting: false });

    // Detail Modal State (Opsi 2 Quick Detail)
    const [detailUnit, setDetailUnit] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const openDetail = (u) => {
        setDetailUnit(u);
        setLoadingDetail(true);
        axios.get(`/api/ko/units/${u.id}`)
            .then(res => {
                const fetched = res.data?.result;
                if (fetched) setDetailUnit(fetched);
            })
            .catch(() => {})
            .finally(() => setLoadingDetail(false));
    };

    const closeDetail = () => {
        setDetailUnit(null);
        setLoadingDetail(false);
    };

    // Cascading options derived from master data
    const availableTypes = useMemo(() => {
        if (!form.ko_spip_category_id) return [];
        return (master.types ?? []).filter(t => t.ko_spip_category_id === form.ko_spip_category_id);
    }, [master.types, form.ko_spip_category_id]);

    const availableBrands = useMemo(() => {
        if (!form.ko_spip_category_id) return [];
        return (master.brands ?? []).filter(b => b.ko_spip_category_id === form.ko_spip_category_id);
    }, [master.brands, form.ko_spip_category_id]);

    const availableSpipUnits = useMemo(() => {
        if (!form.ko_spip_type_id) return [];
        return (master.spipUnits ?? []).filter(u => u.ko_spip_type_id === form.ko_spip_type_id);
    }, [master.spipUnits, form.ko_spip_type_id]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setErrorMessage('');
        setShowModal(true);
    };

    const openEdit = (u) => {
        const catId = u.ko_spip_unit?.ko_spip_type?.ko_spip_category_id || '';
        const typeId = u.ko_spip_unit?.ko_spip_type_id || '';
        setEditing(u);
        setForm({
            ko_spip_category_id: catId,
            ko_spip_type_id: typeId,
            ko_spip_unit_id: u.ko_spip_unit_id ?? '',
            ko_brand_id: u.ko_brand_id ?? '',
            call_sign: u.call_sign ?? '',
            identity_number: u.identity_number ?? '',
            serial_number: u.serial_number ?? '',
            model_unit: u.model_unit ?? '',
            production_year: u.production_year ?? '',
        });
        setErrorMessage('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setForm(emptyForm);
        setErrorMessage('');
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setForm(prev => ({
            ...prev,
            ko_spip_category_id: catId,
            ko_spip_type_id: '',
            ko_spip_unit_id: '',
            ko_brand_id: '',
        }));
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setForm(prev => ({
            ...prev,
            ko_spip_type_id: typeId,
            ko_spip_unit_id: '',
        }));
    };

    const handleSave = () => {
        setSaving(true);
        setErrorMessage('');
        const payload = {
            ko_spip_unit_id: form.ko_spip_unit_id || null,
            ko_brand_id: form.ko_brand_id || null,
            call_sign: form.call_sign,
            identity_number: form.identity_number || null,
            serial_number: form.serial_number,
            model_unit: form.model_unit || null,
            production_year: form.production_year ? parseInt(form.production_year, 10) : null,
        };

        const req = editing
            ? axios.put(`/api/ko/units/${editing.id}`, payload)
            : axios.post('/api/ko/units', payload);

        req.then(() => {
            closeModal();
            refresh();
        }).catch(err => {
            const msg = err.response?.data?.message || err.response?.data?.meta?.message || 'Gagal menyimpan data unit.';
            setErrorMessage(msg);
        }).finally(() => {
            setSaving(false);
        });
    };

    const handleDelete = (u) => {
        if (!confirm(`Hapus unit ${u.call_sign}?`)) return;
        axios.delete(`/api/ko/units/${u.id}`).then(() => refresh());
    };

    const openRevokeModal = (u) => {
        setRevokeModal({ open: true, unit: u, note: '', submitting: false });
    };

    const handleConfirmRevoke = () => {
        if (!revokeModal.unit) return;
        setRevokeModal(prev => ({ ...prev, submitting: true }));
        axios.post(`/api/ko/units/${revokeModal.unit.id}/request-revoke`, {
            revoke_request_note: revokeModal.note,
        }).then(() => {
            setRevokeModal({ open: false, unit: null, note: '', submitting: false });
            refresh();
        }).catch(() => {
            setRevokeModal(prev => ({ ...prev, submitting: false }));
        });
    };

    const renderStatusBadge = (u) => {
        if (u.is_revoked) {
            return (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    Demobilized
                </span>
            );
        }
        if (u.revoke_requested_date) {
            return (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                    Request Demob
                </span>
            );
        }
        return (
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
                Active
            </span>
        );
    };

    return (
        <KoLayout>
            <Head title="Unit KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Truck size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Unit</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Master Unit Operasi & Demobilisasi (Revoke)</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari call sign, identitas, brand, unit..."
                        style={{ width: '320px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <ActionTooltip text="Segarkan Data">
                        <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <RefreshCw size={14} />
                        </button>
                    </ActionTooltip>
                    <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                        <Plus size={14} /> Tambah Unit
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={thStyle}>Call Sign</TableHead>
                            <TableHead style={thStyle}>Description Unit</TableHead>
                            <TableHead style={thStyle}>Identity Number</TableHead>
                            <TableHead style={thStyle}>Brand</TableHead>
                            <TableHead style={thStyle}>Serial Number</TableHead>
                            <TableHead style={thStyle}>Model Unit</TableHead>
                            <TableHead style={thStyle}>Production Year</TableHead>
                            <TableHead style={thStyle}>Total Komisioning</TableHead>
                            <TableHead style={thStyle}>Status</TableHead>
                            <TableHead style={{ ...thStyle, textAlign: 'right' }}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !units.length ? (
                            <TableRow><TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada unit.</TableCell></TableRow>
                        ) : (
                            units.map(u => (
                                <TableRow key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <TableCell style={tdStyle}>
                                        <ActionTooltip text="Lihat Rincian Unit">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(u)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: 0,
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                    color: '#16a34a',
                                                    fontSize: '12px',
                                                    textDecoration: 'underline',
                                                    textUnderlineOffset: '2px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {u.call_sign}
                                            </button>
                                        </ActionTooltip>
                                    </TableCell>
                                    <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{u.ko_spip_unit?.name ?? '—'}</TableCell>
                                    <TableCell style={tdStyle}>{u.identity_number ?? '—'}</TableCell>
                                    <TableCell style={tdStyle}>{u.ko_brand?.name ?? '—'}</TableCell>
                                    <TableCell style={tdStyle}>{u.serial_number}</TableCell>
                                    <TableCell style={tdStyle}>{u.model_unit ?? '—'}</TableCell>
                                    <TableCell style={tdStyle}>{u.production_year}</TableCell>
                                    <TableCell style={tdStyle}>{u.commissioning_count ?? 0}</TableCell>
                                    <TableCell style={tdStyle}>{renderStatusBadge(u)}</TableCell>
                                    <TableCell style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <ActionTooltip text="Edit Unit">
                                                <button onClick={() => openEdit(u)} style={{ ...actionBtn, color: 'var(--primary)' }}>
                                                    <Pencil size={14} />
                                                </button>
                                            </ActionTooltip>
                                            {!u.is_revoked && !u.revoke_requested_date && (
                                                <ActionTooltip text="Request Demob (Demobilisasi)">
                                                    <button onClick={() => openRevokeModal(u)} style={{ ...actionBtn, color: '#d97706' }}>
                                                        <LogOut size={14} />
                                                    </button>
                                                </ActionTooltip>
                                            )}
                                            <ActionTooltip text="Hapus Unit">
                                                <button onClick={() => handleDelete(u)} style={{ ...actionBtn, color: 'var(--danger, #ef4444)' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </ActionTooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            {/* Modal Tambah / Edit Unit dengan Cascading Dropdown Hierarkis */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{editing ? 'Edit Unit' : 'Tambah Unit'}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto' }}>
                            {errorMessage && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '12px' }}>
                                    <AlertTriangle size={14} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Row 1: Cascading Kategori SPIP & Klasifikasi SPIP */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>Kategori SPIP *</label>
                                    <select value={form.ko_spip_category_id} onChange={handleCategoryChange} style={selectSm}>
                                        <option value="">-- Pilih Kategori SPIP --</option>
                                        {(master.categories ?? []).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelSm}>Klasifikasi SPIP *</label>
                                    <select value={form.ko_spip_type_id} onChange={handleTypeChange} disabled={!form.ko_spip_category_id} style={{ ...selectSm, opacity: !form.ko_spip_category_id ? 0.6 : 1, cursor: !form.ko_spip_category_id ? 'not-allowed' : 'default' }}>
                                        <option value="">-- Pilih Klasifikasi SPIP --</option>
                                        {availableTypes.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Deskripsi SPIP & Merk / Brand SPIP */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>Deskripsi SPIP (Unit SPIP) *</label>
                                    <select value={form.ko_spip_unit_id} onChange={e => setForm(f => ({ ...f, ko_spip_unit_id: e.target.value }))} disabled={!form.ko_spip_type_id} style={{ ...selectSm, opacity: !form.ko_spip_type_id ? 0.6 : 1, cursor: !form.ko_spip_type_id ? 'not-allowed' : 'default' }}>
                                        <option value="">-- Pilih Unit SPIP --</option>
                                        {availableSpipUnits.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelSm}>Merk / Brand SPIP *</label>
                                    <select value={form.ko_brand_id} onChange={e => setForm(f => ({ ...f, ko_brand_id: e.target.value }))} disabled={!form.ko_spip_category_id} style={{ ...selectSm, opacity: !form.ko_spip_category_id ? 0.6 : 1, cursor: !form.ko_spip_category_id ? 'not-allowed' : 'default' }}>
                                        <option value="">-- Pilih Brand SPIP --</option>
                                        {availableBrands.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Call Sign & Nomor STNK/IMB */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>Call Sign *</label>
                                    <input value={form.call_sign} onChange={e => setForm(f => ({ ...f, call_sign: e.target.value }))} placeholder="Contoh: LV-01" style={inputSm} />
                                </div>
                                <div>
                                    <label style={labelSm}>Nomor STNK / IMB</label>
                                    <input value={form.identity_number} onChange={e => setForm(f => ({ ...f, identity_number: e.target.value }))} placeholder="Nomor STNK/IMB" style={inputSm} />
                                </div>
                            </div>

                            {/* Row 4: Nomor Serial SPIP & Model Unit */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelSm}>Nomor Serial SPIP *</label>
                                    <input value={form.serial_number} onChange={e => setForm(f => ({ ...f, serial_number: e.target.value }))} placeholder="Nomor Serial" style={inputSm} />
                                </div>
                                <div>
                                    <label style={labelSm}>Model Unit</label>
                                    <input value={form.model_unit} onChange={e => setForm(f => ({ ...f, model_unit: e.target.value }))} placeholder="Model Unit" style={inputSm} />
                                </div>
                            </div>

                            {/* Row 5: Tahun Pembuatan Unit SPIP */}
                            <div>
                                <label style={labelSm}>Tahun Pembuatan Unit SPIP *</label>
                                <input
                                    type="number"
                                    min="1900"
                                    max="2099"
                                    step="1"
                                    value={form.production_year}
                                    onChange={e => setForm(f => ({ ...f, production_year: e.target.value }))}
                                    placeholder="Tahun Pembuatan"
                                    style={inputSm}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button onClick={closeModal} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button
                                disabled={saving || !form.call_sign.trim() || !form.serial_number.trim()}
                                onClick={handleSave}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Request Demob (Demobilisasi) Parity Legacy */}
            {revokeModal.open && (
                <div style={modalOverlay}>
                    <div style={{ ...modalBox, maxWidth: '480px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Request Demob</h3>
                            <button onClick={() => setRevokeModal({ open: false, unit: null, note: '', submitting: false })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                Ajukan permohonan demobilisasi untuk unit <strong style={{ color: 'var(--text-primary)' }}>{revokeModal.unit?.call_sign}</strong> ({revokeModal.unit?.ko_spip_unit?.name || 'Unit SPIP'}).
                            </p>
                            <div>
                                <label style={labelSm}>Catatan / Alasan Demobilisasi</label>
                                <textarea
                                    value={revokeModal.note}
                                    onChange={e => setRevokeModal(prev => ({ ...prev, note: e.target.value }))}
                                    placeholder="Tuliskan alasan atau keterangan demobilisasi..."
                                    rows={3}
                                    style={{ ...inputSm, resize: 'vertical' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setRevokeModal({ open: false, unit: null, note: '', submitting: false })}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}
                            >
                                Batal
                            </button>
                            <button
                                disabled={revokeModal.submitting}
                                onClick={handleConfirmRevoke}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: '#16a34a', color: '#fff', cursor: revokeModal.submitting ? 'not-allowed' : 'pointer', opacity: revokeModal.submitting ? 0.7 : 1 }}
                            >
                                {revokeModal.submitting ? 'Mengirim...' : 'Submit Demob'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Quick Detail Unit (Opsi 2) */}
            {detailUnit && (
                <div style={modalOverlay}>
                    <div style={{ ...modalBox, maxWidth: '640px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                                        {detailUnit.call_sign}
                                    </h3>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {detailUnit.ko_spip_unit?.name || 'Unit Sarana Operasi'}
                                    </span>
                                </div>
                                <div style={{ marginLeft: '8px' }}>
                                    {renderStatusBadge(detailUnit)}
                                </div>
                            </div>
                            <button onClick={closeDetail} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '72vh', overflowY: 'auto' }}>
                            {loadingDetail && (
                                <div style={{ padding: '8px', textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    Memperbarui rincian data unit...
                                </div>
                            )}

                            {/* Section 1: Spesifikasi Unit */}
                            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                                    Spesifikasi Sarana
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: '12px' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Call Sign</span>
                                        <span style={{ fontWeight: 700, color: '#16a34a' }}>{detailUnit.call_sign}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Nomor STNK / IMB</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailUnit.identity_number || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Merk / Brand SPIP</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailUnit.ko_brand?.name || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Nomor Serial SPIP</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailUnit.serial_number || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Model Unit</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailUnit.model_unit || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Tahun Pembuatan</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{detailUnit.production_year || '—'}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Total Komisioning</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{detailUnit.commissioning_count ?? 0} kali</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Hierarki SPIP */}
                            <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                                    Hierarki SPIP
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 14px', fontSize: '12px' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Kategori SPIP</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {detailUnit.ko_spip_unit?.ko_spip_type?.ko_spip_category?.name || '—'}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Klasifikasi SPIP</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {detailUnit.ko_spip_unit?.ko_spip_type?.name || '—'}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Deskripsi SPIP</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {detailUnit.ko_spip_unit?.name || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Informasi Demobilisasi jika ada */}
                            {(detailUnit.is_revoked || detailUnit.revoke_requested_date) && (
                                <div style={{ backgroundColor: detailUnit.is_revoked ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)', border: `1px solid ${detailUnit.is_revoked ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: '10px', padding: '14px 16px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: detailUnit.is_revoked ? '#ef4444' : '#d97706', textTransform: 'uppercase', marginBottom: '10px' }}>
                                        Informasi Demobilisasi (Revoke)
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '12px' }}>
                                        <div>
                                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Status Revoke</span>
                                            <span style={{ fontWeight: 700, color: detailUnit.is_revoked ? '#ef4444' : '#d97706' }}>
                                                {detailUnit.is_revoked ? 'Demobilized (Revoked)' : (detailUnit.revoke_status || 'Under Verification')}
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Tanggal Pengajuan</span>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {detailUnit.revoke_requested_date ? new Date(detailUnit.revoke_requested_date).toLocaleDateString('id-ID') : '—'}
                                            </span>
                                        </div>
                                        {detailUnit.revoked_date && (
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Tanggal Demob Resmi</span>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {new Date(detailUnit.revoked_date).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10.5px' }}>Catatan / Alasan</span>
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                                {detailUnit.revoke_request_note || '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section 4: Riwayat Proposal / Komisioning */}
                            <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                        Riwayat Proposal / Komisioning ({detailUnit.ko_proposals?.length || 0})
                                    </div>
                                </div>
                                {(!detailUnit.ko_proposals || detailUnit.ko_proposals.length === 0) ? (
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                        Belum ada riwayat pengajuan komisioning untuk unit ini.
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {detailUnit.ko_proposals.map(p => (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '12px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.number}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                                        Area: {p.area || '—'} • Diajukan: {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '—'}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                                                        {p.status}
                                                    </span>
                                                    <a
                                                        href={`/ko/proposals/${p.id}`}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}
                                                        title="Buka Detail Proposal"
                                                    >
                                                        Lihat <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                onClick={closeDetail}
                                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff' }}
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    const u = detailUnit;
                                    closeDetail();
                                    openEdit(u);
                                }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: 'pointer' }}
                            >
                                <Pencil size={13} /> Edit Unit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </KoLayout>
    );
}
