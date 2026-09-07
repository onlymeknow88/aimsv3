import { AlertTriangle, CheckCircle2, FileText, MessageSquare, Paperclip } from 'lucide-react';
import React from 'react';

const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
};

function SectionCard({ icon: Icon, iconColor, title, children }) {
    return (
        <div style={cardStyle}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            <SectionCard icon={AlertTriangle} iconColor="var(--danger)" title="Non-Compliance">
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>{doc.non_compliance || '-'}</p>
            </SectionCard>

            {doc.non_compliance_root_cause && (
                <SectionCard icon={FileText} title="Root Cause">
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>{doc.non_compliance_root_cause}</p>
                </SectionCard>
            )}

            <SectionCard icon={CheckCircle2} iconColor="var(--success)" title="Corrective Action">
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>{doc.corrective_action || '-'}</p>
            </SectionCard>

            {doc.remarks && (
                <SectionCard icon={MessageSquare} title="Remarks">
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>{doc.remarks}</p>
                </SectionCard>
            )}

            {/* File Lampiran */}
            {doc.pica_files?.length > 0 && (
                <SectionCard icon={Paperclip} title={`File Lampiran (${doc.pica_files.length})`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {doc.pica_files.map(f => (
                            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                <button
                                    type="button"
                                    onClick={() => onPreviewFile && onPreviewFile(f)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                                >
                                    <Paperclip size={11} />
                                    {f.file ? f.file.split('/').pop() : f.id}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {f.size && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.size}</span>}
                                    <a
                                        href={`/api/pica/files/${f.id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
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
