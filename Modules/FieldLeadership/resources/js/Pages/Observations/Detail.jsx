import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, AlertCircle, Edit } from 'lucide-react';
import axios from 'axios';
import useApproval from './Hooks/useApproval';
import DetailLeftSidebar  from './Partials/DetailLeftSidebar';
import DetailCenter       from './Partials/DetailCenter';
import DetailRightSidebar from './Partials/DetailRightSidebar';

const STATUS_CONFIG = {
    'Open':               { text: 'OPEN',             color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'On Review PICA':     { text: 'ON REVIEW PICA',   color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review PJA':      { text: 'ON REVIEW PJA',    color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)'  },
    'On Review Approval': { text: 'ON REVIEW APPRVL', color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)'  },
    'Overdue':            { text: 'OVERDUE',           color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'   },
    'Closed':             { text: 'CLOSED',            color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'   },
};

export default function Detail({ id }) {
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
        axios.get(`/api/field-leadership/observations/${id}`)
            .then(res => {
                if (res.data?.result) setData(res.data.result);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { loadDetail(); }, [loadDetail]);

    const approval = useApproval(id, { onSuccess: () => loadDetail() });

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Head title="Detail Field Leadership" />
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail Field Leadership...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Head title="Detail Field Leadership" />
                <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Field Leadership tidak ditemukan.</p>
                <a href="/field-leadership/observations" style={{ color: 'var(--primary)', fontSize: '13px' }}>← Kembali ke daftar</a>
            </div>
        );
    }

    const obs    = data.observation ?? {};
    const status = STATUS_CONFIG[obs.status] ?? { text: obs.status, color: '#64748b', bg: '#f1f5f9' };
    const canEdit = obs.status === 'Open';

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={`Detail Field Leadership: ${obs.type ?? ''}`} />

            {/* Top Bar Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <a href="/field-leadership/observations" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                }}>
                    <ArrowLeft size={16} /> Kembali ke Field Leadership
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '11px', fontWeight: 700,
                        backgroundColor: status.bg, color: status.color,
                        padding: '2px 10px', borderRadius: '12px',
                    }}>
                        {status.text}
                    </span>

                    {canEdit && (
                        <a href={`/field-leadership/observations/${id}/edit`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            backgroundColor: 'var(--primary)', color: '#fff',
                            borderRadius: '6px', padding: '6px 14px',
                            fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                        }}>
                            <Edit size={12} /> Edit
                        </a>
                    )}
                </div>
            </div>

            {/* 3-Column Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 280px',
                gap: isMobile ? '16px' : '24px',
                alignItems: 'start',
            }}>
                {/* LEFT SIDEBAR */}
                <aside style={{ order: isMobile ? 2 : 1 }}>
                    <DetailLeftSidebar obs={obs} />
                </aside>

                {/* CENTER */}
                <main style={{ order: isMobile ? 1 : 2 }}>
                    <DetailCenter
                        obs={obs}
                        members={data.members}
                        positives={data.positives}
                        risks={data.risks}
                        questionPtos={data.question_ptos}
                    />
                </main>

                {/* RIGHT SIDEBAR */}
                <aside style={{ order: isMobile ? 3 : 3 }}>
                    <DetailRightSidebar
                        obs={obs}
                        activities={data.activities}
                        approval={approval}
                    />
                </aside>
            </div>
        </div>
    );
}
