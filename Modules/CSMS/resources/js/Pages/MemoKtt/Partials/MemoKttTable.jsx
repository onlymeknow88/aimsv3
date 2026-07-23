import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BlobPreviewModal from '@/Components/BlobPreviewModal';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

export default function MemoKttTable({ memos, loading }) {
    const [preview, setPreview] = useState(null);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#f8fafc' }}>
                        <TableHead style={thStyle}>No</TableHead>
                        <TableHead style={thStyle}>No. Memo</TableHead>
                        <TableHead style={thStyle}>Judul Memo</TableHead>
                        <TableHead style={thStyle}>CCOW</TableHead>
                        <TableHead style={thStyle}>Status</TableHead>
                        <TableHead style={thStyle}>Tanggal Memo</TableHead>
                        <TableHead style={thStyle}>Lampiran</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Memuat data...
                            </TableCell>
                        </TableRow>
                    ) : !memos.length ? (
                        <TableRow>
                            <TableCell colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                Belum ada data Memo KTT.
                            </TableCell>
                        </TableRow>
                    ) : (
                        memos.map((m, i) => (
                            <TableRow key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{m.memo_number}</TableCell>
                                <TableCell style={tdStyle}>{m.title ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{m.ccow_name ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: m.status === 'Active' ? 'rgba(47,191,113,0.08)' : 'rgba(100,116,139,0.1)', color: m.status === 'Active' ? '#2FBF71' : '#64748b' }}>
                                        {m.status}
                                    </span>
                                </TableCell>
                                <TableCell style={tdStyle}>{m.date ? new Date(m.date).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, whiteSpace: 'normal', minWidth: '120px' }}>
                                    {m.files && m.files.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {m.files.map(file => (
                                                <button key={file.id} onClick={() => setPreview({
                                                    id: file.id,
                                                    type: 'csms_memo_ktt_file',
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
