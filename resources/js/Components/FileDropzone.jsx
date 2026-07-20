import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

export default function FileDropzone({ onFileDrop, accept = '.pdf,.docx,.xlsx,.png,.jpg' }) {
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFileDrop(files);
    }, [onFileDrop]);
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) onFileDrop(files);
        e.target.value = '';
    };

    return (
        <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed var(--border-color)', borderRadius: '8px',
                padding: '24px', cursor: 'pointer',
                backgroundColor: '#fafbfc', gap: '8px',
            }}
        >
            <Upload size={24} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Drag & drop berkas atau <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>pilih dari perangkat</span>
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{accept}</span>
            <input type="file" hidden multiple accept={accept} onChange={handleChange} />
        </label>
    );
}
