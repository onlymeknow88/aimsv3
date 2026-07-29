import { ArrowLeft, Loader2, RotateCcw, Save } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import ConfirmationModal from '@/Components/ConfirmationModal';
import FileDropzone from '@/Components/FileDropzone';
import { Head, usePage } from '@inertiajs/react';
import PageLoader from '@/Components/PageLoader';
import axios from 'axios';

const S = {
    label:       { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input:       { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    inputRO:     { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b', boxSizing: 'border-box' },
    title:       { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error:       { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

export default function RenewalCreate() {
    const { id } = usePage().props;

    const [renewal, setRenewal]             = useState(null);
    const [checklists, setChecklists]       = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [questionnaire, setQuestionnaire] = useState({
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
    });
    const [questionnaireFile, setQuestionnaireFile] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitType, setSubmitType]   = useState('publish');
    const [errors, setErrors]     = useState({});

    // Load renewal skeleton and its checklists
    useEffect(() => {
        if (!id) return;
        axios.get(`/api/csms/renewals/${id}`)
            .then(res => {
                const data = res.data?.result;
                if (!data) return;
                const b = data.bidding;
                setRenewal(b);

                // Pre-fill questionnaire from existing data
                const q = typeof b.questionnaire === 'string'
                    ? JSON.parse(b.questionnaire || '{}')
                    : (b.questionnaire || {});
                setQuestionnaire(prev => ({ ...prev, ...q }));

                // Load checklists
                const cls = (data.checklists || []).map(cl => ({
                    checklist_id: cl.id,
                    id:           cl.question_id,
                    crtiteria:    cl.crtiteria,
                    sub_point:    cl.sub_point,
                    point:        cl.point,
                    legal_base:   cl.legal_base,
                    note:         cl.note,
                    ordinal_number: cl.ordinal_number,
                    value:        cl.value || '',
                    comment:      cl.comment || '',
                    existingFiles: cl.attachments || [],
                }));
                setChecklists(cls);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const handleQChange = (field, val) => {
        setQuestionnaire(prev => ({ ...prev, [field]: val }));
    };

    const setChecklist = (checklistId, field, val) => {
        setChecklists(prev => prev.map(c => c.checklist_id === checklistId ? { ...c, [field]: val } : c));
    };

    const handleFileDrop = (checklistId, files) => {
        setChecklistFiles(prev => ({
            ...prev,
            [checklistId]: [...(prev[checklistId] || []), ...files]
        }));
    };

    const removeChecklistFile = (checklistId, fileIdx) => {
        setChecklistFiles(prev => ({
            ...prev,
            [checklistId]: (prev[checklistId] || []).filter((_, i) => i !== fileIdx)
        }));
    };

    const handleSubmit = useCallback((isDraft = false) => {
        setSaving(true);
        setErrors({});

        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('questionnaire', JSON.stringify(questionnaire));
        if (questionnaireFile) fd.append('questionnaire_file', questionnaireFile);
        fd.append('published', isDraft ? 'Draft' : 'Publish');
        fd.append('status',    isDraft ? 'Draft' : 'On Review OHS');

        checklists.forEach((cl, i) => {
            fd.append(`checklists[${i}][checklist_id]`, cl.checklist_id);
            fd.append(`checklists[${i}][value]`,        cl.value || '');
            fd.append(`checklists[${i}][comment]`,      cl.comment || '');
            (checklistFiles[cl.checklist_id] || []).forEach(f => {
                fd.append(`checklists[${i}][new_files][]`, f);
            });
        });

        axios.post(`/api/csms/renewals/${id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => {
                const result = res.data?.result;
                window.location.href = isDraft
                    ? '/csms/renewal/lists'
                    : `/csms/renewal/detail/${result?.id ?? id}`;
            })
            .catch(err => {
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                } else if (err.response?.data?.message) {
                    setErrors({ general: [err.response.data.message] });
                }
            })
            .finally(() => {
                setSaving(false);
                setShowConfirm(false);
            });
    }, [id, questionnaire, questionnaireFile, checklists, checklistFiles]);

    const groupedChecklists = checklists.reduce((groups, item) => {
        const key = item.sub_point || '';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});

    if (loading) {
        return (
            <>
                <Head title="Isi Data Renewal" />
                <PageLoader title="Memuat data renewal..." />
            </>
        );
    }

    if (!renewal) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Head title="Renewal Tidak Ditemukan" />
                <p style={{ color: 'var(--danger)' }}>Data renewal tidak ditemukan.</p>
                <a href="/csms/renewal/lists" style={{ color: 'var(--primary)' }}>Kembali ke Renewal</a>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title="Isi Data Renewal CSMS" />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href="/csms/renewal/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Renewal
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RotateCcw size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Isi Data Renewal</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Lengkapi kuesioner dan checklist perpanjangan CSMS</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))' }}>

                    {errors.general && (
                        <div style={{ marginBottom: '16px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '12px', color: '#ef4444' }}>
                            {errors.general[0]}
                        </div>
                    )}

                    {/* Section 1: Company Info (read-only from renewal record) */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Detail Perusahaan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Perusahaan</label>
                                    <input value={renewal.company_name || ''} readOnly style={S.inputRO} />
                                </div>
                                <div>
                                    <label style={S.label}>No. Lisensi</label>
                                    <input value={renewal.license_number || ''} readOnly style={S.inputRO} />
                                </div>
                            </div>
                            <div>
                                <label style={S.label}>Alamat Perusahaan</label>
                                <input value={renewal.address || ''} readOnly style={S.inputRO} />
                            </div>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Site Perusahaan</label>
                                    <input value={renewal.company_site || ''} readOnly style={S.inputRO} />
                                </div>
                                <div>
                                    <label style={S.label}>Kriteria Jasa</label>
                                    <input value={renewal.service_criteria || ''} readOnly style={S.inputRO} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Questionnaire */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Kuesioner Detail Perpanjangan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Singkatan Perusahaan (Nickname)</label>
                                    <input value={questionnaire.company_nickname} onChange={e => handleQChange('company_nickname', e.target.value)} placeholder="Contoh: PT SIS" style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Lingkup Usaha</label>
                                    <input value={questionnaire.scope_of_business} onChange={e => handleQChange('scope_of_business', e.target.value)} placeholder="Contoh: Coal Hauling" style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Mulai Kontrak</label>
                                    <input type="date" value={questionnaire.date_contract_period_start} onChange={e => handleQChange('date_contract_period_start', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Selesai Kontrak</label>
                                    <input type="date" value={questionnaire.date_contract_period_end} onChange={e => handleQChange('date_contract_period_end', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Jumlah Pekerja</label>
                                    <input type="number" value={questionnaire.number_of_workers} onChange={e => handleQChange('number_of_workers', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row3}>
                                <div>
                                    <label style={S.label}>Pengawas POP</label>
                                    <input type="number" value={questionnaire.number_of_spv_pop} onChange={e => handleQChange('number_of_spv_pop', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Pengawas POM</label>
                                    <input type="number" value={questionnaire.number_of_spv_pom} onChange={e => handleQChange('number_of_spv_pom', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Pengawas POU</label>
                                    <input type="number" value={questionnaire.number_of_spv_pou} onChange={e => handleQChange('number_of_spv_pou', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Implementator SMKP</label>
                                    <input type="number" value={questionnaire.number_of_spv_imp_smkp} onChange={e => handleQChange('number_of_spv_imp_smkp', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Auditor SMKP</label>
                                    <input type="number" value={questionnaire.number_of_spv_auditor_smkp} onChange={e => handleQChange('number_of_spv_auditor_smkp', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama PJO / Penanggung Jawab</label>
                                    <input value={questionnaire.equipped_name} onChange={e => handleQChange('equipped_name', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Jabatan PJO</label>
                                    <input value={questionnaire.equipped_position} onChange={e => handleQChange('equipped_position', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Telepon PJO</label>
                                    <input value={questionnaire.equipped_telephone} onChange={e => handleQChange('equipped_telephone', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Email PJO</label>
                                    <input type="email" value={questionnaire.equipped_email} onChange={e => handleQChange('equipped_email', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
                                <label style={S.label}>File Scan Kuesioner CSMS</label>
                                <FileDropzone onFileDrop={(files) => setQuestionnaireFile(files[0])} accept=".pdf,.png,.jpeg,.jpg" />
                                {questionnaireFile && (
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                        <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{questionnaireFile.name}</span>
                                        <button type="button" onClick={() => setQuestionnaireFile(null)} style={{ border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>Hapus</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Checklists */}
                    {checklists.length > 0 && (
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={S.title}>Checklist Perpanjangan CSMS ({checklists.length} butir)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                    <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {subPoint && (
                                            <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>
                                                {subPoint}
                                            </h5>
                                        )}
                                        {items.map(cl => (
                                            <div key={cl.checklist_id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                                                    {cl.ordinal_number}. {cl.crtiteria}
                                                </p>
                                                {cl.legal_base && <p style={{ fontSize: '11px', color: '#1d4ed8', margin: '0 0 4px' }}><strong>Dasar Hukum:</strong> {cl.legal_base}</p>}
                                                {cl.note && <p style={{ fontSize: '11px', color: '#810da8', margin: '0 0 4px' }}><strong>Panduan:</strong> {cl.note}</p>}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                                    <select value={cl.value ?? ''} onChange={e => setChecklist(cl.checklist_id, 'value', e.target.value)}
                                                        style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', width: '100%' }}>
                                                        <option value="">-- Pilih Pemenuhan --</option>
                                                        <option value="Ya">Ya</option>
                                                        <option value="Tidak">Tidak</option>
                                                        <option value="N/A">N/A</option>
                                                    </select>
                                                    {cl.value === 'Tidak' && (
                                                        <textarea value={cl.comment ?? ''} onChange={e => setChecklist(cl.checklist_id, 'comment', e.target.value)}
                                                            placeholder="Tuliskan catatan/keterangan di sini..."
                                                            style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', width: '100%', minHeight: '60px', boxSizing: 'border-box' }} />
                                                    )}
                                                </div>

                                                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                                                    <label style={{ ...S.label, fontSize: '11px', marginBottom: '8px' }}>Upload Dokumen Bukti</label>
                                                    <FileDropzone onFileDrop={(files) => handleFileDrop(cl.checklist_id, files)} accept=".pdf,.png,.jpeg,.jpg" />
                                                    {(checklistFiles[cl.checklist_id] || []).length > 0 && (
                                                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {(checklistFiles[cl.checklist_id] || []).map((file, fileIdx) => (
                                                                <div key={fileIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontWeight: 500 }}>{file.name}</span>
                                                                    <button type="button" onClick={() => removeChecklistFile(cl.checklist_id, fileIdx)}
                                                                        style={{ border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
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

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <a href="/csms/renewal/lists" style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                        <button onClick={() => { setSubmitType('draft'); setShowConfirm(true); }} disabled={saving}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving && submitType === 'draft' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                            {saving && submitType === 'draft' ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                        </button>
                        <button onClick={() => { setSubmitType('publish'); setShowConfirm(true); }} disabled={saving}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving && submitType === 'publish' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                            {saving && submitType === 'publish' ? 'Menyimpan...' : 'Simpan & Submit ke OHS'}
                        </button>
                        <ConfirmationModal
                            isOpen={showConfirm}
                            type={submitType === 'draft' ? 'draft' : 'review'}
                            title={submitType === 'draft' ? 'Simpan sebagai Draft?' : 'Submit Renewal ke OHS?'}
                            description={submitType === 'draft' ? 'Data akan disimpan sebagai draft.' : 'Data akan disubmit ke OHS untuk review.'}
                            confirmText="Simpan"
                            cancelText="Batal"
                            loading={saving}
                            onConfirm={() => handleSubmit(submitType === 'draft')}
                            onCancel={() => setShowConfirm(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
