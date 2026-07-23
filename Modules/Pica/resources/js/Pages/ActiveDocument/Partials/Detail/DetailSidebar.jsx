import React from 'react';

const S = {
    label: { fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px', display: 'block' },
    value: { fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 },
    section: { marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' },
};

function InfoRow({ label, value }) {
    return (
        <div style={{ marginBottom: '10px' }}>
            <span style={S.label}>{label}</span>
            <span style={S.value}>{value || '-'}</span>
        </div>
    );
}

export default function DetailSidebar({ doc }) {
    if (!doc) return null;
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', height: 'fit-content' }}>
            <div style={S.section}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Info Perusahaan</p>
                <InfoRow label="CCOW"        value={doc.ccow?.company_name} />
                <InfoRow label="Kontraktor"  value={doc.company?.company_name} />
                <InfoRow label="Seksi"       value={doc.section?.name} />
                <InfoRow label="Lokasi"      value={doc.area_location?.name} />
                <InfoRow label="Detail Lok." value={doc.location_detail} />
            </div>
            <div style={S.section}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Info PIC</p>
                <InfoRow label="Auditor" value={doc.auditor_name} />
                <InfoRow label="PJA"     value={doc.pja?.user?.name} />
                <InfoRow label="PJO/KTT" value={doc.pjo?.name} />
            </div>
            <div style={S.section}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Tanggal</p>
                <InfoRow label="Tanggal Temuan"  value={doc.date ? new Date(doc.date).toLocaleDateString('id-ID') : null} />
                <InfoRow label="Target Selesai"  value={doc.target_settlement_date ? new Date(doc.target_settlement_date).toLocaleDateString('id-ID') : null} />
                <InfoRow label="Tanggal Selesai" value={doc.settlement_date ? new Date(doc.settlement_date).toLocaleDateString('id-ID') : null} />
            </div>
            <div>
                <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Source</p>
                <InfoRow label="Source" value={doc.source} />
                <InfoRow label="Tipe"   value={doc.type} />
                <InfoRow label="Dibuat" value={doc.created_by?.name} />
            </div>
        </div>
    );
}
