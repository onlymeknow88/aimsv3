import React from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

export default function SectionPenanggungJawab({
    labelStyle, inputStyle, cardStyle, sectionTitleStyle,
    pjaId, setPjaId, pjaList, sectionId,
    isAreaSuitable, setIsAreaSuitable,
    isImmediateAction, setIsImmediateAction,
    type, setType,
    personilOnReview, setPersonilOnReview,
    personilOnReviewName, setPersonilOnReviewName,
    job, setJob,
    errors,
}) {
    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Penanggung Jawab &amp; Field Leadership</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>

                {/* PJA */}
                <div>
                    <label style={labelStyle}>
                        Penanggung Jawab Area (PJA) <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <SearchableSelect
                        options={pjaList.map(p => ({
                            id: p.id,
                            name: p.name + (p.area_name && p.area_name !== '—' ? ` — ${p.area_name}` : ''),
                        }))}
                        value={pjaId}
                        onChange={setPjaId}
                        placeholder={!sectionId ? 'Pilih Section dulu' : '— Pilih PJA —'}
                    />
                    {!sectionId && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pilih Section terlebih dahulu</span>
                    )}
                    {errors.pja_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.pja_id[0]}</span>}
                </div>

                {/* Jenis FL */}
                <div>
                    <label style={labelStyle}>
                        Jenis Field Leadership <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                        <option value="Planned Task Observation">Planned Task Observation (PTO)</option>
                        <option value="Take Time Talk">Take Time Talk (TTT)</option>
                        <option value="Hazard Report">Hazard Report</option>
                    </select>
                    {errors.type && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.type[0]}</span>}
                </div>

                {/* Jumlah Personil */}
                <div>
                    <label style={labelStyle}>Jumlah Personil Yang Diamati</label>
                    <input
                        type="number"
                        min="0"
                        value={personilOnReview}
                        onChange={e => setPersonilOnReview(e.target.value)}
                        placeholder="0"
                        style={inputStyle}
                    />
                </div>

                {/* Nama Personil */}
                <div>
                    <label style={labelStyle}>Nama Personil Yang Diamati</label>
                    <input
                        type="text"
                        value={personilOnReviewName}
                        onChange={e => setPersonilOnReviewName(e.target.value)}
                        placeholder="Nama personil yang diamati"
                        style={inputStyle}
                    />
                </div>

            </div>

            {/* Checkbox: Tindak Lanjut Saat Itu */}
            <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-primary)' }}>
                    <input
                        type="checkbox"
                        checked={isImmediateAction}
                        onChange={e => setIsImmediateAction(e.target.checked)}
                    />
                    Apakah tindak lanjut dilakukan saat itu juga?
                </label>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', marginLeft: '20px' }}>
                    Centang jika tindakan korektif langsung dilakukan di tempat saat observasi.
                </div>
            </div>

            {/* Checkbox Area Suitable — tampil hanya jika is_immediate_action = true */}
            {isImmediateAction && (
                <div style={{ marginBottom: '16px', padding: '10px 12px', backgroundColor: 'rgba(21,59,115,0.04)', borderRadius: '8px', border: '1px solid rgba(21,59,115,0.1)' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-primary)' }}>
                        <input
                            type="checkbox"
                            checked={isAreaSuitable}
                            onChange={e => setIsAreaSuitable(e.target.checked)}
                        />
                        Apakah Area Kerja Sesuai dengan PJA yang Ditunjuk?
                    </label>
                    {!isAreaSuitable && (
                        <div style={{ marginTop: '6px', marginLeft: '20px', fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>
                            ⚠ Area tidak sesuai — dokumen akan dikirim ke CRS untuk ganti PJA setelah disubmit.
                        </div>
                    )}
                </div>
            )}

            {/* Tugas / SOP */}
            <div>
                <label style={labelStyle}>Tugas / SOP / WI yang Diamati</label>
                <textarea
                    rows={3}
                    value={job}
                    onChange={e => setJob(e.target.value)}
                    placeholder="Deskripsikan tugas, SOP, atau WI yang diamati..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </div>
        </div>
    );
}
