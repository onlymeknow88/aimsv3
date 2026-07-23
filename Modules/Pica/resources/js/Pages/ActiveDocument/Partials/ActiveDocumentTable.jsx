import React from 'react';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from './StatusBadge';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function ActiveDocumentTable({ documents, loading }) {
    return (
        <Table>
            <TableHeader>
                <TableRow style={{ backgroundColor: '#f8fafc' }}>
                    <TableHead style={thStyle}>No</TableHead>
                    <TableHead style={thStyle}>Identity ID</TableHead>
                    <TableHead style={thStyle}>Source</TableHead>
                    <TableHead style={thStyle}>Tipe</TableHead>
                    <TableHead style={thStyle}>Perusahaan</TableHead>
                    <TableHead style={thStyle}>Auditor</TableHead>
                    <TableHead style={thStyle}>Target Selesai</TableHead>
                    <TableHead style={thStyle}>Status</TableHead>
                    <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            Memuat data...
                        </TableCell>
                    </TableRow>
                ) : !documents.length ? (
                    <TableRow>
                        <TableCell colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            Belum ada data PICA.
                        </TableCell>
                    </TableRow>
                ) : (
                    documents.map((doc, i) => (
                        <TableRow key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <TableCell style={tdStyle}>{i + 1}</TableCell>
                            <TableCell style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' }}>
                                <a href={`/pica/detail/${doc.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                    {doc.identity_id ?? '-'}
                                </a>
                            </TableCell>
                            <TableCell style={tdStyle}>{doc.source ?? '-'}</TableCell>
                            <TableCell style={tdStyle}>{doc.type ?? '-'}</TableCell>
                            <TableCell style={{ ...tdStyle, whiteSpace: 'normal', maxWidth: '180px' }}>
                                {doc.company?.company_name ?? '-'}
                            </TableCell>
                            <TableCell style={tdStyle}>{doc.auditor_name ?? '-'}</TableCell>
                            <TableCell style={{
                                ...tdStyle,
                                color: doc.status === 'Overdue' ? '#ef4444' : 'var(--text-secondary)',
                                fontWeight: doc.status === 'Overdue' ? 600 : 400,
                            }}>
                                {doc.target_settlement_date
                                    ? new Date(doc.target_settlement_date).toLocaleDateString('id-ID')
                                    : '-'}
                            </TableCell>
                            <TableCell style={{ padding: '10px 12px' }}>
                                <StatusBadge status={doc.status} />
                            </TableCell>
                            <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <a
                                    href={`/pica/detail/${doc.id}`}
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                                    title="Lihat Detail"
                                >
                                    <Eye size={13} />
                                </a>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}