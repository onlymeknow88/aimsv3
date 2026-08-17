import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4 sm:p-6">
            <Head title="Admin Backoffice Login" />

            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 transition-all">
                {/* Brand Logo & Title */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 inline-flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-600/40">
                        <ShieldAlert size={26} />
                    </div>
                    <h2 className="text-gray-100 text-lg sm:text-xl font-extrabold tracking-wide">AIMS BACKOFFICE</h2>
                    <p className="text-gray-400 text-xs mt-1">Portal administrasi terpusat & konfigurasi sistem.</p>
                </div>

                {status && (
                    <div className="mb-4 text-xs sm:text-sm font-medium text-emerald-400 text-center bg-emerald-950/40 border border-emerald-800/50 p-2.5 rounded-lg">
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">
                            EMAIL ADDRESS
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                <Mail size={18} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                inputMode="email"
                                autoCapitalize="none"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@aims.id"
                                required
                                className={`w-full pl-10 pr-4 py-3 bg-gray-800/80 border ${
                                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                                } rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors duration-200`}
                            />
                        </div>
                        {errors.email && (
                            <span className="text-xs text-red-500 mt-1.5 block">{errors.email}</span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">
                            PASSWORD
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full pl-10 pr-11 py-3 bg-gray-800/80 border ${
                                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                                } rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-colors duration-200`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs text-red-500 mt-1.5 block">{errors.password}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Mengecek Otorisasi...</span>
                            </>
                        ) : (
                            <span>MASUK KE BACKOFFICE</span>
                        )}
                    </button>
                </form>

                {/* Back Link */}
                <div className="text-center mt-6 pt-4 border-t border-gray-800/60">
                    <a 
                        href="/" 
                        className="text-gray-400 hover:text-white text-xs font-medium transition-colors"
                    >
                        ← Kembali ke AIMS Portal Utama
                    </a>
                </div>
            </div>
        </div>
    );
}
