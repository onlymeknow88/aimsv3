import { ArrowLeft, Save, Send } from 'lucide-react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProposalForm, { emptyProposalForm } from './Partials/ProposalForm';

export default function ProposalCreate() {
    const [form, setForm] = useState(emptyProposalForm);
    const [master, setMaster] = useState({ companies: [], departments: [], users: [], units: [] });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/ko/master-data').then(res => setMaster(res.data?.result ?? {})).catch(() => {});
    }, []);

    const setField = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
        setErrors(prev => ({ ...prev, [k]: null }));
    };

    const handleSubmit = async (action = 'draft') => {
        setSubmitting(true);
        try {
            const res = await axios.post('/api/ko/proposals', form);
            const newId = res.data?.result?.id;
            if (action === 'submit' && newId) {
                await axios.post(`/api/ko/proposals/${newId}/submit`);
                window.location.href = `/ko/proposals/${newId}`;
            } else {
                window.location.href = newId ? `/ko/proposals/${newId}` : '/ko/proposals';
            }
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Buat Proposal KO" />

            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', maxWidth: '1100px', margin: '0 auto 24px auto' }}>
                    <a href="/ko/proposals" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px' }}>
                        <ArrowLeft size={16} /> Kembali ke Proposal
                    </a>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Siklus Pembuatan Proposal Baru</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-premium)' }}>

                        <ProposalForm form={form} setField={setField} errors={errors} master={master} />

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <a href="/ko/proposals" style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 20px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>Batal</a>
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
