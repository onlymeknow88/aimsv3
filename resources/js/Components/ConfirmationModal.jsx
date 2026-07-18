import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ConfirmationModal({ 
    isOpen, 
    type, // 'draft' or 'review'
    onConfirm, 
    onCancel, 
    loading 
}) {
    if (!isOpen) return null;

    const isDraft = type === 'draft';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Icon Wrapper */}
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: isDraft ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: isDraft ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)'
                }}>
                    {isDraft ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
                </div>

                {/* Content */}
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 8px 0'
                }}>
                    {isDraft ? 'Simpan sebagai Draft?' : 'Kirim untuk Review?'}
                </h3>
                <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: '0 0 28px 0'
                }}>
                    {isDraft 
                        ? 'Dokumen akan disimpan sebagai draft terlebih dahulu dan dapat diedit kembali nanti.' 
                        : 'Dokumen akan dikirim ke penanggung jawab / reviewer untuk proses verifikasi.'}
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    width: '100%',
                    gap: '10px'
                }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            color: '#475569',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: isDraft ? 'rgb(59, 130, 246)' : 'var(--primary)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.filter = 'brightness(0.95)';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.filter = 'none';
                        }}
                    >
                        {loading ? (
                            <>
                                <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px', color: '#fff' }} fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <style>{`
                                    @keyframes spin {
                                        from { transform: rotate(0deg); }
                                        to { transform: rotate(360deg); }
                                    }
                                `}</style>
                                <span>Processing...</span>
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
