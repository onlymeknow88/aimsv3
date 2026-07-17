import React from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import useMaster from './Hooks/useMaster';
import ModuleTable from './Partials/ModuleTable';
import CategoryTable from './Partials/CategoryTable';
import MappingTable from './Partials/MappingTable';
import DocumentSystemConfig from './Partials/DocumentSystemConfig';

export default function Index({ taxonomy = [] }) {
    const { activeTab } = useMaster();

    return (
        <DocumentSystemLayout>
            <Head title="Master Settings" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Master Configurations</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Kelola taxonomy dan konfigurasi modul K3LH.</p>
            </div>

            {activeTab === 'modules' && <ModuleTable taxonomy={taxonomy} />}
            {activeTab === 'categories' && <CategoryTable taxonomy={taxonomy} />}
            {activeTab === 'mappings' && <MappingTable taxonomy={taxonomy} />}
            {activeTab === 'config' && <DocumentSystemConfig />}
        </DocumentSystemLayout>
    );
}
