import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { ShieldAlert } from 'lucide-react';
import useJsa from './Hooks/useJsa';

import JsaTable from './Partials/JsaTable';

export default function Index() {
    const { formModalOpen, drawerOpen, selectedJsa, loading, openForm, closeForm, openDrawer, closeDrawer, createJsa, docs, fetching } = useJsa();

    return (
        <DocumentSystemLayout>
            <Head title="Job Safety Analysis" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Job Safety Analysis (JSA)</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Analisis bahaya dan tindakan keselamatan kerja.</p>
                </div>
                <button onClick={() => window.location.href = '/document-system/jsa/create'} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    + Buat JSA
                </button>
            </div>


            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <JsaTable documents={docs} onOpenDrawer={openDrawer} loading={fetching} />
            </div>


        </DocumentSystemLayout>
    );
}


