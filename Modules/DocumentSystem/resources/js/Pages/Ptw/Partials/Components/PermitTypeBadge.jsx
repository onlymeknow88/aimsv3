import React from 'react';

const permitColors = {
    'Hot Work':            { bg: '#FFF1F2', text: '#BE123C', label: '🔥 Hot Work' },
    'Working at Height':   { bg: '#FFF7ED', text: '#C2410C', label: '⬆️ At Height' },
    'Confined Space':      { bg: '#FAF5FF', text: '#7C3AED', label: '🕳️ Confined Space' },
    'Electrical':          { bg: '#EFF6FF', text: '#2563EB', label: '⚡ Electrical' },
    'General':             { bg: '#F0FDF4', text: '#16A34A', label: '📋 General' },
};

export default function PermitTypeBadge({ type }) {
    const style = permitColors[type] || { bg: '#F1F5F9', text: '#475569', label: type };
    return (
        <span style={{
            fontSize: '9px', fontWeight: 800,
            backgroundColor: style.bg,
            color: style.text,
            padding: '3px 10px',
            borderRadius: '10px',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
        }}>
            {style.label}
        </span>
    );
}
