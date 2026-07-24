import React from 'react';
import { AlertOctagon, CheckSquare, FileText, Info } from 'lucide-react';

const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
};

const S = {
    sectionTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    fieldValue: { fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' },
};

function SectionCard({ icon: Icon, iconColor, title, children }) {
    return (
        <div style={cardStyle}>
            <h4 style={S.sectionTitle}>
                <Icon size={15} style={{ color: iconColor || 'var(--primary)' }} />
                {title}
            </h4>
            {children}
        </div>
    );
}

export default function DetailInfo({ doc, onPreviewFile }) {
    if (!doc) return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Non-Compliance & Root Cause */}
            <SectionCard icon={AlertOctagon} iconColor="#ef4444" title="Non-Compliance">
                <p style={S.fieldValue}>{doc.non_compliance || '-'}</p>
                {doc.non_compliance_root_cause && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <h5 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                            Root Cause
                        </h5>
                        <p style={S.fieldValue}>{doc.non_compliance_root_cause}</p>
                    </div>
                )}
            </SectionCard>

            {/* Corrective Action */}
            <SectionCard icon={CheckSquare} iconColor="#10b981" title="Corrective Action">
                <p style={S.fieldValue}>{doc.corrective_action || '-'}</p>
            </SectionCard>

            {/* Remarks */}
            {doc.remarks && (
                <SectionCard icon={Info} iconColor="var(--primary)" title="Remarks">
                    <p style={S.fieldValue}>{doc.remarks}</p>
                </SectionCard>
            )}

            {/* File Lampiran */}
            {doc.pica_files?.length > 0 && (
                <SectionCard icon={FileText} iconColor="var(--primary)" title="File Lampiran">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {doc.pica_files.map(f => (
                            <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <span
                                    onClick={() => onPreviewFile && onPreviewFile(f)}
                                    style={{ fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                >
                                    {f.file ? f.file.split('/').pop() : f.id}
                                </span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <a
                                        href={`/api/pica/files/${f.id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textDecoration: 'none', padding: '2px 8px' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}
        </div>
    );
}
