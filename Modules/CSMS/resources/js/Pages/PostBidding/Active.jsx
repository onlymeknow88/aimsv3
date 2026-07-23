import { ClipboardCheck, Eye, Plus, RefreshCw, Search } from 'lucide-react';

import CSMSLayout from '../../Layouts/CSMSLayout';
import { Head } from '@inertiajs/react';
import PostBiddingTable from './Partials/PostBiddingTable';
import React from 'react';
import TablePagination from '@/Components/TablePagination';
import useBidding from '../Bidding/Hooks/useBidding';

const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' };

export default function PostBiddingActive() {
    const { biddings, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh } = useBidding('PostBidding', 'Active');

    return (
        <CSMSLayout>
            <Head title="Post-Bidding Active - CSMS" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ClipboardCheck size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Post-Bidding Active</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Daftar kontraktor Post-Bidding yang berstatus Active</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted, #94a3b8)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari perusahaan..."
                        style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={refresh} style={btnStyle}><RefreshCw size={14} /></button>
                    <a href="/csms/post-bidding/create"
                        style={{ ...btnStyle, backgroundColor: 'var(--primary)', color: '#fff', border: 'none', textDecoration: 'none' }}>
                        <Plus size={14} /> Tambah Post Bidding
                    </a>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <PostBiddingTable biddings={biddings} loading={loading} />
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
        </CSMSLayout>
    );
}
