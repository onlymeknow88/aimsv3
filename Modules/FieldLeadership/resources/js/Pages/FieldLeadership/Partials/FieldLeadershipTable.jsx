import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import TablePagination from '@/Components/TablePagination';
import { Eye } from 'lucide-react';

const STATUS_CONFIG = {
    'Open':                 { text: 'OPEN',             color: 'var(--accent)',   bg: 'rgba(255,140,36,0.08)' },
    'On Review PICA':       { text: 'ON REVIEW PICA',   color: 'var(--info)',     bg: 'rgba(45,127,249,0.08)' },
    'On Review PJA':        { text: 'ON REVIEW PJA',    color: 'var(--info)',     bg: 'rgba(45,127,249,0.08)' },
    'On Review Approval':   { text: 'ON REVIEW APPRVL', color: 'var(--accent)',   bg: 'rgba(255,140,36,0.08)' },
    'Overdue':              { text: 'OVERDUE',           color: 'var(--danger)',   bg: 'rgba(239,68,68,0.08)'  },
    'Closed':               { text: 'CLOSED',            color: 'var(--success)',  bg: 'rgba(34,197,94,0.08)'  },
    'Draft':                { text: 'DRAFT',             color: '#64748b',         bg: '#f1f5f9'               },
};

const TYPE_CONFIG = {
    'Planned Task Observation': { text: 'PTO', color: 'var(--primary)', bg: 'rgba(21,59,115,0.08)' },
    'Take Time Talk':           { text: 'TTT', color: '#7c3aed',        bg: 'rgba(124,58,237,0.08)' },
    'Hazard Report':            { text: 'HR',  color: 'var(--danger)',   bg: 'rgba(239,68,68,0.08)'  },
};

export default function FieldLeadershipTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    visibleColumns,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    onView,
}) {
    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        onSelectionChange(checked ? documents.map(d => d.id) : []);
    };

    const handleSelectRow = (id, checked) => {
        onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter(x => x !== id));
    };

    // Columns matching legacy table-maker.blade.php
    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />,
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(c) => handleSelectRow(row.original.id, c)}
                />
            ),
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.original.company_name || '—'}</span>,
        },
        {
            id: 'date',
            header: 'Date',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.date
                        ? new Date(row.original.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                </span>
            ),
        },
        {
            id: 'ccow',
            header: 'CCOW',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.ccow_name || '—'}</span>,
        },
        {
            id: 'detail_company',
            header: 'Detail Company',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.detail_company || '—'}</span>,
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.department_name || '—'}</span>,
        },
        {
            id: 'section',
            header: 'Section',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.section_name || '—'}</span>,
        },
        {
            id: 'location',
            header: 'Location',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.area_location_name || '—'}</span>,
        },
        {
            id: 'detail_location',
            header: 'Detail Location',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.detail_location || '—'}</span>,
        },
        {
            id: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const cfg = TYPE_CONFIG[row.original.type] ?? { text: row.original.type, color: '#64748b', bg: '#f1f5f9' };
                return (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '10px' }}>
                        {cfg.text}
                    </span>
                );
            },
        },
        {
            id: 'members',
            header: 'Members',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.members_count || row.original.members?.length || '—'}</span>,
        },
        {
            id: 'positive_condition',
            header: 'Positive Condition',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.positives_count || row.original.positives?.length || '—'}</span>,
        },
        {
            id: 'risk_condition',
            header: 'Risk Condition',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.risks_count || row.original.risks?.length || '—'}</span>,
        },
        {
            id: 'repair_action',
            header: 'Repair Action',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.repair_action || '—'}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const cfg = STATUS_CONFIG[row.original.status] ?? { text: row.original.status, color: '#64748b', bg: '#f1f5f9' };
                return (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '10px' }}>
                        {cfg.text}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <button
                    onClick={() => onView?.(row.original)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        backgroundColor: 'transparent', border: '1px solid var(--border-color)',
                        borderRadius: '6px', padding: '4px 10px',
                        fontSize: '11px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer',
                    }}
                >
                    <Eye size={12} /> Detail
                </button>
            ),
        },
    ], [selectedIds, isAllSelected]);

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            date:               visibleColumns['Date']               ?? true,
            ccow:               visibleColumns['CCOW']               ?? true,
            company:            visibleColumns['Company']            ?? true,
            detail_company:     visibleColumns['Detail Company']     ?? true,
            department:         visibleColumns['Department']         ?? true,
            section:            visibleColumns['Section']            ?? true,
            location:           visibleColumns['Location']           ?? true,
            detail_location:    visibleColumns['Detail Location']    ?? true,
            type:               visibleColumns['Type']               ?? true,
            members:            visibleColumns['Members']            ?? true,
            positive_condition: visibleColumns['Positive Condition'] ?? true,
            risk_condition:     visibleColumns['Risk Condition']     ?? true,
            repair_action:      visibleColumns['Repair Action']      ?? true,
            status:             visibleColumns['Status']             ?? true,
            actions:            visibleColumns['Aksi']               ?? true,
        };
    }, [visibleColumns]);

    const table = useReactTable({
        data: documents,
        columns,
        state: { columnVisibility },
        getCoreRowModel: getCoreRowModel(),
    });



    return (
        <div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader style={{ backgroundColor: 'var(--header-bg, #f8fafc)' }}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 14px', whiteSpace: 'nowrap' }}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8 text-xs text-gray-400">
                                    Memuat data Field Leadership...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8 text-xs text-gray-400">
                                    Belum ada data Field Leadership.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} className="hover:bg-slate-50">
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />
        </div>
    );
}
