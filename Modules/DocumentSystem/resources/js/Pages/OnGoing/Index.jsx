import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { FileText, Clock } from 'lucide-react';
import useOnGoing from './Hooks/useOnGoing';
import OnGoingTable from './Partials/OnGoingTable';
import ReviewDetailDrawer from './Partials/ReviewDetailDrawer';

export default function Index({ documents = [] }) {
    const { drawerOpen, selectedDoc, openDrawer, closeDrawer } = useOnGoing();

    return (
        <DocumentSystemLayout>
            <Head title="Ongoing Workflows" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Ongoing Workflows</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen yang sedang dalam proses review dan persetujuan.</p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <OnGoingTable documents={documents} onViewDetail={openDrawer} />
            </div>

            <ReviewDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} />
        </DocumentSystemLayout>
    );
}


