import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CalendarofEvent({ coeEvents, loading }) {
    if (loading) {
        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
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
                    <a href="/coe/calendar" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Lihat Semua</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {coeEvents.length > 0 ? (
                        coeEvents.map((evt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: idx !== coeEvents.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '10px', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '6px 10px', textAlign: 'center', minWidth: '50px' }}>
                                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>{evt.date.split(' ')[0]}</span>
                                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{evt.date.split(' ')[1]}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{evt.title}</h5>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evt.dept}</span>
                                </div>
                                <span style={{ fontSize: '9.5px', fontWeight: 800, backgroundColor: `${evt.color}12`, color: evt.color, padding: '2px 6px', borderRadius: '4px' }}>{evt.status}</span>
                            </div>
                        ))
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
