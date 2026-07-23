import React, { useState } from 'react';
import { CheckCircle, Download, Eye, FileText, Image, MinusCircle, Paperclip, XCircle } from 'lucide-react';
import BlobPreviewModal from '@/Components/BlobPreviewModal';

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '16px',
};

const sectionTitle = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
    marginBottom: '12px', textTransform: 'uppercase',
};

function isImageFile(name) {
    return /\.(png|jpe?g|gif|webp)$/i.test(name || '');
}
function isPdfFile(name) {
    return /\.pdf$/i.test(name || '');
}
function FileIcon({ name }) {
    if (isImageFile(name)) return <Image size={12} color="#2563eb" />;
    return <FileText size={12} color="#64748b" />;
}

// Attachment list per checklist item
function AttachmentList({ attachments }) {
    const [selected, setSelected] = useState(null);
    if (!attachments || attachments.length === 0) return null;

    return (
        <>
            {selected && (
                <BlobPreviewModal
                    attachment={selected}
                    onClose={() => setSelected(null)}
                />
            )}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <Paperclip size={11} color="#94a3b8" />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Dokumen Bukti ({attachments.length})
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {attachments.map((att, i) => {
                        const name     = att.name || att.file?.split('/').pop() || ('File ' + (i + 1));
                        const ext      = name.split('.').pop().toLowerCase();
                        const img      = isImageFile(name);
                        const pdf      = isPdfFile(name);
                        const canPreview = img || pdf;

                        // Build attachment object for BlobPreviewModal
                        const modalAtt = {
                            id:        att.id,
                            type:      'csms_checklist',
                            file_name: name,
                            file_type: ext,
                            blob_url:  att.blob_url || null,
                            path:      att.file || null,
                        };

                        const downloadUrl = att.blob_url
                            || ('/api/csms/checklist-attachments/' + att.id + '/download');

                        return (
                            <div
                                key={att.id || i}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', gap: '8px',
                                    padding: '6px 10px',
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                }}
                            >
                                {/* File info — nama file sebagai link preview */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                                    <FileIcon name={name} />
                                    {canPreview ? (
                                        <button
                                            onClick={() => setSelected(modalAtt)}
                                            style={{
                                                flex: 1, minWidth: 0,
                                                background: 'none', border: 'none', padding: 0,
                                                fontSize: '11px', fontWeight: 600,
                                                color: '#2563eb', cursor: 'pointer',
                                                textAlign: 'left',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                textDecoration: 'underline', textUnderlineOffset: '2px',
                                            }}
                                        >
                                            {name}
                                        </button>
                                    ) : (
                                        <span style={{ flex: 1, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569', fontWeight: 500 }}>
                                            {name}
                                        </span>
                                    )}
                                    {att.size && (
                                        <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{att.size}</span>
                                    )}
                                </div>

                                {/* Download button */}
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        backgroundColor: '#153B73',
                                        color: '#fff',
                                        fontSize: '11px', fontWeight: 600,
                                        padding: '3px 10px', borderRadius: '5px',
                                        textDecoration: 'none', flexShrink: 0,
                                    }}
                                >
                                    <Download size={11} /> Download
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

function ChecklistItem({ checklist, index }) {
    const val = checklist.value;

    const isYa     = val === 'Ya';
    const isTidak   = val === 'Tidak';
    const badgeConfig = isYa
        ? { icon: <CheckCircle size={12} color="#16a34a" />, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' }
        : isTidak
        ? { icon: <XCircle size={12} color="#dc2626" />,    color: '#dc2626', bg: '#fff5f5', border: '#fca5a5' }
        : { icon: <MinusCircle size={12} color="#94a3b8" />, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };

    return (
        <div style={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                gap: '8px',
            }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    #{index + 1}
                    {checklist.point && (
                        <span style={{ fontWeight: 500, color: '#64748b' }}> — {checklist.point}</span>
                    )}
                </span>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontWeight: 700,
                    backgroundColor: badgeConfig.bg,
                    color: badgeConfig.color,
                    border: `1px solid ${badgeConfig.border}`,
                    padding: '1px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
                }}>
                    {badgeConfig.icon} {val || 'Belum diisi'}
                </span>
            </div>

            {/* Body */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Kriteria utama */}
                {checklist.crtiteria && (
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.5 }}>
                        {checklist.crtiteria}
                    </p>
                )}
                {/* Sub point */}
                {checklist.sub_point && (
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {checklist.sub_point}
                    </p>
                )}
                {/* Dasar Hukum */}
                {checklist.legal_base && (
                    <p style={{ fontSize: '11px', margin: 0, paddingLeft: '8px', borderLeft: '2px solid #cbd5e1' }}>
                        <strong style={{ color: '#475569' }}>Dasar Hukum:</strong>{' '}
                        <span style={{ color: 'var(--primary, #153B73)', fontWeight: 500 }}>{checklist.legal_base}</span>
                    </p>
                )}
                {/* Panduan */}
                {checklist.note && (
                    <p style={{ fontSize: '11px', margin: 0, paddingLeft: '8px', borderLeft: '2px solid #cbd5e1' }}>
                        <strong style={{ color: '#475569' }}>Panduan:</strong>{' '}
                        <span style={{ color: 'var(--primary, #153B73)', fontWeight: 500 }}>{checklist.note}</span>
                    </p>
                )}
                {/* Catatan reviewer */}
                {checklist.comment && (
                    <p style={{ fontSize: '11px', color: '#92400e', margin: 0, paddingLeft: '8px', borderLeft: '2px solid #fcd34d', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '0 4px 4px 0' }}>
                        <strong>Catatan:</strong> {checklist.comment}
                    </p>
                )}
                {/* Attachments */}
                <AttachmentList attachments={checklist.attachments} />
            </div>
        </div>
    );
}

export default function DetailCenter({ bidding, checklists = [] }) {
    const filled   = checklists.filter(c => c.value).length;
    const approved = checklists.filter(c => c.value === 'Ya').length;
    const rejected = checklists.filter(c => c.value === 'Tidak').length;

    return (
        <div>
            {/* Summary Card */}
            <div style={card}>
                <h4 style={sectionTitle}>Ringkasan Penilaian</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(47,191,113,0.06)', borderRadius: '8px', border: '1px solid rgba(47,191,113,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)' }}>{approved}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Sesuai (Ya)</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger)' }}>{rejected}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Tidak Sesuai</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(21,59,115,0.06)', borderRadius: '8px', border: '1px solid rgba(21,59,115,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{filled}/{checklists.length}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Diisi</div>
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div style={card}>
                <h4 style={sectionTitle}>Checklist Audit ({checklists.length} butir)</h4>
                {checklists.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        Belum ada checklist.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {checklists.map((cl, i) => (
                            <ChecklistItem key={cl.id} checklist={cl} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
