import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Send, Upload, X } from 'lucide-react';
import axios from 'axios';
import usePicaForm from './Hooks/usePicaForm';

// Style disamakan dengan FieldLeadership Create.jsx:
// satu card besar (1100px) berisi section-section flat.
const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' },
    title: { fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger)', marginTop: '4px' },
    card: { marginBottom: '32px' },
    dateInput: { width: '100%', maxWidth: '280px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
};
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

const SOURCES = ['Field Leadership', 'Inspeksi KPLH', 'Audit', 'CSMS', 'Manual'];
const TYPES = ['Inspeksi', 'Audit Internal', 'Audit External', 'Investigasi', 'Monitoring', 'Evaluasi Peraturan & Perijinan', 'IBPR & Bowtie', 'Field Leadership', 'Evaluasi Target, Sasaran, Program (TSP)'];

export default function CreatePica() {
    const {
        form, setField,
        newFiles, addFiles, removeNewFile,
        errors, submitting, handleSubmit,
        masterData,
    } = usePicaForm();

    const [showConfirm, setShowConfirm] = useState(false);

    // 'draft' | 'submit' — aksi yang dikonfirmasi modal
    const [pendingAction, setPendingAction] = useState('draft');

    const onSubmit = async () => {
        const result = await handleSubmit();
        if (result) {
            if (pendingAction === 'submit' && typeof result === 'string') {
                try {
                    await axios.post(`/api/pica/documents/${result}/approval`, { action: 'submit' });
                } catch {}
                window.location.href = `/pica/detail/${result}`;
            } else {
                window.location.href = '/pica/active-document';
            }
        }
        setShowConfirm(false);
    };

    return (
        <>
            <Head title="Tambah PICA" />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                {/* Back navigation — gaya FieldLeadership CreateHeader */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '24px', borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '12px', maxWidth: '1100px', margin: '0 auto 24px auto',
                }}>
                    <a
                        href="/pica/active-document"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                        }}
                    >
                        <ArrowLeft size={16} /> Kembali ke PICA
                    </a>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Siklus Pembuatan PICA Baru
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                {/* Section 1 — Informasi Dasar */}
                <div style={S.card}>
                    <p style={S.title}>Informasi Dasar</p>
                    <div style={{ ...row2, marginBottom: '16px' }}>
                        <div>
                            <label style={S.label}>Source <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <select value={form.source} onChange={e => setField('source', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih source</option>
                                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.source && <p style={S.error}>{errors.source}</p>}
                        </div>
                        <div>
                            <label style={S.label}>Tipe Inspeksi</label>
                            <select value={form.type} onChange={e => setField('type', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih tipe</option>
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={S.label}>Tanggal Temuan</label>
                        <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} style={S.dateInput} />
                    </div>
                </div>

                {/* Section 2 — Detail Perusahaan */}
                <div style={S.card}>
                    <p style={S.title}>Detail Perusahaan & Lokasi</p>
                    <div style={{ ...row2, marginBottom: '16px' }}>
                        <div>
                            <label style={S.label}>CCOW</label>
                            <select value={form.ccow_id} onChange={e => setField('ccow_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih CCOW</option>
                                {masterData.companies?.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={S.label}>Perusahaan Kontraktor</label>
                            <select value={form.company_id} onChange={e => setField('company_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih perusahaan</option>
                                {masterData.companies?.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ ...row2, marginBottom: '16px' }}>
                        <div>
                            <label style={S.label}>Seksi</label>
                            <select value={form.section_id} onChange={e => setField('section_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih seksi</option>
                                {masterData.sections?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={S.label}>Lokasi</label>
                            <select value={form.location_id} onChange={e => setField('location_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih lokasi</option>
                                {masterData.locations?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div>
                            <label style={S.label}>Detail Lokasi</label>
                            <input type="text" value={form.location_detail} onChange={e => setField('location_detail', e.target.value)} style={S.input} placeholder="Detail lokasi" />
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={S.label}>Auditor / Inisiator (Multi)</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <select
                                value=""
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val && !form.auditors.includes(val)) setField('auditors', [...form.auditors, val]);
                                    e.target.value = '';
                                }}
                                style={{ ...S.input, flex: 1, cursor: 'pointer' }}
                            >
                                <option value="">Pilih auditor...</option>
                                {masterData.users?.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Atau ketik nama manual + Enter"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (val && !form.auditors.includes(val)) setField('auditors', [...form.auditors, val]);
                                        e.target.value = '';
                                    }
                                }}
                                style={{ ...S.input, flex: 1 }}
                            />
                        </div>
                        {form.auditors.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {form.auditors.map((aud, idx) => {
                                    const user = masterData.users?.find(u => u.id === aud);
                                    const label = user ? user.name : aud;
                                    return (
                                        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>
                                            {label}
                                            <button type="button" onClick={() => setField('auditors', form.auditors.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', display: 'flex', padding: 0 }}><X size={10} /></button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Bisa pilih dari user atau ketik manual. Legacy `Auditor` single tetap disimpan.</div>
                    </div>
                </div>

                {/* Section 3 — Detail Temuan */}
                <div style={S.card}>
                    <p style={S.title}>Detail Temuan</p>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={S.label}>Deskripsi Non-Compliance <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <textarea value={form.non_compliance} onChange={e => setField('non_compliance', e.target.value)} style={S.textarea} placeholder="Jelaskan ketidaksesuaian yang ditemukan..." />
                        {errors.non_compliance && <p style={S.error}>{errors.non_compliance}</p>}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={S.label}>Akar Masalah (Root Cause)</label>
                        <textarea value={form.non_compliance_root_cause} onChange={e => setField('non_compliance_root_cause', e.target.value)} style={S.textarea} placeholder="Jelaskan akar masalah..." />
                    </div>
                    <div>
                        <label style={S.label}>Tindakan Perbaikan (Corrective Action) <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <textarea value={form.corrective_action} onChange={e => setField('corrective_action', e.target.value)} style={S.textarea} placeholder="Jelaskan tindakan perbaikan yang akan dilakukan..." />
                        {errors.corrective_action && <p style={S.error}>{errors.corrective_action}</p>}
                    </div>
                </div>

                {/* Section 4 — Target & PIC */}
                <div style={S.card}>
                    <p style={S.title}>Target & Penanggung Jawab</p>
                    <div style={{ ...row2, marginBottom: '16px' }}>
                        <div>
                            <label style={S.label}>Target Tanggal Selesai <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input type="date" value={form.target_settlement_date} onChange={e => setField('target_settlement_date', e.target.value)} style={S.dateInput} />
                            {errors.target_settlement_date && <p style={S.error}>{errors.target_settlement_date}</p>}
                        </div>
                        <div>
                            <label style={S.label}>Catatan (Remarks)</label>
                            <input type="text" value={form.remarks} onChange={e => setField('remarks', e.target.value)} style={S.input} placeholder="Catatan tambahan" />
                        </div>
                    </div>
                    <div style={row2}>
                        <div>
                            <label style={S.label}>PJA (Penanggung Jawab Area)</label>
                            <select value={form.pja_id} onChange={e => setField('pja_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih PJA</option>
                                {masterData.managers?.map(m => <option key={m.id} value={m.id}>{m.user?.name ?? m.id}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={S.label}>PJO / KTT</label>
                            <select value={form.pjo_id} onChange={e => setField('pjo_id', e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                                <option value="">Pilih PJO/KTT</option>
                                {masterData.users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 5 — File Lampiran */}
                <div style={S.card}>
                    <p style={S.title}>File Lampiran</p>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                        <Upload size={20} style={{ color: '#94a3b8' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Klik untuk upload atau drag & drop</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>PDF, PNG, JPG, DOC, DOCX</span>
                        <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
                    </label>
                    {newFiles.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {newFiles.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                                    <button type="button" onClick={() => removeNewFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>Hapus</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer — gaya FieldLeadership CreateFooter */}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '24px',
                    display: 'flex', justifyContent: 'flex-end',
                    alignItems: 'center', gap: '12px',
                    flexWrap: 'wrap',
                }}>
                    <a
                        href="/pica/active-document"
                        style={{
                            display: 'inline-flex', alignItems: 'center',
                            height: '40px', padding: '0 20px',
                            border: '1px solid var(--border-color)', borderRadius: '8px',
                            textDecoration: 'none', color: 'var(--text-secondary)',
                            fontSize: '12px', fontWeight: 600,
                        }}
                    >
                        Batal
                    </a>
                    <button
                        type="button"
                        onClick={() => { setPendingAction('draft'); setShowConfirm(true); }}
                        disabled={submitting}
                        style={{
                            height: '40px', padding: '0 20px',
                            backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px',
                            color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.7 : 1,
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        <Save size={13} />
                        {submitting && pendingAction === 'draft' ? 'Menyimpan...' : 'Simpan Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setPendingAction('submit'); setShowConfirm(true); }}
                        disabled={submitting}
                        style={{
                            height: '40px', padding: '0 24px',
                            backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '12px', fontWeight: 600,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.7 : 1,
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        <Send size={13} />
                        {submitting && pendingAction === 'submit' ? 'Menyimpan...' : 'Submit'}
                    </button>
                </div>

                </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 8px 0' }}>Konfirmasi Simpan</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                            {pendingAction === 'submit'
                                ? 'Dokumen akan disimpan dan langsung disubmit ke PJA. Lanjutkan?'
                                : 'Dokumen akan disimpan sebagai Draft. Lanjutkan?'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowConfirm(false)} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff' }}>Batal</button>
                            <button onClick={onSubmit} disabled={submitting} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                                {submitting ? 'Menyimpan...' : 'Ya, Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}