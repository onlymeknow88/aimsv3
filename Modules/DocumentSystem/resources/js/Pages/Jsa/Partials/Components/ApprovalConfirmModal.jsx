import React from 'react';
import { CheckCircle, Send } from 'lucide-react';

/**
 * ApprovalConfirmModal — modal konfirmasi aksi "Submit for Review" atau "Approve"
 * Props:
 *   isOpen   : boolean
 *   type     : 'submit' | 'approve'
 *   loading  : boolean
 *   onClose  : () => void
 *   onConfirm: () => void
 */
export default function ApprovalConfirmModal({ isOpen, type, onClose, onConfirm, loading }) {
    if (!isOpen) return null;

    const isApprove = type === 'approve';

    const config = {
        approve: {
            icon: <CheckCircle size={28} />,
            iconBg: 'rgba(16,185,129,0.1)',
            iconColor: '#10B981',
            title: 'Setujui Dokumen?',
            desc: 'Dokumen akan disetujui dan statusnya berubah menjadi Active. Tindakan ini tidak dapat dibatalkan.',
            btnBg: '#10B981',
            btnLabel: 'Ya, Setujui',
            btnLoadingLabel: 'Menyetujui...',
        },
        submit: {
            icon: <Send size={28} />,
            iconBg: 'rgba(245,158,11,0.1)',
            iconColor: '#F59E0B',
            title: 'Kirim untuk Review?',
            desc: 'Dokumen akan dikirim ke reviewer untuk proses verifikasi. Anda tidak dapat mengedit dokumen selama dalam proses review.',
            btnBg: '#F59E0B',
            btnLabel: 'Ya, Kirim',
            btnLoadingLabel: 'Mengirim...',
        },
    };

    const cfg = config[type] || config.submit;

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
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                animation: 'scaleUp 0.2s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <style>{`@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

                {/* Icon */}
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    margin: '0 auto 16px',
                    backgroundColor: cfg.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cfg.iconColor
                }}>
                    {cfg.icon}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {cfg.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
                    {cfg.desc}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
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
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '10px',
                            border: 'none', borderRadius: '8px',
                            background: cfg.btnBg, color: '#fff',
                            fontSize: '12px', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? cfg.btnLoadingLabel : cfg.btnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
