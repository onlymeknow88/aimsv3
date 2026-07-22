import React from 'react';
import { Plus, X } from 'lucide-react';

export default function SectionAnggotaTim({
    labelStyle, inputStyle, cardStyle, sectionTitleStyle,
    members, addMember, removeMember, updateMember,
    memberInternals, memberExternals,
    limitMember,
    errors = {},
}) {
    const atLimit = limitMember > 0 && members.length >= limitMember;

    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Anggota Tim</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {members.map((mem, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                        {/* Tipe */}
                        <div style={{ width: '160px', flexShrink: 0 }}>
                            <select
                                value={mem.type}
                                onChange={e => updateMember(idx, 'type', e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">— Tipe —</option>
                                <option value="Internal">Internal</option>
                                <option value="Contractor">Contractor</option>
                                <option value="SubContractor">SubContractor</option>
                            </select>
                            {errors[`members.${idx}.type`] && (
                                <span style={{ color: 'var(--danger)', fontSize: '11px' }}>Tipe anggota wajib dipilih.</span>
                            )}
                        </div>

                        {/* Employee */}
                        <div style={{ flex: 1 }}>
                            <select
                                value={mem.employee_id}
                                onChange={e => updateMember(idx, 'employee_id', e.target.value)}
                                disabled={!mem.type}
                                style={{ ...inputStyle, backgroundColor: !mem.type ? '#f8fafc' : '#fff' }}
                            >
                                <option value="">— Pilih Karyawan —</option>
                                {(mem.type === 'Internal' ? memberInternals : memberExternals).map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            {errors[`members.${idx}.employee_id`] && (
                                <span style={{ color: 'var(--danger)', fontSize: '11px' }}>Nama anggota wajib dipilih.</span>
                            )}
                        </div>

                        {/* Remove */}
                        {members.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeMember(idx)}
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
                onClick={addMember}
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
                Tambah Anggota{limitMember > 0 ? ` (${members.length}/${limitMember})` : ''}
            </button>
        </div>
    );
}
