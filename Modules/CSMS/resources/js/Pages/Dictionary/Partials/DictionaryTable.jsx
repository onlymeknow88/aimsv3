import React from 'react';
import { BookOpen, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center' };

export default function DictionaryTable({ items, loading, onEdit, onDelete }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Istilah</TableHead>
                        <TableHead style={thStyle}>Definisi</TableHead>
                        <TableHead style={thStyle}>Tanggal</TableHead>
                        <TableHead style={{ ...thStyle, textAlign: 'right' }}>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !items.length ? (
                        <TableRow>
                            <TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada data kamus CSMS.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item, i) => (
                            <TableRow key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' }}>{item.term}</TableCell>
                                <TableCell style={{ ...tdStyle, maxWidth: '500px', lineHeight: '1.5' }}>{item.definition}</TableCell>
                                <TableCell style={tdStyle}>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <button onClick={() => onEdit && onEdit(item)} title="Edit" style={{ ...actionBtn, color: 'var(--primary)' }}><Pencil size={14} /></button>
                                    <button onClick={() => onDelete && onDelete(item)} title="Hapus" style={{ ...actionBtn, color: 'var(--danger, #ef4444)' }}><Trash2 size={14} /></button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
