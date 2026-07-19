import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';

export default function RejectModal({ isOpen, onClose, onConfirm, loading }) {
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!notes.trim()) {
            setError('Alasan penolakan wajib diisi.');
            return;
        }
        setError('');
        onConfirm(notes);
    };

    const handleClose = () => {
        setNotes('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15,23,42,0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                animation: 'scaleUp 0.2s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <style>{`@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#EF4444'
                        }}>
                            <XCircle size={20} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            Reject & Return Revision
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Description */}
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.7 }}>
                    Dokumen akan ditolak dan dikembalikan ke status <strong>Draft</strong>.
                    Silakan berikan alasan atau catatan revisi di bawah ini.
                </p>

                {/* Textarea */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Alasan Return / Catatan Revisi <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={e => { setNotes(e.target.value); if (error) setError(''); }}
                        placeholder="Tulis alasan revisi/return secara detail..."
                        rows={4}
                        disabled={loading}
                        style={{
                            width: '100%',
                            border: `1px solid ${error ? '#EF4444' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontSize: '12px',
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box',
                            color: '#0f172a',
                            transition: 'border-color 0.2s',
                            lineHeight: 1.6,
                        }}
                    />
                    {error && (
                        <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', fontWeight: 600 }}>
                            {error}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '10px',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            background: '#fff', color: '#475569',
                            fontSize: '12px', fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '10px',
                            border: 'none', borderRadius: '8px',
                            background: '#EF4444', color: '#fff',
                            fontSize: '12px', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                    >
                        {loading ? 'Processing...' : <><XCircle size={14} /> Return</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
