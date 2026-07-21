import { Head, router, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Mail, RefreshCw, Shield, SmartphoneNfc } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function TwoFactorChallenge({ hasTotpEnabled, email }) {
    const [mode, setMode]         = useState(hasTotpEnabled ? 'totp' : 'otp');
    const [otpSent, setOtpSent]   = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [digits, setDigits]     = useState(['', '', '', '', '', '']);
    const inputRefs               = useRef([]);
    const { errors, processing }  = usePage().props;
    const flash                   = usePage().props.flash ?? {};

    // Countdown timer untuk resend OTP
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Auto-send OTP saat pertama kali mode OTP aktif
    useEffect(() => {
        if (mode === 'otp' && !otpSent) {
            handleSendOtp();
        }
    }, [mode]);

    const getCode = () => digits.join('');

    const handleDigitChange = (index, value) => {
        // Hanya terima angka
        const clean = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = clean;
        setDigits(newDigits);

        // Auto-move ke input berikutnya
        if (clean && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit saat 6 digit terisi
        if (clean && index === 5) {
            const code = newDigits.join('');
            if (code.length === 6) {
                submitCode(code);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            submitCode(pasted);
        }
    };

    const submitCode = (code) => {
        const url = mode === 'totp'
            ? route('two-factor.totp')
            : route('two-factor.otp');

        router.post(url, { code }, {
            preserveScroll: true,
            onError: () => {
                setDigits(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = getCode();
        if (code.length === 6) submitCode(code);
    };

    const handleSendOtp = () => {
        router.post(route('two-factor.send-otp'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setOtpSent(true);
                setCountdown(60);
            },
        });
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F7F9FC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            <Head title="Verifikasi Dua Langkah" />

            <div style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(21,59,115,0.1)',
                padding: '40px',
                width: '100%',
                maxWidth: '440px',
            }}>
                {/* Icon + Title */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(21,59,115,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <Shield size={28} style={{ color: '#153B73' }} />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                        Verifikasi Dua Langkah
                    </h1>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        {mode === 'totp'
                            ? 'Masukkan kode 6 digit dari aplikasi autentikator Anda.'
                            : `Kode verifikasi telah dikirim ke ${email}`
                        }
                    </p>
                </div>

                {/* Mode Tabs — hanya tampil jika TOTP aktif */}
                {hasTotpEnabled && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginBottom: '28px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '12px',
                        padding: '4px',
                    }}>
                        <button
                            type="button"
                            onClick={() => switchMode('totp')}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                backgroundColor: mode === 'totp' ? '#fff' : 'transparent',
                                color: mode === 'totp' ? '#153B73' : '#64748b',
                                boxShadow: mode === 'totp' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            <SmartphoneNfc size={14} /> Authenticator
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('otp')}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                backgroundColor: mode === 'otp' ? '#fff' : 'transparent',
                                color: mode === 'otp' ? '#153B73' : '#64748b',
                                boxShadow: mode === 'otp' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Mail size={14} /> Email OTP
                        </button>
                    </div>
                )}

                {/* OTP sent notice */}
                {flash.otp_sent && (
                    <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '12px',
                        color: '#166534',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <Mail size={14} /> Kode OTP telah dikirim ke email Anda.
                    </div>
                )}

                {/* 6 Digit Input */}
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'center',
                        marginBottom: '8px',
                    }}>
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
                                autoFocus={i === 0}
                                style={{
                                    width: '52px',
                                    height: '60px',
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    border: `2px solid ${errors?.code ? '#fca5a5' : digit ? '#153B73' : '#e2e8f0'}`,
                                    borderRadius: '12px',
                                    outline: 'none',
                                    color: '#0f172a',
                                    backgroundColor: digit ? '#eff6ff' : '#f8fafc',
                                    transition: 'all 0.15s',
                                }}
                            />
                        ))}
                    </div>

                    {/* Error message */}
                    {errors?.code && (
                        <p style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#ef4444',
                            margin: '8px 0 16px',
                        }}>
                            {errors.code}
                        </p>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={processing || getCode().length < 6}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: processing || getCode().length < 6
                                ? '#e2e8f0'
                                : 'linear-gradient(135deg, #153B73, #1E4E96)',
                            color: processing || getCode().length < 6 ? '#94a3b8' : '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: processing || getCode().length < 6 ? 'not-allowed' : 'pointer',
                            marginTop: errors?.code ? '0' : '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                        }}
                    >
                        {processing ? (
                            <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memverifikasi...</>
                        ) : (
                            <><KeyRound size={16} /> Verifikasi</>  
                        )}
                    </button>
                </form>

                {/* Resend OTP — hanya di mode OTP */}
                {mode === 'otp' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        {errors?.resend && (
                            <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>
                                {errors.resend}
                            </p>
                        )}
                        {countdown > 0 ? (
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Kirim ulang dalam <strong style={{ color: '#153B73' }}>{countdown}s</strong>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    color: '#153B73',
                                    fontWeight: 600,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                <RefreshCw size={13} /> Kirim Ulang Kode
                            </button>
                        )}
                    </div>
                )}

                {/* Back to login */}
                <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <a
                        href={route('login')}
                        style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}
                    >
                        ← Kembali ke halaman login
                    </a>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}