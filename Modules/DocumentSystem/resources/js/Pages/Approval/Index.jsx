import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useApproval from './Hooks/useApproval';
import ApprovalDetailDrawer from './Partials/ApprovalDetailDrawer';
import ApproveModal from './Partials/ApproveModal';
import RejectModal from './Partials/RejectModal';
import { CheckSquare } from 'lucide-react';

export default function Index({ documents = [] }) {
    const {
        drawerOpen, approveModalOpen, rejectModalOpen, selectedDoc, loading,
        openDrawer, closeDrawer, openApprove, closeApprove, openReject, closeReject,
        approveDocument, rejectDocument,
    } = useApproval();

    return (
        <DocumentSystemLayout>
            <Head title="Approval Action Center" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Approval Action Center</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Persetujuan dokumen K3LH & SOP (Level 1 CRS & Level 2 PJA).</p>
            </div>

            {documents.length === 0 ? (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
                    <CheckSquare size={48} style={{ margin: '0 auto 16px', color: 'var(--success)', opacity: 0.5, display: 'block' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Tidak Ada Antrean Approval</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Semua permohonan pengesahan telah diselesaikan.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                                {['No. Dokumen', 'Judul', 'Aksi'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openDrawer(doc)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px' }}>Detail</button>
                                            <button onClick={() => openApprove(doc)} style={{ border: 'none', background: 'var(--success)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>Setuju</button>
                                            <button onClick={() => openReject(doc)} style={{ border: 'none', background: 'var(--danger)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>Tolak</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ApprovalDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} onApprove={openApprove} onReject={openReject} />
            <ApproveModal doc={selectedDoc} open={approveModalOpen} onClose={closeApprove} onSubmit={approveDocument} loading={loading} />
            <RejectModal doc={selectedDoc} open={rejectModalOpen} onClose={closeReject} onSubmit={rejectDocument} loading={loading} />
        </DocumentSystemLayout>
    );
}


