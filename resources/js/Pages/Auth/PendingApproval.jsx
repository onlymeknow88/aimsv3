import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

export default function PendingApproval({ message }) {
    return (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 font-sans antialiased">
            <Head title="AIMS - Menunggu Persetujuan" />

            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
                {/* Brand Header */}
                <div className="flex items-center justify-center gap-2.5 mb-6 pb-5 border-b border-slate-100">
                    <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm flex items-center justify-center">
                        <img src="/images/Alamtri Geo Logo - Full Color 1.png" alt="Alamtri Geo Logo" className="h-8 w-auto object-contain" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-extrabold text-[#10233F] tracking-wide leading-none">AIMS</h2>
                        <span className="text-[9px] text-slate-500 block mt-0.5 tracking-wider uppercase font-semibold">Integrated Management System</span>
                    </div>
                </div>

                {/* Status Icon */}
                <div className="w-16 h-16 rounded-full bg-[#FF8C24]/10 flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle size={32} className="text-[#FF8C24]" />
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-22px font-extrabold text-[#10233F] mb-3">
                    Menunggu Persetujuan
                </h1>

                {/* Message */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {message || 'Akun Anda sedang menunggu persetujuan administrator. Anda akan menerima email pemberitahuan setelah akun diaktifkan.'}
                </p>

                {/* Navigation Button */}
                <div className="border-t border-slate-100 pt-5">
                    <Link
                        href={route('login')}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#10233F] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Kembali ke Halaman Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
