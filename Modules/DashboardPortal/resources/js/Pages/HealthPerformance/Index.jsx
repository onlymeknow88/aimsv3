import React from 'react';
import { Heart, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import DashboardPortalLayout from '../../Layouts/DashboardPortalLayout';
import useHealthPerformance from './Hooks/useHealthPerformance';
import HealthPerformanceTable from './Partials/HealthPerformanceTable';
import HealthPerformanceModal from './Partials/HealthPerformanceModal';
import DeleteConfirmModal from './Partials/DeleteConfirmModal';

const inputStyle = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' };

export default function Index() {
    const {
        records, loading, error, search, setSearch, page, setPage, limit, setLimit, pagination, fetchRecords,
        modalOpen, editId, form, setField, submitting, formError, openCreateModal, openEditModal, closeModal, handleSubmit,
        deleteTarget, deleting, deleteError, openDeleteModal, closeDeleteModal, confirmDelete,
        selectedIds, toggleSelectAll, toggleSelectOne, bulkDeleting, handleBulkDelete, toggleVisible,
    } = useHealthPerformance();

    return (
        <DashboardPortalLayout>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={18} color="#a855f7" />
                            </div>
                            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Health Performance</h1>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, paddingLeft: '46px' }}>Kelola data health performance bulanan (RKK, CMR, MMR, SSR, ASR)</p>
                    </div>
                    <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        <Plus size={15} /> Tambah Data
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari bulan..." style={{ ...inputStyle, paddingLeft: '32px' }} />
                        </div>
                        <button onClick={fetchRecords} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                        {selectedIds.length > 0 && (
                            <button onClick={handleBulkDelete} disabled={bulkDeleting} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#dc2626', cursor: bulkDeleting ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                                <Trash2 size={14} /> Hapus ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>

                <HealthPerformanceTable records={records} loading={loading} error={error} selectedIds={selectedIds} toggleSelectAll={toggleSelectAll} toggleSelectOne={toggleSelectOne} onEdit={openEditModal} onDelete={openDeleteModal} onToggleVisible={toggleVisible} pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
            </div>

            <HealthPerformanceModal isOpen={modalOpen} editId={editId} form={form} setField={setField} onSubmit={handleSubmit} onClose={closeModal} submitting={submitting} formError={formError} />
            <DeleteConfirmModal isOpen={!!deleteTarget} onClose={closeDeleteModal} onConfirm={confirmDelete} itemName={deleteTarget?.month?.substring(0, 7)} deleting={deleting} errorMessage={deleteError} title="Hapus Health Performance" />
        </DashboardPortalLayout>
    );
}
