import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './Components/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };
const tdBold  = { ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' };

export default function BiddingTable({ biddings, loading, onDelete, canEdit, canDelete, selectedIds = [], onSelectAll, onSelectRow }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={{ width: '40px', padding: '10px 12px' }}>
                            <Checkbox
                                checked={biddings.length > 0 && selectedIds.length === biddings.length}
                                onCheckedChange={onSelectAll}
                            />
                        </TableHead>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>Nama Perusahaan</TableHead>
                        <TableHead style={thStyle}>No. Lisensi</TableHead>
                        <TableHead style={thStyle}>Kriteria Layanan</TableHead>
                        <TableHead style={thStyle}>Klasifikasi</TableHead>
                        <TableHead style={thStyle}>Status</TableHead>
                        <TableHead style={thStyle}>No. Dokumen</TableHead>
                        <TableHead style={thStyle}>Dibuat</TableHead>
                        <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !biddings.length ? (
                        <TableRow>
                            <TableCell colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Tidak ada data bidding.
                            </TableCell>
                        </TableRow>
                    ) : (
                        biddings.map((b, idx) => (
                            <TableRow key={b.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: selectedIds.includes(b.id) ? '#f8fafc' : 'transparent' }}>
                                <TableCell style={{ padding: '10px 12px' }}>
                                    <Checkbox
                                        checked={selectedIds.includes(b.id)}
                                        onCheckedChange={() => onSelectRow(b.id)}
                                    />
                                </TableCell>
                                <TableCell style={tdStyle}>{idx + 1}</TableCell>
                                <TableCell style={tdBold}>{b.company_name}</TableCell>
                                <TableCell style={tdStyle}>{b.license_number}</TableCell>
                                <TableCell style={tdStyle}>{b.service_criteria}</TableCell>
                                <TableCell style={tdStyle}>{b.classification ?? '-'}</TableCell>
                                <TableCell style={{ padding: '10px 12px' }}><StatusBadge status={b.status} /></TableCell>
                                <TableCell style={tdStyle}>{b.csms_doc_number ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{b.created_at ? new Date(b.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <a href={`/csms/bidding/detail/${b.id}`}
                                            style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(21,59,115,0.08)', display: 'inline-flex', color: 'var(--primary)', textDecoration: 'none' }}
                                            title="Detail">
                                            <Eye size={13} />
                                        </a>
                                        {canEdit && b.status === 'Draft' && (
                                            <a href={`/csms/bidding/edit/${b.id}`}
                                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(255,140,36,0.08)', display: 'inline-flex', color: 'var(--accent)', textDecoration: 'none' }}
                                                title="Edit">
                                                <Edit size={13} />
                                            </a>
                                        )}
                                        {canDelete && b.status === 'Draft' && (
                                            <button onClick={() => onDelete(b)}
                                                style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ef4444' }}
                                                title="Hapus">
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}