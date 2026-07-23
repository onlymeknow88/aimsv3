import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { FileText, RefreshCw, Search, Trash2, Eye, Edit2 } from 'lucide-react';
import PicaLayout from '../../Layouts/PicaLayout';
import TablePagination from '@/Components/TablePagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import StatusBadge from '../ActiveDocument/Partials/StatusBadge';
import useDraft from './Hooks/useDraft';

const thStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { fontSize: '12px', padding: '10px 12px', color: 'var(--text-secondary)' };

const SOURCES = ['Field Leadership', 'Inspeksi KPLH', 'Audit', 'CSMS', 'Manual'];

export default function DraftIndex() {
    const {
        documents, pagination, loading,
        search, setSearch,
        source, setSource,
        limit, setLimit,
        page, setPage,
        refresh, deletePica,
    } = useDraft();

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await deletePica(deleteTarget.id);
            setDeleteTarget(null);
        } catch {
            setDeleteError('Gagal menghapus data.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <PicaLayout>
            <Head title="Draft PICA" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <FileText size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Draft</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Dokumen PICA yang belum dipublish</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari identity ID, perusahaan..."
                        style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        value={source}
                        onChange={e => { setSource(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">Semua Source</option>
                        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <RefreshCw size={13} />
                    </button>
                    <a href="/pica/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                        + Tambah PICA
                    </a>
                </div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <Table>
                    <TableHeader>
                        <TableRow style={{ backgroundColor: '#f8fafc' }}>
                            <TableHead style={thStyle}>No</TableHead>
                            <TableHead style={thStyle}>Identity ID</TableHead>
                            <TableHead style={thStyle}>Source</TableHead>
                            <TableHead style={thStyle}>Tipe</TableHead>
                            <TableHead style={thStyle}>Perusahaan</TableHead>
                            <TableHead style={thStyle}>Target Selesai</TableHead>
                            <TableHead style={thStyle}>Status</TableHead>
                            <TableHead style={{ ...thStyle, textAlign: 'center' }}>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Memuat data...</TableCell></TableRow>
                        ) : !documents.length ? (
                            <TableRow><TableCell colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>Belum ada draft PICA.</TableCell></TableRow>
                        ) : documents.map((doc, i) => (
                            <TableRow key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <TableCell style={tdStyle}>{i + 1}</TableCell>
                                <TableCell style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' }}>
                                    <a href={`/pica/detail/${doc.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{doc.identity_id ?? '-'}</a>
                                </TableCell>
                                <TableCell style={tdStyle}>{doc.source ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>{doc.type ?? '-'}</TableCell>
                                <TableCell style={{ ...tdStyle, whiteSpace: 'normal', maxWidth: '180px' }}>{doc.company?.company_name ?? '-'}</TableCell>
                                <TableCell style={tdStyle}>
                                    {doc.target_settlement_date ? new Date(doc.target_settlement_date).toLocaleDateString('id-ID') : '-'}
                                </TableCell>
                                <TableCell style={{ padding: '10px 12px' }}><StatusBadge status={doc.status} /></TableCell>
                                <TableCell style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <a href={`/pica/detail/${doc.id}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6', textDecoration: 'none' }} title="Lihat Detail">
                                            <Eye size={13} />
                                        </a>
                                        <a href={`/pica/edit/${doc.id}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981', textDecoration: 'none' }} title="Edit">
                                            <Edit2 size={13} />
                                        </a>
                                        <button onClick={() => setDeleteTarget(doc)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Hapus">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                itemName={deleteTarget?.identity_id}
                deleting={deleting}
                errorMessage={deleteError}
            />
        </PicaLayout>
    );
}