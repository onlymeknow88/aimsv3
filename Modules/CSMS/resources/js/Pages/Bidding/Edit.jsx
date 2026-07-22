import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Save, ArrowLeft } from 'lucide-react';

const sectionStyle = { backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle   = { fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' };
const inputStyle   = { width: '100%', padding: '10px 14px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };
const rowStyle     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function BiddingEdit() {
    const { id } = usePage().props;
    const [form, setForm]           = useState(null);
    const [checklists, setChecklists] = useState([]);
    const [masterData, setMasterData] = useState({ service_criterias: [], classifications: [] });
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetch(`/api/csms/biddings/${id}`).then(r => r.json()),
            fetch('/api/csms/master-data').then(r => r.json()),
        ]).then(([detail, master]) => {
            const b = detail?.data?.bidding;
            if (b) {
                setForm({
                    company_name: b.company_name ?? '', address: b.address ?? '',
                    company_site: b.company_site ?? '', license_number: b.license_number ?? '',
                    service_criteria: b.service_criteria ?? '', classification: b.classification ?? '',
                    person_in_charge: b.person_in_charge ?? '', date: b.date ?? '',
                    business_entity_id: b.business_entity_id ?? '',
                });
                setChecklists(detail?.data?.checklists ?? []);
            }
            setMasterData(master?.data ?? {});
        }).finally(() => setLoading(false));
    }, [id]);

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
    const setChecklist = (clId, field, val) => setChecklists(prev =>
        prev.map(c => c.id === clId ? { ...c, [field]: val } : c)
    );

    const handleSubmit = () => {
        setSaving(true);
        fetch(`/api/csms/biddings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
            body: JSON.stringify({ ...form, checklists }),
        })
        .then(r => r.json())
        .then(d => {
            if (d?.errors) { setErrors(d.errors); }
            else { window.location.href = `/csms/bidding/detail/${id}`; }
        })
        .catch(() => {})
        .finally(() => { setSaving(false); setShowConfirm(false); });
    };

    if (loading || !form) return <CSMSLayout><div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data...</div></CSMSLayout>;

    return (
        <CSMSLayout>
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
                                <label style={labelStyle}>Kriteria Layanan *</label>
                                <select value={form.service_criteria} onChange={e => set('service_criteria', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih --</option>
                                    {(masterData.service_criterias ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Klasifikasi</label>
                                <select value={form.classification} onChange={e => set('classification', e.target.value)} style={inputStyle}>
                                    <option value="">-- Pilih --</option>
                                    {(masterData.classifications ?? []).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist */}
                {checklists.length > 0 && (
                    <div style={sectionStyle}>
                        <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 }}>Checklist Audit ({checklists.length} butir)</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {checklists.map((cl, i) => (
                                <div key={cl.id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>{i + 1}. {cl.sub_point}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                                        <select value={cl.value ?? ''} onChange={e => setChecklist(cl.id, 'value', e.target.value)}
                                            style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff' }}>
                                            <option value="">-- Pilih --</option>
                                            <option value="Ya">Ya</option>
                                            <option value="Tidak">Tidak</option>
                                            <option value="Tidak Berlaku">Tidak Berlaku</option>
                                        </select>
                                        <input value={cl.comment ?? ''} onChange={e => setChecklist(cl.id, 'comment', e.target.value)}
                                            placeholder="Catatan (opsional)"
                                            style={{ padding: '8px 10px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff' }} />
                                    </div>
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