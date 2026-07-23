import { ArrowLeft, HardHat, FileText, Loader2, Save, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import ConfirmationModal from '@/Components/ConfirmationModal';
import PageLoader from '@/Components/PageLoader';
import FileDropzone from '@/Components/FileDropzone';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    title: { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function BiddingEdit() {
    const { id } = usePage().props;
    const [form, setForm]               = useState(null);
    const [checklists, setChecklists]   = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [masterData, setMasterData]   = useState({ service_criterias: [], companies: [], business_entities: [] });
    const [errors, setErrors]           = useState({});
    const [saving, setSaving]           = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            axios.get(`/api/csms/biddings/${id}`),
            axios.get('/api/csms/master-data'),
        ]).then(([detailRes, masterRes]) => {
            const detail = detailRes.data?.result;
            const master = masterRes.data?.result;
            const b = detail?.bidding;
            if (b) {
                setForm({
                    company_name:       b.company_name       ?? '',
                    address:            b.address            ?? '',
                    company_site:       b.company_site       ?? '',
                    license_number:     b.license_number     ?? '',
                    service_criteria:   b.service_criteria   ?? '',
                    classification:     b.classification     ?? '',
                    person_in_charge:   b.person_in_charge   ?? '',
                    date:               b.date               ?? '',
                    business_entity_id: b.business_entity_id ?? '',
                    ccow_id:            b.ccow_id            ?? '',
                    parent_id:          b.parent_id          ?? '',
                    company_id:         b.company_id         ?? '',
                });
                setChecklists(detail?.checklists ?? []);
            }
            setMasterData(master ?? {});
        }).finally(() => setLoading(false));
    }, [id]);

    const set = (field, val) => setForm(f => {
        const updated = { ...f, [field]: val };
        if (field === 'service_criteria' && val !== 'SUBCONTRACTOR') {
            updated.parent_id  = '';
            updated.company_id = '';
        }
        if (field === 'parent_id') updated.company_id = val;
        return updated;
    });

    const setChecklist = (clId, field, val) =>
        setChecklists(prev => prev.map(c => c.id === clId ? { ...c, [field]: val } : c));

    const handleFileDrop = (clId, files) =>
        setChecklistFiles(prev => ({ ...prev, [clId]: [...(prev[clId] || []), ...files] }));

    const removeChecklistFile = (clId, fileIdx) =>
        setChecklistFiles(prev => ({
            ...prev,
            [clId]: (prev[clId] || []).filter((_, i) => i !== fileIdx),
        }));

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});
        const fd = new FormData();
        fd.append('_method', 'PUT');
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });
        checklists.forEach((cl, idx) => {
            fd.append(`checklists[${idx}][id]`,      cl.id);
            fd.append(`checklists[${idx}][value]`,   cl.value   || '');
            fd.append(`checklists[${idx}][comment]`, cl.comment || '');
            (checklistFiles[cl.id] || []).forEach(file => {
                fd.append(`checklists[${idx}][new_files][]`, file);
            });
        });
        axios.post(`/api/csms/biddings/${id}`, fd)
            .then(() => { window.location.href = `/csms/bidding/detail/${id}`; })
            .catch(err => { if (err.response?.data?.errors) setErrors(err.response.data.errors); })
            .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    if (loading || !form) {
        return (
            <>
                <Head title="Edit Bidding" />
                <PageLoader title="Memuat data Bidding..." />
            </>
        );
    }

    const ccows            = (masterData.companies ?? []).filter(c => c.type === 'Internal');
    const parentCompanies  = (masterData.companies ?? []).filter(c => c.type !== 'Internal');
    const businessEntities = masterData.business_entities ?? [];

    const groupedChecklists = checklists.reduce((groups, item) => {
        const g = item.sub_point || '';
        if (!groups[g]) groups[g] = [];
        groups[g].push(item);
        return groups;
    }, {});

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Edit Bidding: ${form.company_name}`} />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href={`/csms/bidding/detail/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Detail
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HardHat size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Edit Bidding</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Perbarui data bidding (hanya status Draft)</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))' }}>

                    {/* Section: Informasi Perusahaan */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Informasi Perusahaan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>CCOW *</label>
                                    <select value={form.ccow_id} onChange={e => set('ccow_id', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.ccow_id ? '#ef4444' : 'var(--border-color)' }}>
                                        <option value="">-- Pilih CCOW --</option>
                                        {ccows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.ccow_id && <span style={S.error}>{errors.ccow_id[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Jenis Badan Usaha *</label>
                                    <select value={form.business_entity_id} onChange={e => set('business_entity_id', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.business_entity_id ? '#ef4444' : 'var(--border-color)' }}>
                                        <option value="">-- Pilih Jenis --</option>
                                        {businessEntities.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                    {errors.business_entity_id && <span style={S.error}>{errors.business_entity_id[0]}</span>}
                                </div>
                            </div>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Perusahaan *</label>
                                    <input value={form.company_name} onChange={e => set('company_name', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.company_name ? '#ef4444' : 'var(--border-color)' }}
                                        placeholder="PT. Nama Kontraktor" />
                                    {errors.company_name && <span style={S.error}>{errors.company_name[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Nomor Ijin / Lisensi *</label>
                                    <input value={form.license_number} onChange={e => set('license_number', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.license_number ? '#ef4444' : 'var(--border-color)' }}
                                        placeholder="SIUP-XXXX" />
                                    {errors.license_number && <span style={S.error}>{errors.license_number[0]}</span>}
                                </div>
                            </div>
                            <div>
                                <label style={S.label}>Alamat *</label>
                                <input value={form.address} onChange={e => set('address', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.address ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="Alamat lengkap perusahaan" />
                                {errors.address && <span style={S.error}>{errors.address[0]}</span>}
                            </div>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Site / Lokasi Kerja *</label>
                                    <input value={form.company_site} onChange={e => set('company_site', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.company_site ? '#ef4444' : 'var(--border-color)' }}
                                        placeholder="Pit A, Workshop B, dll." />
                                    {errors.company_site && <span style={S.error}>{errors.company_site[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Penanggung Jawab</label>
                                    <input value={form.person_in_charge} onChange={e => set('person_in_charge', e.target.value)}
                                        style={S.input} placeholder="Nama PIC" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Kriteria & Klasifikasi */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Kriteria & Klasifikasi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Kriteria Jasa Perusahaan *</label>
                                    <select value={form.service_criteria} onChange={e => set('service_criteria', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.service_criteria ? '#ef4444' : 'var(--border-color)' }}>
                                        <option value="">-- Pilih Kriteria --</option>
                                        {(masterData.service_criterias ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.service_criteria && <span style={S.error}>{errors.service_criteria[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Tanggal</label>
                                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={S.input} />
                                </div>
                            </div>
                            {form.service_criteria === 'SUBCONTRACTOR' && (
                                <div style={row2}>
                                    <div>
                                        <label style={S.label}>Perusahaan Induk *</label>
                                        <select value={form.parent_id} onChange={e => set('parent_id', e.target.value)} style={S.input}>
                                            <option value="">-- Pilih Perusahaan Induk --</option>
                                            {parentCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section: Checklist CSMS */}
                    {checklists.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={S.title}>Checklist Audit CSMS ({checklists.length} butir)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                    <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {subPoint && (
                                            <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>
                                                {subPoint}
                                            </h5>
                                        )}
                                        {items.map((cl, i) => (
                                            <div key={cl.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                                                    {cl.ordinal_number ?? i + 1}. {cl.crtiteria}
                                                </p>
                                                {cl.legal_base && <p style={{ fontSize: '11px', color: '#1d4ed8', margin: '0 0 4px' }}><strong>Dasar Hukum:</strong> {cl.legal_base}</p>}
                                                {cl.note && <p style={{ fontSize: '11px', color: '#810da8', margin: '0 0 4px' }}><strong>Panduan:</strong> {cl.note}</p>}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                                    <select value={cl.value ?? ''} onChange={e => setChecklist(cl.id, 'value', e.target.value)}
                                                        style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', width: '100%' }}>
                                                        <option value="">-- Pilih Pemenuhan --</option>
                                                        <option value="Ya">Ya</option>
                                                        <option value="Tidak">Tidak</option>
                                                        <option value="N/A">N/A</option>
                                                    </select>
                                                    {cl.value === 'Tidak' && (
                                                        <textarea value={cl.comment ?? ''} onChange={e => setChecklist(cl.id, 'comment', e.target.value)}
                                                            placeholder="Tuliskan catatan/keterangan di sini..."
                                                            style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', width: '100%', minHeight: '60px', boxSizing: 'border-box' }} />
                                                    )}
                                                </div>

                                                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                                                    <label style={{ ...S.label, fontSize: '11px', marginBottom: '8px' }}>Upload Dokumen Bukti</label>
                                                    <FileDropzone onFileDrop={files => handleFileDrop(cl.id, files)} accept=".pdf,.png,.jpeg,.jpg" />

                                                    {(checklistFiles[cl.id] || []).length > 0 && (
                                                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {(checklistFiles[cl.id] || []).map((file, fIdx) => (
                                                                <div key={fIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                                    <span style={{ flex: 1, color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        <Upload size={10} /> {file.name}
                                                                    </span>
                                                                    <button type="button" onClick={() => removeChecklistFile(cl.id, fIdx)}
                                                                        style={{ flexShrink: 0, border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', lineHeight: '16px' }}>
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {(cl.attachments || []).length > 0 && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Dokumen Terupload:</span>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                {cl.attachments.map(att => (
                                                                    <a key={att.id} href={att.blob_url} target="_blank" rel="noopener noreferrer"
                                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '11px' }}>
                                                                        <FileText size={12} /> {att.name} ({att.size ?? 'Size N/A'})
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <a href={`/csms/bidding/detail/${id}`}
                            style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            Batal
                        </a>
                        <button onClick={() => setShowConfirm(true)} disabled={saving}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>

                    <ConfirmationModal
                        isOpen={showConfirm}
                        type="draft"
                        title="Simpan Perubahan?"
                        description="Pastikan semua data sudah benar sebelum disimpan."
                        confirmText="Simpan"
                        cancelText="Batal"
                        loading={saving}
                        onConfirm={handleSubmit}
                        onCancel={() => setShowConfirm(false)}
                    />
                </div>
            </div>
        </div>
    );
}
