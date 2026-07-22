import React from 'react';
import { Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function LetterTable({ letters, loading }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Judul Surat</TableHead>
                        <TableHead style={thStyle}>Status</TableHead>
                        <TableHead style={thStyle}>Tanggal</TableHead>
                        <TableHead style={thStyle}>Lampiran</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !letters.length ? (
                        <TableRow>
                            <TableCell colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada Surat Edaran.
                            </TableCell>
                        </TableRow>
                    ) : (
                        letters.map((l, i) => (
                            <TableRow key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{l.title}</TableCell>
                                <TableCell style={tdStyle}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: l.status === 'Active' ? 'rgba(47,191,113,0.08)' : 'rgba(100,116,139,0.1)', color: l.status === 'Active' ? '#2FBF71' : '#64748b' }}>
                                        {l.status}
                                    </span>
                                </TableCell>
                                <TableCell style={tdStyle}>{l.created_at ? new Date(l.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell style={tdStyle}>{l.files_count ?? 0} file</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
