import React from 'react';
import { BookOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function DictionaryTable({ items, loading }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Istilah</TableHead>
                        <TableHead style={thStyle}>Definisi</TableHead>
                        <TableHead style={thStyle}>Tanggal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !items.length ? (
                        <TableRow>
                            <TableCell colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
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
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
