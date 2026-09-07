import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function ProposalTable({ proposals, loading }) {
    return (
        <Table>
            <TableHeader>
                <TableRow style={{ backgroundColor: '#f8fafc' }}>
                    <TableHead style={thStyle}>No. Proposal</TableHead>
                    <TableHead style={thStyle}>Call Sign</TableHead>
                    <TableHead style={thStyle}>SPIP Desc</TableHead>
                    <TableHead style={thStyle}>Perusahaan</TableHead>
                    <TableHead style={thStyle}>Area</TableHead>
                    <TableHead style={thStyle}>Jadwal</TableHead>
                    <TableHead style={thStyle}>Berikutnya</TableHead>
                    <TableHead style={thStyle}>Periode</TableHead>
                    <TableHead style={thStyle}>Status</TableHead>
                    <TableHead style={thStyle}>QR Sementara</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                ) : !proposals.length ? (
                    <TableRow><TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada proposal.</TableCell></TableRow>
                ) : (
                    proposals.map(p => (
                        <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={{ ...tdStyle, fontWeight: 700 }}>
                                    <a href={`/ko/proposals/${p.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{p.number}</a>
                                </TableCell>
                                <TableCell style={tdStyle}>{p.ko_unit?.call_sign ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.ko_unit?.ko_spip_unit?.name ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.company?.company_name ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.area ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.internal_komisioning_schedule ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.next_commissioning ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.commissioning_period ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: p.status === 'Completed' ? 'rgba(47,191,113,0.1)' : 'rgba(255,140,36,0.1)', color: p.status === 'Completed' ? '#2FBF71' : '#FF8C24' }}>
                                        {p.status}
                                    </span>
                                </TableCell>
                                <TableCell style={tdStyle}>{p.temporary_qr_status ?? '-'}</TableCell>
                            </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
