import { Download, FileText, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BlobPreviewModal({ attachment, onClose }) {
    const [officeSasUrl, setOfficeSasUrl] = useState(null);
    const [officeSasLoading, setOfficeSasLoading] = useState(false);

    const isActivity        = attachment?.type === 'activity';
    const isJsa             = attachment?.type === 'jsa';
    const isJsaActivity     = attachment?.type === 'jsa_activity';
    const isPtw             = attachment?.type === 'ptw';
    const isUncontrolled    = attachment?.type === 'uncontrolled';
    const isFlRisk          = attachment?.type === 'fl_risk';
    const isFlActivity      = attachment?.type === 'fl_activity';
    const isCsmsChecklist   = attachment?.type === 'csms_checklist';
    const isCsmsPjoFile     = attachment?.type === 'csms_pjo_file';
    const isCsmsMemoKttFile = attachment?.type === 'csms_memo_ktt_file';

    const params = [];
    if (isActivity)        params.push('type=activity');
    else if (isJsa)        params.push('type=jsa');
    else if (isJsaActivity) params.push('type=jsa_activity');
    else if (isPtw)        params.push('type=ptw');
    else if (isUncontrolled) params.push('type=uncontrolled');

    if (attachment?.path) {
        params.push(`path=${encodeURIComponent(attachment.path)}`);
    }

    const queryString  = params.length > 0 ? `?${params.join('&')}` : '';
    const attachmentId = attachment?.id || 'none';

    const previewUrl = isFlRisk
        ? `/api/field-leadership/risk-files/${attachmentId}/preview`
        : isFlActivity
            ? `/api/field-leadership/activity-files/${attachmentId}/preview`
            : isCsmsChecklist
                ? `/api/csms/checklist-attachments/${attachmentId}/preview`
                : isCsmsPjoFile
                    ? `/api/csms/pjo-files/${attachmentId}/preview`
                    : isCsmsMemoKttFile
                        ? `/api/csms/memo-ktt-files/${attachmentId}/preview`
                        : `/api/document-system/attachments/${attachmentId}/preview${queryString}`;

    const downloadUrl = isFlRisk
        ? `/api/field-leadership/risk-files/${attachmentId}/download`
        : isFlActivity
            ? `/api/field-leadership/activity-files/${attachmentId}/download`
            : isCsmsChecklist
                ? `/api/csms/checklist-attachments/${attachmentId}/download`
                : isCsmsPjoFile
                    ? `/api/csms/pjo-files/${attachmentId}/download`
                    : isCsmsMemoKttFile
                        ? `/api/csms/memo-ktt-files/${attachmentId}/download`
                        : `/api/document-system/attachments/${attachmentId}/download${queryString}`;

    const sasUrl = isFlRisk
        ? null
        : isFlActivity
            ? null
            : isCsmsChecklist
                ? null
                : isCsmsPjoFile
                    ? null
                    : isCsmsMemoKttFile
                        ? null
                        : `/api/document-system/attachments/${attachmentId}/sas-url${queryString}`;

    const fileExtension = (() => {
        let raw = (
            attachment?.file_type ||
            (attachment?.file_name ? attachment.file_name.split('.').pop() : '') ||
            (attachment?.name      ? attachment.name.split('.').pop()      : '') ||
            (attachment?.file_path ? attachment.file_path.split('.').pop() : '') ||
            (attachment?.path      ? attachment.path.split('.').pop()      : '') ||
            ''
        ).toLowerCase().trim();

        if (raw.includes('/')) raw = raw.split('/').pop();
        if (raw.includes('.')) raw = raw.split('.').pop();
        return raw;
    })();

    const isImage  = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension);
    const isPdf    = fileExtension === 'pdf';
    const isOffice = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(fileExtension);

    const isLocalUrl = officeSasUrl ? (
        officeSasUrl.includes('localhost') ||
        officeSasUrl.includes('127.0.0.1') ||
        officeSasUrl.includes('.test') ||
        officeSasUrl.includes('.local')
    ) : false;

    // Fetch SAS URL fresh setiap kali modal dibuka untuk Office files.
    // SAS URL tidak disimpan permanen di DB karena akan expired.
    // blob_url di attachment adalah bare blobUri — kita fetch SAS fresh via /sas-url.
    useEffect(() => {
        if (!attachment || !isOffice) return;
        setOfficeSasLoading(true);
        setOfficeSasUrl(null);

        if (!sasUrl) {
            setOfficeSasLoading(false);
            return;
        }

        axios.get(sasUrl)
            .then(res => {
                const url = res.data?.result?.url ?? res.data?.url ?? null;
                setOfficeSasUrl(url);
            })
            .catch(() => setOfficeSasUrl(null))
            .finally(() => setOfficeSasLoading(false));
    }, [attachment?.id, attachment?.path, isOffice]);

    if (!attachment) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={18} style={{ color: 'var(--primary)' }} />
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                Preview Lampiran
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                                {attachment.file_name || 'Unnamed File'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    maxHeight: 'calc(90vh - 140px)',
                    overflow: 'auto',
                    padding: '16px'
                }}>
                    {isPdf ? (
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '550px',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        />
                    ) : isImage ? (
                        <img
                            src={previewUrl}
                            alt={attachment.file_name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '550px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    ) : isOffice ? (
                        officeSasLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '12px' }}>
                                <FileText size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                                <p>Memuat preview...</p>
                            </div>
                        ) : officeSasUrl && !isLocalUrl ? (
                            <iframe
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(officeSasUrl)}`}
                                title="Office Document Preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '550px',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <FileText size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 8px 0' }}>
                                    Pratinjau Dokumen Office ({fileExtension.toUpperCase()})
                                </p>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 20px 0', maxWidth: '420px', lineHeight: '1.5' }}>
                                    {isLocalUrl 
                                        ? 'Pratinjau online Office memerlukan URL server publik. Silakan unduh berkas untuk membukanya di aplikasi lokal.'
                                        : 'Tidak dapat memuat URL pratinjau. Silakan unduh berkas untuk membukanya.'}
                                </p>
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: 'var(--primary)',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        textDecoration: 'none'
                                    }}
                                >
                                    <Download size={14} /> Download File
                                </a>
                            </div>
                        )
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <FileText size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 8px 0' }}>
                                Pratinjau Tidak Tersedia
                            </p>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 20px 0' }}>
                                Format file ({attachment.file_type || fileExtension || 'unknown'}) tidak mendukung pratinjau langsung. Silakan download untuk membukanya.
                            </p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'var(--primary)',
                                    color: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                }}
                            >
                                <Download size={14} /> Download File
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer (Actions) */}
                {(isPdf || isImage || isOffice) && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '16px 24px',
                        borderTop: '1px solid #f1f5f9',
                        backgroundColor: '#fff'
                    }}>
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textDecoration: 'none'
                            }}
                        >
                            <Download size={14} /> Download File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
