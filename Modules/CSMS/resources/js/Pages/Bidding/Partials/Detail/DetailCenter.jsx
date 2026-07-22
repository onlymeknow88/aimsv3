import React from 'react';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '16px',
};

const sectionTitle = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)', paddingBottom: '8px',
    marginBottom: '12px', textTransform: 'uppercase',
};

function ChecklistItem({ checklist, index }) {
    const val = checklist.value;
    const icon = val === 'Ya'
        ? <CheckCircle size={14} color="var(--success)" />
        : val === 'Tidak'
        ? <XCircle size={14} color="var(--danger)" />
        : <MinusCircle size={14} color="#94a3b8" />;

    const bgColor = val === 'Ya'
        ? 'rgba(47,191,113,0.04)'
        : val === 'Tidak'
        ? 'rgba(239,68,68,0.04)'
        : '#fafafa';

    const badgeStyle = {
        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
        backgroundColor: val === 'Ya' ? 'rgba(47,191,113,0.1)' : val === 'Tidak' ? 'rgba(239,68,68,0.08)' : 'rgba(100,116,139,0.1)',
        color: val === 'Ya' ? 'var(--success)' : val === 'Tidak' ? 'var(--danger)' : '#64748b',
    };

    return (
        <div style={{ padding: '12px', backgroundColor: bgColor, borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {index + 1}. {checklist.point}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {checklist.sub_point}
                    </div>
                    {checklist.legal_base && (
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                            Dasar Hukum: {checklist.legal_base}
                        </div>
                    )}
                    {checklist.comment && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', padding: '6px 8px', backgroundColor: '#f8fafc', borderRadius: '4px', borderLeft: '2px solid var(--border-color)' }}>
                            Catatan: {checklist.comment}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {icon}
                    <span style={badgeStyle}>{val || 'Belum diisi'}</span>
                </div>
            </div>
        </div>
    );
}

export default function DetailCenter({ bidding, checklists = [] }) {
    const filled   = checklists.filter(c => c.value).length;
    const approved = checklists.filter(c => c.value === 'Ya').length;
    const rejected = checklists.filter(c => c.value === 'Tidak').length;

    return (
        <div>
            {/* Summary Card */}
            <div style={card}>
                <h4 style={sectionTitle}>Ringkasan Penilaian</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(47,191,113,0.06)', borderRadius: '8px', border: '1px solid rgba(47,191,113,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success)' }}>{approved}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Sesuai (Ya)</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger)' }}>{rejected}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Tidak Sesuai</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(21,59,115,0.06)', borderRadius: '8px', border: '1px solid rgba(21,59,115,0.15)' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{filled}/{checklists.length}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Diisi</div>
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div style={card}>
                <h4 style={sectionTitle}>Checklist Audit ({checklists.length} butir)</h4>
                {checklists.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        Belum ada checklist.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {checklists.map((cl, i) => (
                            <ChecklistItem key={cl.id} checklist={cl} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}