import React, { useState, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2, FileText, Upload, X } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '@/Components/ConfirmationModal';

const sectionStyle = { backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle   = { fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' };
const inputStyle   = { width: '100%', padding: '10px 14px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const rowStyle     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function PjoEdit() {
    const { id } = usePage().props;
    const [form, setForm]             = useState(null);
    const [companies, setCompanies]   = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [loading, setLoading]       = useState(true);
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
                    name: p.name ?? '',
                    number_pjo: p.number_pjo ?? '',
                    company_id: p.company_id ?? '',
                    ccow_id: p.ccow_id ?? '',
                    phone: p.phone ?? '',
                    email: p.email ?? '',
                    date_of_birth: p.date_of_birth ?? '',
                    date_submission: p.date_submission ?? '',
                    submission: p.submission ?? '',
                    status: p.status ?? 'Draft'
                });
                setExistingFiles(detail?.files ?? []);
            }
            setCompanies(master?.companies ?? []);
        }).finally(() => setLoading(false));
    }, [id]);

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (idx) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});
        const fd = new FormData();
        fd.append('_method', 'PUT');

        Object.entries(form).forEach(([k, v]) => {
            if (v) fd.append(k, v);
        });
        selectedFiles.forEach(file => {
            fd.append('files[]', file);
        });

        axios.post(`/api/csms/pjos/${id}`, fd)
        .then(() => {
            window.location.href = `/csms/pjo/detail/${id}`;
        })
        .catch(err => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        })
        .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    if (loading || !form) return <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Memuat data...</div>;

    const ccows = companies.filter(c => c.type === 'Internal');
    const regularCompanies = companies.filter(c => c.type !== 'Internal');

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Edit PJO: ${form.name}`} />

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a href={`/csms/pjo/detail/${id}`} style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} />
                    </a>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Edit PJO</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Ubah informasi data PJO</p>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 }}>Data PJO</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Perusahaan <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={form.company_id} onChange={e => set('company_id', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih Perusahaan --</option>
                                    {regularCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.company_id && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.company_id[0]}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>CCOW <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={form.ccow_id} onChange={e => set('ccow_id', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih CCOW --</option>
                                    {ccows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.ccow_id && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.ccow_id[0]}</span>}
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>No. PJO *</label>
                                <input value={form.number_pjo} onChange={e => set('number_pjo', e.target.value)} style={inputStyle} />
                                {errors.number_pjo && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.number_pjo[0]}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>Nama Lengkap *</label>
                                <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
                                {errors.name && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.name[0]}</span>}
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Pengajuan (Submission)</label>
                                <input value={form.submission} onChange={e => set('submission', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Telepon</label>
                                <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Tanggal Lahir</label>
                                <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Tanggal Pengajuan</label>
                                <input type="date" value={form.date_submission} onChange={e => set('date_submission', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                                    <option value="Draft">Draft</option>
                                    <option value="Active">Active</option>
                                    <option value="On Going">On Going</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
                            <label style={labelStyle}>Upload File Berkas Pendukung Baru</label>
                            <input type="file" multiple onChange={handleFileChange} style={{ fontSize: '12px' }} />
                            {selectedFiles.length > 0 && (
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {selectedFiles.map((f, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                                                <FileText size={14} color="var(--primary)" /> {f.name}
                                            </span>
                                            <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} style={{ color: '#ef4444' }} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {existingFiles.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Berkas Terupload:</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {existingFiles.map(file => (
                                            <a key={file.id} href={file.blob_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'underline', fontSize: '11px' }}>
                                                <FileText size={13} /> {file.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/csms/pjo/detail/${id}`} style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                    <button onClick={() => setShowConfirm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Save size={14} /> Simpan Perubahan
                    </button>
                </div>
            </div>

            <ConfirmationModal isOpen={showConfirm} type="draft" loading={saving} confirmText="Simpan" onConfirm={handleSubmit} onCancel={() => setShowConfirm(false)} />
        </div>
    );
}
