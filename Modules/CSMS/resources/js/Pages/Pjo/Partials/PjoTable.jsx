import { Trash2, FileText, Eye, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import { useState } from 'react';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

const STATUS_COLORS = {
    'Draft':    { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
    'Active':   { color: '#2FBF71', bg: 'rgba(47,191,113,0.08)' },
    'On Going': { color: '#FF8C24', bg: 'rgba(255,140,36,0.08)' },
    'Inactive': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

function PjoStatusBadge({ status }) {
    const s = STATUS_COLORS[status] ?? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    return <span style={{ color: s.color, backgroundColor: s.bg, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{status ?? '-'}</span>;
}

export default function PjoTable({ pjos, loading, onDelete }) {
    const [preview, setPreview] = useState(null);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>No. PJO</TableHead>
                        <TableHead style={thStyle}>Nama PJO</TableHead>
                        <TableHead style={thStyle}>Perusahaan</TableHead>
                        <TableHead style={thStyle}>Telepon</TableHead>
                        <TableHead style={thStyle}>Tgl. Pengajuan</TableHead>
                        <TableHead style={thStyle}>Lampiran</TableHead>
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
                    ) : !pjos.length ? (
                        <TableRow>
                            <TableCell colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Tidak ada data PJO.
                            </TableCell>
                        </TableRow>
                    ) : (
                        pjos.map((p, i) => (
                            <TableRow key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={tdStyle}>{p.number_pjo ?? '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</TableCell>
                                <TableCell style={tdStyle}>{p.company_name_resolved ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.phone ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{p.date_submission ? new Date(p.date_submission).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, whiteSpace: 'normal', minWidth: '120px' }}>
                                    {p.files && p.files.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {p.files.map(file => (
                                                <button key={file.id} onClick={() => setPreview({
                                                    id: file.id,
                                                    type: 'csms_pjo_file',
                                                    name: file.name,
                                                    file_name: file.name,
                                                    file_type: file.name?.split('.').pop() ?? '',
                                                })}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                                                    <FileText size={12} /> {file.name}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                                    )}
                                </TableCell>
                                <TableCell style={{ padding: '10px 12px' }}><PjoStatusBadge status={p.status} /></TableCell>
                                <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <a href={`/csms/pjo/detail/${p.id}`} title="Detail"
                                            style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(45,127,249,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: 'var(--primary)' }}>
                                            <Eye size={13} />
                                        </a>
                                        <a href={`/csms/pjo/edit/${p.id}`} title="Edit"
                                            style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(255,140,36,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ff8c24' }}>
                                            <Edit size={13} />
                                        </a>
                                        <button title="Hapus" onClick={() => onDelete(p)}
                                            style={{ padding: '5px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'inline-flex', color: '#ef4444' }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {preview && (
                <BlobPreviewModal
                    attachment={preview}
                    onClose={() => setPreview(null)}
                />
            )}
        </div>
    );
}
