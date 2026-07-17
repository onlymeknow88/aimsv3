import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DraftTable({ documents, selectedIds = [], onSelectionChange }) {
    const getCompanyCode = (doc) => {
        return doc.company?.company_name || doc.company?.document_code || '-';
    };

    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange(documents.map(d => d.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id, checked) => {
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(x => x !== id));
        }
    };

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
                    <th style={{ padding: '12px 16px', width: '40px' }}>
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            style={{ cursor: 'pointer' }}
                        />
                    </th>
                    {['Company', 'Department', 'PIC', 'Modul', 'Category', 'Level', 'Mapping', 'No. Dokumen', 'Judul', 'Status'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {documents.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', width: '40px' }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(doc.id)}
                                onChange={(e) => handleSelectRow(doc.id, e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                        </td>
                        <td style={{ padding: '14px 16px' }}>{getCompanyCode(doc)}</td>
                        <td style={{ padding: '14px 16px' }}>{doc.department?.name || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>{doc.owner?.name || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>{doc.mapping?.category?.module?.name || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>{doc.mapping?.category?.name || '-'}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{doc.document_level}</span></td>
                        <td style={{ padding: '14px 16px' }}>{doc.mapping?.name || '-'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number || 'DRAFT'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doc.title}</td>
                        <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--info)', backgroundColor: 'rgba(45, 127, 249, 0.08)', padding: '2px 8px', borderRadius: '10px' }}>DRAFT</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
