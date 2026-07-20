import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useJsa from './Hooks/useJsa';
import JsaTable from './Partials/JsaTable';

export default function Index({ isObsolete = false, isDraft = false }) {
    const { 
        docs, 
        fetching, 
        openDrawer, 
        deleteJsa,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        columnFilters,
        setColumnFilters
    } = useJsa(isObsolete, isDraft);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPageTitle = () => {
        if (isObsolete) return "Obsolete JSA Archive";
        if (isDraft) return "Draft Job Safety Analysis";
        return "Job Safety Analysis";
    };

    const getHeadingText = () => {
        if (isObsolete) return "Obsolete JSA Archive";
        if (isDraft) return "Draft Job Safety Analysis (JSA)";
        return "Job Safety Analysis (JSA)";
    };

    const getDescriptionText = () => {
        if (isObsolete) return "Arsip berkas JSA lama yang sudah tidak berlaku.";
        if (isDraft) return "Daftar draf analisis bahaya yang sedang dikerjakan.";
        return "Semua dokumen JSA aktif, termasuk yang sedang dalam proses review.";
    };

    return (
        <DocumentSystemLayout>
            <Head title={getPageTitle()} />
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                gap: isMobile ? '12px' : '16px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                        {getHeadingText()}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
                        {getDescriptionText()}
                    </p>
                </div>
                {!isObsolete && !isDraft && (
                    <button
                        onClick={() => window.location.href = '/document-system/jsa/create'}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                        + Buat JSA
                    </button>
                )}
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <JsaTable 
                    documents={docs} 
                    onOpenDrawer={openDrawer} 
                    onDelete={deleteJsa} 
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
