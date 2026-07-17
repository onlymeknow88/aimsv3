import React from 'react';

export default function DocumentNumberPreview({ company, dept, level, count }) {
    const pad = String(count + 1).padStart(3, '0');
    const preview = `${company || '???'}-${dept || '???'}-${level || '???'}-${pad}`;

    return (
        <div style={{
            padding: '10px 16px',
            backgroundColor: 'rgba(var(--primary-rgb), 0.04)',
            border: '1px dashed var(--primary)',
            borderRadius: '6px',
        }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PREVIEW NOMOR DOKUMEN</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', fontFamily: 'monospace' }}>
                {preview}
            </span>
        </div>
    );
}
