import { Check, Clock } from 'lucide-react';
import React from 'react';

    '1': 1,
};



export default function StatusTimeline({ status, document }) {
    const currentStep = statusToStep[String(status)] ?? 0;
    const isRevision  = String(status) === '4';

    const steps = [
        {
            sublabel: document?.creator?.name || document?.owner?.name || null,
        },
        {
            key: 'review',
            label: 'Tahap Review',
            sublabel: null,
        },
        {
            key: 'approvalL1',
            label: 'Approval CRS (L1)',
            sublabel: document?.approved_by_crs_user?.name
                || (document?.approved_at_crs ? 'Disetujui' : null),
        },
        {
            key: 'approvalL2',
            label: 'Approval PJA (L2)',
            sublabel: document?.approved_by_pja_user?.name
                || (document?.approved_at_pja ? 'Disetujui' : null),
        },
        {
            key: 'active',
            label: 'Dokumen Aktif',
            sublabel: document?.approved_at_pja
                ? new Date(document.approved_at_pja).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                : null,
        },
    ];

    return (

        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, idx) => {



                const done   = idx < currentStep;
                const active = idx === currentStep;
                // connector line between steps
                const showConnector = idx < steps.length - 1;







                                        ? 'var(--success)'
                                        : active && isRevision
                                        ? 'var(--danger)'
                                        : active
                                        ? 'var(--primary)'
                                        : '#E2E8F0',
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
                                        width: '2px',
                                        height: '28px',
                                        backgroundColor: done ? 'var(--success)' : '#E2E8F0',
                                        margin: '2px 0',
                                        transition: 'background-color 0.2s',
                                    }} />
                                )}
                            </div>

                            {/* Label + sublabel */}
                            <div style={{ paddingTop: '3px', paddingBottom: showConnector ? '0' : '0' }}>
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
                            </div>
                        </div>







                    </div>
