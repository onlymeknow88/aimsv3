import React, { useRef } from 'react';
import { X, AlertTriangle, Paperclip, Trash2 } from 'lucide-react';

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

const CATEGORIES = ['Safety', 'Security', 'Environmental', 'Health', 'Quality', 'Operational', 'Other'];

export default function IncidentNotificationModal({
    isOpen, editId, form, setField,
    onSubmit, onClose, submitting, formError,
}) {
    const fileInputRef = useRef(null);
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
                    width: '100%', maxWidth: '560px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden', maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={16} color="#dc2626" />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {editId ? 'Edit Incident Notification' : 'Tambah Incident Notification'}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form
                    id="incident-notification-form"
                    onSubmit={onSubmit}
                    style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {formError && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px', color: '#dc2626' }}>
                            {typeof formError === 'string' ? formError : JSON.stringify(formError)}
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <label style={labelStyle}>Tanggal <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="date" value={form.date} onChange={e => setField('date', e.target.value)}
                            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                    </div>

                    {/* Case */}
                    <div>
                        <label style={labelStyle}>Kasus / Judul <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="text" value={form.case} onChange={e => setField('case', e.target.value)}
                            placeholder="Deskripsi singkat kasus..." style={inputStyle}
                            onFocus={handleFocus} onBlur={handleBlur} required />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>Kategori <span style={{ color: '#dc2626' }}>*</span></label>
                        <select value={form.category} onChange={e => setField('category', e.target.value)}
                            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required>
                            <option value="">-- Pilih Kategori --</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Deskripsi <span style={{ color: '#dc2626' }}>*</span></label>
                        <textarea value={form.description} onChange={e => setField('description', e.target.value)}
                            placeholder="Jelaskan detail incident..." rows={4}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                            onFocus={handleFocus} onBlur={handleBlur} required />
                    </div>

                    {/* File */}
                    <div>
                        <label style={labelStyle}>Lampiran (opsional)</label>
                        <input ref={fileInputRef} type="file" style={{ display: 'none' }}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            onChange={e => { setField('file', e.target.files?.[0] ?? null); e.target.value = ''; }} />
                        {form.file ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                                <Paperclip size={14} color="#64748b" />
                                <span style={{ fontSize: '12px', color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.file.name}</span>
                                <button type="button" onClick={() => setField('file', null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '2px' }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Paperclip size={14} /> Pilih file...
                            </button>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose}
                        style={{ padding: '9px 20px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Batal
                    </button>
                    <button type="submit" form="incident-notification-form" disabled={submitting}
                        style={{ padding: '9px 20px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? (editId ? 'Menyimpan…' : 'Menambahkan…') : (editId ? 'Simpan Perubahan' : 'Tambah Data')}
                    </button>
                </div>
            </div>
        </div>
    );
}
