import { ArrowRight } from 'lucide-react';
import React from 'react';

export default function CalendarofEvent({ coeEvents, loading }) {
    if (loading) {
        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                <style>{`
                    @keyframes pulse-light {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.4; }
                    }
                `}</style>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>CALENDAR OF EVENT</h4>
                        <div style={{ width: '60px', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-light 1.5s infinite' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', borderBottom: i !== 3 ? '1px solid var(--border-color)' : 'none', paddingBottom: '10px', alignItems: 'center', animation: 'pulse-light 1.5s infinite' }}>
                                <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', width: '50px', height: '42px' }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%' }} />
                                    <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '40%' }} />
                                </div>
                                <div style={{ width: '60px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '120px', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-light 1.5s infinite' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>CALENDAR OF EVENT</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(coeEvents ?? []).length > 0 ? (
                        (coeEvents ?? []).slice(0, 5).map((evt, idx) => {
                            const startDate   = evt.start_date ? new Date(evt.start_date) : null;
                            const evtColor    = evt.category_color ?? 'var(--primary)';
                            const statusColor =
                                evt.status === 'Completed'  ? '#16a34a' :
                                evt.status === 'Ongoing'    ? '#2563eb' :
                                evt.status === 'Cancelled'  ? '#dc2626' : '#d97706';
                            const statusBg =
                                evt.status === 'Completed'  ? '#dcfce7' :
                                evt.status === 'Ongoing'    ? '#dbeafe' :
                                evt.status === 'Cancelled'  ? '#fee2e2' : '#fef3c7';

                            return (
                                <div key={evt.id ?? idx} style={{ display: 'flex', gap: '16px', borderBottom: idx !== Math.min((coeEvents ?? []).length, 5) - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '10px', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: `${evtColor}18`, borderRadius: '8px', width: '50px', minWidth: '50px', height: '46px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px solid ${evtColor}40` }}>
                                        <span style={{ fontSize: '18px', fontWeight: 800, color: evtColor, lineHeight: 1 }}>
                                            {startDate ? startDate.getDate() : '?'}
                                        </span>
                                        <span style={{ fontSize: '9px', color: evtColor, fontWeight: 600, textTransform: 'uppercase', opacity: 0.8 }}>
                                            {startDate ? startDate.toLocaleDateString('id-ID', { month: 'short' }) : ''}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {evt.title}
                                        </div>
                                        {evt.end_date && (
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                s/d {new Date(evt.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', backgroundColor: statusBg, color: statusColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                        {evt.status?.toUpperCase()}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
                            Tidak ada agenda kegiatan saat ini.
                        </div>
                    )}
                </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', textAlign: 'center' }}>
                <a href="/coe/calendar" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Lihat Kalender Lengkap <ArrowRight size={12} />
                </a>
            </div>
        </div>
    );
}
