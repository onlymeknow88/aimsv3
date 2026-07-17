import React from 'react';

export default function DocumentSystemConfig() {
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>Konfigurasi Sistem</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                {[
                    { label: 'Company Code', value: 'PAMA', desc: 'Digunakan sebagai prefix nomor dokumen.' },
                    { label: 'Max Upload Size', value: '20 MB', desc: 'Maksimal ukuran file yang bisa diupload.' },
                    { label: 'Allowed Types', value: 'PDF, DOCX, XLSX, PNG, JPG', desc: 'Tipe file yang diizinkan untuk lampiran.' },
                    { label: 'Document Levels', value: 'SOP, TS, MN, WIN, FORM', desc: 'Level hierarki dokumen standar.' },
                ].map(cfg => (
                    <div key={cfg.label} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px 16px', backgroundColor: '#fafbfc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{cfg.label}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{cfg.value}</span>
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cfg.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
