import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Settings, Save } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import axios from 'axios';

export default function Index({ params: serverParams }) {
    const [form, setForm] = useState({
        max_item_member:             0,
        max_item_positive_condition: 0,
        max_item_risk_condition:     0,
        max_item_corrective_action:  0,
    });
    const [loading, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [saved, setSaved]     = useState(false);

    useEffect(() => {
        // Use server props if available, otherwise fetch
        if (serverParams) {
            setForm({
                max_item_member:             serverParams.max_item_member             ?? 0,
                max_item_positive_condition: serverParams.max_item_positive_condition ?? 0,
                max_item_risk_condition:     serverParams.max_item_risk_condition     ?? 0,
                max_item_corrective_action:  serverParams.max_item_corrective_action  ?? 0,
            });
            setFetching(false);
            return;
        }
        axios.get('/api/field-leadership/master/parameters')
            .then(res => {
                const p = res.data?.result;
                if (p) setForm({
                    max_item_member:             p.max_item_member             ?? 0,
                    max_item_positive_condition: p.max_item_positive_condition ?? 0,
                    max_item_risk_condition:     p.max_item_risk_condition     ?? 0,
                    max_item_corrective_action:  p.max_item_corrective_action  ?? 0,
                });
            })
            .catch(err => console.error('Fetch params failed', err))
            .finally(() => setFetching(false));
    }, [serverParams]);

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: Number(val) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        try {
            await axios.put('/api/field-leadership/master/parameters', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Gagal menyimpan. Coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { key: 'max_item_member',             label: 'Maks. Anggota per Dokumen',          desc: 'Jumlah maksimum anggota yang dapat ditambahkan dalam satu observasi. 0 = tidak dibatasi.' },
        { key: 'max_item_positive_condition', label: 'Maks. Kondisi Positif per Dokumen',   desc: 'Jumlah maksimum kondisi positif yang dapat diinput. 0 = tidak dibatasi.' },
        { key: 'max_item_risk_condition',     label: 'Maks. Kondisi Risiko per Dokumen',    desc: 'Jumlah maksimum temuan risiko yang dapat diinput. 0 = tidak dibatasi.' },
        { key: 'max_item_corrective_action',  label: 'Maks. Tindakan Perbaikan per Risiko', desc: 'Jumlah maksimum corrective action per temuan risiko. 0 = tidak dibatasi.' },
    ];

    return (
        <FieldLeadershipLayout>
            <Head title="Settings — Field Leadership" />

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Settings size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Settings</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Konfigurasi parameter dan batas item untuk modul Field Leadership.</p>
            </div>

            {fetching ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat konfigurasi...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', maxWidth: '560px' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                            Parameter Batas Item
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {fields.map(f => (
                                <div key={f.key}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>{f.label}</label>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{f.desc}</p>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form[f.key]}
                                        onChange={e => set(f.key, e.target.value)}
                                        style={{ width: '120px', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', fontWeight: 700, outline: 'none', textAlign: 'center' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                            <button type="submit" disabled={loading}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', border: 'none', borderRadius: '8px', backgroundColor: loading ? '#94a3b8' : 'var(--primary)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                <Save size={14} />{loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                            {saved && (
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>✓ Berhasil disimpan</span>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </FieldLeadershipLayout>
    );
}
