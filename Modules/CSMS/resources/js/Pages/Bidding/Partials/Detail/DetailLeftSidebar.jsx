import { Building, Calendar, FileText, User } from 'lucide-react';
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

export default function DetailLeftSidebar({ bidding }) {
    const initials = (bidding.maker_name || '?')
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bidding.maker_name || '—'}</span>
                    </div>
                    <MetaRow icon={Calendar} label="Tanggal"
                        value={bidding.date ? new Date(bidding.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                </div>
            </div>

            {/* Info Perusahaan */}
            <div style={card}>
                <h4 style={sectionTitle}>Perusahaan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={Building} label="Nama Perusahaan"      value={bidding.company_name} />
                    <MetaRow icon={Building} label="Jenis Badan Usaha"    value={bidding.business_entity_name} />
                    <MetaRow icon={Building} label="No. Lisensi"          value={bidding.license_number} />
                    <MetaRow icon={Building} label="Alamat"               value={bidding.address} />
                    <MetaRow icon={Building} label="Site / Lokasi"        value={bidding.company_site} />
                    <MetaRow icon={Building} label="Klasifikasi"          value={bidding.classification} />
                    {bidding.classification === 'Sub-Kontraktor' && (
                        <MetaRow icon={Building} label="Perusahaan Induk" value={bidding.parent_name} />
                    )}
                </div>
            </div>

            {/* Kriteria */}
            <div style={card}>
                <h4 style={sectionTitle}>Kriteria & Dokumen</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetaRow icon={FileText} label="CCOW"               value={bidding.ccow_name} />
                    <MetaRow icon={FileText} label="Kriteria Layanan"   value={bidding.service_criteria} />
                    <MetaRow icon={FileText} label="Kategori Risiko"    value={bidding.risk_category} />
                    <MetaRow icon={FileText} label="No. Dokumen CSMS"   value={bidding.csms_doc_number} />
                    <MetaRow icon={User}     label="Penanggung Jawab"   value={bidding.person_in_charge} />
                </div>
            </div>

        </div>
    );
}