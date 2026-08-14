import { Head, Link } from '@inertiajs/react';

export default function PendingApproval({ message }) {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F7F9FC',
            fontFamily: 'Inter, system-ui, sans-serif',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Head title="AIMS - Menunggu Persetujuan" />

            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '48px 40px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
            }}>
                {/* Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 140, 36, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8C24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#10233F',
                    marginBottom: '12px',
                }}>
                    Menunggu Persetujuan
                </h1>

                {/* Message */}
                <p style={{
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: '1.6',
                    marginBottom: '32px',
                }}>
                    {message || 'Akun Anda sedang menunggu persetujuan administrator. Anda akan dapat masuk setelah akun diaktifkan.'}
                </p>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #E7ECF3', paddingTop: '24px' }}>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-block',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#153B73',
                            textDecoration: 'none',
                            padding: '10px 24px',
                            border: '1.5px solid #153B73',
                            borderRadius: '8px',
                        }}
                    >
                        Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
