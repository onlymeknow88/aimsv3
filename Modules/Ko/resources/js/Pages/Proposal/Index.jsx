import { ClipboardList, Plus, RefreshCw, Search } from 'lucide-react';
import { Head } from '@inertiajs/react';
import React from 'react';
import KoLayout from '../../Layouts/KoLayout';
import TablePagination from '@/Components/TablePagination';
import ProposalTable from './Partials/ProposalTable';
import useProposal from './Hooks/useProposal';

const STATUSES = ['Draft', 'Returned', 'Admin Proposal Verification', 'Coordinator Proposal Verification', 'Commissioning in Progress', 'Completed'];

export default function ProposalIndex() {
    const { proposals, pagination, loading, search, setSearch, status, setStatus, limit, setLimit, page, setPage, refresh } = useProposal();

    return (
        <KoLayout>
            <Head title="Proposal KO" />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Proposal</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Pengajuan sertifikasi unit operasi</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nomor / email..."
                            style={{ width: '260px', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px' }}>
                        <option value="">Semua Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                    <a href="/ko/proposals/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
                        <Plus size={14} /> Buat Proposal
                    </a>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <ProposalTable proposals={proposals} loading={loading} />
                <TablePagination pagination={pagination} onPageChange={setPage} limit={limit} onLimitChange={v => { setLimit(v); setPage(1); }} />
            </div>
        </KoLayout>
    );
}
