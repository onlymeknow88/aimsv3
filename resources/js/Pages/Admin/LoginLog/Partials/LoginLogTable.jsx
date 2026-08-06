import React from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LoginLogTable({ logs, loading }) {
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
            width: 180,
        },
        {
            id: 'user',
            header: 'Pengguna',
            cell: info => {
                const row = info.row.original;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.user_name || '-'}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{row.user_email || '-'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'event',
            header: 'Aktivitas',
            cell: info => {
                const val = info.getValue();
                let bg = '#e2d9ff';
                let fg = '#4c1d95';
                let label = val;

                if (val === 'login_success') {
                    bg = '#dcfce7';
                    fg = '#15803d';
                    label = 'LOGIN SUKSES';
                } else if (val === 'login_failed') {
                    bg = '#fee2e2';
                    fg = '#b91c1c';
                    label = 'LOGIN GAGAL';
                } else if (val === 'logout') {
                    bg = '#f1f5f9';
                    fg = '#475569';
                    label = 'LOGOUT';
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
            width: 130,
        },
        {
            accessorKey: 'login_method',
            header: 'Metode',
            cell: info => {
                const val = info.getValue();
                if (!val) return <span style={{ color: '#94a3b8' }}>-</span>;
                
                let bg = '#eff6ff';
                let fg = '#1d4ed8';
                
                if (val === 'TOTP') {
                    bg = '#ecfdf5';
                    fg = '#047857';
                } else if (val === 'OTP') {
                    bg = '#fff7ed';
                    fg = '#c2410c';
                }

                return (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: bg,
                        color: fg,
                    }}>
                        {val}
                    </span>
                );
            },
            width: 100,
        },
        {
            accessorKey: 'ip_address',
            header: 'IP Address',
            cell: info => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{info.getValue() || '-'}</span>,
            width: 130,
        },
        {
            id: 'agent',
            header: 'Browser / OS',
            cell: info => {
                const row = info.row.original;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '12px', color: '#334155' }}>
                            {row.browser || '-'} on {row.os || '-'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                            {row.device_type || 'desktop'}
                        </span>
                    </div>
                );
            },
            width: 180,
        },
        {
            accessorKey: 'failure_reason',
            header: 'Alasan Gagal',
            cell: info => {
                const val = info.getValue();
                return val ? (
                    <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>{val}</span>
                ) : <span style={{ color: '#94a3b8' }}>-</span>;
            }
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
                                Memuat data log...
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
                                Tidak ada data log login ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
