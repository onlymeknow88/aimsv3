import React, { useMemo, useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
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
    useReactTable,
} from "@tanstack/react-table";

function LimitParamModal({ onClose, onSave, saving, item }) {
    const [form, setForm] = useState({ ...item });

    const handleSave = () => {
        onSave(form);
    };

    const fields = [
        { key: 'max_item_member',             label: 'Maks. Anggota Tim',        placeholder: '5' },
        { key: 'max_item_positive_condition', label: 'Maks. Kondisi Positif',     placeholder: '5' },
        { key: 'max_item_risk_condition',     label: 'Maks. Kondisi Risiko',      placeholder: '10' },
        { key: 'max_item_corrective_action',  label: 'Maks. Tindakan Perbaikan',  placeholder: '5' },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Edit Limit Parameter</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                </div>
                <div style={{ padding: '20px' }}>
                    {fields.map(f => (
                        <div key={f.key} style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{f.label}</label>
                            <input
                                type="number"
                                value={form[f.key] ?? ''}
                                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
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

export default function LimitParameterTable({ data = [], loading, onSave }) {
    const [editItem, setEditItem] = useState(null);
    const [saving, setSaving]     = useState(false);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            await onSave(form);
            setEditItem(null);
        } catch (err) {
            alert('Gagal menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'max_item_member',             header: 'Maks. Anggota Tim' },
        { accessorKey: 'max_item_positive_condition', header: 'Maks. Kondisi Positif' },
        { accessorKey: 'max_item_risk_condition',     header: 'Maks. Kondisi Risiko' },
        { accessorKey: 'max_item_corrective_action',  header: 'Maks. Tindakan Perbaikan' },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button onClick={() => setEditItem(row.original)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: '5px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <Pencil size={11} /> Edit
                    </button>
                </div>
            ),
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Limit Parameter</h3>
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
                                                textAlign: isActions ? 'right' : 'left',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                        ) : data.length === 0 ? (
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

            {editItem && (
                <LimitParamModal
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            )}
        </div>
    );
}
