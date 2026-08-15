import React from 'react';
import { X, BarChart2 } from 'lucide-react';

const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '13px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#fff',
    transition: 'border-color 0.15s',
};

const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: 700, color: '#0f172a', marginBottom: '6px',
};

const FIELDS = [
    { key: 'coal_shiping',  label: 'Coal Shiping' },
    { key: 'waste_removal', label: 'Waste Removal' },
    { key: 'coal_mining',   label: 'Coal Mining' },
    { key: 'coal_hauling',  label: 'Coal Hauling' },
    { key: 'coal_barged',   label: 'Coal Barged' },
];

export default function ProductionModal({
    isOpen, editId, form, setField,
    onSubmit, onClose, submitting, formError,
}) {
    if (!isOpen) return null;

    const handleFocus = (e) => (e.target.style.borderColor = '#2563eb');
    const handleBlur  = (e) => (e.target.style.borderColor = '#e2e8f0');

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(15,23,42,0.65)',
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1100, padding: '16px',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff', borderRadius: '16px',
                    width: '100%', maxWidth: '520px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden', maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart2 size={16} color="#2563eb" />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {editId ? 'Edit Data Production' : 'Tambah Data Production'}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form
                    id="production-form"
                    onSubmit={onSubmit}
                    style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                    {formError && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px', color: '#dc2626' }}>
                            {typeof formError === 'string' ? formError : JSON.stringify(formError)}
                        </div>
                    )}

                    {/* Month */}
                    <div>
                        <label style={labelStyle}>Bulan <span style={{ color: '#dc2626' }}>*</span></label>
                        <input
                            type="month"
                            value={form.month}
                            onChange={e => setField('month', e.target.value)}
                            style={inputStyle}
                            onFocus={handleFocus} onBlur={handleBlur}
                            required
                        />
                    </div>

                    {/* Production fields - 2 column grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        {FIELDS.map(f => (
                            <div key={f.key}>
                                <label style={labelStyle}>{f.label} <span style={{ color: '#dc2626' }}>*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form[f.key]}
                                    onChange={e => setField(f.key, e.target.value)}
                                    placeholder="0.00"
                                    style={inputStyle}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </form>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose}
                        style={{ padding: '9px 20px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Batal
                    </button>
                    <button type="submit" form="production-form" disabled={submitting}
                        style={{ padding: '9px 20px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? (editId ? 'Menyimpan…' : 'Menambahkan…') : (editId ? 'Simpan Perubahan' : 'Tambah Data')}
                    </button>
                </div>
            </div>
        </div>
    );
}
