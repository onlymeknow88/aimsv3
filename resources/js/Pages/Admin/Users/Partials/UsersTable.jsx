import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/Components/ui/table';
import { Edit2, Trash2, UserCheck, UserX, Briefcase } from 'lucide-react';

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name }) {
    const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
    const color  = colors[(name?.charCodeAt(0) || 0) % colors.length];
    return (
        <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800, flexShrink: 0,
            letterSpacing: '0.03em',
        }}>
            {initials}
        </div>
    );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ name }) {
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px', borderRadius: '99px',
            backgroundColor: '#eff6ff', color: '#1d4ed8',
            fontSize: '10.5px', fontWeight: 700,
            border: '1px solid #bfdbfe',
            whiteSpace: 'nowrap',
        }}>
            {name}
        </span>
    );
}

// ── Action buttons ────────────────────────────────────────────────────────────
function ActionBtns({ onEdit, onDelete }) {
    return (
        <div style={{ display: 'inline-flex', gap: '2px' }}>
            <button onClick={onEdit} title="Edit"
                style={{ background:'none', border:'none', cursor:'pointer', color:'#3b82f6', padding:'6px', borderRadius:'6px', display:'flex', alignItems:'center' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Edit2 size={14} />
            </button>
            <button onClick={onDelete} title="Hapus"
                style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:'6px', borderRadius:'6px', display:'flex', alignItems:'center' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Trash2 size={14} />
            </button>
        </div>
    );
}

// ── Main Table ────────────────────────────────────────────────────────────────
export default function UsersTable({ users = [], loading = false, onEdit, onDelete }) {
    const columns = useMemo(() => [
        {
            id: 'user',
            header: 'User',
            cell: ({ row }) => {
                const u = row.original;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={u.name} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{u.email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'employee',
            header: 'Data Karyawan',
            cell: ({ row }) => {
                const emp = row.original.employee;
                if (!emp) return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1', fontSize: '12px' }}>
                        <UserX size={13} /> <span>Belum ada data</span>
                    </div>
                );
                return (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
                            <Briefcase size={12} style={{ color: '#64748b' }} />
                            {emp.position || '—'}
                            {emp.grade && <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>· Gol. {emp.grade}</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            {emp.company?.company_name || '—'}
                            {emp.department && <span> / {emp.department.department_name}</span>}
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = row.original.document_roles || [];
                if (roles.length === 0) return <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>;
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                        {roles.slice(0, 3).map(r => <RoleBadge key={r.id} name={r.name} />)}
                        {roles.length > 3 && (
                            <span style={{ fontSize: '10.5px', color: '#94a3b8', alignSelf: 'center' }}>
                                +{roles.length - 3} lagi
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const active = row.original.is_active !== false;
                return (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '99px',
                        backgroundColor: active ? '#f0fdf4' : '#fef2f2',
                        color: active ? '#15803d' : '#dc2626',
                    }}>
                        {active ? <UserCheck size={11} /> : <UserX size={11} />}
                        {active ? 'Aktif' : 'Nonaktif'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div style={{ textAlign: 'right' }}>
                    <ActionBtns onEdit={() => onEdit(row.original)} onDelete={() => onDelete(row.original)} />
                </div>
            ),
        },
    ], [onEdit, onDelete]);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    const visibleCount = table.getVisibleFlatColumns().length;

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id} style={{ backgroundColor: '#f8fafc' }}>
                        {hg.headers.map(h => (
                            <TableHead key={h.id} style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                {flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>Memuat data user...</TableCell></TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow><TableCell colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '14px' }}>Belum ada user. Klik "Tambah User" untuk mulai.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    );
}
