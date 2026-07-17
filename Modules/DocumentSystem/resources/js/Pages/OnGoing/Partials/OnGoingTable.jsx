import React from 'react';
import { Clock } from 'lucide-react';

export default function OnGoingTable({ documents, onViewDetail }) {
    if (!documents?.length) {
        return (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
                <p style={{ fontSize: '12px' }}>Tidak ada dokumen yang sedang dalam proses review.</p>
            </div>
        );
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                    {['No. Dokumen', 'Judul', 'Level', 'Status', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {documents.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number || '-'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{doc.document_level}</span></td>
                        <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)' }}>ONGOING</span></td>
                        <td style={{ padding: '14px 16px' }}>
                            <button onClick={() => onViewDetail(doc)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 600 }}>
                                Detail
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
