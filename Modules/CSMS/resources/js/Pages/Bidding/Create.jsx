import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, HardHat, Save, Loader2 } from 'lucide-react';

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
    });
    const [masterData, setMasterData] = useState({ service_criterias: [], classifications: [] });
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);
    const [masterLoading, setMasterLoading] = useState(true);

    useEffect(() => {
        fetch('/api/csms/master-data')
            .then(r => r.json())
            .then(d => setMasterData(d?.data ?? {}))
            .finally(() => setMasterLoading(false));
    }, []);

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = () => {
        setSaving(true);
        setErrors({});
        fetch('/api/csms/biddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content,
            },
            body: JSON.stringify(form),
        })
        .then(r => r.json())
        .then(d => {
            if (d?.data?.id) {
                window.location.href = `/csms/bidding/detail/${d.data.id}`;
            } else if (d?.errors) {
                setErrors(d.errors);
            }
        })
        .catch(() => {})
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
                                <label style={S.label}>Nama Perusahaan <span style={{ color: '#ef4444' }}>*</span></label>
                                <input value={form.company_name} onChange={e => set('company_name', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.company_name ? '#ef4444' : 'var(--border-color)' }}
                                    placeholder="PT. Nama Kontraktor" />
                                {errors.company_name && <span style={S.error}>{errors.company_name[0]}</span>}
                            </div>
                            <div>
                                <label style={S.label}>No. Lisensi <span style={{ color: '#ef4444' }}>*</span></label>
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
                                <label style={S.label}>Kriteria Layanan <span style={{ color: '#ef4444' }}>*</span></label>
                                <select value={form.service_criteria} onChange={e => set('service_criteria', e.target.value)}
                                    style={{ ...S.input, borderColor: errors.service_criteria ? '#ef4444' : 'var(--border-color)' }}>
                                    <option value="">-- Pilih Kriteria --</option>
                                    {(masterData.service_criterias ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.service_criteria && <span style={S.error}>{errors.service_criteria[0]}</span>}
                            </div>
                            <div>
                                <label style={S.label}>Klasifikasi</label>
                                <select value={form.classification} onChange={e => set('classification', e.target.value)} style={S.input}>
                                    <option value="">-- Pilih Klasifikasi --</option>
                                    {(masterData.classifications ?? []).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={row2}>
                            <div>
                                <label style={S.label}>Tanggal</label>
                                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={S.input} />
                            </div>
                        </div>
                    </div>
                </div>

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