import React from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    inputRO: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b', boxSizing: 'border-box' },
    title: { fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger)', marginTop: '4px' },
    card: { marginBottom: '32px' },
};
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export const emptyProposalForm = { area: '', ko_unit_id: '', spip_category_id: '', spip_type_id: '', spip_unit_id: '', company_id: '', ccow_id: '', department_id: '', other_department: '', applicant_email: '', pjo_id: '', internal_komisioning_schedule: '', next_commissioning: '', temporary_validity_period: '', commissioning_period: '' };

// Form section proposal gaya FieldLeadership + cascade SPIP ala aims
// (Kategori -> Klasifikasi -> Deskripsi SPIP -> Call Sign). Dipakai Create & Edit.
export default function ProposalForm({ form, setField, errors, master }) {
    const categories = master.categories ?? [];
    const types = (master.types ?? []).filter(t => !form.spip_category_id || String(t.ko_spip_category_id) === String(form.spip_category_id));
    const spipUnits = (master.spipUnits ?? master.spip_units ?? []).filter(u => !form.spip_type_id || String(u.ko_spip_type_id) === String(form.spip_type_id));
    const units = (master.units ?? []).filter(u => !form.spip_unit_id || String(u.ko_spip_unit_id) === String(form.spip_unit_id));
    const selectedUnit = (master.units ?? []).find(u => String(u.id) === String(form.ko_unit_id));

    const pickCascade = (key, val, resets) => {
        setField(key, val);
        resets.forEach(k => setField(k, ''));
    };

    return (
        <>
            <div style={S.card}>
                <p style={S.title}>Informasi Pengajuan</p>
                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>CCOW</label>
                        <SearchableSelect
                            options={(master.companies ?? []).map(c => ({ id: c.id, name: c.company_name || c.name }))}
                            value={form.ccow_id}
                            onChange={v => setField('ccow_id', v)}
                            placeholder="— Pilih CCOW —"
                        />
                    </div>
                    <div>
                        <label style={S.label}>Area Kerja <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <SearchableSelect
                            options={(master.areas ?? []).map(a => ({ id: a, name: a }))}
                            value={form.area}
                            onChange={v => setField('area', v)}
                            placeholder="— Pilih Area —"
                        />
                        {errors.area && <p style={S.error}>{errors.area}</p>}
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Kategori SPIP</label>
                        <SearchableSelect
                            options={categories.map(c => ({ id: c.id, name: c.name }))}
                            value={form.spip_category_id}
                            onChange={v => pickCascade('spip_category_id', v, ['spip_type_id', 'spip_unit_id', 'ko_unit_id'])}
                            placeholder="— Pilih Kategori —"
                        />
                    </div>
                    <div>
                        <label style={S.label}>Klasifikasi SPIP</label>
                        <SearchableSelect
                            options={types.map(t => ({ id: t.id, name: t.name }))}
                            value={form.spip_type_id}
                            onChange={v => pickCascade('spip_type_id', v, ['spip_unit_id', 'ko_unit_id'])}
                            placeholder="— Pilih Klasifikasi —"
                        />
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Deskripsi SPIP</label>
                        <SearchableSelect
                            options={spipUnits.map(u => ({ id: u.id, name: u.name }))}
                            value={form.spip_unit_id}
                            onChange={v => pickCascade('spip_unit_id', v, ['ko_unit_id'])}
                            placeholder="— Pilih Deskripsi —"
                        />
                    </div>
                    <div>
                        <label style={S.label}>Call Sign</label>
                        <SearchableSelect
                            options={units.map(u => ({ id: u.id, name: `${u.call_sign} (${u.identity_number ?? '-'})` }))}
                            value={form.ko_unit_id}
                            onChange={v => setField('ko_unit_id', v)}
                            placeholder="— Pilih Call Sign —"
                        />
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Nomor STNK/IMB</label>
                        <input value={selectedUnit?.identity_number ?? ''} readOnly placeholder="Otomatis dari unit" style={S.inputRO} />
                    </div>
                    <div>
                        <label style={S.label}>Merk / Brand SPIP</label>
                        <input value={selectedUnit?.ko_brand?.name ?? ''} readOnly placeholder="Otomatis dari unit" style={S.inputRO} />
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Nomor Serial SPIP</label>
                        <input value={selectedUnit?.serial_number ?? ''} readOnly placeholder="Otomatis dari unit" style={S.inputRO} />
                    </div>
                    <div>
                        <label style={S.label}>Tahun Pembuatan Unit SPIP</label>
                        <input value={selectedUnit?.production_year ?? ''} readOnly placeholder="Otomatis dari unit" style={S.inputRO} />
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Perusahaan</label>
                        <SearchableSelect
                            options={(master.companies ?? []).map(c => ({ id: c.id, name: c.company_name || c.name }))}
                            value={form.company_id}
                            onChange={v => setField('company_id', v)}
                            placeholder="— Pilih Perusahaan —"
                        />
                    </div>
                    <div>
                        <label style={S.label}>Departemen</label>
                        <SearchableSelect
                            options={(master.departments ?? []).map(d => ({ id: d.id, name: d.name }))}
                            value={form.department_id}
                            onChange={v => setField('department_id', v)}
                            placeholder="— Pilih Departemen —"
                        />
                    </div>
                </div>

                <div style={{ ...row2, marginBottom: '16px' }}>
                    <div>
                        <label style={S.label}>Departemen Lainnya</label>
                        <input value={form.other_department} onChange={e => setField('other_department', e.target.value)} style={S.input} />
                    </div>
                    <div>
                        <label style={S.label}>Email Pemohon <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input value={form.applicant_email} onChange={e => setField('applicant_email', e.target.value)} placeholder="nama@email.com" style={S.input} />
                        {errors.applicant_email && <p style={S.error}>{errors.applicant_email}</p>}
                    </div>
                </div>

                <div style={{ ...row2 }}>
                    <div>
                        <label style={S.label}>PJO</label>
                        <SearchableSelect
                            options={(master.users ?? []).map(u => ({ id: u.id, name: u.name }))}
                            value={form.pjo_id}
                            onChange={v => setField('pjo_id', v)}
                            placeholder="— Pilih PJO —"
                        />
                    </div>
                    <div />
                </div>
            </div>

            <div style={S.card}>
                <p style={S.title}>Jadwal Komisioning</p>
                <div style={{ ...row2 }}>
                    <div>
                        <label style={S.label}>Jadwal Komisioning Internal</label>
                        <input type="date" value={form.internal_komisioning_schedule} onChange={e => setField('internal_komisioning_schedule', e.target.value)} style={{ ...S.input, maxWidth: '280px' }} />
                    </div>
                    <div>
                        <label style={S.label}>Komisioning Berikutnya</label>
                        <input type="date" value={form.next_commissioning} onChange={e => setField('next_commissioning', e.target.value)} style={{ ...S.input, maxWidth: '280px' }} />
                    </div>
                </div>
            </div>
        </>
    );
}
