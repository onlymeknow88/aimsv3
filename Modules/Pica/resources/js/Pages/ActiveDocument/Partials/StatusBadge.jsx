import React from 'react';

const STATUS_STYLES = {
    'Draft':          { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
    'Open':           { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'On Review PJA':  { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    'On Review CRS':  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    'Overdue':        { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    'Closed':         { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
};

export default function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    return (
        <span style={{
            color: s.color,
            backgroundColor: s.bg,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
        }}>
            {status ?? '-'}
        </span>
    );
}