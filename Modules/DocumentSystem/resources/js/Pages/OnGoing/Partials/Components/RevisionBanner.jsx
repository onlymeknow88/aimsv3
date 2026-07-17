import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function RevisionBanner({ revision, reason }) {
    if (!revision || revision === '0') return null;

    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            backgroundColor: 'rgba(255, 140, 36, 0.06)',
            border: '1px solid rgba(255, 140, 36, 0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
        }}>
            <AlertCircle size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
            <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', display: 'block' }}>
                    Revisi #{revision}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{reason || 'Dokumen ini sedang dalam siklus revisi.'}</span>
            </div>
        </div>
    );
}
