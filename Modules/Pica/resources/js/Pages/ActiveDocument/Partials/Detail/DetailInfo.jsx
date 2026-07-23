import React from 'react';

const S = {
    sectionTitle: { fontSize: '11px', fontWeight: 800, color: 'var(--primary)', margin: '0 0 10px 0', textTransform: 'uppercase' },
    fieldLabel: { fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' },
    fieldValue: { fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' },
    divider: { borderBottom: '1px solid var(--border-color)', marginBottom: '16px', paddingBottom: '16px' },
};

export default function DetailInfo({ doc, onPreviewFile }) {
    if (!doc) return null;
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
            <div style={S.divider}>
                <p style={S.sectionTitle}>Non-Compliance</p>
                <span style={S.fieldLabel}>Deskripsi</span>
                <p style={{ ...S.fieldValue, marginTop: 0 }}>{doc.non_compliance || '-'}</p>
            </div>

            {doc.non_compliance_root_cause && (
                <div style={S.divider}>
                    <p style={S.sectionTitle}>Root Cause</p>
                    <p style={{ ...S.fieldValue, marginTop: 0 }}>{doc.non_compliance_root_cause}</p>
                </div>
            )}

            <div style={S.divider}>
                <p style={S.sectionTitle}>Corrective Action</p>
                <p style={{ ...S.fieldValue, marginTop: 0 }}>{doc.corrective_action || '-'}</p>
            </div>

            {doc.remarks && (
                <div style={S.divider}>
                    <p style={S.sectionTitle}>Remarks</p>
                    <p style={{ ...S.fieldValue, marginTop: 0 }}>{doc.remarks}</p>
                </div>
            )}

            {/* File Lampiran */}
            {doc.pica_files?.length > 0 && (
                <div>
                    <p style={S.sectionTitle}>File Lampiran</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {doc.pica_files.map(f => (
                            <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                    {f.file ? f.file.split('/').pop() : f.id}
                                </span>
                                <button
                                    onClick={() => onPreviewFile && onPreviewFile(f)}
                                    style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px' }}
                                >
                                    Preview
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}