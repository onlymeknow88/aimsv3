import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, User, Building, MapPin, Calendar, Layers, Eye, Download, Info, Users, Clock, Edit } from 'lucide-react';
import StatusTimeline from '../OnGoing/Partials/Components/StatusTimeline';
import useDetail from './Hooks/useDetail';

export default function Detail({ id }) {
    const {
        document,
        loadingData,
        notes,
        setNotes,
        loading,
        isRejectModalOpen,
        setIsRejectModalOpen,
        handleApprove,
        handleReject,
        showApproval
    } = useDetail(id);

    if (loadingData || !document) {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Loading document details...</p>
            </div>
        );
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    };

    const getCompanyCode = (doc) => {
        return doc.company?.company_name || doc.company?.document_code || '-';
    };

    const getStatusColors = (status) => {
        const s = status ? String(status) : '2';
        switch (s) {
            case '1': return { bg: 'rgba(255, 140, 36, 0.08)', text: 'var(--accent)', name: 'WAITING REVIEW' };
            case '2': return { bg: 'rgba(45, 127, 249, 0.08)', text: 'var(--info)', name: 'DRAFT' };
            case '3': return { bg: 'rgba(255, 140, 36, 0.08)', text: 'var(--accent)', name: 'ROOTING APPROVAL' };
            case '4': return { bg: 'rgba(239, 68, 68, 0.08)', text: 'var(--danger)', name: 'REVISION' };
            case '5': return { bg: 'rgba(47, 191, 113, 0.08)', text: 'var(--success)', name: 'ACTIVE' };
            case '6': return { bg: 'rgba(255, 140, 36, 0.08)', text: 'var(--accent)', name: 'PREPARE APPROVAL' };
            case '7': return { bg: 'rgba(239, 68, 68, 0.08)', text: 'var(--danger)', name: 'EXPIRED' };
            case '8': return { bg: 'rgba(239, 68, 68, 0.08)', text: 'var(--danger)', name: 'OBSOLETE' };
            default: return { bg: 'rgba(45, 127, 249, 0.08)', text: 'var(--info)', name: 'DRAFT' };
        }
    };

    const statusColors = getStatusColors(document.status);

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <Head title={`Detail Dokumen: ${document.title}`} />

            {/* Top Bar Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px'
            }}>
                <a href="/document-system/active" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '12px'
                }}>
                    <ArrowLeft size={16} /> Kembali ke Active Document
                </a>

                <a href={`/document-system/active/edit/${document.id}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none'
                }}>
                    <Edit size={12} /> Edit Dokumen
                </a>
            </div>

            {/* 3-Column Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr 280px',
                gap: '24px',
                alignItems: 'start'
            }}>

                {/* LEFT SIDEBAR: Metadata Owner */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase' }}>Owner Info</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), #2563EB)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: '12px'
                                }}>
                                    {getInitials(document.owner?.name)}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.owner?.name || '-'}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Building size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <span style={{ fontSize: '10px', display: 'block', fontWeight: 700 }}>COMPANY</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.company?.company_name || '-'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Layers size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <span style={{ fontSize: '10px', display: 'block', fontWeight: 700 }}>DEPARTMENT</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{document.department?.name || '-'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Calendar size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <span style={{ fontSize: '10px', display: 'block', fontWeight: 700 }}>CREATED AT</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {document.doc_created ? new Date(document.doc_created).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CENTER COLUMN: Document Details */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Detail Card */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                                padding: '2px 8px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                marginBottom: '8px'
                            }}>
                                {statusColors.name}
                            </span>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 0 0' }}>{document.title}</h2>
                        </div>

                        {/* Metadata Rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                <span style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>No. Dokumen</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{document.document_number || 'DRAFT'}</span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                <span style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>Level Dokumen</span>
                                <span><span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{document.document_level}</span></span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                <span style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>Modul / Kategori</span>
                                <span>
                                    {document.mapping?.category?.module?.index ? `${document.mapping.category.module.index}. ` : ''}
                                    {document.mapping?.category?.module?.name} / {document.mapping?.category?.index ? `${document.mapping.category.index}. ` : ''}
                                    {document.mapping?.category?.name}
                                </span>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                                <span style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mapping Target</span>
                                <span>
                                    {document.mapping?.index ? `${document.mapping.index}. ` : ''}
                                    {document.mapping?.name || '-'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: '8px' }}>
                                <span style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tipe Upload</span>
                                <span style={{ fontWeight: 600 }}>{document.upload_type || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Deskripsi Dokumen</h4>
                        <div
                            style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: document.description || 'Tidak ada deskripsi.' }}
                        />
                    </div>

                    {/* Reviewers Card */}
                    {document.invited_people && document.invited_people.length > 0 && (
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users size={16} /> Invited Reviewers
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {document.invited_people.map(p => (
                                    <span key={p.id} style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'rgba(21, 59, 115, 0.05)', border: '1px solid rgba(21, 59, 115, 0.12)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '100px' }}>
                                        {p.email}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments Card */}
                    {document.attachments && document.attachments.length > 0 && (
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Attachment Lampiran</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {document.attachments.map(att => (
                                    <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fafbfc' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{att.file_name}</span>
                                        <a href={`/api/document-system/attachments/${att.id}/download`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                                            <Download size={12} /> Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Document Action (Approval) */}
                    {showApproval && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                            <button
                                onClick={() => setIsRejectModalOpen(true)}
                                disabled={loading}
                                style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                            >
                                Reject & Return
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                style={{ border: 'none', color: '#fff', backgroundColor: 'var(--primary)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                            >
                                {String(document.status) === '1' ? 'Approve & Rooting' : 'Approve & Publish'}
                            </button>
                        </div>
                    )}
                </main>

                {/* Modal Reject & Return */}
                {isRejectModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}>
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '28px',
                            width: '90%',
                            maxWidth: '520px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Reject & Return Revision
                            </h3>
                            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                                Dokumen akan ditolak dan dikembalikan ke pembuat (Draft). Silakan berikan alasan atau catatan revisi di bawah ini.
                            </p>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    Alasan Return / Catatan Revisi <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Tulis alasan revisi/return secara detail..."
                                    style={{ width: '100%', minHeight: '120px', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '11.5px', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    onClick={() => {
                                        setIsRejectModalOpen(false);
                                        setNotes('');
                                    }}
                                    disabled={loading}
                                    style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={loading}
                                    style={{ border: 'none', color: '#fff', backgroundColor: 'var(--danger)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                                >
                                    Return
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RIGHT SIDEBAR: Progress Alur Timeline */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase' }}>Alur Persetujuan</h4>
                        <StatusTimeline status={document.status} />
                    </div>

                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase' }}>Aktivitas Dokumen</h4>

                        {document.activities && document.activities.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {document.activities.map(act => (
                                    <div key={act.id} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '8px', fontSize: '11px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{act.user?.name || 'System'}</div>
                                        <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{act.activity}</div>
                                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={10} /> {new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '11px' }}>
                                Belum ada riwayat aktivitas.
                            </div>
                        )}
                    </div>
                </aside>

            </div>
        </div>
    );
}
