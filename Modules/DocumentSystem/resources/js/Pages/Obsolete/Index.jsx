import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useObsolete from './Hooks/useObsolete';
import ObsoleteTable from './Partials/ObsoleteTable';

export default function Index({ documents = [] }) {
    const { search, setSearch } = useObsolete();

    const filtered = documents.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Obsolete Archive" />
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Obsolete Archive</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Arsip berkas dokumen lama yang sudah tidak berlaku.</p>
            </div>
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <ObsoleteTable documents={filtered} />
            </div>
        </DocumentSystemLayout>
    );
}


