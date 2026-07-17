import React from 'react';

export default function HazardRow({ step, hazard, control, ppe, onChange, onDelete }) {
    return (
        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '8px 12px', fontSize: '11px' }}>
                <input value={step} onChange={e => onChange('step', e.target.value)}
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', outline: 'none' }}
                />
            </td>
            <td style={{ padding: '8px 12px', fontSize: '11px' }}>
                <input value={hazard} onChange={e => onChange('hazard', e.target.value)}
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', outline: 'none' }}
                />
            </td>
            <td style={{ padding: '8px 12px', fontSize: '11px' }}>
                <input value={control} onChange={e => onChange('control', e.target.value)}
                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', outline: 'none' }}
                />
            </td>
            <td style={{ padding: '8px 12px', fontSize: '11px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ppe || '-'}</span>
            </td>
            <td style={{ padding: '8px 12px' }}>
                <button onClick={onDelete} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                    ✕
                </button>
            </td>
        </tr>
    );
}
