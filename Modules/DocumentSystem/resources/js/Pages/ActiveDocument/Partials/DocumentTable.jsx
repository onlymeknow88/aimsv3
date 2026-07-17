import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Eye, Download, FileText } from 'lucide-react';

export default function DocumentTable({ documents, onPreview, onDownload }) {
    const columns = useMemo(() => [
        {
            accessorKey: 'document_number',
            header: 'No. Dokumen',
            cell: info => <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '11px' }}>{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'title',
            header: 'Judul Dokumen',
            cell: info => <span style={{ fontWeight: 600, fontSize: '11px' }}>{info.getValue()}</span>
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
            accessorKey: 'revision',
            header: 'Rev',
            cell: info => <span style={{ fontSize: '11px' }}>Rev {info.getValue() || 0}</span>
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
                        <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Belum ada dokumen aktif.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
