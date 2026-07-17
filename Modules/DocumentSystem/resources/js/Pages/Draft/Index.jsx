import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { AlertCircle } from 'lucide-react';
import useDraft from './Hooks/useDraft';
import DraftTable from './Partials/DraftTable';

export default function Index({ documents = [] }) {
    const { search, setSearch } = useDraft();

    const filtered = documents.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Draft Documents" />
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Draft Documents</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar draf dokumen yang belum diajukan ke alur review.</p>
            </div>
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <DraftTable documents={filtered} />
            </div>
        </DocumentSystemLayout>
    );
}


