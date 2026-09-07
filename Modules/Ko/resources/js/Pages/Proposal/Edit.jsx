import { ArrowLeft, Save, Send } from 'lucide-react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProposalForm, { emptyProposalForm } from './Partials/ProposalForm';

export default function ProposalEdit() {
    const { id } = usePage().props;
    const [form, setForm] = useState(emptyProposalForm);
    const [master, setMaster] = useState({ companies: [], departments: [], users: [], units: [] });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        axios.get('/api/ko/master-data').then(res => setMaster(res.data?.result ?? {})).catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/ko/proposals/${id}`)
            .then(res => {
                const doc = res.data?.result;
                if (!doc) return;
                if (!['Draft', 'Returned'].includes(doc.status)) {
                    setLocked(true);
                    return;
                }
                setForm({
                    area: doc.area ?? '', ko_unit_id: doc.ko_unit_id ?? '',
                    company_id: doc.company_id ?? '', ccow_id: doc.ccow_id ?? '',
                    department_id: doc.department_id ?? '', other_department: doc.other_department ?? '',
                    applicant_email: doc.applicant_email ?? '', pjo_id: doc.pjo_id ?? '',
                    internal_komisioning_schedule: doc.internal_komisioning_schedule ? String(doc.internal_komisioning_schedule).slice(0, 10) : '',
                    next_commissioning: doc.next_commissioning ? String(doc.next_commissioning).slice(0, 10) : '',
                    temporary_validity_period: doc.temporary_validity_period ? String(doc.temporary_validity_period).slice(0, 10) : '',
                    commissioning_period: doc.commissioning_period ?? '',
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const setField = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
        setErrors(prev => ({ ...prev, [k]: null }));
    };

    const handleSubmit = async (action = 'draft') => {
        setSubmitting(true);
        try {
            await axios.put(`/api/ko/proposals/${id}`, form);
            if (action === 'submit') {
                await axios.post(`/api/ko/proposals/${id}/submit`);
            }
            window.location.href = `/ko/proposals/${id}`;
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat data...</div>;
    }

    if (locked) {
        return (
            <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Dokumen tidak dapat diedit</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hanya proposal berstatus Draft/Returned yang dapat diedit.</p>
                    <a href={`/ko/proposals/${id}`} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>Kembali ke Detail</a>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Edit Proposal KO" />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', maxWidth: '1100px', margin: '0 auto 24px auto' }}>
                    <a href={`/ko/proposals/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                        <ArrowLeft size={16} /> Kembali ke Detail
                    </a>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Siklus Pembaharuan Proposal</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                        <ProposalForm form={form} setField={setField} errors={errors} master={master} />

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <a href={`/ko/proposals/${id}`} style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Batal</a>
                            <button type="button" onClick={() => handleSubmit('draft')} disabled={submitting}
                                style={{ height: '40px', padding: '0 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Save size={13} />
                                {submitting ? 'Menyimpan...' : 'Simpan Draft'}
                            </button>
                            <button type="button" onClick={() => handleSubmit('submit')} disabled={submitting}
                                style={{ height: '40px', padding: '0 24px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Send size={13} />
                                {submitting ? 'Menyimpan...' : 'Submit'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
