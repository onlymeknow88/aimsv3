import { AlertCircle, CheckCircle2, ClipboardList, Download, Paperclip, Users } from 'lucide-react';
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

function RiskFiles({ files, type, onPreview }) {
    const filtered = (files || []).filter(f => f.type === type);
    if (!filtered.length) return null;
    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {type === 'Temuan Risiko' ? 'Lampiran Temuan' : 'Lampiran Tindakan Perbaikan'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filtered.map(f => (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                        <button
                            type="button"
                            onClick={() => onPreview(f)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                        >
                            <Paperclip size={11} />
                            {f.file ? f.file.split('/').pop() : 'File'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {f.size && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.size}</span>}
                            <a
                                href={`/api/field-leadership/risk-files/${f.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                            >
                                <Download size={11} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DetailCenter({ obs, members, positives, risks, questionPtos }) {
    const [previewFile, setPreviewFile] = useState(null);

    const handlePreview = (f) => setPreviewFile({
        id: f.id,
        file_name: f.file ? f.file.split('/').pop() : 'File',
        type: 'fl_risk',
        path: f.file,
    });

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Field Leadership Info */}
                <SectionCard icon={ClipboardList} title="Field Leadership">
                    <InfoRow label="Jenis Field Leadership" value={obs.type} valueStyle={{ fontWeight: 700 }} />
                    <InfoRow label="Tugas / SOP / WI yang Diamati" value={obs.job} />
                    <InfoRow label="Waktu Kunjungan" value={obs.visit_time ? `${obs.visit_time} Menit` : null} />
                    <InfoRow label="Jumlah Personil Diamati" value={obs.personil_on_review} />
                    <InfoRow label="Nama Personil Diamati" value={obs.personil_on_review_name} />
                    <InfoRow
                        label="Area Sesuai PJA"
                        value={obs.is_area_suitable ? 'Ya' : 'Tidak'}
                        valueStyle={{ color: obs.is_area_suitable ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}
                    />
                </SectionCard>

                {/* PTO Questions */}
                {questionPtos?.length > 0 && (
                    <SectionCard icon={ClipboardList} title="Pertanyaan PTO">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {questionPtos.map((q, idx) => (
                                <div key={q.id} style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 12px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>PERTANYAAN {idx + 1}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.4 }}>{q.question}</div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {q.answer && (
                                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '12px', backgroundColor: q.answer === 'Ya' ? 'rgba(34,197,94,0.1)' : q.answer === 'Tidak' ? 'rgba(239,68,68,0.1)' : '#f1f5f9', color: q.answer === 'Ya' ? 'var(--success)' : q.answer === 'Tidak' ? 'var(--danger)' : 'var(--text-muted)' }}>
                                                {q.answer}
                                            </span>
                                        )}
                                        {q.description && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{q.description}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {/* Kondisi Positif */}
                {positives?.length > 0 && (
                    <SectionCard icon={CheckCircle2} iconColor="var(--success)" title={`Kondisi Positif (${positives.length})`}>
                        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {positives.map(p => (
                                <li key={p.id} style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{p.description}</li>
                            ))}
                        </ul>
                    </SectionCard>
                )}

                {/* Kondisi Beresiko */}
                {risks?.length > 0 && (
                    <SectionCard icon={AlertCircle} iconColor="var(--danger)" title={`Kondisi Beresiko (${risks.length})`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {risks.map((r, idx) => (
                                <div key={r.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                    {/* Risk header */}
                                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>#{idx + 1} {r.risk_condition}</span>
                                        {r.status && (
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', color: r.status === 'Closed' ? 'var(--success)' : 'var(--accent)', backgroundColor: r.status === 'Closed' ? 'rgba(34,197,94,0.1)' : 'rgba(255,140,36,0.1)' }}>
                                                {r.status}
                                            </span>
                                        )}
                                    </div>
                                    {/* Risk detail */}
                                    <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Kategori</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.category_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Jenis KTA / TTA</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.kta_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Potensi / Konsekuensi</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.potency_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Due Date</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.due_date ? new Date(r.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div>
                                        </div>
                                        {r.repair_action && (
                                            <>
                                                <div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Supervisor PIC</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.supervisor || '—'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Jenis Tindakan Perbaikan</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{r.type_action || '—'}</div>
                                                </div>
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Tindakan Perbaikan</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '8px 10px' }}>{r.repair_action}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* File attachments */}
                                    <div style={{ padding: '0 14px 12px' }}>
                                        <RiskFiles files={r.files} type="Temuan Risiko"      onPreview={handlePreview} />
                                        <RiskFiles files={r.files} type="Tindakan Perbaikan" onPreview={handlePreview} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {/* Anggota Tim */}
                {members?.length > 0 && (
                    <SectionCard icon={Users} title={`Anggota Tim (${members.length})`}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {members.map(m => (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #2563EB)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                                        {(m.employee_name || '?')[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.employee_name || '—'}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.type}</div>
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
