import { ArrowLeft, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import PtwDetailCenter from './Partials/PtwDetailCenter';
import PtwDetailLeftSidebar from './Partials/PtwDetailLeftSidebar';
import PtwDetailRightSidebar from './Partials/PtwDetailRightSidebar';
import { Head } from '@inertiajs/react';
import usePtwDetail from './Hooks/usePtwDetail';
import RejectModal from './Partials/Components/RejectModal';
import ApprovalConfirmModal from './Partials/Components/ApprovalConfirmModal';
import ConfirmationModal from '@/Components/ConfirmationModal';

const STATUS_CONFIG = {
    '1': { text: 'DRAFT',          color: 'var(--accent)',  bg: 'rgba(255,140,36,0.1)' },
    '2': { text: 'PENDING REVIEW', color: 'var(--info)',    bg: 'rgba(45,127,249,0.1)' },
    '3': { text: 'REJECTED',       color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'  },
    '5': { text: 'ACTIVE',         color: 'var(--success)', bg: 'rgba(34,197,94,0.1)'  },
};

export default function Detail({ id }) {
    const [rejectModal, setRejectModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, type: null });
    const [isConfirmRenewOpen, setIsConfirmRenewOpen] = useState(false);
    const [isConfirmDeactivateOpen, setIsConfirmDeactivateOpen] = useState(false);
    const [isConfirmReactivateOpen, setIsConfirmReactivateOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const {
        document,
        canApprove,
        loadingData,
        actionLoading,
        actionError,
        submitForReview,
        approveDocument,
        rejectDocument,
        deactivateDocument,
        reactivateDocument,
    } = usePtwDetail(id);

    if (loadingData || !document) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Head title="Detail PTW" />
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail PTW...</p>
            </div>
        );
    }

    const status = STATUS_CONFIG[String(document.status)] ?? { text: document.status, color: '#64748b', bg: '#f1f5f9' };
    const isDraft         = String(document.status) === '1';
    const isPendingReview = String(document.status) === '2';
    const isActive        = String(document.status) === '5';

    const handleSubmitReview = async () => {
        const ok = await submitForReview();
        if (ok) setConfirmModal({ open: false, type: null });
    };

    const handleApprove = async () => {
        const ok = await approveDocument();
        if (ok) setConfirmModal({ open: false, type: null });
    };

    const handleReject = async (notes) => {
        const ok = await rejectDocument(notes);
        if (ok) setRejectModal(false);
    };

    const handleDeactivate = async () => {
        const ok = await deactivateDocument();
        if (ok) setIsConfirmDeactivateOpen(false);
    };

    const handleReactivate = async () => {
        const ok = await reactivateDocument();
        if (ok) setIsConfirmReactivateOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={`Detail PTW: ${document.title}`} />

            {/* Top Bar Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <a href="/document-system/ptw" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px',
                }}>
                    <ArrowLeft size={16} /> Kembali ke PTW
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {actionError && (
                        <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>{actionError}</span>
                    )}
                    <span style={{
                        fontSize: '11px', fontWeight: 700,
                        backgroundColor: status.bg, color: status.color,
                        padding: '2px 10px', borderRadius: '12px',
                    }}>
                        {status.text}
                    </span>

                    {isDraft && (
                        <a href={`/document-system/ptw/edit/${document.id}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            backgroundColor: 'var(--primary)', color: '#fff',
                            borderRadius: '6px', padding: '6px 14px',
                            fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                        }}>
                            <Edit size={12} /> Edit
                        </a>
                    )}
                </div>
            </div>

            {/* 3-Column Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '260px 1fr 280px',
                gap: isMobile ? '16px' : '24px',
                alignItems: 'start',
            }}>
                {/* LEFT SIDEBAR */}
                <aside style={{ order: isMobile ? 2 : 1 }}>
                    <PtwDetailLeftSidebar document={document} />
                </aside>

                {/* CENTER */}
                <main style={{ order: isMobile ? 1 : 2 }}>
                    <PtwDetailCenter document={document} />
                </main>

                {/* RIGHT SIDEBAR */}
                <aside style={{ order: isMobile ? 3 : 3 }}>
                    <PtwDetailRightSidebar
                        document={document}
                        canApprove={canApprove}
                        isDraft={isDraft}
                        isPendingReview={isPendingReview}
                        isActive={isActive}
                        actionLoading={actionLoading}
                        actionError={actionError}
                        onSubmit={() => setConfirmModal({ open: true, type: 'submit' })}
                        onApprove={() => setConfirmModal({ open: true, type: 'approve' })}
                        onReject={() => setRejectModal(true)}
                        onRenew={() => setIsConfirmRenewOpen(true)}
                        onDeactivate={() => setIsConfirmDeactivateOpen(true)}
                        onReactivate={() => setIsConfirmReactivateOpen(true)}
                    />
                </aside>
            </div>

            <RejectModal
                isOpen={rejectModal}
                loading={actionLoading}
                onClose={() => setRejectModal(false)}
                onConfirm={handleReject}
            />

            <ApprovalConfirmModal
                isOpen={confirmModal.open}
                type={confirmModal.type}
                loading={actionLoading}
                onClose={() => setConfirmModal({ open: false, type: null })}
                onConfirm={confirmModal.type === 'submit' ? handleSubmitReview : handleApprove}
            />

            <ConfirmationModal
                isOpen={isConfirmRenewOpen}
                type="generic"
                title="Perbarui PTW (Revisi)?"
                description="Apakah Anda yakin ingin memperbarui PTW ini? Dokumen baru versi revisi akan dibuat sebagai Draft."
                confirmText="Ya, Perbarui"
                cancelText="Batal"
                onConfirm={() => {
                    setIsConfirmRenewOpen(false);
                    window.location.href = `/document-system/ptw/edit/${document.id}`;
                }}
                onCancel={() => setIsConfirmRenewOpen(false)}
            />
            <ConfirmationModal
                isOpen={isConfirmDeactivateOpen}
                type="generic"
                title="Nonaktifkan PTW?"
                description="PTW tetap berstatus Active tetapi ditandai nonaktif (inactive_at diisi). Anda bisa mengaktifkannya ulang kapan saja."
                confirmText="Ya, Nonaktifkan"
                cancelText="Batal"
                onConfirm={handleDeactivate}
                onCancel={() => setIsConfirmDeactivateOpen(false)}
            />
            <ConfirmationModal
                isOpen={isConfirmReactivateOpen}
                type="generic"
                title="Aktifkan Ulang PTW?"
                description="Tanda nonaktif akan dihapus dan PTW kembali aktif penuh."
                confirmText="Ya, Aktifkan"
                cancelText="Batal"
                onConfirm={handleReactivate}
                onCancel={() => setIsConfirmReactivateOpen(false)}
            />
        </div>
    );
}
