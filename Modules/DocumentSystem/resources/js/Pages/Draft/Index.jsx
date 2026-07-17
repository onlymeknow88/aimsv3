import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { AlertCircle, Search, Plus } from 'lucide-react';
import useDraft from './Hooks/useDraft';
import DraftTable from './Partials/DraftTable';

export default function Index({ documents = [] }) {
    const { search, setSearch } = useDraft();

    const filtered = documents.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.document_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Draft Document" />
            
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Draft Document</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar draf dokumen yang belum diajukan ke alur review.</p>
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

                <a 
                    href="/document-system/active/create"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}
                >
                    <Plus size={14} /> Create Document
                </a>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <DraftTable documents={filtered} />
            </div>
        </DocumentSystemLayout>
    );
}


