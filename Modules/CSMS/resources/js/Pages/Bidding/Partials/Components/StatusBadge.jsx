import React from 'react';

const STATUS_STYLES = {
    'Draft':               { color: '#64748b', backgroundColor: 'rgba(100,116,139,0.1)' },
    'On Review OHS':       { color: '#FF8C24', backgroundColor: 'rgba(255,140,36,0.08)' },
    'On Review D/H OHS':   { color: '#FF8C24', backgroundColor: 'rgba(255,140,36,0.08)' },
    'On Review KTT':       { color: '#2D7FF9', backgroundColor: 'rgba(45,127,249,0.08)' },
    'Approved':            { color: '#2FBF71', backgroundColor: 'rgba(47,191,113,0.08)' },
    'Inactive':            { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' },
    'Obsolate':            { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' },
};

export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] ?? { color: '#64748b', backgroundColor: 'rgba(100,116,139,0.1)' };
    return (
        <span style={{
            ...style,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'inline-block',
            whiteSpace: 'nowrap',
        }}>
            {status ?? '-'}
        </span>
    );
}