import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Eye, Download, FileText } from 'lucide-react';

export default function DocumentTable({ documents, onPreview, onDownload }) {
    const columns = useMemo(() => [
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.department?.company?.company_name || '-'}</span>
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.department?.name || '-'}</span>
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.owner?.name || '-'}</span>
        },
        {
            id: 'module',
            header: 'Modul',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.mapping?.category?.module?.name || '-'}</span>
        },
        {
            id: 'category',
            header: 'Category',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.mapping?.category?.name || '-'}</span>
        },
        {
            accessorKey: 'document_level',
            header: 'Level',
            cell: info => (
                <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {info.getValue()}
                </span>
            )
        },
        {
            id: 'mapping',
            header: 'Mapping',
            cell: ({ row }) => <span style={{ fontSize: '11px' }}>{row.original.mapping?.name || '-'}</span>
        },
        {
            accessorKey: 'document_number',
            header: 'No. Dokumen',
            cell: info => <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '11px' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'title',
            header: 'Judul Dokumen',
            cell: info => (
                <div>
                    <span style={{ fontWeight: 600, fontSize: '11px', display: 'block' }}>{info.getValue()}</span>
                    {info.row.original.description && (
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{info.row.original.description}</span>
                    )}
                </div>
            )
        },
        {
            accessorKey: 'revision',
            header: 'Rev',
            cell: info => <span style={{ fontSize: '11px' }}>Rev {info.getValue() || 0}</span>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                const colors = status === '5' ? { bg: 'rgba(47, 191, 113, 0.08)', text: 'var(--success)', name: 'ACTIVE' }
                             : status === '7' ? { bg: 'rgba(244, 67, 54, 0.08)', text: 'var(--danger)', name: 'EXPIRED' }
                             : status === '2' ? { bg: 'rgba(255, 140, 36, 0.08)', text: 'var(--accent)', name: 'REVIEW' }
                             : { bg: 'rgba(45, 127, 249, 0.08)', text: 'var(--info)', name: 'DRAFT' };
                return (
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: colors.bg,
                        color: colors.text,
                        padding: '2px 8px',
                        borderRadius: '10px'
                    }}>
                        {colors.name}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => onPreview(row.original)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                        <Eye size={12} /> Preview
                    </button>
                    <button onClick={() => onDownload(row.original)} style={{ border: 'none', background: 'var(--primary)', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                        <Download size={12} /> Download
                    </button>
                </div>
            )
        }
    ], [onPreview, onDownload]);

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
                {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                        {hg.headers.map(h => (
                            <th key={h.id} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} style={{ padding: '14px 16px' }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Belum ada dokumen aktif.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
