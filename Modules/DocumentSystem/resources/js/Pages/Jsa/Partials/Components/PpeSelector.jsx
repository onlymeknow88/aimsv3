import React from 'react';

const ppeItems = [
    { id: 'helmet', label: '⛑️ Helm' },
    { id: 'harness', label: '🦺 Harness' },
    { id: 'gloves', label: '🧤 Sarung Tangan' },
    { id: 'boots', label: '👢 Sepatu Safety' },
    { id: 'goggles', label: '🥽 Kacamata' },
    { id: 'ear_protection', label: '🎧 Ear Plug' },
    { id: 'respirator', label: '😷 Respirator' },
];

export default function PpeSelector({ selected = [], onChange }) {
    const toggle = (id) => {
        const newSelected = selected.includes(id)
            ? selected.filter(s => s !== id)
            : [...selected, id];
        onChange(newSelected);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ppeItems.map(item => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    style={{
                        border: `1px solid ${selected.includes(item.id) ? 'var(--primary)' : 'var(--border-color)'}`,
                        backgroundColor: selected.includes(item.id) ? 'rgba(var(--primary-rgb), 0.06)' : '#fafbfc',
                        color: selected.includes(item.id) ? 'var(--primary)' : 'var(--text-secondary)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '10px',
                        fontWeight: selected.includes(item.id) ? 700 : 500,
                        cursor: 'pointer',
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
