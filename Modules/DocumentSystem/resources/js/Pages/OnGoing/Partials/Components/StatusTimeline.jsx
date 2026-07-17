import React from 'react';
import { Check, Clock, X } from 'lucide-react';

const steps = [
    { key: 'draft',    label: 'Draft Dibuat' },
    { key: 'review',   label: 'Tahap Review' },
    { key: 'approvalL1', label: 'Approval CRS (L1)' },
    { key: 'approvalL2', label: 'Approval PJA (L2)' },
    { key: 'active',   label: 'Dokumen Aktif' },
];

const statusToStep = {
    '2': 0, // DRAFT -> "Draft Dibuat"
    '1': 1, // WAITING_REVIEW -> "Tahap Review"
    '3': 2, // ROOTING_REVIEW -> "Approval CRS (L1)"
    '6': 3, // PREPARE_ROOTING_REVIEW -> "Approval PJA (L2)"
    '5': 4, // ACTIVE -> "Dokumen Aktif"
    '4': 1, // ON_REVISION -> "Tahap Review"
};

export default function StatusTimeline({ status }) {
    const currentStep = statusToStep[status] ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.map((step, idx) => {
                const done    = idx < currentStep;
                const active  = idx === currentStep;
                const pending = idx > currentStep;

                return (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: done ? 'var(--success)' : active ? 'var(--primary)' : '#E2E8F0',
                            color: (done || active) ? '#fff' : 'var(--text-muted)',
                        }}>
                            {done ? <Check size={12} /> : active ? <Clock size={12} /> : <span style={{ fontSize: '10px', fontWeight: 700 }}>{idx + 1}</span>}
                        </div>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: active ? 700 : 500,
                            color: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--text-muted)'
                        }}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
