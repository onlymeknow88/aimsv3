import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { Activity } from 'lucide-react';
import usePtw from './Hooks/usePtw';
import PtwFormModal from './Partials/PtwFormModal';
import PtwDetailDrawer from './Partials/PtwDetailDrawer';
import PermitTypeBadge from './Partials/Components/PermitTypeBadge';

export default function Index() {
    const { formModalOpen, drawerOpen, selectedPtw, loading, openForm, closeForm, openDrawer, closeDrawer, createPtw, docs, fetching } = usePtw();

    return (
        <DocumentSystemLayout>
            <Head title="Permit to Work" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Permit to Work (PTW)</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Surat Izin Kerja Aman berisiko tinggi.</p>
                </div>
                <button onClick={openForm} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    + Ajukan PTW
                </button>
            </div>

            {fetching ? (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Loading PTW data...</p>
                </div>
            ) : docs.length === 0 ? (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
                    <Activity size={48} style={{ margin: '0 auto 16px', color: '#06B6D4', opacity: 0.5, display: 'block' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Belum Ada PTW</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ajukan izin kerja aman untuk pekerjaan berisiko tinggi.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                                {['Judul', 'Jenis Izin', 'Lokasi', 'Tanggal', 'Status', 'Aksi'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                                    <td style={{ padding: '14px 16px' }}><PermitTypeBadge type={doc.permit_type} /></td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{doc.location}</td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '10px' }}>{doc.start_date} – {doc.end_date}</td>
                                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '10px' }}>{doc.status === '5' ? 'ACTIVE' : 'DRAFT'}</span></td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <button onClick={() => openDrawer(doc)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 600 }}>Detail</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <PtwFormModal open={formModalOpen} onClose={closeForm} onSubmit={createPtw} loading={loading} />
            <PtwDetailDrawer ptw={selectedPtw} open={drawerOpen} onClose={closeDrawer} />
        </DocumentSystemLayout>
    );
}


