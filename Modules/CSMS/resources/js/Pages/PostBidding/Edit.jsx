import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ClipboardCheck, Save, Loader2, FileText, Upload, X } from 'lucide-react';
import axios from 'axios';
import FileDropzone from '@/Components/FileDropzone';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    inputReadOnly: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b', boxSizing: 'border-box' },
    title: { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

export default function PostBiddingEdit({ id }) {
    const [form, setForm] = useState(null);
    const [checklists, setChecklists] = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [questionnaireFile, setQuestionnaireFile] = useState(null);
    const [classifications, setClassifications] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        Promise.all([
            axios.get(`/api/csms/biddings/${id}`),
            axios.get('/api/csms/master-data')
        ])
        .then(([biddingRes, masterRes]) => {
            const data = biddingRes.data?.result ?? {};
            setClassifications(masterRes.data?.result?.classifications ?? []);
            const bid = data.bidding ?? {};
            
            let parsedQuest = {
                    company_nickname: '',
                    scope_of_business: '',
                    date_contract_period_start: '',
                    date_contract_period_end: '',
                    number_of_workers: '0',
                    number_of_spv_pop: '0',
                    number_of_spv_pom: '0',
                    number_of_spv_pou: '0',
                    number_of_spv_imp_smkp: '0',
                    number_of_spv_auditor_smkp: '0',
                    equipped_name: '',
                    equipped_position: '',
                    equipped_telephone: '',
                    equipped_email: '',
                };

                if (bid.questionnaire) {
                    try {
                        const parsed = typeof bid.questionnaire === 'string' ? JSON.parse(bid.questionnaire) : bid.questionnaire;
                        parsedQuest = { ...parsedQuest, ...parsed };
                    } catch (e) {}
                }

                setForm({
                    company_name: bid.company_name ?? '',
                    address: bid.address ?? '',
                    company_site: bid.company_site ?? '',
                    license_number: bid.license_number ?? '',
                    service_criteria: bid.service_criteria ?? '',
                    classification: bid.classification ?? '',
                    ccow_id: bid.ccow_id ?? '',
                    business_entity_id: bid.business_entity_id ?? 1,
                    company_id: bid.company_id ?? '',
                    parent_id: bid.parent_id ?? '',
                    person_in_charge: bid.person_in_charge ?? '',
                    risk_category: bid.risk_category ?? 'Tinggi',
                    questionnaire: parsedQuest
                });

                setChecklists(data.checklists ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const handleQuestionnaireChange = (field, val) => {
        setForm(prev => ({
            ...prev,
            questionnaire: {
                ...prev.questionnaire,
                [field]: val
            }
        }));
    };

    const handleRiskChange = (e) => {
        const risk = e.target.value;
        setForm(prev => ({ ...prev, risk_category: risk }));
    };

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
        fd.append('_method', 'PUT');
        fd.append('company_name', form.company_name);
        fd.append('address', form.address);
        fd.append('company_site', form.company_site);
        fd.append('license_number', form.license_number);
        fd.append('service_criteria', form.service_criteria);
        fd.append('classification', form.classification);
        fd.append('business_entity_id', form.business_entity_id);
        fd.append('risk_category', form.risk_category);
        
        if (form.ccow_id) fd.append('ccow_id', form.ccow_id);
        if (form.company_id) fd.append('company_id', form.company_id);
        if (form.parent_id) fd.append('parent_id', form.parent_id);
        if (form.person_in_charge) fd.append('person_in_charge', form.person_in_charge);
        if (questionnaireFile) fd.append('questionnaire_file', questionnaireFile);
        
        fd.append('questionnaire', JSON.stringify(form.questionnaire));

        // Append checklists and files
        checklists.forEach((cl, i) => {
            fd.append(`checklists[${i}][id]`, cl.id);
            fd.append(`checklists[${i}][value]`, cl.value || '');
            fd.append(`checklists[${i}][comment]`, cl.comment || '');
            
            const files = checklistFiles[cl.id] || [];
            files.forEach(f => {
                fd.append(`checklists[${i}][new_files][]`, f);
            });
        });

        axios.post(`/api/csms/biddings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                window.location.href = `/csms/post-bidding/detail/${id}`;
            })
            .catch(err => {
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                }
            })
            .finally(() => {
                setSaving(false);
            });
    };

    const groupedChecklists = checklists.reduce((groups, item) => {
        const groupName = item.sub_point || '';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(item);
        return groups;
    }, {});

    if (loading || !form) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Head title="Edit Post Bidding" />
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Memuat data Post Bidding...
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Edit Post Bidding: ${form.company_name}`} />
            
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href={`/csms/post-bidding/detail/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Detail
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ClipboardCheck size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Edit Post Bidding</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Perbarui kuesioner & berkas bukti kualifikasi</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))' }}>
                    
                    {/* Section 1: Company Details */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Detail Perusahaan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Perusahaan</label>
                                    <input value={form.company_name} readOnly style={S.inputReadOnly} />
                                </div>
                                <div>
                                    <label style={S.label}>No. Lisensi</label>
                                    <input value={form.license_number} readOnly style={S.inputReadOnly} />
                                </div>
                            </div>
                            <div>
                                <label style={S.label}>Alamat Perusahaan</label>
                                <input value={form.address} readOnly style={S.inputReadOnly} />
                            </div>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Site Perusahaan</label>
                                    <input value={form.company_site} readOnly style={S.inputReadOnly} />
                                </div>
                                <div>
                                    <label style={S.label}>Kriteria Jasa</label>
                                    <input value={form.service_criteria} readOnly style={S.inputReadOnly} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Questionnaire Details */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Kuesioner Detail Kualifikasi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Singkatan Perusahaan (Nickname)</label>
                                    <input value={form.questionnaire.company_nickname} onChange={e => handleQuestionnaireChange('company_nickname', e.target.value)} placeholder="Contoh: PT SIS" style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Lingkup Usaha</label>
                                    <input value={form.questionnaire.scope_of_business} onChange={e => handleQuestionnaireChange('scope_of_business', e.target.value)} placeholder="Contoh: Coal Hauling" style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Mulai Kontrak</label>
                                    <input type="date" value={form.questionnaire.date_contract_period_start} onChange={e => handleQuestionnaireChange('date_contract_period_start', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Selesai Kontrak</label>
                                    <input type="date" value={form.questionnaire.date_contract_period_end} onChange={e => handleQuestionnaireChange('date_contract_period_end', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row3}>
                                <div>
                                    <label style={S.label}>Jumlah Pekerja</label>
                                    <input type="number" value={form.questionnaire.number_of_workers} onChange={e => handleQuestionnaireChange('number_of_workers', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Kategori Risiko</label>
                                    <select value={form.risk_category} onChange={handleRiskChange} style={S.input}>
                                        <option value="Rendah">Rendah</option>
                                        <option value="Menengah">Menengah</option>
                                        <option value="Tinggi">Tinggi</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={S.label}>Klasifikasi</label>
                                    <select value={form.classification} onChange={e => setForm(prev => ({ ...prev, classification: e.target.value }))} style={S.input}>
                                        <option value="">-- Pilih Klasifikasi --</option>
                                        {classifications.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={row3}>
                                <div>
                                    <label style={S.label}>Pengawas POP</label>
                                    <input type="number" value={form.questionnaire.number_of_spv_pop} onChange={e => handleQuestionnaireChange('number_of_spv_pop', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Pengawas POM</label>
                                    <input type="number" value={form.questionnaire.number_of_spv_pom} onChange={e => handleQuestionnaireChange('number_of_spv_pom', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Pengawas POU</label>
                                    <input type="number" value={form.questionnaire.number_of_spv_pou} onChange={e => handleQuestionnaireChange('number_of_spv_pou', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Implementator SMKP</label>
                                    <input type="number" value={form.questionnaire.number_of_spv_imp_smkp} onChange={e => handleQuestionnaireChange('number_of_spv_imp_smkp', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Auditor SMKP</label>
                                    <input type="number" value={form.questionnaire.number_of_spv_auditor_smkp} onChange={e => handleQuestionnaireChange('number_of_spv_auditor_smkp', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama PJO / Penanggung Jawab</label>
                                    <input value={form.questionnaire.equipped_name} onChange={e => handleQuestionnaireChange('equipped_name', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Jabatan PJO</label>
                                    <input value={form.questionnaire.equipped_position} onChange={e => handleQuestionnaireChange('equipped_position', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Telepon PJO</label>
                                    <input value={form.questionnaire.equipped_telephone} onChange={e => handleQuestionnaireChange('equipped_telephone', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Email PJO</label>
                                    <input type="email" value={form.questionnaire.equipped_email} onChange={e => handleQuestionnaireChange('equipped_email', e.target.value)} style={S.input} />
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
                                <label style={S.label}>File Scan Kuesioner CSMS</label>
                                <FileDropzone onFileDrop={(files) => setQuestionnaireFile(files[0])} accept=".pdf,.png,.jpeg,.jpg" />
                                {questionnaireFile && (
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{questionnaireFile.name}</span>
                                        <button type="button" onClick={() => setQuestionnaireFile(null)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
                                    </div>
                                )}
                                {form.questionnaire.questionnaire_file_url && !questionnaireFile && (
                                    <div style={{ marginTop: '8px' }}>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>File Terupload:</span>
                                        <a href={form.questionnaire.questionnaire_file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '11px' }}>
                                            <FileText size={12} /> {form.questionnaire.questionnaire_file_name || 'Lihat Dokumen'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Audit Checklist */}
                    {checklists.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={S.title}>Checklist Kualifikasi CSMS ({checklists.length} butir)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                    <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {subPoint && <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>{subPoint}</h5>}
                                        {items.map((cl, i) => (
                                            <div key={cl.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>{cl.ordinal_number ?? i + 1}. {cl.crtiteria}</p>
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

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <a href={`/csms/post-bidding/detail/${id}`} style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                        <button onClick={handleSubmit} disabled={saving}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                            {saving ? 'Menyimpan...' : 'Simpan Post Bidding'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
