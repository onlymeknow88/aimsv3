import React from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import PicaLayout from '../../Layouts/PicaLayout';
import TablePagination from '@/Components/TablePagination';
import ActiveDocumentTable from './Partials/ActiveDocumentTable';
import useActiveDocument from './Hooks/useActiveDocument';

const SOURCES = ['Field Leadership', 'Inspeksi KPLH', 'Audit', 'CSMS', 'Manual'];
const STATUSES = ['Open', 'On Review PJA', 'On Review CRS', 'Overdue', 'Closed'];

export default function ActiveDocumentIndex() {
    const {
        documents, pagination, loading,
        search, setSearch,
        status, setStatus,
        source, setSource,
        limit, setLimit,
        page, setPage,
        refresh,
    } = useActiveDocument();

    return (
        <PicaLayout>
            <Head title="Active Document PICA" />

            {/* Page Header */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Active Document</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                    Dokumen PICA yang telah dipublish dan sedang aktif
                </p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Cari identity ID, perusahaan, auditor..."
                        style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={source}
                        onChange={e => { setSource(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">Semua Source</option>
                        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={status}
                        onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">Semua Status</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                        onClick={refresh}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <RefreshCw size={13} />
                    </button>
                    <a
                        href="/pica/create"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg, #1d4ed8, #153B73)', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                    >
                        + Tambah PICA
                    </a>
                </div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <ActiveDocumentTable documents={documents} loading={loading} />
                <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={v => { setLimit(v); setPage(1); }}
                />
            </div>
        </PicaLayout>
    );
}