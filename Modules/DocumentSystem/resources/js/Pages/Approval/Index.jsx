import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useApproval from './Hooks/useApproval';
import ApprovalDetailDrawer from './Partials/ApprovalDetailDrawer';
import ApproveModal from './Partials/ApproveModal';
import RejectModal from './Partials/RejectModal';
import { CheckSquare, Search, Edit, Trash2, X } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function Index() {
    const {
        search,
        setSearch,
        docs,
        loading,
        actionLoading,
        selectedIds,
        setSelectedIds,
        drawerOpen, 
        approveModalOpen, 
        rejectModalOpen, 
        selectedDoc,
        openDrawer, 
        closeDrawer, 
        openApprove, 
        closeApprove, 
        openReject, 
        closeReject,
        approveDocument, 
        rejectDocument,
        handleEdit,
        handleDelete
    } = useApproval();

    const filtered = docs.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.document_number?.toLowerCase().includes(search.toLowerCase())
    );

    const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filtered.map(d => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id, checked) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(x => x !== id));
        }
    };

    return (
        <DocumentSystemLayout>
            <Head title="Approval Action Center" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Approval Action Center</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Persetujuan dokumen K3LH & SOP (Level 1 CRS & Level 2 PJA).</p>
            </div>

            {selectedIds.length > 0 ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(21, 59, 115, 0.05)',
                    border: '1px solid rgba(21, 59, 115, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    marginBottom: '20px',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {selectedIds.length} Row Selected
                        </span>
                        <button 
                            onClick={() => setSelectedIds([])}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                            title="Clear Selection"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {selectedIds.length === 1 && (
                            <button 
                                onClick={handleEdit}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Edit size={12} /> Edit
                            </button>
                        )}
                        <button 
                            onClick={handleDelete}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'var(--danger)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    gap: '16px'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari judul atau nomor dokumen..."
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none' }}
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '11px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    Memuat data antrean persetujuan...
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
                    <CheckSquare size={48} style={{ margin: '0 auto 16px', color: 'var(--success)', opacity: 0.5, display: 'block' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Tidak Ada Antrean Approval</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Semua permohonan pengesahan telah diselesaikan.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <Table style={{ fontSize: '12px' }}>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: '40px' }}>
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                {['No. Dokumen', 'Judul', 'Aksi'].map(h => (
                                    <TableHead key={h} style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell style={{ width: '40px' }}>
                                        <Checkbox
                                            checked={selectedIds.includes(doc.id)}
                                            onCheckedChange={(checked) => handleSelectRow(doc.id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 700, color: 'var(--primary)' }}>{doc.document_number}</TableCell>
                                    <TableCell style={{ fontWeight: 600 }}>{doc.title}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openDrawer(doc)} style={{ border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px' }}>Detail</button>
                                            <button onClick={() => openApprove(doc)} style={{ border: 'none', background: 'var(--success)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>Setuju</button>
                                            <button onClick={() => openReject(doc)} style={{ border: 'none', background: 'var(--danger)', color: '#fff', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>Tolak</button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <ApprovalDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} onApprove={openApprove} onReject={openReject} />
            <ApproveModal doc={selectedDoc} open={approveModalOpen} onClose={closeApprove} onSubmit={approveDocument} loading={actionLoading} />
            <RejectModal doc={selectedDoc} open={rejectModalOpen} onClose={closeReject} onSubmit={rejectDocument} loading={actionLoading} />
        </DocumentSystemLayout>
    );
}


