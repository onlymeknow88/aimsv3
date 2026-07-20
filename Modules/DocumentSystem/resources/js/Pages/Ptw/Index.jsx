import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import usePtw from './Hooks/usePtw';
import PtwTable from './Partials/PtwTable';

export default function Index() {
    const { 
        docs, 
        fetching,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        columnFilters,
        setColumnFilters
    } = usePtw();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <DocumentSystemLayout>
            <Head title="Permit to Work" />
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '16px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Permit to Work (PTW)</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Surat Izin Kerja Aman berisiko tinggi.</p>
                </div>
                <button onClick={() => window.location.href = '/document-system/ptw/create'} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    + Ajukan PTW
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <PtwTable 
                    documents={docs} 
                    loading={fetching}
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={setLimit}
                    columnFilters={columnFilters}
                    onColumnFilterChange={(colId, val) => setColumnFilters(prev => ({ ...prev, [colId]: val }))}
                />
            </div>
        </DocumentSystemLayout>
    );
}


