import React from 'react';

export default function SectionWaktuKunjungan({
    labelStyle, inputStyle, cardStyle, sectionTitleStyle,
    visitTime, setVisitTime,
}) {
    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Jumlah Waktu Kunjungan</h3>
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: '220px' }}>
                <input
                    type="number"
                    min="0"
                    value={visitTime}
                    onChange={e => setVisitTime(e.target.value)}
                    placeholder="0"
                    style={{ ...inputStyle, borderRadius: '6px 0 0 6px', borderRight: 'none' }}
                />
                <span style={{
                    padding: '8px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0 6px 6px 0',
                    backgroundColor: '#f8fafc',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}>
                    Menit
                </span>
            </div>
        </div>
    );
}