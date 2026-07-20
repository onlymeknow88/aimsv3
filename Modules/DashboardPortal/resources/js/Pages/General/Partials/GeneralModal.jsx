import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
};

const KpiField = ({ label, valueField, markField, valuePlaceholder, form, setField }) => (
    <div>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
            {label}
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
            <input
                type="number"
                min="0"
                value={form[valueField] ?? ''}
                onChange={e => setField(valueField, e.target.value)}
                placeholder={valuePlaceholder}
                style={{ ...inputStyle, flex: 1 }}
            />
            {/* UP / DOWN toggle */}
            <button
                type="button"
                onClick={() => setField(markField, form[markField] === 'UP' ? 'DOWN' : 'UP')}
                title={`Trend: ${form[markField]}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '9px 14px',
                    border: '1.5px solid',
                    borderColor: form[markField] === 'UP' ? '#16a34a' : '#dc2626',
                    borderRadius: '8px',
                    backgroundColor: form[markField] === 'UP' ? '#f0fdf4' : '#fef2f2',
                    color: form[markField] === 'UP' ? '#16a34a' : '#dc2626',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    minWidth: '90px',
                    justifyContent: 'center',
                }}
            >
                {form[markField] === 'UP'
                    ? <><TrendingUp size={14} /> UP</>
                    : <><TrendingDown size={14} /> DOWN</>
                }
            </button>
        </div>
    </div>
);

export default function GeneralModal({
    isOpen,
    onClose,
    onSubmit,
    editId,
    form,
    setField,
    submitting,
    formError,
}) {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
            <form
                onSubmit={onSubmit}
                style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {/* Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {editId ? 'Edit Data General KPI' : 'Tambah Data General KPI'}
                    </h3>
                    <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
                    {formError && (
                        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}

                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        Klik tombol trend (UP/DOWN) untuk mengubah indikator perbandingan periode sebelumnya.
                    </p>

                    <KpiField
                        label="Project to Date (Hari)"
                        valueField="project_to_date"
                        markField="project_to_date_mark"
                        valuePlaceholder="Jumlah hari..."
                        form={form}
                        setField={setField}
                    />

                    <KpiField
                        label="Manhours (Jam)"
                        valueField="manhours"
                        markField="manhours_mark"
                        valuePlaceholder="Jumlah jam..."
                        form={form}
                        setField={setField}
                    />

                    <KpiField
                        label="Day After Last LTI (Hari)"
                        valueField="day_after_last_lti"
                        markField="day_after_last_lti_mark"
                        valuePlaceholder="Jumlah hari setelah LTI terakhir..."
                        form={form}
                        setField={setField}
                    />

                    <KpiField
                        label="Manpower (Orang)"
                        valueField="manpower"
                        markField="manpower_mark"
                        valuePlaceholder="Jumlah orang..."
                        form={form}
                        setField={setField}
                    />
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: '9px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{ padding: '9px 20px', border: 'none', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
}