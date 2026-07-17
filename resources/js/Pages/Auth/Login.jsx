import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheck, Lock, Mail, ChevronRight, HardHat, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F9FC', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Head title="AIMS - Log In" />

            {/* Left Column: Visual Branding Sidebar */}
            <div style={{
                flex: '1.2',
                background: 'linear-gradient(135deg, #10233F 0%, #153B73 100%)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background mining overlay */}
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000")', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    opacity: 0.15,
                    zIndex: 1
                }} />

                {/* Top Branding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#FF8C24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 10px rgba(255, 140, 36, 0.3)'
                    }}>
                        ★
                    </div>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '0.5px' }}>AIMS</h1>
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Integrated Management System</span>
                    </div>
                </div>

                {/* Slogans */}
                <div style={{ zIndex: 2, maxWidth: '480px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', backgroundColor: 'rgba(255,140,36,0.2)', color: '#FF8C24', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Safety First</span>
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', backgroundColor: 'rgba(47,191,113,0.2)', color: '#2FBF71', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Enterprise</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
                        Platform Integrasi Keselamatan & Kesehatan Kerja Tambang
                    </h2>
                    <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
                        AIMS menyatukan seluruh program kepatuhan, audit keselamatan, mitigasi risiko (IBPR), hingga pengelolaan dokumen operasional tambang dalam satu portal terpusat yang aman dan produktif.
                    </p>
                </div>

                {/* Footer copyright */}
                <div style={{ fontSize: '11px', color: '#64748B', zIndex: 2 }}>
                    &copy; 2026 AIMS Integrated Management System. All rights reserved.
                </div>
            </div>

            {/* Right Column: Premium Login Form Card */}
            <div style={{
                flex: '0.8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 10px 25px -5px rgba(16, 35, 63, 0.05), 0 8px 16px -8px rgba(16, 35, 63, 0.05)',
                    border: '1px solid #E7ECF3'
                }}>
                    {/* Header Form */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#10233F', marginBottom: '8px' }}>Log In ke Akun</h3>
                        <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                            Gunakan kredensial AIMS Anda untuk masuk ke sistem.
                        </p>
                    </div>

                    {status && (
                        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '12px', fontWeight: 600 }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        {/* Email Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="email" style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                                Alamat Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    style={{
                                        width: '100%',
                                        padding: '11px 16px 11px 40px',
                                        backgroundColor: '#fff',
                                        border: errors.email ? '1px solid #F44336' : '1px solid #E7ECF3',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#10233F'
                                    }}
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                            </div>
                            <InputError message={errors.email} style={{ marginTop: '6px', fontSize: '11px', color: '#F44336' }} />
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label htmlFor="password" style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        style={{ fontSize: '11px', color: '#153B73', fontWeight: 600, textDecoration: 'none' }}
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    style={{
                                        width: '100%',
                                        padding: '11px 16px 11px 40px',
                                        backgroundColor: '#fff',
                                        border: errors.password ? '1px solid #F44336' : '1px solid #E7ECF3',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#10233F'
                                    }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                            </div>
                            <InputError message={errors.password} style={{ marginTop: '6px', fontSize: '11px', color: '#F44336' }} />
                        </div>

                        {/* Remember Me */}
                        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '4px',
                                    border: '1px solid #E7ECF3',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                            <label htmlFor="remember_me" style={{ marginLeft: '8px', fontSize: '12px', color: '#64748B', cursor: 'pointer', userSelect: 'none' }}>
                                Ingat saya di perangkat ini
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#153B73',
                                color: '#fff',
                                border: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(21, 59, 115, 0.15)',
                                transition: 'all 0.2s',
                                marginBottom: '16px'
                            }}
                            onMouseEnter={(e) => { if(!processing) e.currentTarget.style.backgroundColor = '#1E4E96'; }}
                            onMouseLeave={(e) => { if(!processing) e.currentTarget.style.backgroundColor = '#153B73'; }}
                        >
                            {processing ? 'Menghubungkan...' : 'Masuk Ke AIMS'}
                            {!processing && <ChevronRight size={16} />}
                        </button>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94A3B8' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#E7ECF3' }} />
                            <span style={{ padding: '0 10px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>atau masuk dengan</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#E7ECF3' }} />
                        </div>

                        {/* Microsoft Login Button */}
                        <button
                            type="button"
                            onClick={() => window.location.href = '/login/microsoft'}
                            style={{
                                width: '100%',
                                padding: '11px',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                color: '#10233F',
                                border: '1px solid #E7ECF3',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F7F9FC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E7ECF3'; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                                <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                                <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                                <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                            </svg>
                            Microsoft 365
                        </button>
                    </form>

                    {/* Bottom Links */}
                    <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #E7ECF3', paddingTop: '20px' }}>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Belum punya akun? </span>
                        <Link href="/register" style={{ fontSize: '12px', color: '#153B73', fontWeight: 700, textDecoration: 'none' }}>
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
