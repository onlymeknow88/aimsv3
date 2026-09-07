import { CheckCircle } from 'lucide-react';
import React from 'react';

const STATUS_STEPS = [
    { key: 'Draft',         label: 'Draft' },
    { key: 'On Review PJA', label: 'Review PJA' },
    { key: 'On Review CRS', label: 'Verifikasi CRS' },
    { key: 'Open',          label: 'Approved / Open' },
    { key: 'Closed',        label: 'Closed' },
];

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

function formatDt(dt) {
    if (!dt) return null;
    return new Date(dt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Cari aktivitas transisi terbaru yang relevan dengan step (toleran data lama).
function findActivity(activities, keywords) {
    const list = [...(activities ?? [])].reverse();
    return list.find(a => keywords.some(k => (a.description ?? '').toLowerCase().includes(k))) ?? null;
}

function StepDetails({ stepKey, doc }) {
    const acts = doc.activities ?? [];
    let user = null;
    let time = null;

    if (stepKey === 'Draft') {
        user = doc.createdBy?.name;
        time = formatDt(doc.created_at);
    } else if (stepKey === 'On Review PJA') {
        const a = findActivity(acts, ['submit', 'new request']);
        user = a?.user?.name;
        time = formatDt(a?.created_at);
    } else if (stepKey === 'On Review CRS') {
        const a = findActivity(acts, ['approved by pja', 'pja']);
        user = a?.user?.name;
        time = formatDt(a?.created_at);
    } else if (stepKey === 'Open') {
        const a = findActivity(acts, ['approved by crs']);
        user = a?.user?.name;
        time = formatDt(a?.created_at);
    } else if (stepKey === 'Closed') {
        const a = findActivity(acts, ['closed']);
        user = a?.user?.name;
        time = formatDt(doc.settlement_date ?? a?.created_at);
    }

    if (!time && !user) return null;
    return (
        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {user && <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>By: {user}</span>}
            {time && <span>{time}</span>}
        </div>
    );
}

export default function ApprovalTimeline({ doc }) {
    if (!doc) return null;

    const isReturn = doc.requested === 'Return Document' && doc.status === 'Open';
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === doc.status);

    return (
        <div style={card}>
            <h4 style={sectionTitle}>Alur Persetujuan</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {isReturn && (
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', padding: '6px 10px', backgroundColor: '#fef2f2', borderRadius: '6px', marginBottom: '8px' }}>
                        ✗ Dikembalikan (Return Document)
                    </div>
                )}
                {STATUS_STEPS.map((step, idx) => {
                    const done   = currentIdx === -1 ? false : idx < currentIdx;
                    const active = idx === currentIdx;
                    return (
                        <div key={step.key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%', zIndex: 1,
                                    backgroundColor: done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0',
                                    border: `2px solid ${done ? 'var(--success)' : active ? 'var(--primary)' : '#e2e8f0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {done && <CheckCircle size={11} color="#fff" />}
                                    {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                    <div style={{ width: '2px', height: '36px', backgroundColor: done ? 'var(--success)' : '#e2e8f0' }} />
                                )}
                            </div>
                            <div style={{ paddingTop: '2px', paddingBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: active ? 700 : 600, color: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    {step.label}
                                </div>
                                <StepDetails stepKey={step.key} doc={doc} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
