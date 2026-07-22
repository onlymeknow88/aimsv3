import React, { useState, useEffect } from 'react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Save, ArrowLeft } from 'lucide-react';

const sectionStyle = { backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle   = { fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' };
const inputStyle   = { width: '100%', padding: '10px 14px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const rowStyle     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function PjoCreate() {
    const [form, setForm]             = useState({ name: '', number_pjo: '', company_id: '', phone: '', email: '', date_of_birth: '', date_submission: '' });
    const [companies, setCompanies]   = useState([]);
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetch('/api/csms/master-data').then(r => r.json()).then(d => setCompanies(d?.data?.companies ?? []));
    }, []);

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = () => {
        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        fetch('/api/csms/pjos', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
            body: fd,
        })
        .then(r => r.json())
        .then(d => {
            if (d?.errors) { setErrors(d.errors); }
            else { window.location.href = '/csms/pjo/lists'; }
        })
        .catch(() => {})
        .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    return (
        <CSMSLayout>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <a href="/csms/pjo/lists" style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} />
                    </a>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Tambah PJO Baru</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Data Penanggung Jawab Operasional kontraktor</p>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 }}>Data PJO</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>No. PJO <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={form.number_pjo} onChange={e => set('number_pjo', e.target.value)}
                                    style={{ ...inputStyle, borderColor: errors.number_pjo ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="PJO-XXXX" />
                                {errors.number_pjo && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.number_pjo[0]}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={form.name} onChange={e => set('name', e.target.value)}
                                    style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="Nama PJO" />
                                {errors.name && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.name[0]}</span>}
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Perusahaan</label>
                            <select value={form.company_id} onChange={e => set('company_id', e.target.value)} style={inputStyle}>
                                <option value="">-- Pilih Perusahaan --</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Telepon</label>
                                <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="+62xxx" />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="email@perusahaan.com" />
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <label style={labelStyle}>Tanggal Lahir</label>
                                <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Tanggal Pengajuan</label>
                                <input type="date" value={form.date_submission} onChange={e => set('date_submission', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href="/csms/pjo/lists" style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Batal</a>
                    <button onClick={() => setShowConfirm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Save size={14} /> Simpan PJO
                    </button>
                </div>
            </div>

            <ConfirmationModal isOpen={showConfirm} type="draft" loading={saving} confirmText="Simpan" onConfirm={handleSubmit} onCancel={() => setShowConfirm(false)} />
        </CSMSLayout>
    );
}