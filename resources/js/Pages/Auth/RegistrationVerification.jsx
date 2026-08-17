import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

export default function RegistrationVerification({ status, message, user }) {
    // Determine visual style based on status
    let icon = <AlertCircle size={48} className="text-[#FF8C24]" />;
    let iconBg = 'bg-[#FF8C24]/10';
    let title = 'Status Verifikasi';

    if (status === 'approved') {
        icon = <CheckCircle2 size={48} className="text-emerald-500" />;
        iconBg = 'bg-emerald-50';
        title = 'Registrasi Disetujui';
    } else if (status === 'rejected') {
        icon = <XCircle size={48} className="text-red-500" />;
        iconBg = 'bg-red-50';
        title = 'Registrasi Ditolak';
    } else if (status === 'info') {
        icon = <Info size={48} className="text-[#153B73]" />;
        iconBg = 'bg-[#153B73]/10';
        title = 'Informasi Akun';
    } else if (status === 'error') {
        icon = <XCircle size={48} className="text-red-500" />;
        iconBg = 'bg-red-50';
        title = 'Verifikasi Gagal';
    }

    return (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 font-sans antialiased">
            <Head title={`AIMS - ${title}`} />

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

                {/* Verification Icon */}
                <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-5`}>
                    {icon}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-22px font-extrabold text-[#10233F] mb-3">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {message}
                </p>

                {/* User Details box (if user is provided) */}
                {user && (
                    <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 mb-6 text-xs sm:text-sm">
                        <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Nama</span>
                            <span className="text-[#10233F] font-semibold">{user.name}</span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2.5">
                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Email</span>
                            <span className="text-[#10233F] font-medium">{user.email}</span>
                        </div>
                    </div>
                )}

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
