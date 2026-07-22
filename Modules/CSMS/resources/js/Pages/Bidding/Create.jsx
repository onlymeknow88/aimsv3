import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, HardHat, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import FileDropzone from '@/Components/FileDropzone';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    title: { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function BiddingCreate() {
    const [form, setForm] = useState({
        company_name: '', address: '', company_site: '',
        license_number: '', service_criteria: '', classification: '',
        person_in_charge: '', date: '', business_entity_id: '',
        ccow_id: '', parent_id: '', company_id: '',
    });
    const [masterData, setMasterData] = useState({ service_criterias: [], classifications: [], companies: [], business_entities: [] });
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [checklists, setChecklists]         = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [masterLoading, setMasterLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/csms/master-data')
            .then(res => {
                const data = res.data?.result ?? {};
                setMasterData(data);
                if (data.master_checklists) {
                    const filtered = (data.master_checklists ?? []).filter(mc => mc.criteria === 'Bidding');
                    setChecklists(filtered.map(mc => ({
                        id: mc.id,
                        crtiteria: mc.crtiteria,
                        sub_point: mc.sub_point,
                        point: mc.point,
                        legal_base: mc.legal_base,
                        note: mc.note,
                        value: '',
                        comment: ''
                    })));
                }
            })
            .finally(() => setMasterLoading(false));
    }, []);

    const set = (field, val) => setForm(f => {
        const updated = { ...f, [field]: val };
        // If service criteria changes from SUBCONTRACTOR, clear parent_id/company_id
        if (field === 'service_criteria' && val !== 'SUBCONTRACTOR') {
            updated.parent_id = '';
            updated.company_id = '';
        }
        // Sync company_id with parent_id for subcontractor parent reference
        if (field === 'parent_id') {
            updated.company_id = val;
        }
        return updated;
    });

    const setChecklist = (clId, field, val) => setChecklists(prev =>
        prev.map(c => c.id === clId ? { ...c, [field]: val } : c)
    );

    const handleFileDrop = (clId, files) => {
        setChecklistFiles(prev => ({
            ...prev,
            [clId]: [...(prev[clId] || []), ...files]
        }));
    };

    const removeChecklistFile = (clId, fileIdx) => {
        setChecklistFiles(prev => ({
            ...prev,
            [clId]: (prev[clId] || []).filter((_, i) => i !== fileIdx)
        }));
    };

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });

        checklists.forEach((cl, idx) => {
            fd.append(`checklists[${idx}][id]`, cl.id);
            fd.append(`checklists[${idx}][value]`, cl.value || '');
            fd.append(`checklists[${idx}][comment]`, cl.comment || '');
            
            const files = checklistFiles[cl.id] || [];
            files.forEach(file => {
                fd.append(`checklists[${idx}][new_files][]`, file);
            });
        });

        axios.post('/api/csms/biddings', fd)
        .then(res => {
            const data = res.data?.result;
            if (data?.id) {
                window.location.href = `/csms/bidding/detail/${data.id}`;
            }
        })
        .catch(err => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        })
        .finally(() => setSaving(false));
    };

    if (masterLoading) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Head title="Tambah Bidding CSMS" />
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Memuat data master...
            </div>
        );
    }

    const ccows = (masterData.companies ?? []).filter(c => c.type === 'Internal');
    const parentCompanies = (masterData.companies ?? []).filter(c => c.type !== 'Internal');
    const businessEntities = masterData.business_entities ?? [];

    const groupedChecklists = checklists.reduce((groups, item) => {
        const groupName = item.sub_point || '';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(item);
        return groups;
    }, {});

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title="Tambah Bidding CSMS" />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href="/csms/bidding/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Bidding
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HardHat size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Tambah Bidding Baru</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Isi data perusahaan kontraktor untuk pendaftaran CSMS</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))' }}>

                {/* Section: Info Perusahaan */}
                <div style={{ marginBottom: '32px' }}>
                    <h4 style={S.title}>Informasi Perusahaan</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={row2}>
                            <div>
                                <label style={S.label}>CCOW <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={form.ccow_id} onChange={e => set('ccow_id', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.ccow_id ? '#ef4444' : 'var(--border-color)' }}>
                                    <option value="">-- Pilih CCOW --</option>
                                    {ccows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.ccow_id && <span style={S.error}>{errors.ccow_id[0]}</span>}
                            </div>
                            <div>
                                <label style={S.label}>Jenis Badan Usaha <span style={{ color: '#ef4444' }}>*</span></label>
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
                                <label style={S.label}>Nama Perusahaan <span style={{ color: '#ef4444' }}>*</span> (Sesuai Akta)</label>
                                <input value={form.company_name} onChange={e => set('company_name', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.company_name ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="PT. Nama Kontraktor" />
                                {errors.company_name && <span style={S.error}>{errors.company_name[0]}</span>}
                            </div>
                            <div>
                                <label style={S.label}>Nomor Ijin / Lisensi <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={form.license_number} onChange={e => set('license_number', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.license_number ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="SIUP-XXXX" />
                                {errors.license_number && <span style={S.error}>{errors.license_number[0]}</span>}
                            </div>
                        </div>
                        <div>
                            <label style={S.label}>Alamat <span style={{ color: '#ef4444' }}>*</span></label>
                            <input value={form.address} onChange={e => set('address', e.target.value)}
                                style={{ ...S.input, borderColor: errors.address ? '#ef4444' : 'var(--border-color)' }}
                                placeholder="Alamat lengkap perusahaan" />
                            {errors.address && <span style={S.error}>{errors.address[0]}</span>}
                        </div>
                        <div style={row2}>
                            <div>
                                <label style={S.label}>Site / Lokasi Kerja <span style={{ color: '#ef4444' }}>*</span></label>
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

                {/* Section: Kriteria */}
                <div style={{ marginBottom: '32px' }}>
                    <h4 style={S.title}>Kriteria & Klasifikasi</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={row2}>
                            <div>
                                <label style={S.label}>Kriteria Jasa Perusahaan <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={form.service_criteria} onChange={e => set('service_criteria', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.service_criteria ? '#ef4444' : 'var(--border-color)' }}>
                                    <option value="">-- Pilih Kriteria --</option>
                                    {(masterData.service_criterias ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.service_criteria && <span style={S.error}>{errors.service_criteria[0]}</span>}
                            </div>
                        </div>
                        <div style={row2}>
                            <div>
                                <label style={S.label}>Tanggal</label>
                                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={S.input} />
                            </div>
                            {form.service_criteria === 'SUBCONTRACTOR' && (
                                <div>
                                    <label style={S.label}>Perusahaan Induk <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select value={form.parent_id} onChange={e => set('parent_id', e.target.value)} style={S.input}>
                                        <option value="">-- Pilih Perusahaan Induk --</option>
                                        {parentCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section: Checklist CSMS */}
                {checklists.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Checklist Audit CSMS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {subPoint && <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>{subPoint}</h5>}
                                    {items.map((cl, i) => (
                                        <div key={cl.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>{i + 1}. {cl.crtiteria}</p>
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

                                            {/* Upload attachment for this checklist item */}
                                            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                                                <label style={{ ...S.label, fontSize: '11px', marginBottom: '8px' }}>Upload Dokumen Bukti</label>
                                                <FileDropzone onFileDrop={(files) => handleFileDrop(cl.id, files)} accept=".pdf,.png,.jpeg,.jpg" />
                                                
                                                {/* Newly selected files */}
                                                {(checklistFiles[cl.id] || []).length > 0 && (
                                                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        {(checklistFiles[cl.id] || []).map((file, fileIdx) => (
                                                            <div key={fileIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '6px 10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>{file.name}</span>
                                                                <button type="button" onClick={() => removeChecklistFile(cl.id, fileIdx)}
                                                                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        ))}
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
                    <a href="/csms/bidding/lists" style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                    <button onClick={handleSubmit} disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                        {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                        {saving ? 'Menyimpan...' : 'Simpan Bidding'}
                    </button>
                </div>

            </div>
            </div>
        </div>
    );
}