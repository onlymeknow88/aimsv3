import React, { useState, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import axios from 'axios';
import ConfirmationModal from '@/Components/ConfirmationModal';
import FileDropzone from '@/Components/FileDropzone';
import { Save, ArrowLeft, Upload, X, FileText } from 'lucide-react';

const sectionStyle = { backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle   = { fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' };
const inputStyle   = { width: '100%', padding: '10px 14px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const rowStyle     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function BiddingEdit() {
    const { id } = usePage().props;
    const [form, setForm]           = useState(null);
    const [checklists, setChecklists] = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [masterData, setMasterData] = useState({ service_criterias: [], classifications: [], companies: [], business_entities: [] });
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]       = useState(true);

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
                    company_name: b.company_name ?? '', address: b.address ?? '',
                    company_site: b.company_site ?? '', license_number: b.license_number ?? '',
                    service_criteria: b.service_criteria ?? '', classification: b.classification ?? '',
                    person_in_charge: b.person_in_charge ?? '', date: b.date ?? '',
                    business_entity_id: b.business_entity_id ?? '',
                    ccow_id: b.ccow_id ?? '', parent_id: b.parent_id ?? '',
                    company_id: b.company_id ?? '',
                });
                setChecklists(detail?.checklists ?? []);
            }
            setMasterData(master ?? {});
        }).finally(() => setLoading(false));
    }, [id]);

    const set = (field, val) => setForm(f => {
        const updated = { ...f, [field]: val };
        if (field === 'service_criteria' && val !== 'SUBCONTRACTOR') {
            updated.parent_id = '';
            updated.company_id = '';
        }
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
        const fd = new FormData();
        fd.append('_method', 'PUT');

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

        axios.post(`/api/csms/biddings/${id}`, fd)
        .then(() => {
            window.location.href = `/csms/bidding/detail/${id}`;
        })
        .catch(err => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        })
        .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    if (loading || !form) return <CSMSLayout><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</div></CSMSLayout>;

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
        <CSMSLayout>
            <Head title={`Edit Bidding: ${form.company_name}`} />
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a href={`/csms/bidding/detail/${id}`} style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} />
                    </a>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Edit Bidding</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Perbarui data bidding (hanya status Draft)</p>
                    </div>
                </div>

                {/* Info Perusahaan */}
                <div style={sectionStyle}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 }}>Informasi Perusahaan</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>CCOW *</label>
                                <select value={form.ccow_id} onChange={e => set('ccow_id', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih CCOW --</option>
                                    {ccows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Jenis Badan Usaha *</label>
                                <select value={form.business_entity_id} onChange={e => set('business_entity_id', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih Jenis --</option>
                                    {businessEntities.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Nama Perusahaan *</label>
                                <input value={form.company_name} onChange={e => set('company_name', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>No. Lisensi *</label>
                                <input value={form.license_number} onChange={e => set('license_number', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Alamat *</label>
                            <input value={form.address} onChange={e => set('address', e.target.value)} style={inputStyle} />
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Site / Lokasi Kerja *</label>
                                <input value={form.company_site} onChange={e => set('company_site', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>PIC</label>
                                <input value={form.person_in_charge} onChange={e => set('person_in_charge', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Kriteria Jasa Perusahaan *</label>
                                <select value={form.service_criteria} onChange={e => set('service_criteria', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih --</option>
                                    {(masterData.service_criterias ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Tanggal</label>
                                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} />
                            </div>
                            {form.service_criteria === 'SUBCONTRACTOR' && (
                                <div>
                                    <label style={labelStyle}>Perusahaan Induk *</label>
                                    <select value={form.parent_id} onChange={e => set('parent_id', e.target.value)} style={inputStyle}>
                                        <option value="">-- Pilih Perusahaan Induk --</option>
                                        {parentCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Checklist */}
                {checklists.length > 0 && (
                    <div style={sectionStyle}>
                        <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 }}>Checklist Audit ({checklists.length} butir)</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {subPoint && <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>{subPoint}</h5>}
                                    {items.map((cl, i) => (
                                        <div key={cl.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>{i + 1}. {cl.crtiteria}</p>
                                            {cl.legal_base && <p style={{ fontSize: '11px', color: '#1d4ed8', margin: '0 0 4px' }}><strong>Dasar Hukum:</strong> {cl.legal_base}</p>}
                                            {cl.note && <p style={{ fontSize: '11px', color: '#810da8', margin: '0 0 4px' }}><strong>Panduan:</strong> {cl.note}</p>}
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                                                <label style={{ ...labelStyle, fontSize: '11px', marginBottom: '8px' }}>Upload Dokumen Bukti</label>
                                                <FileDropzone onFileDrop={(files) => handleFileDrop(cl.id, files)} accept=".pdf,.png,.jpeg,.jpg" />
                                                
                                                {/* Newly selected files */}
                                                {(checklistFiles[cl.id] || []).length > 0 && (
                                                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        {(checklistFiles[cl.id] || []).map((file, fIdx) => (
                                                            <div key={fIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '10px' }}>
                                                                <span style={{ color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Upload size={10} /> {file.name}</span>
                                                                <button onClick={() => removeChecklistFile(cl.id, fIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={12} style={{ color: '#ef4444' }} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Already uploaded files */}
                                                {(cl.attachments || []).length > 0 && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Dokumen Terupload:</span>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {cl.attachments.map(att => (
                                                                <a key={att.id} href={att.blob_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '11px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/csms/bidding/detail/${id}`} style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                    <button onClick={() => setShowConfirm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Save size={14} /> Simpan Perubahan
                    </button>
                </div>
            </div>

            <ConfirmationModal isOpen={showConfirm} type="draft" loading={saving} confirmText="Simpan" onConfirm={handleSubmit} onCancel={() => setShowConfirm(false)} />
        </CSMSLayout>
    );
}