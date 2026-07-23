import React, { useState, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { ArrowLeft, User, Calendar, Mail, Phone, Building, FileText, Edit, Trash2 } from 'lucide-react';

import axios from 'axios';
import PageLoader from '@/Components/PageLoader';

const cardStyle = { backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' };
const sectionTitle = { fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: 0 };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' };

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)' }}>
            <Icon size={16} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--primary)' }} />
            <div>
                <span style={{ fontSize: '10px', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value || '—'}</span>
            </div>
        </div>
    );
}

export default function PjoDetail() {
    const { id } = usePage().props;
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/csms/pjos/${id}`)
            .then(res => setData(res.data?.result))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading || !data) return <PageLoader title="Memuat detail PJO..." />;

    const { pjo, files = [] } = data;

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Detail PJO: ${pjo.name}`} />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <a href="/csms/pjo/lists" style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            <ArrowLeft size={16} />
                        </a>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Detail PJO</h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Data lengkap Penanggung Jawab Operasional</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={`/csms/pjo/edit/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                            <Edit size={14} /> Edit PJO
                        </a>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h5 style={sectionTitle}>Informasi Personil</h5>
                    <div style={infoGrid}>
                        <InfoRow icon={User} label="Nama Lengkap" value={pjo.name} />
                        <InfoRow icon={FileText} label="No. PJO" value={pjo.number_pjo} />
                        <InfoRow icon={Building} label="Perusahaan" value={pjo.company_name_resolved} />
                        <InfoRow icon={Building} label="CCOW" value={pjo.ccow_name} />
                        <InfoRow icon={Phone} label="Telepon" value={pjo.phone} />
                        <InfoRow icon={Mail} label="Email" value={pjo.email} />
                        <InfoRow icon={Calendar} label="Tanggal Lahir" value={pjo.date_of_birth ? new Date(pjo.date_of_birth).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                        <InfoRow icon={Calendar} label="Tanggal Pengajuan" value={pjo.date_submission ? new Date(pjo.date_submission).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                        <InfoRow icon={FileText} label="Pengajuan (Submission)" value={pjo.submission} />
                        <InfoRow icon={FileText} label="Status" value={pjo.status} />
                    </div>

                    <h5 style={sectionTitle}>Berkas Lampiran Pendukung</h5>
                    {files.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Tidak ada berkas pendukung terunggah.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {files.map(file => (
                                <div key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                                        <FileText size={16} color="var(--primary)" /> {file.name}
                                    </span>
                                    <a href={file.blob_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
                                        Lihat / Unduh
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
