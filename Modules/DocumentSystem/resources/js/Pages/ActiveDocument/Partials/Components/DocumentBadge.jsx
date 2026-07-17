import React from 'react';

const levelColors = {
    SOP:  { bg: '#EFF6FF', text: '#2563EB' },
    TS:   { bg: '#F0FDF4', text: '#16A34A' },
    MN:   { bg: '#FFF7ED', text: '#C2410C' },
    WIN:  { bg: '#FAF5FF', text: '#7C3AED' },
    FORM: { bg: '#FFF1F2', text: '#BE123C' },
};

export default function DocumentBadge({ level }) {
    const style = levelColors[level] || { bg: '#F1F5F9', text: '#475569' };
    return (
        <span style={{
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: style.bg,
            color: style.text,
            padding: '2px 8px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
        }}>
            {level}
        </span>
    );
}
