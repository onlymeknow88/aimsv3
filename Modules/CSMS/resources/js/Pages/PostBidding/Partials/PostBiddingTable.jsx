import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, SlidersHorizontal, Trash2 } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from '../../Bidding/Partials/Components/StatusBadge';

const ALL_COLUMNS = {
    'No':                 true,
    'CCOW':               true,
    'Kriteria':           true,
    'Jenis Badan Usaha':  true,
    'Nama Perusahaan':    true,
    'Alamat Perusahaan':  true,
    'Site Perusahaan':    true,
    'Nomor Ijin/Lisensi': true,
    'Perusahaan Induk':   true,
    'PIC':                true,
    'No. Dokumen CSMS':   true,
    'Request':            true,
    'Status':             true,
};

export default function PostBiddingTable({ biddings, loading, selectedIds = [], onSelectionChange, onDelete }) {
    const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMNS);

    const toggleColumn = (col) => {
        setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    const isAllSelected = biddings.length > 0 && selectedIds.length === biddings.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < biddings.length;

    const handleSelectAll = useCallback((checked) => {
        onSelectionChange(checked ? biddings.map(b => b.id) : []);
    }, [biddings, onSelectionChange]);

    const handleSelectRow = useCallback((id, checked) => {
        onSelectionChange(checked
            ? [...selectedIds, id]
            : selectedIds.filter(sid => sid !== id)
        );
    }, [selectedIds, onSelectionChange]);

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={isAllSelected}
                    data-checked={isAllSelected || undefined}
                    data-indeterminate={someSelected || undefined}
                    onCheckedChange={handleSelectAll}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    data-checked={selectedIds.includes(row.original.id) || undefined}
                    onCheckedChange={(checked) => handleSelectRow(row.original.id, checked)}
                />
            ),
        },
        {
            id: 'no',
            header: 'No',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.index + 1}</span>,
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
            id: 'csms_doc_number',
            header: 'No. Dokumen CSMS',
            cell: ({ row }) => <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{row.original.csms_doc_number ?? '-'}</span>,
        },
        {
            id: 'request',
            header: 'Request',
            cell: ({ row }) => <StatusBadge status={row.original.requested} />,
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <a
                        href={`/csms/post-bidding/detail/${row.original.id}`}
                        style={{
                            padding: '5px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(21,59,115,0.08)',
                            display: 'inline-flex',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                        }}
                    >
                        <Eye size={13} />
                    </a>
                </div>
            ),
        },
    ], [selectedIds, isAllSelected, someSelected, handleSelectAll, handleSelectRow]);

    const columnVisibility = useMemo(() => ({
        'no':                visibleColumns['No'],
        'ccow':              visibleColumns['CCOW'],
        'kriteria':          visibleColumns['Kriteria'],
        'jenis_badan_usaha': visibleColumns['Jenis Badan Usaha'],
        'nama_perusahaan':   visibleColumns['Nama Perusahaan'],
        'alamat_perusahaan': visibleColumns['Alamat Perusahaan'],
        'site_perusahaan':   visibleColumns['Site Perusahaan'],
        'nomor_ijin':        visibleColumns['Nomor Ijin/Lisensi'],
        'perusahaan_induk':  visibleColumns['Perusahaan Induk'],
        'pic':               visibleColumns['PIC'],
        'csms_doc_number':   visibleColumns['No. Dokumen CSMS'],
        'request':           visibleColumns['Request'],
        'status':            visibleColumns['Status'],
    }), [visibleColumns]);

    const table = useReactTable({
        data: biddings,
        columns,
        state: { columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (
        <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border-color)', gap: '12px', flexWrap: 'wrap' }}>
                {selectedIds.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {selectedIds.length} Row Selected
                        </span>
                        <button
                            onClick={() => onDelete && onDelete(selectedIds)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', backgroundColor: 'var(--danger)', color: '#fff',
                                border: 'none', borderRadius: '6px', fontSize: '11px',
                                fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                        {loading ? 'Memuat...' : `${biddings.length} data`}
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        backgroundColor: '#fff', border: '1px solid var(--border-color)',
                        borderRadius: '6px', padding: '6px 12px', fontSize: '11px',
                        fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
                    }}>
                        <SlidersHorizontal size={13} /> Columns
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md p-1">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs font-bold text-gray-500" style={{ padding: '8px 12px' }}>
                                Toggle Columns
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
                        {Object.keys(ALL_COLUMNS).map(col => (
                            <DropdownMenuCheckboxItem
                                key={col}
                                checked={visibleColumns[col]}
                                onCheckedChange={() => toggleColumn(col)}
                                className="text-xs text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                                style={{ padding: '8px 12px', cursor: 'pointer' }}
                            >
                                {col}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

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
                                <TableRow key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
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
                                    Tidak ada data post-bidding.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
