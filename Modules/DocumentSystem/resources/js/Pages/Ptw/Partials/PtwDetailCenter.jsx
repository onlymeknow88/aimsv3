import { ClipboardList, Download, FileText, Paperclip, Users } from 'lucide-react';
import React, { useState } from 'react';

import BlobPreviewModal from '@/Components/BlobPreviewModal';

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

function InfoRow({ label, value, valueStyle }) {
    return (
        <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ width: '200px', flexShrink: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)', ...valueStyle }}>{value || '—'}</span>
        </div>
    );
}

function AttachmentFiles({ files, onPreview }) {
    if (!files?.length) return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {files.map(f => {
                const label = f.file_name || (f.file_path ? f.file_path.split('/').pop() : 'File');
                return (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                        <button
                            type="button"
                            onClick={() => onPreview(f)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                        >
                            <Paperclip size={11} />
                            {label}
                        </button>
                        <a
                            href={`/api/document-system/attachments/${f.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                        >
                            <Download size={11} />
                        </a>
                    </div>
                );
            })}
        </div>
    );
}

export default function PtwDetailCenter({ document }) {
    const [previewFile, setPreviewFile] = useState(null);

    const handlePreview = (f) => setPreviewFile({
        ...f,
        file_name: f.file_name || (f.file_path ? f.file_path.split('/').pop() : 'File'),
        type: 'ptw',
    });

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Informasi PTW */}
                <SectionCard icon={ClipboardList} title="Informasi PTW">
                    <InfoRow label="Nomor Dokumen" value={document.document_number} valueStyle={{ fontWeight: 700 }} />
                    <InfoRow label="Judul" value={document.title} />
                    <InfoRow label="Detail Location" value={document.detail_location} />
                    <InfoRow label="Tanggal Dibuat"
                        value={document.doc_created ? new Date(document.doc_created).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                    {document.inactive_at && (
                        <InfoRow label="Nonaktif Pada"
                            value={new Date(document.inactive_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            valueStyle={{ color: 'var(--danger)', fontWeight: 700 }} />
                    )}
                </SectionCard>

                {/* Deskripsi */}
                {document.description && (
                    <SectionCard icon={FileText} title="Deskripsi / Rincian Pekerjaan">
                        <div
                            className="rich-content-view"
                            style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.7 }}
                            dangerouslySetInnerHTML={{ __html: document.description }}
                        />
                    </SectionCard>
                )}

                {/* Lampiran */}
                {document.attachments?.length > 0 && (
                    <SectionCard icon={Paperclip} title={`Lampiran / Dokumen Pendukung (${document.attachments.length})`}>
                        <AttachmentFiles files={document.attachments} onPreview={handlePreview} />
                    </SectionCard>
                )}

                {/* Invited people */}
                {document.peoples?.length > 0 && (
                    <SectionCard icon={Users} title={`Invited People (${document.peoples.length})`}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {document.peoples.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #2563EB)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                                        {((p.user?.name || p.email || '?')[0] || '?').toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.user?.name || p.email}</div>
                                        {p.user?.name && <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.email}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}
            </div>

            {previewFile && (
                <BlobPreviewModal
                    attachment={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </>
    );
}
