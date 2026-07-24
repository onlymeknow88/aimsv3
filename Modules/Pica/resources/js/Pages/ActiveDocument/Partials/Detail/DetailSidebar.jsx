import React from 'react';
import { Building, Calendar, FileText, MapPin, User } from 'lucide-react';

function MetaRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
            <Icon size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
                <span style={{ fontSize: '10px', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{value || '—'}</span>
            </div>
        </div>
    );
}

export default function DetailSidebar({ doc }) {
    if (!doc) return null;

    const initials = (doc.created_by?.name || '?')
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dibuat Oleh */}
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
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.created_by?.name || '—'}</span>
                    </div>
                </div>
            </div>

            {/* Perusahaan & Seksi */}
            <div style={card}>
                <h4 style={sectionTitle}>Perusahaan & Seksi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={Building} label="CCOW" value={doc.ccow?.company_name} />
                    <MetaRow icon={Building} label="Kontraktor" value={doc.company?.company_name} />
                    <MetaRow icon={Building} label="Detail Kontraktor" value={doc.company_detail} />
                    <MetaRow icon={MapPin} label="Seksi" value={doc.section?.name} />
                </div>
            </div>

            {/* Lokasi */}
            <div style={card}>
                <h4 style={sectionTitle}>Lokasi</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={MapPin} label="Area Location" value={doc.area_location?.name} />
                    <MetaRow icon={MapPin} label="Detail Lokasi" value={doc.location_detail} />
                </div>
            </div>

            {/* Penanggung Jawab */}
            <div style={card}>
                <h4 style={sectionTitle}>Penanggung Jawab</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={User} label="Auditor" value={doc.auditor} />
                    <MetaRow icon={User} label="PJA" value={doc.pja?.user?.name} />
                    <MetaRow icon={User} label="PJO/KTT" value={doc.pjo?.name} />
                </div>
            </div>

            {/* Waktu & Source */}
            <div style={card}>
                <h4 style={sectionTitle}>Tanggal & Source</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={Calendar} label="Tanggal Temuan" value={doc.date ? new Date(doc.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                    <MetaRow icon={Calendar} label="Target Selesai" value={doc.target_settlement_date ? new Date(doc.target_settlement_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                    <MetaRow icon={Calendar} label="Tanggal Selesai" value={doc.settlement_date ? new Date(doc.settlement_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                    <MetaRow icon={FileText} label="Source" value={doc.source} />
                    <MetaRow icon={FileText} label="Tipe" value={doc.type} />
                </div>
            </div>
        </div>
    );
}
