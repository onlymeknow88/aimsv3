import React, { useState, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { ArrowLeft, UserCog, Save, Loader2, FileText, Upload } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PageLoader from '@/Components/PageLoader';
import FileDropzone from '@/Components/FileDropzone';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    inputRO: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b', boxSizing: 'border-box' },
    title: { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger, #ef4444)', marginTop: '4px' },
};

const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

// Single-file dropzone with preview
function SingleFileDrop({ label, fileKey, file, existingFile, onChange, onRemove }) {
    return (
        <div>
            <label style={S.label}>{label}</label>
            {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontWeight: 600 }}>
                        <Upload size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />{file.name}
                    </span>
                    <button type="button" onClick={() => onRemove(fileKey)} style={{ border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                        Hapus
                    </button>
                </div>
            ) : (
                <FileDropzone onFileDrop={(files) => onChange(fileKey, files[0])} accept=".pdf,.png,.jpeg,.jpg,.doc,.docx" />
            )}
            {existingFile && !file && (
                <div style={{ marginTop: '4px' }}>
                    <a href={existingFile.blob_url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '10.5px' }}>
                        <FileText size={11} /> {existingFile.name}
                    </a>
                </div>
            )}
        </div>
    );
}

export default function PjoEdit() {
    const { id } = usePage().props;

    const [form, setForm] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [biddingCompanies, setBiddingCompanies] = useState([]);

    // Typed single files (new uploads)
    const [typedFiles, setTypedFiles] = useState({
        sertifikat_pop: null,
        sertifikat_pom: null,
        sertifikat_pou: null,
        sertifikat_ismkp: null,
        sertifikat_asmkp: null,
        cv: null,
        surat_penunjukan: null,
        struktur_organisasi: null,
        persyaratan_administratif: null,
        surat_pernyataan: null,
    });

    // Multiple for sertifikat_lainnya (new uploads)
    const [lainnyaFiles, setLainnyaFiles] = useState([]);

    // Existing files grouped by type
    const [existingByType, setExistingByType] = useState({});
    // Existing lainnya files
    const [existingLainnya, setExistingLainnya] = useState([]);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            axios.get(`/api/csms/pjos/${id}`),
            axios.get('/api/csms/master-data'),
        ]).then(([detailRes, masterRes]) => {
            const detail = detailRes.data?.result;
            const master = masterRes.data?.result;
            const p = detail?.pjo;
            if (p) {
                setForm({
                    name:            p.name            ?? '',
                    number_pjo:      p.number_pjo      ?? '',
                    company_id:      String(p.company_id ?? ''),
                    ccow_id:         String(p.ccow_id   ?? ''),
                    criteria:        p.criteria         ?? '',
                    phone:           p.phone            ?? '',
                    email:           p.email            ?? '',
                    date_of_birth:   p.date_of_birth    ?? '',
                    date_submission: p.date_submission  ?? '',
                    submission:      p.submission       ?? '',
                    status:          p.status           ?? 'Draft',
                    competence:      p.competence       ?? '',
                    cert_number:     p.cert_number      ?? '',
                    cert_expiry:     p.cert_expiry      ?? '',
                });

                // Group existing files by type key
                const byType = {};
                const lainnya = [];
                (detail?.files ?? []).forEach(f => {
                    if (f.type === 'sertifikat_lainnya') {
                        lainnya.push(f);
                    } else if (f.type) {
                        byType[f.type] = f;
                    }
                });
                setExistingByType(byType);
                setExistingLainnya(lainnya);
            }
            setCompanies(master?.companies ?? []);
            setBiddingCompanies(master?.bidding_companies ?? []);
        }).finally(() => setLoading(false));
    }, [id]);

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleCompanyChange = (companyId) => {
        if (!companyId) {
            setForm(f => ({ ...f, company_id: '', criteria: '' }));
            return;
        }
        const selectedCompany = companies.find(c => String(c.id) === String(companyId));
        const match = biddingCompanies.find(b =>
            String(b.id) === String(companyId) ||
            (selectedCompany && b.company_name === selectedCompany.name)
        );
        setForm(f => ({
            ...f,
            company_id: companyId,
            criteria:   match?.service_criteria ?? f.criteria,
        }));
    };

    const handleTypedFileChange = (key, file) => {
        setTypedFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleTypedFileRemove = (key) => {
        setTypedFiles(prev => ({ ...prev, [key]: null }));
    };

    const handleLainnyaDrop = (files) => {
        setLainnyaFiles(prev => [...prev, ...files]);
    };

    const removeLainnya = (idx) => {
        setLainnyaFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});
        const fd = new FormData();
        fd.append('_method', 'PUT');

        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });

        // Typed single files
        Object.entries(typedFiles).forEach(([key, file]) => {
            if (file) fd.append(key, file);
        });

        // Multiple lainnya files
        lainnyaFiles.forEach(file => {
            fd.append('sertifikat_lainnya[]', file);
        });

        axios.post(`/api/csms/pjos/${id}`, fd)
            .then(() => { window.location.href = `/csms/pjo/detail/${id}`; })
            .catch(err => {
                if (err.response?.data?.errors) setErrors(err.response.data.errors);
                else if (err.response?.data?.message) setErrors({ general: [err.response.data.message] });
            })
            .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    if (loading || !form) {
        return (
            <>
                <Head title="Edit PJO" />
                <PageLoader title="Memuat data PJO..." />
            </>
        );
    }

    const ccows            = companies.filter(c => c.type === 'Internal');
    const regularCompanies = companies.filter(c => c.type !== 'Internal');

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Edit PJO: ${form.name}`} />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href={`/csms/pjo/detail/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke Detail
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCog size={16} color="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Edit PJO</h2>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Ubah informasi data PJO</p>
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

                    {/* Section: Informasi PJO */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Informasi PJO</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Perusahaan <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select
                                        value={form.company_id}
                                        onChange={e => handleCompanyChange(e.target.value)}
                                        style={{ ...S.input, borderColor: errors.company_id ? '#ef4444' : 'var(--border-color)' }}
                                    >
                                        <option value="">-- Pilih Perusahaan --</option>
                                        {regularCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.company_id && <span style={S.error}>{errors.company_id[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Kriteria Perusahaan</label>
                                    <input value={form.criteria} readOnly style={S.inputRO} placeholder="Otomatis dari perusahaan" />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>CCOW <span style={{ color: '#ef4444' }}>*</span></label>
                                    <select
                                        value={form.ccow_id}
                                        onChange={e => set('ccow_id', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.ccow_id ? '#ef4444' : 'var(--border-color)' }}
                                    >
                                        <option value="">-- Pilih CCOW --</option>
                                        {ccows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.ccow_id && <span style={S.error}>{errors.ccow_id[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>No. PJO <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        value={form.number_pjo}
                                        onChange={e => set('number_pjo', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.number_pjo ? '#ef4444' : 'var(--border-color)' }}
                                        placeholder="PJO-XXXX"
                                    />
                                    {errors.number_pjo && <span style={S.error}>{errors.number_pjo[0]}</span>}
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                        style={{ ...S.input, borderColor: errors.name ? '#ef4444' : 'var(--border-color)' }}
                                        placeholder="Nama PJO"
                                    />
                                    {errors.name && <span style={S.error}>{errors.name[0]}</span>}
                                </div>
                                <div>
                                    <label style={S.label}>Pengajuan (Submission)</label>
                                    <input value={form.submission} onChange={e => set('submission', e.target.value)} style={S.input} placeholder="Submission / Pengajuan" />
                                </div>
                            </div>

                            <div style={row3}>
                                <div>
                                    <label style={S.label}>Telepon</label>
                                    <input value={form.phone} onChange={e => set('phone', e.target.value)} style={S.input} placeholder="+62xxx" />
                                </div>
                                <div>
                                    <label style={S.label}>Email</label>
                                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={S.input} placeholder="email@perusahaan.com" />
                                </div>
                                <div>
                                    <label style={S.label}>Tanggal Lahir</label>
                                    <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} style={S.input} />
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={S.label}>Tanggal Pengajuan Evaluasi</label>
                                    <input type="date" value={form.date_submission} onChange={e => set('date_submission', e.target.value)} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Status</label>
                                    <select value={form.status} onChange={e => set('status', e.target.value)} style={S.input}>
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="On Going">On Going</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div style={row3}>
                                <div>
                                    <label style={S.label}>Kompetensi PJO</label>
                                    <input value={form.competence} onChange={e => set('competence', e.target.value)} style={S.input} placeholder="POP / POM / POU" />
                                </div>
                                <div>
                                    <label style={S.label}>Nomor Sertifikat</label>
                                    <input value={form.cert_number} onChange={e => set('cert_number', e.target.value)} style={S.input} placeholder="No. sertifikat kompetensi" />
                                </div>
                                <div>
                                    <label style={S.label}>Masa Berlaku Sertifikat</label>
                                    <input type="date" value={form.cert_expiry} onChange={e => set('cert_expiry', e.target.value)} style={S.input} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Sertifikat Kompetensi */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Sertifikat Kompetensi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <SingleFileDrop label="Sertifikat POP" fileKey="sertifikat_pop" file={typedFiles.sertifikat_pop} existingFile={existingByType.sertifikat_pop} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                                <SingleFileDrop label="Sertifikat POM" fileKey="sertifikat_pom" file={typedFiles.sertifikat_pom} existingFile={existingByType.sertifikat_pom} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>
                            <div style={row2}>
                                <SingleFileDrop label="Sertifikat POU" fileKey="sertifikat_pou" file={typedFiles.sertifikat_pou} existingFile={existingByType.sertifikat_pou} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                                <SingleFileDrop label="Sertifikat ISMKP" fileKey="sertifikat_ismkp" file={typedFiles.sertifikat_ismkp} existingFile={existingByType.sertifikat_ismkp} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>
                            <div style={row2}>
                                <SingleFileDrop label="Sertifikat ASMKP" fileKey="sertifikat_asmkp" file={typedFiles.sertifikat_asmkp} existingFile={existingByType.sertifikat_asmkp} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>

                            {/* Sertifikat Lainnya - multiple */}
                            <div>
                                <label style={S.label}>Sertifikat Lainnya</label>
                                <FileDropzone onFileDrop={handleLainnyaDrop} accept=".pdf,.png,.jpeg,.jpg,.doc,.docx" />
                                {lainnyaFiles.length > 0 && (
                                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {lainnyaFiles.map((f, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontWeight: 500 }}>
                                                    <Upload size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />{f.name}
                                                </span>
                                                <button type="button" onClick={() => removeLainnya(idx)} style={{ border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {existingLainnya.length > 0 && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {existingLainnya.map(f => (
                                            <a key={f.id} href={f.blob_url} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '10.5px' }}>
                                                <FileText size={11} /> {f.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Dokumen Pendukung */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Dokumen Pendukung</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <SingleFileDrop label="CV PJO" fileKey="cv" file={typedFiles.cv} existingFile={existingByType.cv} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                                <SingleFileDrop label="Surat Penunjukan PJO oleh Direksi" fileKey="surat_penunjukan" file={typedFiles.surat_penunjukan} existingFile={existingByType.surat_penunjukan} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>
                            <div style={row2}>
                                <SingleFileDrop label="Struktur Organisasi" fileKey="struktur_organisasi" file={typedFiles.struktur_organisasi} existingFile={existingByType.struktur_organisasi} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>
                        </div>
                    </div>

                    {/* Section: Dokumen Administratif */}
                    <div style={{ marginBottom: '32px' }}>
                        <h4 style={S.title}>Dokumen Administratif</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={row2}>
                                <SingleFileDrop label="Persyaratan Administratif" fileKey="persyaratan_administratif" file={typedFiles.persyaratan_administratif} existingFile={existingByType.persyaratan_administratif} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                                <SingleFileDrop label="Surat Pernyataan Komitmen" fileKey="surat_pernyataan" file={typedFiles.surat_pernyataan} existingFile={existingByType.surat_pernyataan} onChange={handleTypedFileChange} onRemove={handleTypedFileRemove} />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <a href={`/csms/pjo/detail/${id}`}
                            style={{ padding: '9px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            Batal
                        </a>
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={saving}
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
