import React from 'react';
import { Head } from '@inertiajs/react';
import { Database } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

import LimitParameterTable from './Partials/LimitParameterTable';
import KtaTtaTable from './Partials/KtaTtaTable';
import PotencyTable from './Partials/PotencyTable';
import CategoryTable from './Partials/CategoryTable';

import useMaster from './Hooks/useMaster';

const TABS = ['limit-parameter', 'jenis-kta-tta', 'potensi-konsekuensi', 'kategori'];
const TAB_LABELS = {
    'limit-parameter': 'Limit Parameter',
    'jenis-kta-tta': 'Jenis KTA / TTA',
    'potensi-konsekuensi': 'Potensi Konsekuensi',
    'kategori': 'Kategori'
};

export default function Index() {
    const {
        activeTab,
        setActiveTab,
        limitParams,
        ktaTta,
        potency,
        category,
        loading,
        pendingDelete,
        setPendingDelete,
        deleting,
        saveLimitParam,
        saveKtaTta,
        deleteKtaTta,
        confirmDeleteKtaTta,
        savePotency,
        deletePotency,
        confirmDeletePotency,
        saveCategory,
        deleteCategory,
        confirmDeleteCategory,
    } = useMaster();

    return (
        <FieldLeadershipLayout>
            <Head title="Master Library — Field Leadership" />

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Database size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Master Library</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>Kelola data referensi &amp; parameter modul Field Leadership.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid var(--border-color)', paddingBottom: '0' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ padding: '10px 20px', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: '-2px', backgroundColor: 'transparent', fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', borderRadius: '6px 6px 0 0', transition: 'all 0.2s ease' }}>
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            {activeTab === 'limit-parameter' && (
                <LimitParameterTable data={limitParams} loading={loading} onSave={saveLimitParam} />
            )}

            {activeTab === 'jenis-kta-tta' && (
                <KtaTtaTable data={ktaTta} loading={loading} onSave={saveKtaTta} onDelete={deleteKtaTta} />
            )}

            {activeTab === 'potensi-konsekuensi' && (
                <PotencyTable data={potency} loading={loading} onSave={savePotency} onDelete={deletePotency} />
            )}

            {activeTab === 'kategori' && (
                <CategoryTable data={category} loading={loading} onSave={saveCategory} onDelete={deleteCategory} />
            )}

            <DeleteConfirmModal
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={
                    pendingDelete?.type === 'kta-tta' ? confirmDeleteKtaTta :
                    pendingDelete?.type === 'potency' ? confirmDeletePotency :
                    confirmDeleteCategory
                }
                deleting={deleting}
                title={`Hapus ${pendingDelete?.label ?? 'Data'}`}
                description={`Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`}
            />
        </FieldLeadershipLayout>
    );
}
