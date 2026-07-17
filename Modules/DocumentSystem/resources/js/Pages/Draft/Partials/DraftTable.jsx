import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function DraftTable({
    documents,
    selectedIds = [],
    onSelectionChange,
    visibleColumns = {
        'No. Dokumen': true,
        'Company': true,
        'Department': true,
        'PIC': true,
        'Modul': true,
        'Category': true,
        'Level': true,
        'Mapping': true,
        'Judul': true,
        'Status': true
    },
    loading = false
}) {
    const getCompanyCode = (doc) => {
        return doc.company?.company_name || doc.company?.document_code || '-';
    };

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
                    {['No. Dokumen', 'Company', 'Department', 'PIC', 'Modul', 'Category', 'Level', 'Mapping', 'Judul', 'Status'].map(h => (
                        visibleColumns[h] && <TableHead key={h} style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={activeColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                            Memuat data draf dokumen...
                        </TableCell>
                    </TableRow>
                ) : !documents?.length ? (
                    <TableRow>
                        <TableCell colSpan={activeColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                            <AlertCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.4, display: 'block' }} />
                            data draf kosong.
                        </TableCell>
                    </TableRow>
                ) : (
                    documents.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell style={{ width: '40px' }}>
                                <Checkbox
                                    checked={selectedIds.includes(doc.id)}
                                    onCheckedChange={(checked) => handleSelectRow(doc.id, checked)}
                                />
                            </TableCell>
                            {visibleColumns['No. Dokumen'] && (
                                <TableCell style={{ fontWeight: 700 }}>
                                    <a href={`/document-system/active/detail/${doc.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                        {doc.document_number || 'DRAFT'}
                                    </a>
                                </TableCell>
                            )}
                            {visibleColumns['Company'] && <TableCell>{getCompanyCode(doc)}</TableCell>}
                            {visibleColumns['Department'] && <TableCell>{doc.department?.name || '-'}</TableCell>}
                            {visibleColumns['PIC'] && <TableCell>{doc.owner?.name || '-'}</TableCell>}
                            {visibleColumns['Modul'] && (
                                <TableCell>
                                    {doc.mapping?.category?.module?.index ? `${doc.mapping.category.module.index}. ` : ''}
                                    {doc.mapping?.category?.module?.name || '-'}
                                </TableCell>
                            )}
                            {visibleColumns['Category'] && (
                                <TableCell>
                                    {doc.mapping?.category?.index ? `${doc.mapping.category.index}. ` : ''}
                                    {doc.mapping?.category?.name || '-'}
                                </TableCell>
                            )}
                            {visibleColumns['Level'] && <TableCell><span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{doc.document_level}</span></TableCell>}
                            {visibleColumns['Mapping'] && (
                                <TableCell>
                                    {doc.mapping?.index ? `${doc.mapping.index}. ` : ''}
                                    {doc.mapping?.name || '-'}
                                </TableCell>
                            )}
                            {visibleColumns['Judul'] && <TableCell style={{ fontWeight: 600 }}>{doc.title}</TableCell>}
                            {visibleColumns['Status'] && (
                                <TableCell>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--info)', backgroundColor: 'rgba(45, 127, 249, 0.08)', padding: '2px 8px', borderRadius: '10px' }}>DRAFT</span>
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
