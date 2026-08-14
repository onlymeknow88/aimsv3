import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useAimsLegacy from './Hooks/useAimsLegacy';
import AimsLegacyTable from './Partials/AimsLegacyTable';
import { Database } from 'lucide-react';

export default function Index() {
    const {
        docs,
        loading,
        error,
        columnFilters,
        setColumnFilters,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
    } = useAimsLegacy();

    return (
        <DocumentSystemLayout>
            <Head title="AIMS Lama — Document System" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Database size={18} style={{ color: 'var(--primary)' }} />
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>AIMS Lama</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                        Data dokumen kebijakan dan standardisasi yang bersumber dari database SQL Server legacy AIMS.
                    </p>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '12px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <AimsLegacyTable
                data={docs}
                loading={loading}
                columnFilters={columnFilters}
                onColumnFilterChange={setColumnFilters}
                page={page}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                pagination={pagination}
            />
        </DocumentSystemLayout>
    );
}
