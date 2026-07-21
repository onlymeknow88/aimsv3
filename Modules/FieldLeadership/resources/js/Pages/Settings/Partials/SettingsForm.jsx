import React from 'react';
import { Save, Check } from 'lucide-react';

export default function SettingsForm({
    form,
    setFieldValue,
    onSubmit,
    saving,
    saved,
    fetching,
    errors = {},
}) {
    const fields = [
        { key: 'max_item_member', label: 'Batas Maksimum Anggota Tim (Member)', desc: 'Jumlah maksimum personil yang dapat ditambahkan sebagai anggota tim dalam satu observasi.' },
        { key: 'max_item_positive_condition', label: 'Batas Maksimum Kondisi Positif', desc: 'Jumlah maksimum item perilaku/kondisi positif yang dapat dicatat.' },
        { key: 'max_item_risk_condition', label: 'Batas Maksimum Kondisi Beresiko', desc: 'Jumlah maksimum item kondisi beresiko (KTA/TTA) yang dapat dicatat.' },
        { key: 'max_item_corrective_action', label: 'Batas Maksimum Tindakan Perbaikan', desc: 'Jumlah maksimum rencana tindakan perbaikan per temuan beresiko.' },
    ];

    if (fetching) {
        return (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Memuat konfigurasi...
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {fields.map(item => (
                    <div key={item.key} style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                            {item.label}
                        </label>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                            {item.desc}
                        </p>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={form[item.key] ?? 0}
                            onChange={e => setFieldValue(item.key, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                fontSize: '13px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors[item.key] && (
                            <span style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                {errors[item.key][0]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                {saved && (
                    <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Tersimpan!
                    </span>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 20px',
                        backgroundColor: saving ? '#94a3b8' : 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Save size={14} />
                    {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </button>
            </div>
        </form>
    );
}
