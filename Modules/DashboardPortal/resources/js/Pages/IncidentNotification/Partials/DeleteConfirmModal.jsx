import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, deleting = false, errorMessage }) {
    if (!isOpen) return null;

    return (
        <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <AlertTriangle size={16} color="#dc2626" />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Hapus Data</h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                        Apakah Anda yakin ingin menghapus incident notification:
                    </p>
                    {itemName && (
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '8px 0 0' }}>"{itemName}"</p>
                    )}
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>Tindakan ini tidak dapat dibatalkan.</p>
                    {errorMessage && (
                        <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', color: '#dc2626' }}>
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose}
                        style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Batal
                    </button>
                    <button type="button" onClick={onConfirm} disabled={deleting}
                        style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                        {deleting ? 'Menghapus…' : 'Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}
