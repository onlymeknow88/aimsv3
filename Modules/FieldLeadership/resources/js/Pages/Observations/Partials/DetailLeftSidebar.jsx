import React from 'react';
import { Building, MapPin, User, Calendar } from 'lucide-react';

function MetaRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
            <Icon size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
                <span style={{ fontSize: '10px', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{value || '—'}</span>
            </div>
        </div>
    );
}

export default function DetailLeftSidebar({ obs }) {
    const initials = (obs.created_by_name || '?')
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const card = {
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
    };
    const sectionTitle = {
        fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
        marginBottom: '12px', textTransform: 'uppercase',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' }}>

            {/* Creator card */}
            <div style={card}>
                <h4 style={sectionTitle}>Dibuat Oleh</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, var(--primary), #2563EB)',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700,
                        }}>
                            {initials}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{obs.created_by_name || '—'}</span>
                    </div>
                    <MetaRow icon={Calendar} label="Tanggal"
                        value={obs.date ? new Date(obs.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                </div>
            </div>

            {/* Perusahaan card */}
            <div style={card}>
                <h4 style={sectionTitle}>Perusahaan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={Building} label="CCOW"           value={obs.ccow_name} />
                    <MetaRow icon={Building} label="Company"        value={obs.company_name} />
                    <MetaRow icon={Building} label="Detail Company" value={obs.detail_company} />
                </div>
            </div>

            {/* Lokasi card */}
            <div style={card}>
                <h4 style={sectionTitle}>Lokasi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={MapPin} label="Department"      value={obs.department_name} />
                    <MetaRow icon={MapPin} label="Section"         value={obs.section_name} />
                    <MetaRow icon={MapPin} label="Area Location"   value={obs.area_location_name} />
                    <MetaRow icon={MapPin} label="Detail Location" value={obs.detail_location} />
                </div>
            </div>

            {/* Area warning */}
            {obs.is_area_suitable === false && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', marginBottom: '3px' }}>⚠ Area Tidak Sesuai PJA</div>
                    <div style={{ fontSize: '11px', color: '#991b1b', lineHeight: 1.4 }}>Perbarui PJA melalui tombol Edit.</div>
                </div>
            )}

            {/* PJA card */}
            <div style={card}>
                <h4 style={sectionTitle}>Penanggung Jawab</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={User} label="PJA"       value={obs.pja_name} />
                    <MetaRow icon={User} label="KTT / PJO" value={obs.pjo_name} />
                </div>
            </div>
        </div>
    );
}
