import { Building, Calendar, MapPin, User } from 'lucide-react';

import React from 'react';

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

export default function PtwDetailLeftSidebar({ document }) {
    const initials = (document.user?.name || '?')
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

            {/* Pembuat */}
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
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.user?.name || '—'}</span>
                    </div>
                    <MetaRow icon={Calendar} label="Tanggal"
                        value={document.doc_created ? new Date(document.doc_created).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                </div>
            </div>

            {/* Perusahaan */}
            <div style={card}>
                <h4 style={sectionTitle}>Perusahaan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={Building} label="Company"    value={document.department?.company?.company_name} />
                    <MetaRow icon={Building} label="Department" value={document.department?.name} />
                </div>
            </div>

            {/* Lokasi */}
            <div style={card}>
                <h4 style={sectionTitle}>Lokasi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={MapPin} label="Detail Location" value={document.detail_location} />
                    {document.inactive_at && (
                        <MetaRow icon={Calendar} label="Nonaktif Pada"
                            value={new Date(document.inactive_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
                    )}
                </div>
            </div>

            {/* Penanggung jawab */}
            <div style={card}>
                <h4 style={sectionTitle}>Penanggung Jawab</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={User} label="PJA" value={document.areaManager?.user?.name || document.areaManager?.name} />
                </div>
            </div>
        </div>
    );
}
