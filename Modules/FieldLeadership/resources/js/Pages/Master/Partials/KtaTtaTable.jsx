import React, { useMemo, useState } from 'react';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DebouncedInput } from "@/lib/utils";
import TablePagination from "@/Components/TablePagination";

function KtaTtaModal({ title, onClose, onSave, saving, item }) {
    const [form, setForm] = useState(item ? { ...item } : { code: '', name: '', type: '' });

    const handleSave = () => {
        onSave(form);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                </div>
                <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Kode</label>
                        <input
                            type="text"
                            value={form.code}
                            onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
                            placeholder="Misal: KTA-01"
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Nama KTA / TTA</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Misal: Tidak Memakai APD"
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Tipe</label>
                        <select
                            value={form.type}
                            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        >
                            <option value="">Pilih...</option>
                            <option value="Kondisi Tidak Aman">Kondisi Tidak Aman (KTA)</option>
                            <option value="Tindakan Tidak Aman">Tindakan Tidak Aman (TTA)</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer' }}>Batal</button>
                    <button onClick={handleSave} disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: saving ? '#94a3b8' : 'var(--primary)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                        <Save size={12} />{saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function KtaTtaTable({ data = [], loading, onSave, onDelete }) {
    const [modal, setModal]   = useState(null); // null | { mode: 'create' } | { mode: 'edit', item }
    const [saving, setSaving] = useState(false);

    // States for local TanStack Table features
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination]       = useState({ pageIndex: 0, pageSize: 10 });

    const handleSave = async (form) => {
        setSaving(true);
        try {
            await onSave(form, modal?.item?.id);
            setModal(null);
        } catch (err) {
            alert('Gagal menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'code', header: 'Kode' },
        { accessorKey: 'name', header: 'Nama KTA / TTA' },
        { accessorKey: 'type', header: 'Tipe' },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button onClick={() => setModal({ mode: 'edit', item: row.original })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '5px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <Pencil size={11} /> Edit
                    </button>
                    <button onClick={() => onDelete(row.original.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', border: 'none', borderRadius: '5px', backgroundColor: 'var(--danger)', fontSize: '11px', cursor: 'pointer', color: '#fff' }}>
                        <Trash2 size={11} /> Hapus
                    </button>
                </div>
            ),
        }
    ], [onDelete]);

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            pagination,
        },
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    // Adapt pagination state to TablePagination props
    const localPagination = {
        current_page: table.getState().pagination.pageIndex + 1,
        last_page: table.getPageCount(),
        total: table.getFilteredRowModel().rows.length,
    };

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Jenis KTA / TTA</h3>
                <button onClick={() => setModal({ mode: 'create' })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', border: 'none', borderRadius: '6px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    <Plus size={12} /> Tambah
                </button>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <Table style={{ fontSize: '12px' }}>
                    <TableHeader style={{ backgroundColor: '#f8fafc' }}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isActions = header.id === 'actions';
                                    return (
                                        <TableHead key={header.id}
                                            style={{
                                                padding: '10px 16px',
                                                verticalAlign: 'top',
                                                color: 'var(--text-secondary)',
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isActions ? 'auto' : '120px' }}>
                                                <span style={{ fontWeight: 700 }}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                                {!isActions && (
                                                    <DebouncedInput
                                                        type="text"
                                                        placeholder="Cari..."
                                                        value={header.column.getFilterValue() || ""}
                                                        onChange={val => header.column.setFilterValue(val)}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            width: "100%",
                                                            padding: "4px 8px",
                                                            fontSize: "11px",
                                                            fontWeight: "normal",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "4px",
                                                            outline: "none",
                                                            boxSizing: "border-box",
                                                            color: "#334155",
                                                            backgroundColor: "#fff",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        const isActions = cell.column.id === 'actions';
                                        return (
                                            <TableCell key={cell.id} style={{ padding: '10px 16px', color: 'var(--text-primary)', textAlign: isActions ? 'right' : 'left' }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                pagination={localPagination}
                onPageChange={p => table.setPageIndex(p - 1)}
                limit={table.getState().pagination.pageSize}
                onLimitChange={l => table.setPageSize(l)}
            />

            {modal && (
                <KtaTtaModal
                    title={modal.mode === 'create' ? 'Tambah Jenis KTA / TTA' : 'Edit Jenis KTA / TTA'}
                    item={modal.item}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            )}
        </div>
    );
}
