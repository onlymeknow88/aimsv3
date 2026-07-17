import React from 'react';
import { Download } from 'lucide-react';

export default function DownloadButton({ onClick, label = 'Download', small = false }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: small ? '4px 10px' : '8px 16px',
                fontSize: small ? '10px' : '12px',
                fontWeight: 700,
                cursor: 'pointer',
            }}
        >
            <Download size={small ? 12 : 14} />
            {label}
        </button>
    );
}
