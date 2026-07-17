import React from 'react';
import { Trash2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function ObsoleteTable({ 
    documents, 
    selectedIds = [], 
    onSelectionChange,
    visibleColumns = {
        'No. Dokumen': true,
        'Judul': true,
        'Level': true,
        'Revision': true,
        'Status': true
    },
    loading = false
}) {
    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        if (checked) {
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

    const activeColsCount = Object.values(visibleColumns).filter(Boolean).length + 1; // plus select checkbox

    return (
        <Table style={{ fontSize: '12px' }}>
            <TableHeader>
                <TableRow>
                    <TableHead style={{ width: '40px' }}>
                        <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                        />
                    </TableHead>
                    {['No. Dokumen', 'Judul', 'Level', 'Revision', 'Status'].map(h => (
                        visibleColumns[h] && <TableHead key={h} style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{h === 'Revision' ? 'Revisi' : h}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={activeColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                            Memuat data dokumen usang...
                        </TableCell>
                    </TableRow>
                ) : !documents?.length ? (
                    <TableRow>
                        <TableCell colSpan={activeColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                            <Trash2 size={32} style={{ margin: '0 auto 8px', opacity: 0.4, display: 'block' }} />
                            Arsip kosong.
                        </TableCell>
                    </TableRow>
                ) : (
                    documents.map(doc => (
                        <TableRow key={doc.id} style={{ opacity: 0.7 }}>
                            <TableCell style={{ width: '40px' }}>
                                <Checkbox
                                    checked={selectedIds.includes(doc.id)}
                                    onCheckedChange={(checked) => handleSelectRow(doc.id, checked)}
                                />
                            </TableCell>
                            {visibleColumns['No. Dokumen'] && (
                                <TableCell style={{ fontWeight: 700 }}>
                                    <a href={`/document-system/active/detail/${doc.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                        {doc.document_number || '-'}
                                    </a>
                                </TableCell>
                            )}
                            {visibleColumns['Judul'] && <TableCell style={{ fontWeight: 600 }}>{doc.title}</TableCell>}
                            {visibleColumns['Level'] && <TableCell><span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{doc.document_level}</span></TableCell>}
                            {visibleColumns['Revision'] && <TableCell style={{ color: 'var(--text-secondary)' }}>Rev {doc.revision || 0}</TableCell>}
                            {visibleColumns['Status'] && <TableCell><span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--danger)', backgroundColor: 'rgba(244, 67, 54, 0.06)', padding: '2px 8px', borderRadius: '10px' }}>OBSOLETE</span></TableCell>}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
