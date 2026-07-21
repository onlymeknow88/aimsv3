import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, CheckCircle2, AlertCircle, Users, FileText, Activity } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import axios from 'axios';

const STATUS_CONFIG = {
    'Open':               { text: 'OPEN',             color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review PICA':     { text: 'ON REVIEW PICA',   color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review PJA':      { text: 'ON REVIEW PJA',    color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review Approval': { text: 'ON REVIEW APPRVL', color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'Overdue':            { text: 'OVERDUE',           color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
    'Closed':             { text: 'CLOSED',            color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'   },
};

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, minWidth: '160px', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{value || '—'}</span>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children }) {
    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <Icon size={15} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function Detail({ id }) {
    const [data, setData]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/field-leadership/observations/${id}`)
            .then(res => {
                if (res.data?.result) setData(res.data.result);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    const obs     = data?.observation ?? {};
    const status  = STATUS_CONFIG[obs.status] ?? { text: obs.status, color: '#64748b', bg: '#f1f5f9' };

    if (loading) {
        return (
            <FieldLeadershipLayout>
                <Head title="Detail Observasi" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Memuat detail observasi...
                </div>
            </FieldLeadershipLayout>
        );
    }

    if (error || !data) {
        return (
            <FieldLeadershipLayout>
                <Head title="Detail Observasi" />
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                    <AlertCircle size={32} style={{ color: 'var(--danger)', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px' }}>Observasi tidak ditemukan.</p>
                    <a href="/field-leadership/observations" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
                </div>
            </FieldLeadershipLayout>
        );
    }

    return (
        <FieldLeadershipLayout>
            <Head title={`Detail Observasi — ${obs.type ?? ''}`} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <a href="/field-leadership/observations"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} />
                </a>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Detail Observasi</h1>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: status.color, backgroundColor: status.bg, padding: '3px 10px', borderRadius: '12px' }}>
                            {status.text}
                        </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
                        {obs.type} — {obs.date ? new Date(obs.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                {/* Informasi Dasar */}
                <SectionCard title="Informasi Dasar" icon={ClipboardList}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <InfoRow label="Tanggal" value={obs.date ? new Date(obs.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                        <InfoRow label="Tipe Observasi" value={obs.type} />
                        <InfoRow label="Pekerjaan" value={obs.job} />
                        <InfoRow label="Waktu Kunjungan" value={obs.visit_time ? `${obs.visit_time} menit` : null} />
                        <InfoRow label="Area Sesuai" value={obs.is_area_suitable ? 'Ya' : 'Tidak'} />
                    </div>
                </SectionCard>

                {/* Lokasi & Perusahaan */}
                <SectionCard title="Lokasi & Perusahaan" icon={FileText}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <InfoRow label="Perusahaan" value={obs.company_name} />
                        <InfoRow label="Departemen" value={obs.department_name} />
                        <InfoRow label="Seksi" value={obs.section_name} />
                        <InfoRow label="Area Lokasi" value={obs.area_location_name} />
                        <InfoRow label="Detail Lokasi" value={obs.detail_location} />
                    </div>
                </SectionCard>

                {/* Penanggung Jawab */}
                <SectionCard title="Penanggung Jawab" icon={Users}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <InfoRow label="PJO" value={obs.pjo_name} />
                        <InfoRow label="Dibuat Oleh" value={obs.created_by_name} />
                    </div>
                </SectionCard>

            </div>

            {/* Members */}
            {data.members?.length > 0 && (
                <SectionCard title={`Anggota (${data.members.length})`} icon={Users}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.members.map(m => (
                            <span key={m.id} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                {m.employee_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({m.type})</span>
                            </span>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Positives */}
            {data.positives?.length > 0 && (
                <SectionCard title={`Kondisi Positif (${data.positives.length})`} icon={CheckCircle2}>
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {data.positives.map(p => (
                            <li key={p.id} style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.description}</li>
                        ))}
                    </ul>
                </SectionCard>
            )}

            {/* Risks */}
            {data.risks?.length > 0 && (
                <SectionCard title={`Temuan Risiko (${data.risks.length})`} icon={AlertCircle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.risks.map((r, idx) => (
                            <div key={r.id} style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>#{idx + 1} {r.risk_condition}</span>
                                    {r.status && (
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: r.status === 'Closed' ? 'var(--success)' : 'var(--accent)', backgroundColor: r.status === 'Closed' ? 'rgba(34,197,94,0.08)' : 'rgba(255,140,36,0.08)', padding: '2px 8px', borderRadius: '10px' }}>
                                            {r.status}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                                    <InfoRow label="Kategori" value={r.category_name} />
                                    <InfoRow label="KTA/TTA" value={r.kta_name} />
                                    <InfoRow label="Potensi" value={r.potency_name} />
                                    <InfoRow label="Tindakan" value={r.repair_action} />
                                    <InfoRow label="Due Date" value={r.due_date ? new Date(r.due_date).toLocaleDateString('id-ID') : null} />
                                    <InfoRow label="Supervisor" value={r.supervisor} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Activities */}
            {data.activities?.length > 0 && (
                <SectionCard title="Riwayat Aktivitas" icon={Activity}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.activities.map(a => (
                            <div key={a.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0, marginTop: '5px' }} />
                                <div>
                                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{a.description}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                                        {a.created_at ? new Date(a.created_at).toLocaleString('id-ID') : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

        </FieldLeadershipLayout>
    );
}
