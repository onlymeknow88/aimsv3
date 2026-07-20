import React from 'react';
import FileDropzone from '@/Components/FileDropzone';
import { FileText, Image } from 'lucide-react';

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

export default function NewsAndUpdateModal({
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
                style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '620px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {/* Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {editId ? 'Edit News & Update' : 'Tambah News & Update'}
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

                    {/* Title */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Judul *</label>
                        <input
                            required
                            value={form.title || ''}
                            onChange={e => setField('title', e.target.value)}
                            placeholder="Masukkan judul berita / pengumuman..."
                            style={inputStyle}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Konten / Deskripsi</label>
                        <textarea
                            value={form.description || ''}
                            onChange={e => setField('description', e.target.value)}
                            placeholder="Tulis isi berita atau pengumuman..."
                            rows={5}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Visibility</label>
                        <select
                            value={form.visible || 'true'}
                            onChange={e => setField('visible', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="true">Visible (Tampil)</option>
                            <option value="false">Hidden (Sembunyikan)</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                            Attachment (Gambar / PDF)
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>Opsional — maks. 10MB</span>
                        </label>
                        <FileDropzone
                            accept="image/*,application/pdf"
                            onFileDrop={(files) => setField('file', files[0])}
                        />
                        {form.file && (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {form.file.type.startsWith('image/') ? <Image size={14} color="#3b82f6" /> : <FileText size={14} color="#3b82f6" />}
                                    <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>
                                        {form.file.name} ({(form.file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setField('file', null)}
                                    style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                >
                                    Hapus
                                </button>
                            </div>
                        )}
                        {/* Image preview */}
                        {form.file && form.file.type.startsWith('image/') && (
                            <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <img
                                    src={URL.createObjectURL(form.file)}
                                    alt="preview"
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        )}
                    </div>
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