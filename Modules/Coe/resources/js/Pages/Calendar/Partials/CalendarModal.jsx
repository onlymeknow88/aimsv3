import React from 'react';
import { X, Clock, Layers, Mail, Info } from 'lucide-react';

export default function CalendarModal({ selectedEvent, onClose }) {
    if (!selectedEvent) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.65)",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "16px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "500px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                        backgroundColor: selectedEvent.category?.color || '#3b82f6',
                        color: '#fff'
                    }}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
                        Detail Agenda Pertemuan
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            opacity: 0.8
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{selectedEvent.title}</h4>
                        <span style={{
                            backgroundColor: (selectedEvent.category?.color || '#3b82f6') + '20',
                            color: selectedEvent.category?.color || '#3b82f6',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            display: 'inline-block'
                        }}>
                            {selectedEvent.category?.name || 'Kategori Umum'}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        {/* Time */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <Clock size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Waktu Pelaksanaan</div>
                                <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px', fontWeight: 600 }}>
                                    {new Date(selectedEvent.start_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {/* Section */}
                        {selectedEvent.section && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <Layers size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Section Penanggung Jawab</div>
                                    <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px', fontWeight: 600 }}>
                                        {selectedEvent.section.name || '-'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Invites */}
                        {selectedEvent.invited_emails && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <Mail size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Daftar Undangan</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                        {Array.isArray(selectedEvent.invited_emails) ? (
                                            selectedEvent.invited_emails.map((email, idx) => (
                                                <span key={idx} style={{ fontSize: '11px', color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {email}
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#334155' }}>{selectedEvent.invited_emails}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {selectedEvent.description && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <Info size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Deskripsi Agenda</div>
                                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: '1.6' }}>
                                        {selectedEvent.description}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "10px 20px",
                                background: "linear-gradient(135deg, #1d4ed8, #153B73)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
