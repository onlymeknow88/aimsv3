import React from 'react';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '../../Bidding/Partials/Components/StatusBadge';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function PostBiddingTable({ biddings, loading }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Nama Perusahaan</TableHead>
                        <TableHead style={thStyle}>No. Lisensi</TableHead>
                        <TableHead style={thStyle}>No. Dokumen CSMS</TableHead>
                        <TableHead style={thStyle}>Status</TableHead>
                        <TableHead style={thStyle}>Disetujui Oleh</TableHead>
                        <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !biddings.length ? (
                        <TableRow>
                            <TableCell colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Tidak ada data post-bidding.
                            </TableCell>
                        </TableRow>
                    ) : (
                        biddings.map((b, i) => (
                            <TableRow key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{b.company_name}</TableCell>
                                <TableCell style={tdStyle}>{b.license_number}</TableCell>
                                <TableCell style={tdStyle}>{b.csms_doc_number ?? '-'}</TableCell>
                                <TableCell style={{ padding: '10px 12px' }}><StatusBadge status={b.status} /></TableCell>
                                <TableCell style={tdStyle}>{b.ktt_name ?? '-'}</TableCell>
                                <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <a href={`/csms/post-bidding/detail/${b.id}`}
                                        style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', color: 'var(--primary)', textDecoration: 'none' }}>
                                        <Eye size={13} />
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
