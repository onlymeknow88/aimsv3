import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { 
    useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender 
} from '@tanstack/react-table';
import { FileText, Plus, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export default function Index({ documents = [] }) {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(() => [
        {
            accessorKey: 'document_number',
            header: 'Doc Number',
            cell: info => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{info.getValue() || 'AUTO-GEN'}</span>
        },
        {
            accessorKey: 'title',
            header: 'Document Title',
            cell: info => (
                <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{info.getValue()}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{info.row.original.description || '-'}</span>
                </div>
            )
        },
        {
            accessorKey: 'document_level',
            header: 'Level',
            cell: info => <span style={{ 
                fontSize: '9px', 
                fontWeight: 700, 
                backgroundColor: '#f1f5f9', 
                color: 'var(--text-secondary)',
                padding: '2px 6px',
                borderRadius: '4px'
            }}>{info.getValue()}</span>
        },
        {
            accessorKey: 'revision',
            header: 'Revision',
            cell: info => `Rev ${info.getValue() || 0}`
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
        }
    ], []);

    const table = useReactTable({
        data: documents,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    return (
        <DocumentSystemLayout>
            <Head title="Document Maker" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <a href="/document-system" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={20} /></a>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Document Maker</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>Daftar dokumen keselamatan kerja dan operasional yang telah aktif.</p>
                </div>
            </div>

            {/* Header Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                gap: '16px'
            }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                    <input 
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Cari dokumen..."
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 36px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            outline: 'none'
                        }}
                    />
                </div>

                <a 
                    href="/document-system/maker/create"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}
                >
                    <Plus size={14} /> Create Document
                </a>
            </div>

            {/* Document Table */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafbfc' }}>
                                {hg.headers.map(header => (
                                    <th key={header.id} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                                    <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.3, display: 'block' }} />
                                    Tidak ada dokumen keselamatan ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {table.getPageCount() > 1 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderTop: '1px solid var(--border-color)',
                        backgroundColor: '#fafbfc'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button 
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DocumentSystemLayout>
    );
}
