import React from 'react';
import { Plus, X } from 'lucide-react';
import FileDropzone from '@/Components/FileDropzone';

export default function SectionKondisiRisiko({
    inputStyle, cardStyle, sectionTitleStyle,
    isHazardReport,
    riskConditions,
    addRiskCondition,
    removeRiskCondition,
    updateRiskCondition,
    categories,
    typeKtaTta,
    potencies,
    maxRisk,
    errors,
}) {
    const atLimit = maxRisk > 0 && riskConditions.length >= maxRisk;
    const labelStyle = { fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' };

    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
                {isHazardReport ? 'Kondisi Beresiko yang Diamati' : 'Perilaku / Kondisi Beresiko yang Diamati'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                {riskConditions.map((risk, idx) => {
                    const selectedCat = categories.find(c => String(c.id) === String(risk.category_id));
                    const filteredTypes = typeKtaTta.filter(t => {
                        if (!selectedCat) return true;
                        if (selectedCat.name === 'Kondisi Tidak Aman')  return t.type === 'KTA' || t.type === 'Kondisi Tidak Aman';
                        if (selectedCat.name === 'Tindakan Tidak Aman') return t.type === 'TTA' || t.type === 'Tindakan Tidak Aman';
                        return true;
                    });

                    return (
                        <div
                            key={idx}
                            style={{
                                backgroundColor: '#f8fafc',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '16px',
                            }}
                        >
                            {/* Row header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                                    Temuan Risiko #{idx + 1}
                                </span>
                                {riskConditions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRiskCondition(idx)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--danger)', display: 'inline-flex',
                                            alignItems: 'center', gap: '4px', fontSize: '11px',
                                        }}
                                    >
                                        <X size={13} /> Hapus
                                    </button>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={labelStyle}>
                                    Deskripsi Temuan <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={risk.description}
                                    onChange={e => updateRiskCondition(idx, 'description', e.target.value)}
                                    placeholder="Deskripsikan kondisi beresiko yang ditemukan..."
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                                {errors[`risks.${idx}.description`] && (
                                    <span style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                        {errors[`risks.${idx}.description`][0]}
                                    </span>
                                )}
                            </div>

                            {/* Kategori + KTA/TTA + Potensi */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Kategori</label>
                                    {isHazardReport ? (
                                        <input
                                            type="text"
                                            value="Kondisi Tidak Aman"
                                            disabled
                                            style={{ ...inputStyle, backgroundColor: '#e2e8f0', color: 'var(--text-muted)' }}
                                        />
                                    ) : (
                                        <select
                                            value={risk.category_id}
                                            onChange={e => updateRiskCondition(idx, 'category_id', e.target.value)}
                                            style={inputStyle}
                                        >
                                            <option value="">— Pilih Kategori —</option>
                                            {categories
                                                .filter(c => ['Kondisi Tidak Aman', 'Tindakan Tidak Aman'].includes(c.name))
                                                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                            }
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label style={labelStyle}>Jenis KTA / TTA</label>
                                    <select
                                        value={risk.type_id}
                                        onChange={e => updateRiskCondition(idx, 'type_id', e.target.value)}
                                        disabled={!risk.category_id && !isHazardReport}
                                        style={{ ...inputStyle, backgroundColor: (!risk.category_id && !isHazardReport) ? '#f8fafc' : '#fff' }}
                                    >
                                        <option value="">— Pilih Jenis —</option>
                                        {filteredTypes.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.code ? `${t.code} — ` : ''}{t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Tingkat Risiko / Potensi</label>
                                    <select
                                        value={risk.potency_id}
                                        onChange={e => updateRiskCondition(idx, 'potency_id', e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">— Pilih Potensi —</option>
                                        {potencies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={labelStyle}>
                                    {risk.repaired ? 'Tanggal Tindakan Perbaikan' : 'Tanggal Rencana Pemenuhan Perbaikan'}
                                    <span style={{ color: 'var(--danger)' }}> *</span>
                                </label>
                                <input
                                    type="date"
                                    value={risk.due_date}
                                    onChange={e => updateRiskCondition(idx, 'due_date', e.target.value)}
                                    style={{ ...inputStyle, maxWidth: '220px' }}
                                />
                                {errors[`risks.${idx}.due_date`] && (
                                    <span style={{ color: 'var(--danger)', fontSize: '11px' }}>
                                        {errors[`risks.${idx}.due_date`][0]}
                                    </span>
                                )}
                            </div>

                            {/* Checkbox repaired (non-hazard only) */}
                            {!isHazardReport && (
                                <div style={{ marginBottom: risk.repaired ? '12px' : '0' }}>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-primary)' }}>
                                        <input
                                            type="checkbox"
                                            checked={risk.repaired}
                                            onChange={e => updateRiskCondition(idx, 'repaired', e.target.checked)}
                                        />
                                        Apakah Langsung Dilakukan Perbaikan?
                                    </label>
                                </div>
                            )}

                            {/* Upload Lampiran Temuan Risiko */}
                            <div style={{ marginTop: '8px' }}>
                                <label style={labelStyle}>Lampiran Temuan Risiko</label>
                                <FileDropzone
                                    accept=".pdf,.png,.jpeg,.jpg"
                                    onFileDrop={files => updateRiskCondition(idx, 'files', [...(risk.files || []), ...files])}
                                />
                                {(risk.files || []).length > 0 && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {(risk.files || []).map((f, fi) => (
                                            <div key={fi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '11px' }}>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>{f.name}</span>
                                                <button type="button" onClick={() => updateRiskCondition(idx, 'files', (risk.files || []).filter((_, i) => i !== fi))}
                                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Repair detail (when repaired = true) */}
                            {risk.repaired && (
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    padding: '14px',
                                    marginTop: '8px',
                                }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={labelStyle}>
                                            Tindakan Perbaikan <span style={{ color: 'var(--danger)' }}>*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={risk.repair_action}
                                            onChange={e => updateRiskCondition(idx, 'repair_action', e.target.value)}
                                            placeholder="Deskripsikan tindakan perbaikan yang dilakukan..."
                                            style={{ ...inputStyle, resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>Jenis Tindakan Perbaikan</label>
                                            <select
                                                value={risk.type_action}
                                                onChange={e => updateRiskCondition(idx, 'type_action', e.target.value)}
                                                style={inputStyle}
                                            >
                                                <option value="">— Pilih Jenis —</option>
                                                <option value="Eliminasi">Eliminasi</option>
                                                <option value="Substitusi">Substitusi</option>
                                                <option value="Teknik Rekayasa">Teknik Rekayasa</option>
                                                <option value="Administrasi">Administrasi</option>
                                                <option value="Alat Pelindung Diri">Alat Pelindung Diri</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Nama Pengawas (PIC)</label>
                                            <input
                                                type="text"
                                                value={risk.supervisor}
                                                onChange={e => updateRiskCondition(idx, 'supervisor', e.target.value)}
                                                placeholder="Nama pengawas / PIC"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    {/* Upload Lampiran Tindakan Perbaikan */}
                                    <div>
                                        <label style={labelStyle}>Lampiran Tindakan Perbaikan</label>
                                        <FileDropzone
                                            accept=".pdf,.png,.jpeg,.jpg"
                                            onFileDrop={files => updateRiskCondition(idx, 'filesCA', [...(risk.filesCA || []), ...files])}
                                        />
                                        {(risk.filesCA || []).length > 0 && (
                                            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {(risk.filesCA || []).map((f, fi) => (
                                                    <div key={fi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '11px' }}>
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>{f.name}</span>
                                                        <button type="button" onClick={() => updateRiskCondition(idx, 'filesCA', (risk.filesCA || []).filter((_, i) => i !== fi))}
                                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={addRiskCondition}
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
                Tambah Temuan Risiko{maxRisk > 0 ? ` (${riskConditions.length}/${maxRisk})` : ''}
            </button>
        </div>
    );
}
