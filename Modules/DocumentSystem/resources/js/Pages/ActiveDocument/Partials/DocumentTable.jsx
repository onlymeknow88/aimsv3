import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Eye, Download, FileText } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function DocumentTable({ documents, onPreview, onDownload, selectedIds = [], onSelectionChange, visibleColumns, loading = false }) {
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
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{getCompanyCode(row.original)}</span>
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
            header: 'Level',
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
                <span style={{ fontWeight: 700 }}>
                    <a href={`/document-system/active/detail/${row.original.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        {row.original.document_number}
                    </a>
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
                const status = info.getValue()?.toUpperCase() || 'ACTIVE';
                const isObsolete = status === 'OBSOLETE';
                return (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isObsolete ? 'var(--danger)' : 'var(--success)',
                        backgroundColor: isObsolete ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '10px'
                    }}>
                        {status}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => onPreview(row.original)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                        <Eye size={12} /> Preview
                    </button>
                    <button onClick={() => onDownload(row.original)} style={{ border: 'none', background: 'var(--primary)', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                        <Download size={12} /> Download
                    </button>
                </div>
            )
        }
    ], [onPreview, onDownload, selectedIds, isAllSelected]);

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

    return (
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
    );
}
