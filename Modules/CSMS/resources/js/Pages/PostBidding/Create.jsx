import { ArrowLeft, ClipboardCheck, Loader2, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import ConfirmationModal from '@/Components/ConfirmationModal';
import FileDropzone from '@/Components/FileDropzone';
import { Head } from '@inertiajs/react';
import PageLoader from '@/Components/PageLoader';
import axios from 'axios';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    inputReadOnly: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b', boxSizing: 'border-box' },
    title: { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

export default function PostBiddingCreate() {
    const [approvedBiddings, setApprovedBiddings] = useState([]);
    const [selectedBiddingId, setSelectedBiddingId] = useState('');

    const [form, setForm] = useState({
        company_name: '',
        address: '',
        company_site: '',
        license_number: '',
        service_criteria: '',
        classification: '',
        ccow_id: '',
        business_entity_id: '',
        csms_doc_number: '',
        company_id: '',
        parent_id: '',
        person_in_charge: '',
        risk_category: 'Tinggi',
        questionnaire: {
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
            pjo_competence: '',
            pjo_cert_number: '',
            pjo_cert_expiry: '',
            // ── Data Sertifikat (Bidang Usaha) ────────────────────────────
            nib_number: '',
            iujp_number: '',
            license_start_date: '',
            license_end_date: '',
            kbli_code: '',
            business_type: '',
            activities_list: '',
            business_fields: [],
        }
    });

    const [allMasterChecklists, setAllMasterChecklists] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [checklistFiles, setChecklistFiles] = useState({});
    const [questionnaireFile, setQuestionnaireFile] = useState(null);
    const [classifications, setClassifications] = useState([]);

    const [masterLoading, setMasterLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitType, setSubmitType] = useState('publish'); // 'draft' or 'publish'
    const [errors, setErrors] = useState({});

    useEffect(() => {
        Promise.all([
            axios.get('/api/csms/approved-biddings'),
            axios.get('/api/csms/master-data')
        ])
        .then(([biddingsRes, masterRes]) => {
            setApprovedBiddings(biddingsRes.data?.result ?? []);
            setClassifications(masterRes.data?.result?.classifications ?? []);
            const allChecklists = masterRes.data?.result?.master_checklists ?? [];
            const postChecklists = allChecklists.filter(c => c.criteria === 'PostBidding');
            setAllMasterChecklists(postChecklists);
            filterAndSetChecklists('Tinggi', postChecklists);
        })
        .catch(() => {})
        .finally(() => setMasterLoading(false));
    }, []);

    const filterAndSetChecklists = (risk, masterList = allMasterChecklists) => {
        let filtered = [...masterList];
        if (risk === 'Rendah') {
            filtered = masterList.filter(c => [1, 2, 3, 4, 8, 17, 18, 25, 27].includes(c.ordinal_number));
        } else if (risk === 'Menengah') {
            filtered = masterList.filter(c => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34].includes(c.ordinal_number));
        }

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
    };

    const handleBiddingChange = (e) => {
        const bidId = e.target.value;
        setSelectedBiddingId(bidId);
        if (!bidId) {
            setForm(prev => ({
                ...prev,
                company_name: '',
                address: '',
                company_site: '',
                license_number: '',
                service_criteria: '',
                classification: '',
                ccow_id: '',
                company_id: '',
                parent_id: '',
                person_in_charge: '',
                csms_doc_number: '',
            }));
            return;
        }

        const bid = approvedBiddings.find(b => b.id === bidId);
        if (bid) {
            setForm(prev => ({
                ...prev,
                company_name: bid.company_name,
                address: bid.address,
                company_site: bid.company_site,
                license_number: bid.license_number,
                service_criteria: bid.service_criteria,
                classification: bid.classification ?? 'Kontraktor',
                ccow_id: bid.ccow_id ?? '',
                business_entity_id: bid.business_entity_id ?? '',
                csms_doc_number: bid.csms_doc_number ?? '',
                company_id: bid.company_id ?? '',
                parent_id: bid.parent_id ?? '',
                person_in_charge: bid.person_in_charge ?? '',
            }));
        }
    };

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
        filterAndSetChecklists(risk);
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

    const handleSubmit = (isDraft = false) => {
        if (!selectedBiddingId) {
            setErrors({ bidding_reference: ['Harap pilih Referensi Bidding terlebih dahulu'] });
            return;
        }

        setSaving(true);
        setErrors({});
        const fd = new FormData();

        // Add parent bidding_id
        fd.append('bidding_id', selectedBiddingId);
        fd.append('classification', form.classification);
        fd.append('risk_category', form.risk_category);

        // Add questionnaire data
        fd.append('questionnaire', JSON.stringify(form.questionnaire));
        if (questionnaireFile) fd.append('questionnaire_file', questionnaireFile);

        // Add status fields
        fd.append('published', isDraft ? 'Draft' : 'Publish');
        fd.append('status', isDraft ? 'Draft' : 'On Review OHS');

        // Append checklists and files
        checklists.forEach((cl, i) => {
            fd.append(`checklists[${i}][question_id]`, cl.id);
            fd.append(`checklists[${i}][value]`, cl.value || '');
            fd.append(`checklists[${i}][comment]`, cl.comment || '');

            const files = checklistFiles[cl.id] || [];
            files.forEach(f => {
                fd.append(`checklists[${i}][new_files][]`, f);
            });
        });

        axios.post('/api/csms/post-biddings', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => {
                const result = res.data?.result;
                if (result?.id) {
                    window.location.href = `/csms/post-bidding/detail/${result.id}`;
                } else {
                    const redirectUrl = isDraft
                        ? '/csms/post-bidding/lists?status=Draft'
                        : '/csms/post-bidding/lists?status=On Going';
                    window.location.href = redirectUrl;
                }
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
    };

    const handleExportQuestionnaire = () => {
        if (!selectedBiddingId) {
            alert('Pilih bidding terlebih dahulu');
            return;
        }

        // Validate required questionnaire fields
        const required = [
            'company_nickname', 'scope_of_business',
            'date_contract_period_start', 'date_contract_period_end',
            'number_of_workers', 'number_of_spv_pop',
            'number_of_spv_pom', 'number_of_spv_pou',
            'number_of_spv_imp_smkp', 'number_of_spv_auditor_smkp',
            'equipped_name', 'equipped_position',
            'equipped_telephone', 'equipped_email'
        ];

        for (const field of required) {
            if (!form.questionnaire[field]) {
                alert(`Field ${field.replace(/_/g, ' ')} belum terisi`);
                return;
            }
        }

        window.open(
            `/api/csms/post-biddings/${selectedBiddingId}/export-questionnaire`,
            '_blank'
        );
    };

    const groupedChecklists = checklists.reduce((groups, item) => {
        const groupName = item.sub_point || '';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(item);
        return groups;
    }, {});

    if (masterLoading) {
        return (
            <>
                <Head title="Tambah Post Bidding" />
                <PageLoader title="Memuat data master..." />
            </>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title="Tambah Post Bidding" />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href="/csms/post-bidding/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Post Bidding
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ClipboardCheck size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Tambah Post Bidding</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Buat kualifikasi baru pasca proses bidding selesai</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium, 0 4px 24px rgba(0,0,0,0.06))' }}>

                    {/* Section 1: Reference Bidding */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Referensi Bidding</h4>
                        <div>
                            <label style={S.label}>Pilih Bidding Terdaftar <span style={{ color: '#ef4444' }}>*</span></label>
                            <select value={selectedBiddingId} onChange={handleBiddingChange}
                                style={{ ...S.input, borderColor: errors.bidding_reference ? '#ef4444' : 'var(--border-color)' }}>
                                <option value="">-- Pilih Bidding Reference --</option>
                                {approvedBiddings.map(b => (
                                    <option key={b.id} value={b.id}>{b.company_name} ({b.license_number})</option>
                                ))}
                            </select>
                            {errors.bidding_reference && <span style={S.error}>{errors.bidding_reference[0]}</span>}
                        </div>
                    </div>

                    {selectedBiddingId && (
                        <>
                            {/* Section 2: Company Details */}
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

                            {/* Section 3: Questionnaire Details */}
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

                                    <div style={row3}>
                                        <div>
                                            <label style={S.label}>Kompetensi PJO</label>
                                            <select value={form.questionnaire.pjo_competence ?? ''} onChange={e => handleQuestionnaireChange('pjo_competence', e.target.value)} style={S.input}>
                                                <option value="">-- Pilih Kompetensi --</option>
                                                <option value="POP">POP</option>
                                                <option value="POM">POM</option>
                                                <option value="POU">POU</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={S.label}>No. Sertifikasi PJO</label>
                                            <input value={form.questionnaire.pjo_cert_number ?? ''} onChange={e => handleQuestionnaireChange('pjo_cert_number', e.target.value)} placeholder="Contoh: xxxx/xx.0xx/DBT/2009" style={S.input} />
                                        </div>
                                        <div>
                                            <label style={S.label}>Masa Berlaku Sertifikasi PJO</label>
                                            <input value={form.questionnaire.pjo_cert_expiry ?? ''} onChange={e => handleQuestionnaireChange('pjo_cert_expiry', e.target.value)} placeholder="Contoh: - atau Tanggal" style={S.input} />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                        <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Legalitas Bidang Usaha</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div style={row3}>
                                                <div>
                                                    <label style={S.label}>NIB Perusahaan</label>
                                                    <input value={form.questionnaire.nib_number} onChange={e => handleQuestionnaireChange('nib_number', e.target.value)} placeholder="Masukkan NIB..." style={S.input} />
                                                </div>
                                                <div>
                                                    <label style={S.label}>KBLI Perusahaan</label>
                                                    <input value={form.questionnaire.kbli_code} onChange={e => handleQuestionnaireChange('kbli_code', e.target.value)} placeholder="Contoh: 09900" style={S.input} />
                                                </div>
                                                <div>
                                                    <label style={S.label}>No. IUJP Perusahaan</label>
                                                    <input value={form.questionnaire.iujp_number} onChange={e => handleQuestionnaireChange('iujp_number', e.target.value)} placeholder="Masukkan No. IUJP..." style={S.input} />
                                                </div>
                                            </div>

                                            <div style={row3}>
                                                <div>
                                                    <label style={S.label}>Jenis Usaha (Business Type)</label>
                                                    <input value={form.questionnaire.business_type} onChange={e => handleQuestionnaireChange('business_type', e.target.value)} placeholder="Contoh: Aktivitas Penunjang..." style={S.input} />
                                                </div>
                                                <div>
                                                    <label style={S.label}>Mulai Berlaku Izin</label>
                                                    <input type="date" value={form.questionnaire.license_start_date} onChange={e => handleQuestionnaireChange('license_start_date', e.target.value)} style={S.input} />
                                                </div>
                                                <div>
                                                    <label style={S.label}>Selesai Berlaku Izin</label>
                                                    <input type="date" value={form.questionnaire.license_end_date} onChange={e => handleQuestionnaireChange('license_end_date', e.target.value)} style={S.input} />
                                                </div>
                                            </div>

                                            <div>
                                                <label style={S.label}>Daftar Aktivitas (Activities List)</label>
                                                <textarea
                                                    value={form.questionnaire.activities_list}
                                                    onChange={e => handleQuestionnaireChange('activities_list', e.target.value)}
                                                    placeholder="Tuliskan daftar aktivitas kerja..."
                                                    rows={3}
                                                    style={{ ...S.input, fontFamily: 'inherit', resize: 'vertical' }}
                                                />
                                            </div>

                                            {/* Business Fields - dynamic rows */}
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <label style={S.label}>Keterangan Bidang Usaha</label>
                                                    <button type="button" onClick={() => handleQuestionnaireChange('business_fields', [
                                                        ...(form.questionnaire.business_fields ?? []),
                                                        { kbli: form.questionnaire.kbli_code ?? '', jenis_usaha: form.questionnaire.business_type ?? '', bidang_usaha: '', sub_bidang_list: [], risiko: 'Tinggi' }
                                                    ])} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                                        + Tambah Baris
                                                    </button>
                                                </div>

                                                {(form.questionnaire.business_fields ?? []).length === 0 ? (
                                                    <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                                        Belum ada baris bidang usaha. Klik "+ Tambah Baris" untuk menambahkan.
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {(form.questionnaire.business_fields ?? []).map((bf, idx) => (
                                                            <div key={idx} style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Baris {idx + 1}</span>
                                                                    <button type="button" onClick={() => handleQuestionnaireChange('business_fields',
                                                                        (form.questionnaire.business_fields ?? []).filter((_, i) => i !== idx)
                                                                    )} style={{ border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                                <div style={row2}>
                                                                    <div>
                                                                        <label style={S.label}>No. KBLI</label>
                                                                        <input value={bf.kbli ?? ''} onChange={e => {
                                                                            const updated = [...(form.questionnaire.business_fields ?? [])];
                                                                            updated[idx] = { ...updated[idx], kbli: e.target.value };
                                                                            handleQuestionnaireChange('business_fields', updated);
                                                                        }} placeholder="09900" style={S.input} />
                                                                    </div>
                                                                    <div>
                                                                        <label style={S.label}>Jenis Usaha</label>
                                                                        <input value={bf.jenis_usaha ?? ''} onChange={e => {
                                                                            const updated = [...(form.questionnaire.business_fields ?? [])];
                                                                            updated[idx] = { ...updated[idx], jenis_usaha: e.target.value };
                                                                            handleQuestionnaireChange('business_fields', updated);
                                                                        }} placeholder="Jenis Usaha..." style={S.input} />
                                                                    </div>
                                                                </div>
                                                                <div style={{ ...row2, marginTop: '10px' }}>
                                                                    <div>
                                                                        <label style={S.label}>Bidang Usaha / Sifat Usaha</label>
                                                                        <input value={bf.bidang_usaha ?? ''} onChange={e => {
                                                                            const updated = [...(form.questionnaire.business_fields ?? [])];
                                                                            updated[idx] = { ...updated[idx], bidang_usaha: e.target.value };
                                                                            handleQuestionnaireChange('business_fields', updated);
                                                                        }} placeholder="Penambangan / Pengangkutan..." style={S.input} />
                                                                    </div>
                                                                    <div>
                                                                        <label style={S.label}>Risiko</label>
                                                                        <select value={bf.risiko ?? 'Tinggi'} onChange={e => {
                                                                            const updated = [...(form.questionnaire.business_fields ?? [])];
                                                                            updated[idx] = { ...updated[idx], risiko: e.target.value };
                                                                            handleQuestionnaireChange('business_fields', updated);
                                                                        }} style={S.input}>
                                                                            <option value="Tinggi">Tinggi</option>
                                                                            <option value="Menengah">Menengah</option>
                                                                            <option value="Rendah">Rendah</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div style={{ marginTop: '10px' }}>
                                                                    <label style={S.label}>Sub Bidang / Sub Klasifikasi <span style={{ fontWeight: 400, color: 'var(--text-muted,#94a3b8)' }}>(satu per baris)</span></label>
                                                                    <textarea
                                                                        value={Array.isArray(bf.sub_bidang_list) ? bf.sub_bidang_list.join('\n') : (bf.sub_bidang_list ?? '')}
                                                                        onChange={e => {
                                                                            const updated = [...(form.questionnaire.business_fields ?? [])];
                                                                            updated[idx] = { ...updated[idx], sub_bidang_list: e.target.value.split('\n') };
                                                                            handleQuestionnaireChange('business_fields', updated);
                                                                        }}
                                                                        placeholder="Pembukaan lahan&#10;Pengupasan tanah..."
                                                                        rows={3}
                                                                        style={{ ...S.input, fontFamily: 'inherit', resize: 'vertical' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
                                        <label style={S.label}>File Scan Kuesioner CSMS</label>
                                        <FileDropzone onFileDrop={(files) => setQuestionnaireFile(files[0])} accept=".pdf,.png,.jpeg,.jpg" />
                                        {questionnaireFile && (
                                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0 }}>{questionnaireFile.name}</span>
                                                <button type="button" onClick={() => setQuestionnaireFile(null)} style={{ flexShrink: 0, border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', lineHeight: '16px' }}>Hapus</button>
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            </div>

                            {/* Section 4: Audit Checklist */}
                            {checklists.length > 0 && (
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={S.title}>Checklist Kualifikasi CSMS ({checklists.length} butir)</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {Object.entries(groupedChecklists).map(([subPoint, items]) => (
                                            <div key={subPoint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {subPoint && <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 0', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>{subPoint}</h5>}
                                                {items.map((cl, i) => (
                                                    <div key={cl.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>{cl.ordinal_number}. {cl.crtiteria}</p>
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
                                                                        <div key={fileIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                                            <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0, color: 'var(--text-primary)', fontWeight: 500 }}>{file.name}</span>
                                                                            <button type="button" onClick={() => removeChecklistFile(cl.id, fileIdx)}
                                                                                style={{ flexShrink: 0, border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', lineHeight: '16px' }}>
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
                                <a href="/csms/post-bidding/lists" style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                                <button onClick={() => { setSubmitType('draft'); setShowConfirm(true); }} disabled={saving}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving && submitType === 'draft' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                                    {saving && submitType === 'draft' ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                                </button>
                                <button onClick={() => { setSubmitType('publish'); setShowConfirm(true); }} disabled={saving}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving && submitType === 'publish' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                                    {saving && submitType === 'publish' ? 'Menyimpan...' : 'Simpan & Submit'}
                                </button>
                                <ConfirmationModal
                                    isOpen={showConfirm}
                                    type={submitType === 'draft' ? 'draft' : 'review'}
                                    title={submitType === 'draft' ? 'Simpan sebagai Draft?' : 'Submit Post Bidding?'}
                                    description={submitType === 'draft' ? 'Data akan disimpan sebagai draft dan dapat diedit kembali.' : 'Data akan disubmit untuk review OHS.'}
                                    confirmText="Simpan"
                                    cancelText="Batal"
                                    loading={saving}
                                    onConfirm={() => handleSubmit(submitType === 'draft')}
                                    onCancel={() => setShowConfirm(false)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
