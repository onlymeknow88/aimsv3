import React from 'react';
import { Plus, X } from 'lucide-react';

export default function SectionKondisiPositif({
    labelStyle, inputStyle, cardStyle, sectionTitleStyle,
    positiveConditions,
    addPositiveCondition,
    removePositiveCondition,
    updatePositiveCondition,
    maxPositive,
}) {
    const atLimit = maxPositive > 0 && positiveConditions.length >= maxPositive;

    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Perilaku / Kondisi Positif Yang Diamati</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {positiveConditions.map((pos, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <textarea
                            rows={3}
                            value={pos.description}
                            onChange={e => updatePositiveCondition(idx, e.target.value)}
                            placeholder={`Kondisi positif #${idx + 1}...`}
                            style={{ ...inputStyle, flex: 1, resize: 'vertical' }}
                        />
                        {positiveConditions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removePositiveCondition(idx)}
                                style={{
                                    flexShrink: 0, background: 'none',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px', padding: '7px 9px',
                                    cursor: 'pointer', color: 'var(--danger)',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addPositiveCondition}
                disabled={atLimit}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', border: '1px solid var(--border-color)',
                    borderRadius: '6px', backgroundColor: '#fff',
                    fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)',
                    cursor: atLimit ? 'not-allowed' : 'pointer',
                    opacity: atLimit ? 0.5 : 1,
                }}
            >
                <Plus size={13} />
                Tambah Kondisi Positif{maxPositive > 0 ? ` (${positiveConditions.length}/${maxPositive})` : ''}
            </button>
        </div>
    );
}