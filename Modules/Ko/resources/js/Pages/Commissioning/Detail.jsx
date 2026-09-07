import { ArrowLeft, Paperclip } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import React, { useCallback, useEffect, useState } from 'react';

// Parity aims commissioned-detail: DATA SARANA, DATA PENGGUNA, Attachment,
// Berita Acara (issue), Formulir Komisioning + verifikasi.
const card = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' };
const sectionTitle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase' };

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ width: '220px', flexShrink: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value || '—'}</span>
        </div>
    );
}

const ATTACH_LABELS = [
    ['stnk', 'STNK'], ['nota_pajak', 'Nota Pajak'], ['surat_pengantar', 'Surat Pengantar'],
    ['re_manufacture', 'Re-Manufacture'], ['oem', 'OEM'], ['dokumen_sertifikat', 'Dokumen Sertifikat'],
    ['inspeksi_p3k', 'Inspeksi P3K'], ['kir', 'KIR'], ['uji_pjit', 'Uji PJIT'],
    ['pra_komisioning', 'Pra Komisioning'], ['setting_radio', 'Setting Radio'], ['slo', 'SLO'],
    ['komisioning_internal', 'Komisioning Internal'], ['com', 'COM'],
];

export default function CommissioningDetail() {
    const { id } = usePage().props;
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(false);
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
            .then(res => setDoc(res.data?.result ?? null))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { fetchDoc(); }, [fetchDoc]);

    const verify = async (stage, action) => {
        setActing(true);
        try {
            await axios.post(`/api/ko/commissionings/${id}/verify`, { stage, action });
            fetchDoc();
        } catch {}
        finally { setActing(false); }
    };

    if (loading) return <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail komisioning...</span></div>;
    if (!doc) return <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '12px', color: 'var(--danger)' }}>Data tidak ditemukan.</span></div>;

    const unit = doc.ko_unit ?? {};
    const spip = unit.ko_spip_unit ?? {};
    const comm = doc.ko_commissioning;
    const items = comm?.ko_commissioning_items ?? [];
    const issues = doc.ko_issue_reports ?? [];
    const attach = doc.ko_attachment ?? {};

    const vbtn = (label, onClick, primary = true) => (
        <button key={label} onClick={onClick} disabled={acting}
            style={{ padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: primary ? 'none' : '1px solid var(--danger)', backgroundColor: primary ? 'var(--primary)' : '#fff', color: primary ? '#fff' : 'var(--danger)', opacity: acting ? 0.7 : 1 }}>
            {label}
        </button>
    );

    return (
        <>
            <Head title={`Komisioning ${doc.number ?? ''}`} />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <a href="/ko/commissionings" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                        <ArrowLeft size={16} /> Kembali ke Komisioning
                    </a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{doc.number}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,140,36,0.1)', color: '#FF8C24' }}>{doc.status}</span>
                        {vbtn('Approve Admin', () => verify('admin', 'approve'))}
                        {vbtn('Approve Koordinator', () => verify('coordinator', 'approve'))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={card}>
                        <h4 style={sectionTitle}>Data Sarana, Prasarana, Instalasi dan Peralatan Pertambangan</h4>
                        <InfoRow label="Number" value={doc.number} />
                        <InfoRow label="CCOW" value={doc.ccow?.company_name} />
                        <InfoRow label="Area Kerja" value={doc.area} />
                        <InfoRow label="Kategori SPIP" value={spip.ko_spip_type?.ko_spip_category?.name} />
                        <InfoRow label="Klasifikasi SPIP" value={spip.ko_spip_type?.name} />
                        <InfoRow label="Deskripsi SPIP" value={spip.name} />
                        <InfoRow label="Call Sign" value={unit.call_sign} />
                        <InfoRow label="Nomor IMB/STNK" value={unit.identity_number} />
                        <InfoRow label="Merk / Brand SPIP" value={unit.ko_brand?.name} />
                        <InfoRow label="Nomor Serial SPIP" value={unit.serial_number} />
                        <InfoRow label="Tahun Pembuatan Unit SPIP" value={unit.production_year} />
                        <InfoRow label="Tanggal Komisioning" value={comm?.date} />
                        <InfoRow label="Jadwal Komisioning" value={doc.internal_komisioning_schedule} />
                        <InfoRow label="Komisioning Selanjutnya" value={doc.next_commissioning} />
                        <InfoRow label="Periode Komisioning" value={doc.commissioning_period} />
                    </div>

                    <div style={card}>
                        <h4 style={sectionTitle}>Data Pengguna</h4>
                        <InfoRow label="Company" value={doc.company?.company_name} />
                        <InfoRow label="Departement" value={doc.department?.name ?? doc.other_department} />
                        <InfoRow label="Alamat Email Pemohon" value={doc.applicant_email} />
                        <InfoRow label="PJO" value={doc.pjo?.name} />
                    </div>

                    <div style={card}>
                        <h4 style={sectionTitle}>Attachment</h4>
                        {ATTACH_LABELS.map(([key, label]) => {
                            const val = attach[key];
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
                                    <span style={{ width: '220px', flexShrink: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
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
                        })}
                    </div>

                    {issues.length > 0 && (
                        <div style={card}>
                            <h4 style={sectionTitle}>Berita Acara ({issues.length})</h4>
                            {issues.map(i => (
                                <div key={i.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{i.note ?? '-'}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {i.created_at ? new Date(i.created_at).toLocaleDateString('id-ID') : '-'} • Kode: {i.hazard_code ?? '-'} • {i.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={card}>
                        <h4 style={sectionTitle}>Formulir Komisioning</h4>
                        {!comm ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                Belum ada data komisioning. <a href="/ko/commissionings/create" style={{ color: 'var(--primary)', fontWeight: 600 }}>Buat komisioning</a>
                            </p>
                        ) : !items.length ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Belum ada item pemeriksaan.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {items.map((it, idx) => (
                                    <div key={it.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>#{idx + 1} {it.ko_commissioning_field?.question?.replace(/<[^>]*>/g, '') ?? it.ko_commissioning_field_id}</span>
                                            {it.condition && (
                                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}>{it.condition}</span>
                                            )}
                                        </div>
                                        <div style={{ padding: '10px 14px', fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                            <div><div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Keterangan & Deviasi</div><div>{it.note ?? '—'}</div></div>
                                            <div><div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Kode Bahaya</div><div>{it.ko_commissioning_field?.hazard_code ?? '—'}</div></div>
                                            <div><div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>No. Item</div><div>{it.ko_commissioning_field?.number ?? '—'}</div></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
