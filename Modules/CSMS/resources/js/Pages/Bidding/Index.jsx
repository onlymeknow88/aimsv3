import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import BiddingTable from './Partials/BiddingTable';
import useBidding from './Hooks/useBidding';
import TablePagination from '@/Components/TablePagination';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { ClipboardList, Plus, RefreshCw, Search } from 'lucide-react';

const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#fff', border: '1px solid var(--border-color)',
    borderRadius: '6px', padding: '8px 12px',
    fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
};

export default function BiddingIndex() {
    const {
        biddings, pagination, loading,
        search, setSearch, status, setStatus,
        limit, setLimit, page, setPage,
        refresh, deleteBidding, bulkDeleteBidding, submitApproval,
    } = useBidding('Bidding');

    const [deleteModal, setDeleteModal] = useState({ open: false, item: null, isBulk: false });
    const [deleting, setDeleting]       = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [submitModal, setSubmitModal] = useState({ open: false, id: null });
    const [submitting, setSubmitting]   = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectAll = () => {
        if (selectedIds.length === biddings.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(biddings.map(b => b.id));
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleDelete = (item) => { setDeleteModal({ open: true, item, isBulk: false }); setDeleteError(''); };
    const handleBulkDelete = () => { setDeleteModal({ open: true, item: null, isBulk: true }); setDeleteError(''); };
    const confirmDelete = () => {
        setDeleting(true);
        if (deleteModal.isBulk) {
            bulkDeleteBidding(selectedIds)
                .then(() => {
                    setDeleteModal({ open: false, item: null, isBulk: false });
                    setSelectedIds([]);
                })
                .catch(e => setDeleteError(e?.response?.data?.message ?? e?.message ?? 'Gagal menghapus data terpilih'))
                .finally(() => setDeleting(false));
        } else {
            deleteBidding(deleteModal.item.id)
                .then(() => setDeleteModal({ open: false, item: null, isBulk: false }))
                .catch(e => setDeleteError(e?.message ?? 'Gagal menghapus'))
                .finally(() => setDeleting(false));
        }
    };

    const handleSubmit = (id) => setSubmitModal({ open: true, id });
    const confirmSubmit = () => {
        setSubmitting(true);
        submitApproval(submitModal.id, 'submit')
            .then(() => setSubmitModal({ open: false, id: null }))
            .finally(() => setSubmitting(false));
    };

    return (
        <CSMSLayout>
            <Head title="Bidding CSMS" />

            {/* Page Header */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Bidding CSMS</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                    Daftar pengajuan kelayakan K3 kontraktor
                </p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari perusahaan, no. lisensi..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Semua Status</option>
                        <option value="Draft">Draft</option>
                        <option value="On Review OHS">On Review OHS</option>
                        <option value="On Review D/H OHS">On Review D/H OHS</option>
                        <option value="On Review KTT">On Review KTT</option>
                        <option value="Approved">Approved</option>
                    </select>
                    <button onClick={refresh} style={btnStyle}><RefreshCw size={14} /></button>
                    <a href="/csms/bidding/create"
                        style={{ ...btnStyle, backgroundColor: 'var(--primary)', color: '#fff', border: 'none', textDecoration: 'none' }}>
                        <Plus size={14} /> Tambah Bidding
                    </a>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{selectedIds.length} Baris Terpilih</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedIds([])} style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: '#fff', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', color: '#991b1b', fontWeight: 600 }}>Batal</button>
                        <button onClick={handleBulkDelete} style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600 }}>Hapus Terpilih</button>
                    </div>
                </div>
            )}

            {/* Table Card */}
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <BiddingTable
                    biddings={biddings}
                    loading={loading}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    canEdit
                    canDelete
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                />
                <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={v => { setLimit(v); setPage(1); }}
                />
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                itemName={deleteModal.isBulk ? `${selectedIds.length} data bidding terpilih` : deleteModal.item?.company_name}
                deleting={deleting}
                errorMessage={deleteError}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ open: false, item: null, isBulk: false })}
            />

            <ConfirmationModal
                isOpen={submitModal.open}
                type="review"
                loading={submitting}
                confirmText="Submit ke OHS"
                onConfirm={confirmSubmit}
                onCancel={() => setSubmitModal({ open: false, id: null })}
            />
        </CSMSLayout>
    );
}