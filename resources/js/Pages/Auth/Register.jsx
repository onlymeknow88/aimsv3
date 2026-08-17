import { ChevronRight, Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import InputError from '@/Components/InputError';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Sangat Lemah', color: 'bg-slate-200' });

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Password strength evaluation logic
    useEffect(() => {
        const pass = data.password;
        if (!pass) {
            setPasswordStrength({ score: 0, label: 'Sangat Lemah', color: 'bg-slate-200' });
            return;
        }

        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        let label = 'Lemah';
        let color = 'bg-red-500';

        if (score === 3) {
            label = 'Sedang';
            color = 'bg-amber-500';
        } else if (score >= 4) {
            label = 'Kuat';
            color = 'bg-emerald-500';
        }

        setPasswordStrength({ score, label, color });
    }, [data.password]);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F9FC] font-sans antialiased">
            <Head title="AIMS - Daftar Akun" />

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

            {/* Right Column: Register Card (Responsive Full Width on Mobile, Centered Card) */}
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
                        <h3 className="text-xl sm:text-22px font-extrabold text-[#10233F] mb-1">Buat Akun Baru</h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Daftarkan diri Anda untuk masuk ke sistem AIMS.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Nama Lengkap
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={`w-full pl-10 pr-4 py-3 bg-white border ${
                                        errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-[#153B73] focus:border-[#153B73]'
                                    } rounded-xl text-xs sm:text-sm text-[#10233F] placeholder-slate-400 transition-colors duration-200 outline-none`}
                                    placeholder="Nama lengkap Anda"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1.5 text-xs text-red-500" />
                        </div>

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
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5 text-xs text-red-500" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Kata Sandi
                            </label>
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
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator Visual */}
                            {data.password && (
                                <div className="mt-2.5 space-y-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="font-semibold text-slate-500">Kekuatan Sandi:</span>
                                        <span className={`font-bold uppercase ${
                                            passwordStrength.score <= 2 ? 'text-red-500' : passwordStrength.score === 3 ? 'text-amber-500' : 'text-emerald-500'
                                        }`}>{passwordStrength.label}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${
                                            passwordStrength.score >= 1 ? 'w-1/4' : 'w-0'
                                        }`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${
                                            passwordStrength.score >= 2 ? 'w-1/4' : 'w-0'
                                        }`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${
                                            passwordStrength.score >= 3 ? 'w-1/4' : 'w-0'
                                        }`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${
                                            passwordStrength.score >= 4 ? 'w-1/4' : 'w-0'
                                        }`} />
                                    </div>
                                    <p className="text-[9px] text-slate-400 leading-normal">
                                        Gunakan minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.
                                    </p>
                                </div>
                            )}
                            
                            <InputError message={errors.password} className="mt-1.5 text-xs text-red-500" />
                        </div>

                        {/* Password Confirmation Input */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className={`w-full pl-10 pr-11 py-3 bg-white border ${
                                        errors.password_confirmation ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-[#153B73] focus:border-[#153B73]'
                                    } rounded-xl text-xs sm:text-sm text-[#10233F] placeholder-slate-400 transition-colors duration-200 outline-none`}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1.5 text-xs text-red-500" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 rounded-xl bg-[#153B73] hover:bg-[#1E4E96] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#153B73]/20 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Mendaftarkan...</span>
                                </>
                            ) : (
                                <>
                                    <span>Daftar Akun</span>
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Links */}
                    <div className="mt-6 pt-5 text-center border-t border-slate-100">
                        <span className="text-xs text-slate-500">Sudah punya akun? </span>
                        <Link href={route('login')} className="text-xs text-[#153B73] font-bold hover:underline">
                            Masuk Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
