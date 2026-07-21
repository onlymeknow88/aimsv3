import React from 'react';

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>

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
                    <select
                        value={ccowId}
                        onChange={e => setCcowId(e.target.value)}
                        disabled={masterLoading}
                        style={inputStyle}
                    >
                        <option value="">{masterLoading ? 'Memuat...' : '— Pilih CCOW —'}</option>
                        {ccows.map(c => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
                    </select>
                    {errors.ccow_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.ccow_id[0]}</span>}
                </div>

                {/* Perusahaan */}
                <div>
                    <label style={labelStyle}>Perusahaan <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <select
                        value={companyId}
                        onChange={e => setCompanyId(e.target.value)}
                        disabled={masterLoading}
                        style={inputStyle}
                    >
                        <option value="">{masterLoading ? 'Memuat...' : '— Pilih Perusahaan —'}</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
                    </select>
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
                    <select
                        value={departmentId}
                        onChange={e => setDepartmentId(e.target.value)}
                        style={{ ...inputStyle, backgroundColor: masterLoading ? '#f8fafc' : '#fff' }}
                        disabled={masterLoading}
                    >
                        <option value="">— Pilih Department —</option>
                        {departmentsList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    {errors.department_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.department_id[0]}</span>}
                </div>

                {/* Section */}
                <div>
                    <label style={labelStyle}>Section</label>
                    <select
                        value={sectionId}
                        onChange={e => setSectionId(e.target.value)}
                        disabled={!departmentId}
                        style={{ ...inputStyle, backgroundColor: !departmentId ? '#f8fafc' : '#fff' }}
                    >
                        <option value="">— Pilih Section —</option>
                        {sectionsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {errors.section_id && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.section_id[0]}</span>}
                </div>

                {/* Area Location */}
                <div>
                    <label style={labelStyle}>Area Lokasi</label>
                    <select
                        value={areaLocationId}
                        onChange={e => setAreaLocationId(e.target.value)}
                        disabled={!sectionId}
                        style={{ ...inputStyle, backgroundColor: !sectionId ? '#f8fafc' : '#fff' }}
                    >
                        <option value="">— Pilih Area Lokasi —</option>
                        {areaLocationsList.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
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