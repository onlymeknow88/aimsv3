import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import BlobPreviewModal from '@/Components/BlobPreviewModal';

export default function DocumentTable({ documents, selectedIds = [], onSelectionChange, visibleColumns, loading = false }) {
    const [previewAttachment, setPreviewAttachment] = useState(null);
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

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.original.id, checked)}
                />
            )
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '12px' ,fontWeight: 700 }}>   <a href={`/document-system/active/detail/${row.original.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{getCompanyCode(row.original)}</a></span>
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.department?.name || '-'}</span>
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.owner?.name || '-'}</span>
        },
        {
            id: 'module',
            header: 'Modul',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.module?.index ? `${row.original.mapping.category.module.index}. ` : ''}
                    {row.original.mapping?.category?.module?.name || '-'}
                </span>
            )
        },
        {
            id: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.index ? `${row.original.mapping.category.index}. ` : ''}
                    {row.original.mapping?.category?.name || '-'}
                </span>
            )
        },
        {
            accessorKey: 'document_level',
            id: 'document_level',
            header: 'Document Type',
            cell: info => (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {info.getValue()}
                </span>
            )
        },
        {
            id: 'mapping',
            header: 'Mapping',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.index ? `${row.original.mapping.index}. ` : ''}
                    {row.original.mapping?.name || '-'}
                </span>
            )
        },
        {
            accessorKey: 'document_number',
            id: 'document_number',
            header: 'No. Dokumen',
            cell: ({ row }) => (
                <span >
                        {row.original.document_number}
                </span>
            )
        },
        {
            accessorKey: 'title',
            id: 'title',
            header: 'Judul Dokumen',
            cell: info => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{info.getValue()}</span>
        },
        {
            accessorKey: 'revision',
            id: 'revision',
            header: 'Rev',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>Rev {info.getValue() || 0}</span>
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: 'Status',
            cell: info => {
                const s = info.getValue() ? String(info.getValue()) : '5';
                const statusNames = {
                    '1': { text: 'WAITING REVIEW', color: 'var(--accent)', bg: 'rgba(255, 140, 36, 0.08)' },
                    '2': { text: 'DRAFT', color: 'var(--info)', bg: 'rgba(45, 127, 249, 0.08)' },
                    '3': { text: 'ROOTING APPROVAL', color: 'var(--accent)', bg: 'rgba(255, 140, 36, 0.08)' },
                    '4': { text: 'REVISION', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.08)' },
                    '5': { text: 'ACTIVE', color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.08)' },
                    '6': { text: 'PREPARE APPROVAL', color: 'var(--accent)', bg: 'rgba(255, 140, 36, 0.08)' },
                    '7': { text: 'EXPIRED', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.08)' },
                    '8': { text: 'OBSOLETE', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.08)' }
                };
                const config = statusNames[s] || { text: 'ACTIVE', color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.08)' };
                return (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: config.color,
                        backgroundColor: config.bg,
                        padding: '2px 8px',
                        borderRadius: '10px'
                    }}>
                        {config.text}
                    </span>
                );
            }
        },
        {
            id: 'attachment',
            header: 'Attachment',
            cell: ({ row }) => {
                const finalAttachments = (row.original.attachments || []).filter(
                    att => att.file_name && att.file_name.startsWith('FINAL_')
                );

                if (finalAttachments.length === 0) {
                    return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>;
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {finalAttachments.map(att => (
                            <span
                                key={att.id}
                                onClick={() => setPreviewAttachment(att)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--primary)',
                                    textDecoration: 'underline',
                                    textDecorationStyle: 'dotted',
                                    cursor: 'pointer',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                title={`Klik untuk preview: ${att.file_name}`}
                            >
                                <FileText size={11} style={{ flexShrink: 0 }} />
                                {att.file_name}
                            </span>
                        ))}
                    </div>
                );
            }
        }
    ], [selectedIds, isAllSelected, previewAttachment]);

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            'company': visibleColumns['Company'] ?? true,
            'department': visibleColumns['Department'] ?? true,
            'pic': visibleColumns['PIC'] ?? true,
            'module': visibleColumns['Modul'] ?? true,
            'category': visibleColumns['Category'] ?? true,
            'document_level': visibleColumns['Level'] ?? true,
            'mapping': visibleColumns['Mapping'] ?? true,
            'document_number': visibleColumns['No. Dokumen'] ?? true,
            'title': visibleColumns['Judul Dokumen'] ?? true,
            'revision': visibleColumns['Rev'] ?? true,
            'status': visibleColumns['Status'] ?? true,
            'actions': visibleColumns['Aksi'] ?? true,
        };
    }, [visibleColumns]);

    const table = useReactTable({
        data: documents,
        columns,
        state: {
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (<>
        <Table style={{ fontSize: '12px' }}>
            <TableHeader>
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id}>
                        {hg.headers.map(h => (
                            <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                            Memuat data dokumen keselamatan...
                        </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={visibleColsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Belum ada dokumen aktif.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

        {previewAttachment && (
            <BlobPreviewModal
                attachment={previewAttachment}
                onClose={() => setPreviewAttachment(null)}
            />
        )}
    </>);
}
