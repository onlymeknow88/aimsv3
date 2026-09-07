import { ArrowLeft } from 'lucide-react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

const S = {
    label: { fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    title: { fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: 0 },
    error: { fontSize: '11px', color: 'var(--danger)', marginTop: '4px' },
    card: { marginBottom: '32px' },
};
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

export default function CommissioningCreate() {
    const [proposals, setProposals] = useState([]);
    const [proposalId, setProposalId] = useState('');
    const [headers, setHeaders] = useState([]);
    const [items, setItems] = useState({});
    const [form, setForm] = useState({ date: '', commissioning_completion_date: '', smu_odo_meter: '', engine_status: '', expired_date: '', status: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/ko/proposals', { params: { status: 'Commissioning in Progress', limit: 100 } })
            .then(res => setProposals(res.data?.result?.data ?? []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!proposalId) { setHeaders([]); setItems({}); return; }
        axios.get(`/api/ko/proposals/${proposalId}`)
            .then(res => {
                const spipId = res.data?.result?.ko_unit?.ko_spip_unit_id;
                if (!spipId) { setHeaders([]); return; }
                return axios.get('/api/ko/commissioning-headers', { params: { spip_unit_id: spipId, limit: 100 } });
            })
            .then(res => { if (res) setHeaders(res.data?.result?.data ?? []); })
            .catch(() => {});
    }, [proposalId]);

    const setItem = (fieldId, patch) => {
        setItems(prev => ({ ...prev, [fieldId]: { ...(prev[fieldId] ?? {}), ...patch } }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                ko_proposal_id: proposalId,
                ...form,
                items: Object.entries(items)
                    .filter(([, v]) => v.condition || v.note)
                    .map(([fieldId, v]) => ({ ko_commissioning_field_id: Number(fieldId), condition: v.condition ?? '', note: v.note ?? '' })),
            };
            const res = await axios.post('/api/ko/commissionings', payload);
            window.location.href = `/ko/commissionings/${proposalId}`;
            return res;
        } catch {
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Buat Komisioning KO" />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', maxWidth: '1100px', margin: '0 auto 24px auto' }}>
                    <a href="/ko/commissionings" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                        <ArrowLeft size={16} /> Kembali ke Komisioning
                    </a>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Siklus Komisioning Baru</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                        <div style={S.card}>
                            <p style={S.title}>Proposal & Jadwal</p>
                            <div style={{ ...row2, marginBottom: '16px' }}>
                                <div>
                                    <label style={S.label}>Proposal <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <SearchableSelect
                                        options={proposals.map(p => ({ id: p.id, name: `${p.number} — ${p.ko_unit?.call_sign ?? ''}` }))}
                                        value={proposalId}
                                        onChange={setProposalId}
                                        placeholder="— Pilih Proposal (Commissioning) —"
                                    />
                                </div>
                                <div>
                                    <label style={S.label}>Tanggal Komisioning</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ ...S.input, maxWidth: '280px' }} />
                                </div>
                            </div>
                            <div style={{ ...row2 }}>
                                <div>
                                    <label style={S.label}>SMU / Odo Meter</label>
                                    <input value={form.smu_odo_meter} onChange={e => setForm(f => ({ ...f, smu_odo_meter: e.target.value }))} style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Status Engine</label>
                                    <input value={form.engine_status} onChange={e => setForm(f => ({ ...f, engine_status: e.target.value }))} style={S.input} />
                                </div>
                            </div>
                        </div>

                        <div style={S.card}>
                            <p style={S.title}>Item Pemeriksaan ({Object.keys(items).filter(k => items[k].condition || items[k].note).length} terisi)</p>
                            {!proposalId ? (
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pilih proposal terlebih dahulu untuk memuat checklist.</p>
                            ) : !headers.length ? (
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tidak ada checklist untuk unit ini.</p>
                            ) : (
                                headers.map(h => (
                                    <div key={h.id} style={{ marginBottom: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: 700 }}>
                                            {h.number} — {h.header}
                                        </div>
                                        {(h.ko_commissioning_fields ?? []).map(f => (
                                            <div key={f.id} style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px', alignItems: 'start' }}>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{f.number} — <span dangerouslySetInnerHTML={{ __html: f.question ?? '' }} /></div>
                                                    <input
                                                        value={items[f.id]?.note ?? ''}
                                                        onChange={e => setItem(f.id, { note: e.target.value })}
                                                        placeholder="Catatan..."
                                                        style={{ ...S.input, marginTop: '6px' }}
                                                    />
                                                </div>
                                                <select
                                                    value={items[f.id]?.condition ?? ''}
                                                    onChange={e => setItem(f.id, { condition: e.target.value })}
                                                    style={{ ...S.input, cursor: 'pointer' }}
                                                >
                                                    <option value="">— Kondisi —</option>
                                                    <option value="Baik">Baik</option>
                                                    <option value="Rusak">Rusak</option>
                                                    <option value="NA">N/A</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <a href="/ko/commissionings" style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Batal</a>
                            <button type="button" onClick={handleSubmit} disabled={submitting || !proposalId}
                                style={{ height: '40px', padding: '0 24px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: submitting || !proposalId ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                                {submitting ? 'Menyimpan...' : 'Simpan Komisioning'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
