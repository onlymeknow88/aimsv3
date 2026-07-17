import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { FileText, Clock, Search } from 'lucide-react';
import useOnGoing from './Hooks/useOnGoing';
import OnGoingTable from './Partials/OnGoingTable';
import ReviewDetailDrawer from './Partials/ReviewDetailDrawer';

export default function Index() {
    const { 
        search,
        setSearch,
        docs,
        loading,
        selectedIds,
        setSelectedIds,
        drawerOpen, 
        selectedDoc, 
        openDrawer, 
        closeDrawer 
    } = useOnGoing();

    const filtered = docs.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.document_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Ongoing Workflows" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Ongoing Workflows</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen yang sedang dalam proses review dan persetujuan.</p>
            </div>

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

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '11px' }}>
                        Memuat data alur persetujuan...
                    </div>
                ) : (
                    <OnGoingTable 
                        documents={filtered} 
                        onViewDetail={openDrawer} 
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                    />
                )}
            </div>

            <ReviewDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} />
        </DocumentSystemLayout>
    );
}


