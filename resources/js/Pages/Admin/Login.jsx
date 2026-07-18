import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0c', // Gelap premium matching backoffice sidebar
            fontFamily: 'Inter, sans-serif',
            padding: '20px'
        }}>
            <Head title="Admin Backoffice Login" />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '16px',
                padding: '40px 32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Brand Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        marginBottom: '16px',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                    }}>
                        <ShieldAlert size={28} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: 0 }}>AIMS BACKOFFICE</h2>
                    <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>Portal administrasi terpusat & konfigurasi sistem.</p>
                </div>

                {status && (
                    <div style={{ marginBottom: '16px', fontSize: '13px', fontWeight: 500, color: '#10b981', textAlign: 'center' }}>
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit}>
                    {/* Email Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                            EMAIL ADDRESS
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@aims.id"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px 12px 42px',
                                    backgroundColor: '#1f2937',
                                    border: errors.email ? '1px solid #ef4444' : '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '13.5px',
                                    outline: 'none',
                                    transition: 'border 0.2s'
                                }}
                            />
                            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6b7280' }} />
                        </div>
                        {errors.email && (
                            <span style={{ fontSize: '11.5px', color: '#ef4444', marginTop: '6px', display: 'block' }}>{errors.email}</span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                            PASSWORD
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 42px 12px 42px',
                                    backgroundColor: '#1f2937',
                                    border: errors.password ? '1px solid #ef4444' : '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '13.5px',
                                    outline: 'none',
                                    transition: 'border 0.2s'
                                }}
                            />
                            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#6b7280' }} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '14px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: 0
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span style={{ fontSize: '11.5px', color: '#ef4444', marginTop: '6px', display: 'block' }}>{errors.password}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => { if(!processing) e.target.style.backgroundColor = '#1d4ed8'; }}
                        onMouseLeave={(e) => { if(!processing) e.target.style.backgroundColor = '#2563eb'; }}
                    >
                        {processing ? 'Mengecek Otorisasi...' : 'MASUK KE BACKOFFICE'}
                    </button>
                </form>

                {/* Back Link */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <a href="/" style={{ color: '#6b7280', fontSize: '12.5px', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                        ← Kembali ke AIMS Portal Utama
                    </a>
                </div>
            </div>
        </div>
    );
}
