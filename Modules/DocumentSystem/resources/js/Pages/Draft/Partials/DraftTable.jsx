import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DraftTable({ documents }) {
    if (!documents?.length) {
        return (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
                <p style={{ fontSize: '12px' }}>Workspace draf kosong.</p>
            </div>
        );
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                    {['No. Dokumen', 'Judul', 'Level', 'Dibuat', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {documents.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number || 'DRAFT'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{doc.document_level}</span></td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '10px' }}>{doc.created_at}</td>
                        <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--info)', backgroundColor: 'rgba(45, 127, 249, 0.08)', padding: '2px 8px', borderRadius: '10px' }}>DRAFT</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
