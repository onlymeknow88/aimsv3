import React from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

export default function SectionInfoUmum({
    labelStyle, inputStyle, cardStyle, sectionTitleStyle,
    masterLoading,
    date, setDate,
    ccowId, setCcowId, ccows,
    companyId, setCompanyId, companies,
    detailCompany,
    departmentId, setDepartmentId, departmentsList,
    sectionId, setSectionId, sectionsList,
    areaLocationId, setAreaLocationId, areaLocationsList,
    detailLocation, setDetailLocation,
    errors,
}) {
    return (
        <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Informasi Umum</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>

                {/* Tanggal */}
                <div>
                    <label style={labelStyle}>Tanggal <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={inputStyle}
                    />
                    {errors.date && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.date[0]}</span>}
                </div>

                {/* CCOW */}
                <div>
                    <label style={labelStyle}>CCOW <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <SearchableSelect
                        options={ccows.map(c => ({ id: c.id, name: c.company_name || c.name }))}
                        value={ccowId}
                        onChange={setCcowId}
                        placeholder={masterLoading ? 'Memuat...' : '— Pilih CCOW —'}
                    />
                    {errors.ccow_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.ccow_id[0]}</span>}
                </div>

                {/* Perusahaan */}
                <div>
                    <label style={labelStyle}>Perusahaan <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <SearchableSelect
                        options={companies.map(c => ({ id: c.id, name: c.company_name || c.name }))}
                        value={companyId}
                        onChange={setCompanyId}
                        placeholder={masterLoading ? 'Memuat...' : '— Pilih Perusahaan —'}
                    />
                    {errors.company_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.company_id[0]}</span>}
                </div>

                {/* Detail Perusahaan (read-only auto-fill) */}
                <div>
                    <label style={labelStyle}>Detail Perusahaan</label>
                    <input
                        type="text"
                        value={detailCompany}
                        disabled
                        placeholder="Terisi otomatis dari Perusahaan"
                        style={{ ...inputStyle, backgroundColor: '#f8fafc', color: 'var(--text-muted)' }}
                    />
                </div>

                {/* Department */}
                <div>
                    <label style={labelStyle}>Department</label>
                    <SearchableSelect
                        options={departmentsList.map(d => ({ id: d.id, name: d.name }))}
                        value={departmentId}
                        onChange={setDepartmentId}
                        placeholder={masterLoading ? 'Memuat...' : '— Pilih Department —'}
                    />
                    {errors.department_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.department_id[0]}</span>}
                </div>

                {/* Section */}
                <div>
                    <label style={labelStyle}>Section</label>
                    <SearchableSelect
                        options={sectionsList.map(s => ({ id: s.id, name: s.name }))}
                        value={sectionId}
                        onChange={setSectionId}
                        placeholder={!departmentId ? 'Pilih Department dulu' : '— Pilih Section —'}
                    />
                    {errors.section_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.section_id[0]}</span>}
                </div>

                {/* Area Location */}
                <div>
                    <label style={labelStyle}>Area Lokasi</label>
                    <SearchableSelect
                        options={areaLocationsList.map(l => ({ id: l.id, name: l.name }))}
                        value={areaLocationId}
                        onChange={setAreaLocationId}
                        placeholder={!sectionId ? 'Pilih Section dulu' : '— Pilih Area Lokasi —'}
                    />
                    {errors.area_location_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.area_location_id[0]}</span>}
                </div>

            </div>

            {/* Detail Location */}
            <div>
                <label style={labelStyle}>Detail Lokasi</label>
                <textarea
                    rows={3}
                    value={detailLocation}
                    onChange={e => setDetailLocation(e.target.value)}
                    placeholder="Deskripsi detail lokasi observasi..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </div>
        </div>
    );
}
