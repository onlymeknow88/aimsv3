import { CheckCircle, Copy, Eye, EyeOff, KeyRound, RefreshCw, Shield, ShieldOff, SmartphoneNfc } from 'lucide-react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

import DashboardLayout from '@/Layouts/DashboardLayout';

function TwoFactorSetup({ qrCodeUrl, secret, isEnabled, recoveryCodes }) {
    const { errors, flash } = usePage().props;
    const [digits, setDigits]         = useState(['', '', '', '', '', '']);
    const [showSecret, setShowSecret]  = useState(false);
    const [copied, setCopied]          = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const inputRefs = useRef([]);

    const sessionRecoveryCodes = flash?.recovery_codes ?? recoveryCodes ?? [];
    const status = flash?.status;

    const getCode = () => digits.join('');

    const handleDigitChange = (index, value) => {
        const clean = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = clean;
        setDigits(newDigits);
        if (clean && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) setDigits(pasted.split(''));
    };

    const handleEnable = (e) => {
        e.preventDefault();
        const code = getCode();
        if (code.length < 6) return;
        router.post(route('two-factor.enable'), { code }, {
            preserveScroll: true,
            onError: () => {
                setDigits(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const { data, setData, post, processing: disableProcessing } = useForm({ password: '' });

    const handleDisable = (e) => {
        e.preventDefault();
        post(route('two-factor.disable'), {
            preserveScroll: true,
            onSuccess: () => setShowDisable(false),
        });
    };

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate QR code menggunakan qrcode.js (via URL to image API)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;

    return (
        <>
            <Head title="Setup Two-Factor Authentication" />

            {/* Page Header */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #153B73, #1E4E96)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <Shield size={20} style={{ color: '#fff' }} />
                </div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                        Two-Factor Authentication
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        Kelola keamanan akun Anda dengan autentikasi dua langkah.
                    </p>
                </div>
            </div>

            {/* Layout: info kiri + form kanan */}
            <div className="twofa-grid">

            {/* Kolom kiri: status + info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Status card */}
                <div style={{
                    background: isEnabled
                        ? 'linear-gradient(135deg, #166534, #15803d)'
                        : 'linear-gradient(135deg, #153B73, #1E4E96)',
                    borderRadius: '16px', padding: '20px', color: '#fff',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        {isEnabled
                            ? <Shield size={20} style={{ color: '#86efac' }} />
                            : <SmartphoneNfc size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
                        }
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.8)' }}>
                            Status 2FA
                        </span>
                    </div>
                    <p style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1 }}>
                        {isEnabled ? 'Aktif' : 'Belum Aktif'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                        {isEnabled
                            ? 'Akun Anda terlindungi 2FA.'
                            : 'Aktifkan untuk keamanan ekstra.'
                        }
                    </p>
                </div>

                {/* Info card */}
                <div style={{
                    backgroundColor: '#fff', border: '1px solid var(--border-color)',
                    borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)',
                }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 14px' }}>
                        Cara Kerja 2FA
                    </p>
                    {[
                        { step: '1', text: 'Install aplikasi Google Authenticator atau Authy di ponsel Anda.' },
                        { step: '2', text: 'Scan QR code atau masukkan kode manual ke aplikasi.' },
                        { step: '3', text: 'Masukkan kode 6 digit dari aplikasi saat login.' },
                    ].map(({ step, text }) => (
                        <div key={step} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <div style={{
                                width: '22px', height: '22px', borderRadius: '50%',
                                backgroundColor: 'rgba(21,59,115,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700, color: '#153B73', flexShrink: 0,
                            }}>{step}</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kolom kanan: form */}
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
            }}>
                {/* Section title */}
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                    {isEnabled ? 'Kelola Two-Factor Authentication' : 'Aktifkan Two-Factor Authentication'}
                </p>

                {/* Status alerts */}
                {status === 'enabled' && (
                    <div style={{
                        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '13px', color: '#166534',
                    }}>
                        <CheckCircle size={16} /> Two-factor authentication berhasil diaktifkan!
                    </div>
                )}
                {status === 'disabled' && (
                    <div style={{
                        backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
                        borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '13px', color: '#9a3412',
                    }}>
                        <ShieldOff size={16} /> Two-factor authentication telah dinonaktifkan.
                    </div>
                )}

                {!isEnabled ? (
                    <>
                        {/* Step 1: QR Code */}
                        <div style={{
                            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Langkah 1 — Scan QR Code
                            </p>
                            <img
                                src={qrImageUrl}
                                alt="QR Code 2FA"
                                style={{ width: '180px', height: '180px', margin: '0 auto 16px', display: 'block', borderRadius: '8px' }}
                            />
                            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px' }}>
                                Atau masukkan kode manual:
                            </p>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                backgroundColor: '#fff', border: '1px solid #e2e8f0',
                                borderRadius: '8px', padding: '10px 14px',
                                justifyContent: 'space-between',
                            }}>
                                <code style={{
                                    fontSize: '14px', fontWeight: 700, color: '#153B73',
                                    letterSpacing: '2px', fontFamily: 'monospace',
                                    filter: showSecret ? 'none' : 'blur(4px)',
                                    transition: 'filter 0.2s',
                                    userSelect: showSecret ? 'text' : 'none',
                                }}>
                                    {secret}
                                </code>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button type="button" onClick={() => setShowSecret(!showSecret)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
                                        {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                    <button type="button" onClick={copySecret}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#2FBF71' : '#94a3b8', padding: '2px' }}>
                                        {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Verifikasi */}
                        <div style={{
                            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: '16px', padding: '24px',
                        }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Langkah 2 — Verifikasi Kode
                            </p>
                            <form onSubmit={handleEnable}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                                    {digits.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => inputRefs.current[i] = el}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleDigitChange(i, e.target.value)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            onPaste={handlePaste}
                                            style={{
                                                width: '48px', height: '56px',
                                                textAlign: 'center', fontSize: '22px', fontWeight: 800,
                                                border: `2px solid ${errors?.code ? '#fca5a5' : digit ? '#153B73' : '#e2e8f0'}`,
                                                borderRadius: '10px', outline: 'none',
                                                color: '#0f172a',
                                                backgroundColor: digit ? '#eff6ff' : '#fff',
                                                transition: 'all 0.15s',
                                            }}
                                        />
                                    ))}
                                </div>
                                {errors?.code && (
                                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#ef4444', marginBottom: '12px' }}>
                                        {errors.code}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={getCode().length < 6}
                                    style={{
                                        width: '100%', padding: '12px',
                                        background: getCode().length < 6 ? '#e2e8f0' : 'linear-gradient(135deg, #153B73, #1E4E96)',
                                        color: getCode().length < 6 ? '#94a3b8' : '#fff',
                                        border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: 700,
                                        cursor: getCode().length < 6 ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}
                                >
                                    <KeyRound size={15} /> Aktifkan 2FA
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Recovery Codes */}
                        {sessionRecoveryCodes.length > 0 && (
                            <div style={{
                                backgroundColor: '#fffbeb', border: '1px solid #fde68a',
                                borderRadius: '12px', padding: '16px', marginBottom: '24px',
                            }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '12px' }}>
                                    ⚠️ Simpan kode pemulihan ini di tempat yang aman. Masing-masing hanya bisa digunakan sekali.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                    {sessionRecoveryCodes.map((code, i) => (
                                        <code key={i} style={{
                                            fontSize: '12px', padding: '6px 10px',
                                            backgroundColor: '#fff', borderRadius: '6px',
                                            border: '1px solid #fde68a', fontFamily: 'monospace',
                                            color: '#92400e', letterSpacing: '1px',
                                        }}>
                                            {code}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status aktif */}
                        <div style={{
                            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '12px', padding: '20px', marginBottom: '24px',
                            display: 'flex', alignItems: 'center', gap: '16px',
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                backgroundColor: 'rgba(47,191,113,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Shield size={22} style={{ color: '#2FBF71' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#166534', margin: '0 0 4px' }}>Akun Anda Terlindungi</p>
                                <p style={{ fontSize: '12px', color: '#4d7c0f', margin: 0 }}>Two-factor authentication aktif menggunakan aplikasi autentikator.</p>
                            </div>
                        </div>

                        {/* Disable 2FA */}
                        {!showDisable ? (
                            <button
                                type="button"
                                onClick={() => setShowDisable(true)}
                                style={{
                                    width: '100%', padding: '12px',
                                    backgroundColor: '#fff', color: '#ef4444',
                                    border: '1.5px solid #fca5a5',
                                    borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                }}
                            >
                                <ShieldOff size={15} /> Nonaktifkan 2FA
                            </button>
                        ) : (
                            <form onSubmit={handleDisable} style={{
                                backgroundColor: '#fff5f5', border: '1px solid #fca5a5',
                                borderRadius: '12px', padding: '20px',
                            }}>
                                <p style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '12px', fontWeight: 600 }}>
                                    Konfirmasi password untuk menonaktifkan 2FA:
                                </p>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Password Anda"
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: `1.5px solid ${errors?.password ? '#fca5a5' : '#e2e8f0'}`,
                                        borderRadius: '8px', fontSize: '13px',
                                        outline: 'none', marginBottom: '8px', boxSizing: 'border-box',
                                    }}
                                />
                                {errors?.password && (
                                    <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>{errors.password}</p>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowDisable(false)}
                                        style={{
                                            flex: 1, padding: '10px',
                                            backgroundColor: '#fff', border: '1px solid #e2e8f0',
                                            borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                            cursor: 'pointer', color: '#64748b',
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={disableProcessing}
                                        style={{
                                            flex: 1, padding: '10px',
                                            backgroundColor: '#ef4444', color: '#fff',
                                            border: 'none', borderRadius: '8px',
                                            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                        }}
                                    >
                                        {disableProcessing ? 'Memproses...' : 'Nonaktifkan'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}

        </div>
        </div>

            <style>{`
                .twofa-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.4fr;
                    gap: 24px;
                    align-items: start;
                }
                @media (max-width: 768px) {
                    .twofa-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </>
    );
}

TwoFactorSetup.layout = page => <DashboardLayout>{page}</DashboardLayout>;

export default TwoFactorSetup;
