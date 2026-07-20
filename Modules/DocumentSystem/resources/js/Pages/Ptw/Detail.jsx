import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Building, Layers, Calendar, Edit, Download, Clock, Send, Users, CheckCircle, XCircle, FileText } from 'lucide-react';
import usePtwDetail from './Hooks/usePtwDetail';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import RejectModal from './Partials/Components/RejectModal';
import ApprovalConfirmModal from './Partials/Components/ApprovalConfirmModal';
import ConfirmationModal from '@/Components/ConfirmationModal';

// Status config
const STATUS_CONFIG = {
    '1': { bg: 'rgba(99,102,241,0.1)',  text: '#6366F1', name: 'DRAFT',          dot: '#6366F1' },
    '2': { bg: 'rgba(245,158,11,0.1)',  text: '#F59E0B', name: 'PENDING REVIEW', dot: '#F59E0B' },
    '3': { bg: 'rgba(239,68,68,0.1)',   text: '#EF4444', name: 'REJECTED',       dot: '#EF4444' },
    '5': { bg: 'rgba(16,185,129,0.1)',  text: '#10B981', name: 'ACTIVE',         dot: '#10B981' },
};

function getDotClass(activity) {
    const a = (activity || '').toLowerCase();
    if (a.includes('approved') || a.includes('aktif')) return '#10B981';
    if (a.includes('rejected') || a.includes('tolak')) return '#EF4444';
    if (a.includes('review') || a.includes('submit')) return '#F59E0B';
    return '#94A3B8';
}

export default function Detail({ id }) {
    const { props } = usePage();
    const authUser = props.auth?.user;

    const [previewAttachment, setPreviewAttachment] = useState(null);
    const [rejectModal, setRejectModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, type: null });
    const [isConfirmRenewOpen, setIsConfirmRenewOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
    } = usePtwDetail(id);

    if (loadingData || !document) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Memuat detail PTW...</p>
            </div>
        );
    }

    const statusCfg = STATUS_CONFIG[String(document.status)] || STATUS_CONFIG['1'];
    const isDraft         = String(document.status) === '1';
    const isPendingReview = String(document.status) === '2';
    const isActive        = String(document.status) === '5';

    const isOwner    = authUser?.id === document.user_id;

    const getInitials = (name) =>
        name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

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

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '32px 20px' }}>
            <Head title={`Detail PTW: ${document.title}`} />

            {/* ── Top Bar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px',
                maxWidth: '1100px', margin: '0 auto 24px auto'
            }}>
                <a href="/document-system/ptw" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '12px'
                }}>
                    <ArrowLeft size={16} /> Kembali ke PTW
                </a>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {actionError && (
                        <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>{actionError}</span>
                    )}

                    {isActive && (
                        <button 
                            onClick={() => setIsConfirmRenewOpen(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                fontSize: '11px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Edit size={12} /> Update PTW (Revisi)
                        </button>
                    )}
                </div>
            </div>

            {/* ── 3-Column Grid Layout ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '240px 1fr 280px',
                gap: isMobile ? '16px' : '20px',
                maxWidth: '1100px',
                margin: '0 auto',
                alignItems: 'start'
            }}>

                {/* ── LEFT SIDEBAR ── */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px', order: isMobile ? 2 : 1 }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                        borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                            Owner Info
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                            {/* Creator avatar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), #2563EB)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: '12px', flexShrink: 0
                                }}>
                                    {getInitials(document.user?.name)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '12px' }}>
                                        {document.user?.name || '-'}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Pembuat</div>
                                </div>
                            </div>

                            {/* Company */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Building size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase' }}>Company</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.department?.company?.company_name || '-'}</div>
                                </div>
                            </div>

                            {/* Department */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Layers size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase' }}>Department</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.department?.name || '-'}</div>
                                </div>
                            </div>

                            {/* Date */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Calendar size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase' }}>Tanggal Dibuat</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {document.doc_created
                                            ? new Date(document.doc_created).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invited People */}
                    {document.peoples && document.peoples.length > 0 && (
                        <div style={{
                            backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={11} /> Invited People
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {document.peoples.map(p => (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '26px', height: '26px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 700, fontSize: '10px', flexShrink: 0
                                        }}>
                                            {getInitials(p.user?.name || p.email)}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                                {p.user?.name || p.email}
                                            </div>
                                            {p.user?.name && (
                                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{p.email}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* ── CENTER CONTENT ── */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '16px', order: isMobile ? 1 : 2 }}>
                    {/* Detail Card */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                        borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{
                                fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                                backgroundColor: statusCfg.bg, color: statusCfg.text,
                                display: 'inline-block', marginBottom: '8px', letterSpacing: '0.5px'
                            }}>
                                {statusCfg.name}
                            </span>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                                {document.title}
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px' }}>
                            {[
                                { label: 'No. Dokumen', value: document.document_number || '-', bold: true },
                                { label: 'Detail Location', value: document.detail_location || '-' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px', lineHeight: 1.6 }}>
                                    <div style={{ width: '130px', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.label}</div>
                                    <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: item.bold ? 700 : 'normal' }}>{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description RichText */}
                        {document.description && (
                            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                                    Deskripsi / Rincian Pekerjaan
                                </h4>
                                <div
                                    className="rich-content-view"
                                    style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.7 }}
                                    dangerouslySetInnerHTML={{ __html: document.description }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Attachments Section */}
                    {document.attachments && document.attachments.length > 0 && (
                        <div style={{
                            backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
                                Lampiran / Dokumen Pendukung
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {document.attachments.map(att => {
                                    const fileName = att.file_name || att.file_path?.split('/').pop() || 'File Pendukung';
                                    return (
                                        <div key={att.id} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '10px 12px', border: '1px solid var(--border-color)',
                                            borderRadius: '8px', backgroundColor: '#fafbfc'
                                        }}>
                                            <span
                                                onClick={() => setPreviewAttachment({ ...att, file_name: fileName, type: 'ptw' })}
                                                style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                                title="Klik untuk preview"
                                            >
                                                {fileName}
                                            </span>
                                            <a href={`/api/document-system/attachments/${att.id}/download`}
                                                target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                                                <Download size={12} /> Download
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Document Action (Approval) */}
                    {isPendingReview && canApprove && (
                        <div style={{
                            backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)',
                            display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px'
                        }}>
                            <button
                                onClick={() => setRejectModal(true)}
                                disabled={actionLoading}
                                style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                            >
                                Reject & Return
                            </button>
                            <button
                                onClick={() => setConfirmModal({ open: true, type: 'approve' })}
                                disabled={actionLoading}
                                style={{
                                    border: 'none',
                                    color: '#fff',
                                    backgroundColor: 'var(--primary)',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    opacity: actionLoading ? 0.7 : 1,
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {actionLoading ? (
                                    <>
                                        <svg style={{ animation: 'spin 1s linear infinite', width: '12px', height: '12px', color: '#fff' }} fill="none" viewBox="0 0 24 24">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    'Approve & Publish'
                                )}
                            </button>
                        </div>
                    )}
                </main>

                {/* ── RIGHT TIMELINE ── */}
                <aside style={{
                    backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                    borderRadius: '12px', padding: '20px 16px', boxShadow: 'var(--shadow-sm)',
                    order: isMobile ? 3 : 3
                }}>
                    <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={11} /> Riwayat Dokumen
                    </h4>

                    {document.activities && document.activities.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)', margin: '8px 0 0 8px' }}>
                            {document.activities.map(act => (
                                <div key={act.id} style={{ position: 'relative' }}>
                                    {/* Circle dot on border line */}
                                    <div style={{
                                        position: 'absolute', left: '-21.5px', top: '2px',
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        backgroundColor: getDotClass(act.activity),
                                        border: '2px solid var(--card-bg)'
                                    }} />

                                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {act.activity}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        Oleh: {act.user?.name || 'System'}
                                    </div>
                                    {act.notes && (
                                        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', margin: '4px 0 0 0', backgroundColor: '#f1f5f9', padding: '6px 8px', borderRadius: '4px', fontStyle: 'italic', lineHeight: 1.4 }}>
                                            {act.notes}
                                        </p>
                                    )}
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {new Date(act.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>
                            Belum ada riwayat aktivitas.
                        </p>
                    )}
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

            {previewAttachment && (
                <BlobPreviewModal
                    attachment={previewAttachment}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}
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
        </div>
    );
}
