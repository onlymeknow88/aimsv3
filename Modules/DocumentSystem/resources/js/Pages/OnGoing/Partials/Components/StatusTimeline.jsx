import { Check, Clock } from 'lucide-react';

import React from 'react';

const statusToStep = {
    '1': 1,  // Waiting Review -> step 1 (Tahap Review)
    '2': 0,  // Draft -> step 0
    '3': 2,  // Routing Approval -> step 2 (Approval DC IMS)
    '4': 1,  // Revision -> back to step 1 (Tahap Review)
    '5': 3,  // Active -> step 3 (Dokumen Aktif)
    '6': 1,  // Prepare Approval -> step 1 (Tahap Review)
    '7': 3,  // Expired -> step 3 (stays at Dokumen Aktif)
    '8': 3,  // Obsolete -> step 3
};



export default function StatusTimeline({ status, document }) {
    const currentStep = statusToStep[String(status)] ?? 0;
    const isRevision  = String(status) === '4';

    const fmt = (dateStr) => dateStr
        ? new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;

    const steps = [
        {
            key: 'draft',
            label: 'Draft / Pembuat',
            sublabel: document?.creator?.name || document?.owner?.name || null,
            timestamp: fmt(document?.created_at),
        },
        {
            key: 'review',
            label: 'Tahap Review',
            sublabel: (String(document?.status) === '3') ? 'Sedang Direview' : null,
            timestamp: ['3', '6', '5', '7'].includes(String(document?.status)) ? fmt(document?.approved_at_pja || document?.updated_at) : null,
        },
        {
            key: 'approvalDCIMS',
            label: 'Approval DC IMS',
            sublabel: document?.approved_by_crs_user?.name || (String(document?.status) === '6' ? 'Menunggu Persetujuan' : null),
            timestamp: fmt(document?.approved_at_crs),
        },
        {
            key: 'active',
            label: 'Dokumen Aktif',
            sublabel: String(document?.status) === '5' ? 'Aktif' : String(document?.status) === '7' ? 'Expired' : null,
            timestamp: String(document?.status) === '5' || String(document?.status) === '7' ? fmt(document?.approved_at_crs) : null,
        },
    ];

        return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, idx) => {
                const done          = idx < currentStep || (idx === currentStep && currentStep === 3);
                const active        = idx === currentStep && currentStep !== 3;
                const showConnector = idx < steps.length - 1;
                const dotBg = done
                    ? 'var(--success)'
                    : active && isRevision
                    ? 'var(--danger)'
                    : active
                    ? 'var(--primary)'
                    : '#E2E8F0';

                return (
                    <div key={step.key ?? idx} style={{ display: 'flex', gap: '10px', marginBottom: showConnector ? '0' : '0' }}>
                        {/* Dot + connector */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '22px', height: '22px',
                                borderRadius: '50%',
                                backgroundColor: dotBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                color: (done || active) ? '#fff' : 'var(--text-muted)',
                                boxShadow: active ? '0 0 0 3px rgba(21,59,115,0.15)' : 'none',
                                transition: 'all 0.2s',
                            }}>
                                                                    {done
                                    ? <Check size={12} />
                                    : active
                                    ? <Clock size={12} />
                                    : <span style={{ fontSize: '9px', fontWeight: 700 }}>{idx + 1}</span>
                                }
                            </div>
                            {showConnector && (
                                <div style={{
                                    width: '2px', height: '28px',
                                    backgroundColor: done ? 'var(--success)' : '#E2E8F0',
                                    margin: '2px 0',
                                    transition: 'background-color 0.2s',
                                }} />
                            )}
                        </div>

                        {/* Label + sublabel + timestamp */}
                        <div style={{ paddingTop: '3px', paddingBottom: showConnector ? '28px' : '0' }}>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: active ? 700 : 600,
                                color: done
                                    ? 'var(--success)'
                                    : active && isRevision
                                    ? 'var(--danger)'
                                    : active
                                    ? 'var(--primary)'
                                    : 'var(--text-muted)',
                            }}>
                                {step.label}
                                {active && isRevision && (
                                    <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1px 6px', borderRadius: '10px', marginLeft: '6px' }}>
                                        REVISION
                                    </span>
                                )}
                            </div>
                            {step.sublabel && (
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px', fontWeight: 500 }}>
                                    {step.sublabel}
                                </div>
                            )}
                            {step.timestamp && (done || active) && (
                                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Clock size={9} />
                                    {step.timestamp}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
