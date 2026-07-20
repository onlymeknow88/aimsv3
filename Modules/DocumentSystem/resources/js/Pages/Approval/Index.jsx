import React, { useState, useEffect } from 'react';
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

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(x => x !== id));
        }
    };

    return (
        <DocumentSystemLayout>
            <Head title="Document Approval" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Document Approval</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen keselamatan kerja dan operasional yang memerlukan persetujuan Anda.</p>
            </div>

            {selectedIds.length > 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(21, 59, 115, 0.05)',
                    border: '1px solid rgba(21, 59, 115, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    marginBottom: '20px',
                    gap: isMobile ? '12px' : '16px',
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

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
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
                                    cursor: 'pointer',
                                    flex: isMobile ? 1 : 'initial',
                                    justifyContent: 'center'
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
                                cursor: 'pointer',
                                flex: isMobile ? '100%' : 'initial',
                                justifyContent: 'center'
                            }}
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    gap: '16px'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari judul atau nomor dokumen..."
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}
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
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <Table style={{ fontSize: '12px', minWidth: '900px' }}>
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
                                        <TableCell style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{doc.document_number}</TableCell>
                                        <TableCell style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{doc.title}</TableCell>
                                        <TableCell style={{ whiteSpace: 'nowrap' }}>
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
                </div>
            )}

            <ApprovalDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} onApprove={openApprove} onReject={openReject} />
            <ApproveModal doc={selectedDoc} open={approveModalOpen} onClose={closeApprove} onSubmit={approveDocument} loading={actionLoading} />
            <RejectModal doc={selectedDoc} open={rejectModalOpen} onClose={closeReject} onSubmit={rejectDocument} loading={actionLoading} />
        </DocumentSystemLayout>
    );
}


