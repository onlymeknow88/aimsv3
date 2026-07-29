import { Edit, Eye, Trash2 } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from './Components/StatusBadge';

export default function BiddingTable({ biddings, loading, onDelete, canEdit, canDelete, selectedIds = [], onSelectAll, onSelectRow }) {
    const isAllSelected = biddings.length > 0 && selectedIds.length === biddings.length;

    const handleDelete = useCallback((b) => {
        onDelete && onDelete(b);
    }, [onDelete]);

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={() => onSelectRow(row.original.id)}
                />
            ),
        },
        {
            id: 'no',
            header: 'No',
            cell: ({ row }) => <span style={{ fontSize: '12px', padding: '10px 12px', color: 'var(--text-primary)' }}>{row.index + 1}</span>,
        },
        {
            id: 'ccow',
            header: 'CCOW',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.ccow_name ?? '-'}</span>,
        },
        {
            id: 'kriteria',
            header: 'Kriteria',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.service_criteria}</span>,
        },
        {
            id: 'jenis_badan_usaha',
            header: 'Jenis Badan Usaha',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.business_entity_name ?? '-'}</span>,
        },
        {
            id: 'nama_perusahaan',
            header: 'Nama Perusahaan',
            cell: ({ row }) => <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.original.company_name}</span>,
        },
        {
            id: 'alamat_perusahaan',
            header: 'Alamat Perusahaan',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'normal', minWidth: '150px', display: 'block' }}>{row.original.address}</span>,
        },
        {
            id: 'site_perusahaan',
            header: 'Site Perusahaan',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.company_site}</span>,
        },
        {
            id: 'nomor_ijin',
            header: 'Nomor Ijin/Lisensi',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.license_number}</span>,
        },
        {
            id: 'perusahaan_induk',
            header: 'Perusahaan Induk',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.parent_name ?? '-'}</span>,
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.person_in_charge ?? '-'}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const b = row.original;
                return (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <a
                            href={`/csms/bidding/detail/${b.id}`}
                            style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', color: 'var(--primary)', textDecoration: 'none' }}
                            title="Detail"
                        >
                            <Eye size={13} />
                        </a>
                        {canEdit && b.status === 'Draft' && (
                            <a
                                href={`/csms/bidding/edit/${b.id}`}
                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(255,140,36,0.08)', display: 'inline-flex', color: 'var(--accent)', textDecoration: 'none' }}
                                title="Edit"
                            >
                                <Edit size={13} />
                            </a>
                        )}
                        {canDelete && b.status === 'Draft' && (
                            <button
                                onClick={() => handleDelete(b)}
                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ef4444' }}
                                title="Hapus"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ], [selectedIds, isAllSelected, canEdit, canDelete, handleDelete, onSelectAll, onSelectRow]);

    const table = useReactTable({
        data: biddings,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (
        <div>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <Table style={{ fontSize: '12px', minWidth: '1200px' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id} style={{ backgroundColor: '#f8fafc' }}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '13px' }}>
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: selectedIds.includes(row.original.id) ? '#f8fafc' : 'transparent' }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} style={{ padding: '10px 12px' }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '13px' }}>
                                    Tidak ada data bidding.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
