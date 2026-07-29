import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Building, Calendar, Download, Edit, Eye, FileText, Mail, Paperclip, Phone, User } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';

import PageLoader from '@/Components/PageLoader';
import axios from 'axios';

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    'Draft':             { text: 'DRAFT',             color: '#64748b',        bg: 'rgba(100,116,139,0.1)' },
    'On Review OHS':     { text: 'ON REVIEW OHS',     color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review D/H OHS': { text: 'ON REVIEW D/H OHS', color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review KTT':     { text: 'ON REVIEW KTT',     color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'Approved':          { text: 'APPROVED',           color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'   },
    'Rejected':          { text: 'REJECTED',           color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
    'Inactive':          { text: 'INACTIVE',           color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
};

const FILE_TYPE_GROUPS = {
    'Sertifikat Kompetensi': ['sertifikat_pop', 'sertifikat_pom', 'sertifikat_pou', 'sertifikat_ismkp', 'sertifikat_asmkp', 'sertifikat_lainnya'],
    'Dokumen Pendukung':     ['cv', 'surat_penunjukan', 'struktur_organisasi'],
    'Dokumen Administratif': ['persyaratan_administratif', 'surat_pernyataan'],
    'Lainnya':               ['other', null, undefined],
};

const FILE_TYPE_LABELS = {
    sertifikat_pop:            'Sertifikat POP',
    sertifikat_pom:            'Sertifikat POM',
    sertifikat_pou:            'Sertifikat POU',
    sertifikat_ismkp:          'Sertifikat ISMKP',
    sertifikat_asmkp:          'Sertifikat ASMKP',
    sertifikat_lainnya:        'Sertifikat Lainnya',
    cv:                        'CV PJO',
    surat_penunjukan:          'Surat Penunjukan PJO',
    struktur_organisasi:       'Struktur Organisasi',
    persyaratan_administratif: 'Persyaratan Administratif',
    surat_pernyataan:          'Surat Pernyataan Komitmen',
    other:                     'Berkas Lainnya',
};

// ── Shared styles ────────────────────────────────────────────────────────────

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
};

const sectionTitle = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
    marginBottom: '12px', textTransform: 'uppercase',
};

// ── Sub-components ───────────────────────────────────────────────────────────

function MetaRow({ icon: Icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
            <Icon size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
                <span style={{ fontSize: '10px', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{value || '—'}</span>
            </div>
        </div>
    );
}

function InfoGrid({ children }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {children}
        </div>
    );
}

function FileRow({ file }) {
    const typeLabel = FILE_TYPE_LABELS[file.type] ?? file.type ?? 'Berkas';
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '8px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileText size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{typeLabel}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name ?? file.file?.split('/').pop() ?? '—'}</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <a href={`/api/csms/pjos/files/${file.id}/preview`} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
                    <Eye size={11} /> Lihat
                </a>
                <a href={`/api/csms/pjos/files/${file.id}/download`} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(47,191,113,0.08)', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2FBF71', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
                    <Download size={11} /> Unduh
                </a>
            </div>
        </div>
    );
}

function FilesSection({ files }) {
    if (!files || files.length === 0) {
        return (
            <div style={{ ...card }}>
                <h4 style={sectionTitle}>Berkas Lampiran</h4>
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Belum ada berkas lampiran.
                </div>
            </div>
        );
    }

    // Group files by type category
    const grouped = {};
    files.forEach(file => {
        let groupName = 'Lainnya';
        const fileType = file.type ?? null;
        for (const [group, types] of Object.entries(FILE_TYPE_GROUPS)) {
            if (types.includes(fileType)) { groupName = group; break; }
        }
        if (!grouped[groupName]) grouped[groupName] = [];
        grouped[groupName].push(file);
    });

    return (
        <div style={card}>
            <h4 style={sectionTitle}>
                <Paperclip size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Berkas Lampiran ({files.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(grouped).map(([group, groupFiles]) => (
                    <div key={group}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', borderLeft: '3px solid var(--primary)', paddingLeft: '8px' }}>
                            {group}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {groupFiles.map(f => <FileRow key={f.id} file={f} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function PjoDetail() {
    const { id } = usePage().props;
    const [data,     setData]     = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const loadDetail = useCallback(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`/api/csms/pjos/${id}`)
            .then(res => {
                if (res.data?.result) setData(res.data.result);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { loadDetail(); }, [loadDetail]);

    if (loading) {
        return (
            <>
                <Head title="Detail PJO" />
                <PageLoader title="Memuat detail PJO..." />
            </>
        );
    }

    if (error || !data) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Head title="Detail PJO" />
                <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Data PJO tidak ditemukan.</p>
                <a href="/csms/pjo/lists" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
            </div>
        );
    }

    const { pjo, files = [] } = data;

    const statusCfg = STATUS_CONFIG[pjo.status] ?? { text: pjo.status, color: '#64748b', bg: '#f1f5f9' };
    const initials  = (pjo.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const fmt       = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
            <Head title={`Detail PJO: ${pjo.name}`} />

            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <a href="/csms/pjo/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                    <ArrowLeft size={16} /> Kembali ke PJO
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: statusCfg.bg, color: statusCfg.color, padding: '2px 10px', borderRadius: '12px' }}>
                        {statusCfg.text}
                    </span>
                    <a href={`/csms/pjo/edit/${id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'var(--accent, #f59e0b)', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
                        <Edit size={12} /> Edit PJO
                    </a>
                </div>
            </div>

            {/* 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>

                {/* ── Left Sidebar ── */}
                <aside style={{ position: isMobile ? 'static' : 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px', order: isMobile ? 2 : 1 }}>

                    {/* Dibuat Oleh */}
                    <div style={card}>
                        <h4 style={sectionTitle}>Dibuat Oleh</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--primary), #2563EB)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                                    {initials}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{pjo.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PJO</div>
                                </div>
                            </div>
                            <MetaRow icon={Calendar} label="Dibuat" value={fmt(pjo.created_at)} />
                            <MetaRow icon={Calendar} label="Diperbarui" value={fmt(pjo.updated_at)} />
                        </div>
                    </div>

                    {/* Perusahaan */}
                    <div style={card}>
                        <h4 style={sectionTitle}>Perusahaan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <MetaRow icon={Building} label="Nama Perusahaan" value={pjo.company?.company_name ?? pjo.company_name_resolved} />
                            <MetaRow icon={Building} label="CCOW"            value={pjo.ccow?.company_name} />
                            <MetaRow icon={FileText}  label="Kriteria"        value={pjo.criteria} />
                            <MetaRow icon={FileText}  label="Pengajuan"       value={pjo.submission} />
                        </div>
                    </div>

                    {/* Status */}
                    <div style={card}>
                        <h4 style={sectionTitle}>Status Dokumen</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</span>
                                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: statusCfg.bg, color: statusCfg.color, padding: '2px 8px', borderRadius: '10px' }}>
                                    {statusCfg.text}
                                </span>
                            </div>
                            <MetaRow icon={FileText} label="Requested" value={pjo.requested} />
                            <MetaRow icon={FileText} label="Published"  value={pjo.published} />
                            {pjo.date_approved && (
                                <MetaRow icon={Calendar} label="Tanggal Disetujui" value={fmt(pjo.date_approved)} />
                            )}
                            {pjo.comment && (
                                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '11px', color: '#ef4444' }}>
                                    <div style={{ fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>Catatan Reviewer</div>
                                    {pjo.comment}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', order: isMobile ? 1 : 2 }}>

                    {/* Informasi Personil */}
                    <div style={card}>
                        <h4 style={sectionTitle}>Informasi Personil</h4>
                        <InfoGrid>
                            <MetaRow icon={User}      label="Nama Lengkap"        value={pjo.name} />
                            <MetaRow icon={FileText}  label="No. PJO"             value={pjo.number_pjo} />
                            <MetaRow icon={Phone}     label="Telepon"             value={pjo.phone} />
                            <MetaRow icon={Mail}      label="Email"               value={pjo.email} />
                            <MetaRow icon={Calendar}  label="Tanggal Lahir"       value={fmt(pjo.date_of_birth)} />
                            <MetaRow icon={Calendar}  label="Tanggal Pengajuan"   value={fmt(pjo.date_submission)} />
                        </InfoGrid>
                    </div>

                    {/* Berkas Lampiran */}
                    <FilesSection files={files} />

                </main>
            </div>
        </div>
    );
}
