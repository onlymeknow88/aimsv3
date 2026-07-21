import React from 'react';
import { Head } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import useSettings from './Hooks/useSettings';
import SettingsForm from './Partials/SettingsForm';

export default function Index({ params: serverParams }) {
    const {
        form,
        setFieldValue,
        saving,
        fetching,
        saved,
        errors,
        handleSubmit,
    } = useSettings(serverParams);

    return (
        <FieldLeadershipLayout>
            <Head title="Pengaturan — Field Leadership" />

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Settings size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                        Pengaturan Parameter
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                    Konfigurasi batas maksimum item untuk form observasi Field Leadership.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <SettingsForm
                    form={form}
                    setFieldValue={setFieldValue}
                    onSubmit={handleSubmit}
                    saving={saving}
                    saved={saved}
                    fetching={fetching}
                    errors={errors}
                />
            </div>
        </FieldLeadershipLayout>
    );
}
