import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { Search, FileText } from 'lucide-react';
import useActiveDocument from './Hooks/useActiveDocument';
import DocumentTable from './Partials/DocumentTable';
import DocumentPreviewModal from './Partials/DocumentPreviewModal';

export default function Index({ documents = [] }) {
    const [search, setSearch] = useState('');
    const { previewDoc, openPreview, closePreview, downloadFile } = useActiveDocument();

    const filtered = documents.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.document_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Active Documents" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Active Documents</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen aktif yang dapat diunduh dan digunakan.</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative', maxWidth: '320px' }}>
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
                <DocumentTable
                    documents={filtered}
                    onPreview={openPreview}
                    onDownload={(doc) => downloadFile(doc.attachments?.[0]?.id, doc.title)}
                />
            </div>

            <DocumentPreviewModal
                doc={previewDoc}
                onClose={closePreview}
                onDownload={(doc) => downloadFile(doc.attachments?.[0]?.id, doc.title)}
            />
        </DocumentSystemLayout>
    );
}


