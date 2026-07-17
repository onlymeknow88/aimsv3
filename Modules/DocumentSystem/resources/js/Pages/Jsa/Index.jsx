import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { ShieldAlert } from 'lucide-react';
import useJsa from './Hooks/useJsa';
import JsaFormModal from './Partials/JsaFormModal';
import JsaDetailDrawer from './Partials/JsaDetailDrawer';

export default function Index({ documents = [] }) {
    const { formModalOpen, drawerOpen, selectedJsa, loading, openForm, closeForm, openDrawer, closeDrawer, createJsa } = useJsa();

    return (
        <DocumentSystemLayout>
            <Head title="Job Safety Analysis" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Job Safety Analysis (JSA)</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Analisis bahaya dan tindakan keselamatan kerja.</p>
                </div>
                <button onClick={openForm} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    + Buat JSA
                </button>
            </div>

            {documents.length === 0 ? (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
                    <ShieldAlert size={48} style={{ margin: '0 auto 16px', color: '#8B5CF6', opacity: 0.5, display: 'block' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Belum Ada JSA</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Buat analisis bahaya pertama Anda untuk memulai.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                                {['Judul', 'Jenis Pekerjaan', 'Lokasi', 'Status', 'Aksi'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{doc.work_type}</td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{doc.location}</td>
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

            <JsaFormModal open={formModalOpen} onClose={closeForm} onSubmit={createJsa} loading={loading} />
            <JsaDetailDrawer jsa={selectedJsa} open={drawerOpen} onClose={closeDrawer} />
        </DocumentSystemLayout>
    );
}


