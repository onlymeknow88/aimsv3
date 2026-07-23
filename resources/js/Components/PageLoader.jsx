import React from 'react';

/**
 * PageLoader — full-page centered loading spinner.
 * Usage: <PageLoader title="Memuat data..." />
 */
export default function PageLoader({ title = 'Memuat data...', minHeight = '100vh' }) {
    return (
        <>
            <style>{`
                @keyframes pageloader-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes pageloader-fade {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div style={{
                backgroundColor: 'var(--bg-color, #f8fafc)',
                minHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                animation: 'pageloader-fade 0.25s ease-out',
            }}>
                {/* Spinner */}
                <div style={{ position: 'relative', width: '44px', height: '44px' }}>
                    {/* Track */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '3px solid var(--border-color, #e2e8f0)',
                    }} />
                    {/* Active arc */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '3px solid transparent',
                        borderTopColor: 'var(--primary, #153B73)',
                        animation: 'pageloader-spin 0.75s linear infinite',
                    }} />
                </div>

                {/* Label */}
                <p style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-secondary, #64748b)',
                    margin: 0,
                    letterSpacing: '0.1px',
                }}>
                    {title}
                </p>
            </div>
        </>
    );
}