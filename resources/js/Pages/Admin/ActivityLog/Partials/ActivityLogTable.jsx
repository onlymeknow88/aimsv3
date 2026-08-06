import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ActivityLogTable({ logs, loading }) {
    const [selectedLog, setSelectedLog] = useState(null);

    const columns = React.useMemo(() => [
        {
            accessorKey: 'created_at',
            header: 'Waktu',
            cell: info => {
                const val = info.getValue();
                return val ? new Date(val).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) : '-';
            },
            width: 170,
        },
        {
            id: 'admin',
            header: 'Administrator',
            cell: info => {
                const row = info.row.original;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.admin_name || '-'}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{row.admin_email || '-'}</span>
                    </div>
                );
            },
            width: 220,
        },
        {
            accessorKey: 'action',
            header: 'Aksi',
            cell: info => {
                const val = info.getValue() || '';
                let bg = '#f1f5f9';
                let fg = '#475569';
                let label = val.toUpperCase();

                if (val === 'create') {
                    bg = '#dcfce7';
                    fg = '#15803d';
                } else if (val === 'update') {
                    bg = '#eff6ff';
                    fg = '#1d4ed8';
                } else if (val === 'delete') {
                    bg = '#fee2e2';
                    fg = '#b91c1c';
                } else if (val === 'activate') {
                    bg = '#ccfbf1';
                    fg = '#0f766e';
                } else if (val === 'deactivate') {
                    bg = '#f3e8ff';
                    fg = '#6b21a8';
                }

                return (
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: bg,
                        color: fg,
                        letterSpacing: '0.5px'
                    }}>
                        {label}
                    </span>
                );
            },
            width: 110,
        },
        {
            accessorKey: 'resource',
            header: 'Resource',
            cell: info => (
                <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155'
                }}>
                    {info.getValue() || '-'}
                </span>
            ),
            width: 120,
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: info => <span style={{ fontSize: '12px', color: '#334155' }}>{info.getValue() || '-'}</span>,
        },
        {
            accessorKey: 'ip_address',
            header: 'IP Address',
            cell: info => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>{info.getValue() || '-'}</span>,
            width: 120,
        },
        {
            id: 'actions',
            header: 'Detail',
            cell: info => {
                const row = info.row.original;
                const hasData = row.old_data || row.new_data;
                return (
                    <button
                        onClick={() => setSelectedLog(row)}
                        disabled={!hasData}
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: hasData ? '#2563eb' : '#94a3b8',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: hasData ? 'pointer' : 'not-allowed',
                            textDecoration: hasData ? 'underline' : 'none',
                            padding: '4px'
                        }}
                    >
                        Lihat Data
                    </button>
                );
            },
            width: 80,
        }
    ], []);

    const table = useReactTable({
        data: logs,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div style={{ overflowX: 'auto' }}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} style={{ backgroundColor: '#f8fafc' }}>
                            {headerGroup.headers.map(header => (
                                <TableHead 
                                    key={header.id} 
                                    style={{ 
                                        fontWeight: 700, 
                                        fontSize: '11px', 
                                        color: '#475569', 
                                        textTransform: 'uppercase', 
                                        padding: '14px 16px',
                                        width: header.column.columnDef.width ? `${header.column.columnDef.width}px` : 'auto'
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                Memuat data log aktivitas...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} style={{ padding: '14px 16px' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                Tidak ada data log aktivitas admin ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Custom Detail Modal */}
            {selectedLog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '900px',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                    Detail Data Perubahan
                                </h3>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                    {selectedLog.resource} ID: {selectedLog.resource_id}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#64748b',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{
                            padding: '24px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            backgroundColor: '#f8fafc'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {/* Old Data */}
                                <div>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        Sebelum Perubahan (Old Data)
                                    </h4>
                                    <div style={{
                                        backgroundColor: '#1e293b',
                                        color: '#f8fafc',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        fontFamily: 'monospace',
                                        fontSize: '11px',
                                        overflow: 'auto',
                                        height: '350px',
                                        border: '1px solid #334155'
                                    }}>
                                        {selectedLog.old_data ? (
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                {JSON.stringify(selectedLog.old_data, null, 2)}
                                            </pre>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>[Kosong / Tidak Ada Data]</span>
                                        )}
                                    </div>
                                </div>

                                {/* New Data */}
                                <div>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        Setelah Perubahan (New Data)
                                    </h4>
                                    <div style={{
                                        backgroundColor: '#1e293b',
                                        color: '#f8fafc',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        fontFamily: 'monospace',
                                        fontSize: '11px',
                                        overflow: 'auto',
                                        height: '350px',
                                        border: '1px solid #334155'
                                    }}>
                                        {selectedLog.new_data ? (
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                {JSON.stringify(selectedLog.new_data, null, 2)}
                                            </pre>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>[Kosong / Tidak Ada Data]</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            backgroundColor: '#fff'
                        }}>
                            <button
                                onClick={() => setSelectedLog(null)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f1f5f9',
                                    color: '#334155',
                                    border: 'none',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
