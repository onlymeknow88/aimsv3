import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

const PICA_STATUS_COLORS = {
    'Open':     { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'Closed':   { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    'Overdue':  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

function PicaStatusBadge({ status }) {
    const s = PICA_STATUS_COLORS[status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    return <span style={{ color: s.color, backgroundColor: s.bg, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{status ?? '-'}</span>;
}

export default function PicaTable({ picas, loading }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Temuan</TableHead>
                        <TableHead style={thStyle}>Perusahaan</TableHead>
                        <TableHead style={thStyle}>Due Date</TableHead>
                        <TableHead style={thStyle}>Status</TableHead>
                        <TableHead style={thStyle}>PIC</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !picas.length ? (
                        <TableRow>
                            <TableCell colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada data PICA.
                            </TableCell>
                        </TableRow>
                    ) : (
                        picas.map((p, i) => (
                            <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'normal', maxWidth: '300px' }}>{p.description ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.company_name ?? '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, color: p.status === 'Overdue' ? '#ef4444' : 'var(--text-secondary)' }}>
                                    {p.due_date ? new Date(p.due_date).toLocaleDateString('id-ID') : '-'}
                                </TableCell>
                                <TableCell style={{ padding: '10px 12px' }}><PicaStatusBadge status={p.status} /></TableCell>
                                <TableCell style={tdStyle}>{p.pic ?? '-'}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
