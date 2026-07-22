import React from 'react';
import { PTO_QUESTIONS } from '../Hooks/useObservationForm';

const ANSWER_OPTIONS = ['Ya', 'Tidak', 'Tidak Berlaku'];

const ANSWER_COLOR = {
    'Ya':           { active: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    'Tidak':        { active: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    'Tidak Berlaku':{ active: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

export default function SectionPertanyaanPTO({
    inputStyle, cardStyle, sectionTitleStyle,
    answers, setAnswers,
}) {
    const setAnswer = (key, field, value) =>
        setAnswers(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Pertanyaan Field Leadership (PTO)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PTO_QUESTIONS.map((q, idx) => {
                    const current = answers[q.key]?.answer || '';
                    return (
                        <div
                            key={q.key}
                            style={{
                                backgroundColor: '#fff',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '14px 16px',
                            }}
                        >
                            {/* Nomor + teks pertanyaan */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <span style={{
                                    flexShrink: 0,
                                    width: '22px', height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: '#fff',
                                    fontSize: '11px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {idx + 1}
                                </span>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                                    {q.text}
                                </p>
                            </div>

                            {/* Pilihan jawaban (badge toggle) */}
                            {q.has_answer && (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {ANSWER_OPTIONS.map(opt => {
                                        const cfg = ANSWER_COLOR[opt];
                                        const isActive = current === opt;
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setAnswer(q.key, 'answer', isActive ? '' : opt)}
                                                style={{
                                                    padding: '5px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    border: `1.5px solid ${isActive ? cfg.active : cfg.border}`,
                                                    backgroundColor: isActive ? cfg.bg : '#f8fafc',
                                                    color: isActive ? cfg.active : 'var(--text-muted)',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Keterangan */}
                            <textarea
                                rows={2}
                                value={answers[q.key]?.description || ''}
                                onChange={e => setAnswer(q.key, 'description', e.target.value)}
                                placeholder="Keterangan tambahan (opsional)..."
                                style={{ ...inputStyle, resize: 'vertical', fontSize: '12px' }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
