import { ChevronRight, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { microsoftLoginUrl, microsoftRedirectEnabled } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    
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
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F9FC] font-sans antialiased">
            <Head title="AIMS - Log In" />

            {/* Left Column: Visual Branding Sidebar (Hidden on Mobile, Visible on Desktop lg+) */}
            <div className="hidden lg:flex lg:w-7/12 xl:w-2/3 bg-gradient-to-br from-[#10233F] to-[#153B73] text-white flex-col justify-between p-8 xl:p-16 relative overflow-hidden">
                {/* Background mining overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-15 z-0 pointer-events-none"
                    style={{ backgroundImage: 'url("/images/alamtri-minerals.jpg")' }}
                />

                {/* Top Branding */}
                <div className="flex items-center gap-3 z-10">
                    <div className="bg-white p-1.5 rounded-lg shadow-lg flex items-center justify-center">
                        <img src="/images/Alamtri Geo Logo - Full Color 1.png" alt="Alamtri Geo Logo" className="h-10 w-auto object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white tracking-wide leading-none">AIMS</h1>
                        <span className="text-[10px] text-slate-400 block mt-1 tracking-wider uppercase">Integrated Management System</span>
                    </div>
                </div>

                {/* Main Hero Slogans */}
                <div className="z-10 max-w-xl my-auto py-12">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold tracking-widest bg-[#FF8C24]/20 text-[#FF8C24] px-2.5 py-1 rounded uppercase">
                            Safety First
                        </span>
                        <span className="text-[10px] font-bold tracking-widest bg-[#2FBF71]/20 text-[#2FBF71] px-2.5 py-1 rounded uppercase">
                            Enterprise
                        </span>
                    </div>
                    <h2 className="text-2xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
                        Platform Integrasi Keselamatan & Kesehatan Kerja Tambang
                    </h2>
                    <p className="text-slate-300 text-xs xl:text-sm leading-relaxed">
                        AIMS menyatukan seluruh program kepatuhan, audit keselamatan, mitigasi risiko (IBPR), hingga pengelolaan dokumen operasional tambang dalam satu portal terpusat yang aman dan produktif.
                    </p>
                </div>

                {/* Footer copyright */}
                <div className="text-xs text-slate-400 z-10">
                    &copy; 2026 AIMS Integrated Management System. All rights reserved.
                </div>
            </div>

            {/* Right Column: Login Card (Responsive Full Width on Mobile, Centered Card) */}
            <div className="w-full lg:w-5/12 xl:w-1/3 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 min-h-screen">
                <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 transition-all">
                    
                    {/* Mobile Brand Header (Visible ONLY on mobile/tablet < lg) */}
                    <div className="flex lg:hidden items-center justify-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm flex items-center justify-center">
                            <img src="/images/Alamtri Geo Logo - Full Color 1.png" alt="Alamtri Geo Logo" className="h-8 w-auto object-contain" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-[#10233F] tracking-wide leading-none">AIMS</h2>
                            <span className="text-[9px] text-slate-500 block mt-0.5 tracking-wider uppercase font-semibold">Integrated Management System</span>
                        </div>
                    </div>

                    {/* Header Form */}
                    <div className="mb-6">
                        <h3 className="text-xl sm:text-22px font-extrabold text-[#10233F] mb-1">Log In ke Akun</h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Gunakan kredensial AIMS Anda untuk masuk ke sistem.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Alamat Email
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    inputMode="email"
                                    autoCapitalize="none"
                                    value={data.email}
                                    className={`w-full pl-10 pr-4 py-3 bg-white border ${
                                        errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-[#153B73] focus:border-[#153B73]'
                                    } rounded-xl text-xs sm:text-sm text-[#10233F] placeholder-slate-400 transition-colors duration-200 outline-none`}
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5 text-xs text-red-500" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="password" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-[#153B73] font-semibold hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className={`w-full pl-10 pr-11 py-3 bg-white border ${
                                        errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-[#153B73] focus:border-[#153B73]'
                                    } rounded-xl text-xs sm:text-sm text-[#10233F] placeholder-slate-400 transition-colors duration-200 outline-none`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1.5 text-xs text-red-500" />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center pt-1">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[#153B73] focus:ring-[#153B73] cursor-pointer"
                            />
                            <label htmlFor="remember_me" className="ml-2 text-xs sm:text-sm text-slate-600 cursor-pointer select-none">
                                Ingat saya di perangkat ini
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 rounded-xl bg-[#153B73] hover:bg-[#1E4E96] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#153B73]/20 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Menhubungkan...</span>
                                </>
                            ) : (
                                <>
                                    <span>Masuk Ke AIMS</span>
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        {(microsoftRedirectEnabled || microsoftLoginUrl) && (
                            <div className="relative flex items-center justify-center my-5">
                                <div className="border-t border-slate-200 w-full" />
                                <span className="bg-white px-3 text-[10px] font-semibold uppercase text-slate-400 tracking-wider absolute">
                                    atau masuk dengan
                                </span>
                            </div>
                        )}

                        {/* Microsoft Login Button */}
                        {(microsoftRedirectEnabled || microsoftLoginUrl) && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (microsoftRedirectEnabled) {
                                        window.location.href = route('microsoft.redirect');
                                    } else {
                                        window.location.href = microsoftLoginUrl;
                                    }
                                }}
                                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#10233F] text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm"
                            >
                                <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                    <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
                                    <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
                                    <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
                                    <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
                                </svg>
                                <span>Microsoft 365</span>
                            </button>
                        )}
                    </form>

                    {/* Bottom Links */}
                    <div className="mt-6 pt-5 text-center border-t border-slate-100">
                        <span className="text-xs text-slate-500">Belum punya akun? </span>
                        <Link href="/register" className="text-xs text-[#153B73] font-bold hover:underline">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
