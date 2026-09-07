import { AlertCircle, ArrowLeft, Paperclip } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import FileDropzone from '@/Components/FileDropzone';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import React, { useCallback, useEffect, useState } from 'react';

const card = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' };
const sectionTitle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase' };

const ATTACH_FIELDS = [
    ['stnk', 'STNK'], ['nota_pajak', 'Nota Pajak'], ['surat_pengantar', 'Surat Pengantar'],
    ['re_manufacture', 'Re-Manufacture'], ['oem', 'OEM'], ['dokumen_sertifikat', 'Dokumen Sertifikat'],
    ['inspeksi_p3k', 'Inspeksi P3K'], ['kir', 'KIR'], ['uji_pjit', 'Uji PJIT'],
    ['pra_komisioning', 'Pra Komisioning'], ['setting_radio', 'Setting Radio'], ['slo', 'SLO'],
    ['komisioning_internal', 'Komisioning Internal'], ['com', 'COM'],
];

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ width: '200px', flexShrink: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value || '—'}</span>
        </div>
    );
}

export default function ProposalDetail() {
    const { id } = usePage().props;
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null);
    const [note, setNote] = useState('');
    const [attach, setAttach] = useState(null);
    const [attachFiles, setAttachFiles] = useState({});
    const [savingAttach, setSavingAttach] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const handlePreviewAttachment = (label, filePath) => {
        if (!filePath) return;
        const fileName = String(filePath).split('/').pop() || label;
        setPreviewFile({
            id: filePath,
            file_name: `${label} - ${fileName}`,
            name: fileName,
            type: 'ko_proposal',
            path: filePath,
            previewUrl: `/api/ko/proposal-attachments/preview?path=${encodeURIComponent(filePath)}`,
            downloadUrl: `/api/ko/proposal-attachments/download?path=${encodeURIComponent(filePath)}`,
        });
    };

    const fetchDoc = useCallback(() => {
        setLoading(true);
        axios.get(`/api/ko/proposals/${id}`)
            .then(res => {
                const d = res.data?.result ?? null;
                setDoc(d);
                setAttach(d?.ko_attachment ? { ...d.ko_attachment } : null);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { fetchDoc(); }, [fetchDoc]);

    const call = async (url, body = {}) => {
        setActing(url);
        try {
            await axios.post(url, body);
            setNote('');
            fetchDoc();
        } catch {}
        finally { setActing(null); }
    };

    const saveAttachments = async () => {
        setSavingAttach(true);
        try {
            const fd = new FormData();
            ATTACH_FIELDS.forEach(([k]) => {
                if (attachFiles[k]) {
                    fd.append(`file_${k}`, attachFiles[k]);
                } else {
                    fd.append(k, attach?.[k] ?? '');
                }
            });
            fd.append('_method', 'PUT');
            await axios.post(`/api/ko/proposals/${id}/attachments`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAttachFiles({});
            fetchDoc();
        } catch {}
        finally { setSavingAttach(false); }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Head title="Detail Proposal KO" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail proposal...</span>
        </div>
    );
    if (!doc) return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Head title="Detail Proposal KO" />
            <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Proposal tidak ditemukan.</p>
            <a href="/ko/proposals" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
        </div>
    );

    const btn = (label, onClick, primary = true) => (
        <button key={label} onClick={onClick} disabled={!!acting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: primary ? 'none' : '1px solid var(--danger)', backgroundColor: primary ? 'var(--primary)' : '#fff', color: primary ? '#fff' : 'var(--danger)', opacity: acting ? 0.7 : 1 }}>
            {label}
        </button>
    );

    const actionList = () => {
        // Parity aims KoDetail: hanya aksi verifikasi. Submit ada di Create/Edit.
        switch (doc.status) {
            case 'Admin Proposal Verification':
                return [
                    btn('Approve Admin', () => call(`/api/ko/proposals/${id}/verify`, { stage: 'admin', action: 'approve' })),
                    btn('Return', () => call(`/api/ko/proposals/${id}/verify`, { stage: 'admin', action: 'return', note }), false),
                ];
            case 'Coordinator Proposal Verification':
                return [
                    btn('Approve Koordinator', () => call(`/api/ko/proposals/${id}/verify`, { stage: 'coordinator', action: 'approve' })),
                    btn('Return', () => call(`/api/ko/proposals/${id}/verify`, { stage: 'coordinator', action: 'return', note }), false),
                ];
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={`Proposal ${doc.number ?? ''}`} />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <a href="/ko/proposals" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                        <ArrowLeft size={16} /> Kembali ke Proposal
                    </a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{doc.number}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,140,36,0.1)', color: '#FF8C24' }}>{doc.status}</span>
                        {['Draft', 'Returned'].includes(doc.status) && (
                            <a href={`/ko/proposals/${id}/edit`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
                                Edit
                            </a>
                        )}
                    </div>
                </div>

                {/* 1 kolom: semua kartu tersusun vertikal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={card}>
                                <h4 style={sectionTitle}>Informasi Proposal</h4>
                                <InfoRow label="Nomor" value={doc.number} />
                                <InfoRow label="Area" value={doc.area} />
                                <InfoRow label="Unit" value={doc.ko_unit ? `${doc.ko_unit.call_sign} (${doc.ko_unit.identity_number ?? '-'})` : null} />
                                <InfoRow label="Perusahaan" value={doc.company?.company_name} />
                                <InfoRow label="CCOW" value={doc.ccow?.company_name} />
                                <InfoRow label="Departemen" value={doc.department?.name ?? doc.other_department} />
                                <InfoRow label="Email Pemohon" value={doc.applicant_email} />
                                <InfoRow label="PJO" value={doc.pjo?.name} />
                            </div>

                            <div style={card}>
                                <h4 style={sectionTitle}>Jadwal & Status</h4>
                                <InfoRow label="Jadwal Komisioning Internal" value={doc.internal_komisioning_schedule} />
                                <InfoRow label="Komisioning Berikutnya" value={doc.next_commissioning} />
                                <InfoRow label="Masa Berlaku Sementara" value={doc.temporary_validity_period} />
                                <InfoRow label="QR Sementara" value={doc.temporary_qr_status} />
                                {doc.proposal_reject_note && <InfoRow label="Catatan Return" value={doc.proposal_reject_note} />}
                            </div>

                    {doc.ko_commissioning && (
                        <div style={card}>
                            <h4 style={sectionTitle}>Komisioning</h4>
                            <InfoRow label="Tanggal" value={doc.ko_commissioning.date} />
                            <InfoRow label="Status" value={doc.ko_commissioning.status} />
                        </div>
                    )}

                    {(doc.status === 'Admin Proposal Verification' || doc.status === 'Coordinator Proposal Verification') && (
                                <div style={card}>
                                    <h4 style={sectionTitle}>Catatan Verifikasi (untuk Return)</h4>
                                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Alasan pengembalian..." rows={3}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
                                </div>
                            )}

                            {actionList() && (
                                <div style={card}>
                                    <h4 style={sectionTitle}>Aksi</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {actionList()}
                                    </div>
                                </div>
                            )}
                    <div style={card}>
                        <h4 style={sectionTitle}>Lampiran Dokumen</h4>
                        {['Draft', 'Returned'].includes(doc.status) ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                                    {ATTACH_FIELDS.map(([key, label]) => (
                                        <div key={key}>
                                            <label style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{label}</label>
                                            {attach?.[key] && !attachFiles[key] && (
                                                <div style={{ marginBottom: '6px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreviewAttachment(label, attach[key])}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            color: 'var(--primary)',
                                                            background: 'rgba(59, 130, 246, 0.08)',
                                                            border: '1px solid rgba(59, 130, 246, 0.2)',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            cursor: 'pointer',
                                                            maxWidth: '100%',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        title={attach[key]}
                                                    >
                                                        <Paperclip size={12} />
                                                        <span>Saat ini: {String(attach[key]).split('/').pop()}</span>
                                                    </button>
                                                </div>
                                            )}
                                            <FileDropzone
                                                accept=".pdf"
                                                onFileDrop={(dropped) => {
                                                    if (dropped.length) setAttachFiles(prev => ({ ...prev, [key]: dropped[0] }));
                                                }}
                                            />
                                            {attachFiles[key] && (
                                                <div style={{ fontSize: '11px', color: 'var(--success, #2FBF71)', marginTop: '4px' }}>Baru: {attachFiles[key].name}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <button onClick={saveAttachments} disabled={savingAttach}
                                        style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: 'var(--primary)', color: '#fff', cursor: savingAttach ? 'not-allowed' : 'pointer', opacity: savingAttach ? 0.7 : 1 }}>
                                        {savingAttach ? 'Menyimpan...' : 'Simpan Lampiran'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            ATTACH_FIELDS.map(([key, label]) => {
                                const val = doc.ko_attachment?.[key];
                                return (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
                                        <span style={{ width: '200px', flexShrink: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                                        {val ? (
                                            <button
                                                type="button"
                                                onClick={() => handlePreviewAttachment(label, val)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--primary)',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    padding: 0,
                                                }}
                                            >
                                                <Paperclip size={13} />
                                                <span>{String(val).split('/').pop()}</span>
                                            </button>
                                        ) : (
                                            <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>—</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
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
