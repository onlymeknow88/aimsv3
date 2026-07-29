import { ClipboardCheck, RefreshCw, Search, Plus } from 'lucide-react';
import React, { useState } from 'react';

import CSMSLayout from '../../Layouts/CSMSLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head } from '@inertiajs/react';
import PostBiddingTable from './Partials/PostBiddingTable';
import TablePagination from '@/Components/TablePagination';
import axios from 'axios';
import useBidding from '../Bidding/Hooks/useBidding';

const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

export default function PostBiddingIndex() {
    const { biddings, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh } = useBidding('PostBidding');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.post('/api/csms/biddings/bulk-delete', { ids: selectedIds });
            setSelectedIds([]);
            refresh();
        } catch (err) {
            alert(err.response?.data?.message ?? 'Gagal menghapus data');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <CSMSLayout>
            <Head title="Post-Bidding CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ClipboardCheck size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Post-Bidding CSMS</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Penilaian kelayakan & penerbitan sertifikat CSMS</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari perusahaan..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                        <option value="">Semua Status</option>
                        <option value="On Review OHS">On Review OHS</option>
                        <option value="On Review D/H OHS">On Review D/H OHS</option>
                        <option value="On Review KTT">On Review KTT</option>
                        <option value="Approved">Approved</option>
                    </select>
                    <button onClick={refresh} style={btnStyle}><RefreshCw size={14} /></button>
                    <a href="/csms/post-bidding/create"
                        style={{ ...btnStyle, backgroundColor: 'var(--primary)', color: '#fff', border: 'none', textDecoration: 'none' }}>
                        <Plus size={14} /> Tambah Post Bidding
                    </a>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <PostBiddingTable
                    biddings={biddings}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onDelete={() => setShowDeleteConfirm(true)}
                />
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                type="generic"
                title="Hapus Data?"
                description={`${selectedIds.length} data akan dihapus permanen dan tidak dapat dikembalikan.`}
                confirmText="Hapus"
                cancelText="Batal"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </CSMSLayout>
    );
}
