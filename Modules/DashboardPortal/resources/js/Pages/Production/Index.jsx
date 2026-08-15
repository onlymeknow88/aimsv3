import React from 'react';
import { BarChart2, Plus, RefreshCw, Search, Trash2, Eye } from 'lucide-react';
import DashboardPortalLayout from '../../Layouts/DashboardPortalLayout';
import useProduction from './Hooks/useProduction';
import ProductionTable from './Partials/ProductionTable';
import ProductionModal from './Partials/ProductionModal';
import DeleteConfirmModal from './Partials/DeleteConfirmModal';

const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '13px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#fff',
    transition: 'border-color 0.15s',
};

export default function Index() {
    const {
        productions, loading, error,
        search, setSearch, page, setPage, limit, setLimit, pagination,
        fetchProductions,
        modalOpen, editId, form, setField, submitting, formError,
        openCreateModal, openEditModal, closeModal, handleSubmit,
        deleteTarget, deleting, deleteError,
        openDeleteModal, closeDeleteModal, confirmDelete,
        selectedIds, toggleSelectAll, toggleSelectOne,
        bulkDeleting, handleBulkDelete,
        toggleVisible, handleBulkToggleVisible,
    } = useProduction();

    const hasBulkSelection = selectedIds.length > 0;

    return (
        <DashboardPortalLayout>
            <div style={{ margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BarChart2 size={18} color="#2563eb" />
                            </div>
                            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Production</h1>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, paddingLeft: '46px' }}>
                            Kelola data produksi bulanan
                        </p>
                    </div>
                    <button onClick={openCreateModal}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        <Plus size={15} /> Tambah Data
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text" value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari bulan..."
                                style={{ ...inputStyle, paddingLeft: '32px' }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <button onClick={fetchProductions}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                            <RefreshCw size={14} /> Refresh
                        </button>

                        {hasBulkSelection && (
                            <>
                                <button onClick={handleBulkToggleVisible}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#16a34a', cursor: 'pointer', fontWeight: 600 }}>
                                    <Eye size={14} /> Toggle Visible ({selectedIds.length})
                                </button>
                                <button onClick={handleBulkDelete} disabled={bulkDeleting}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#dc2626', cursor: bulkDeleting ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: bulkDeleting ? 0.6 : 1 }}>
                                    <Trash2 size={14} /> Hapus ({selectedIds.length})
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Table */}
                <ProductionTable
                    productions={productions}
                    loading={loading}
                    error={error}
                    selectedIds={selectedIds}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelectOne={toggleSelectOne}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onToggleVisible={toggleVisible}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>

            <ProductionModal
                isOpen={modalOpen}
                editId={editId}
                form={form}
                setField={setField}
                onSubmit={handleSubmit}
                onClose={closeModal}
                submitting={submitting}
                formError={formError}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={deleteTarget?.month_label ?? deleteTarget?.month?.substring(0, 7)}
                deleting={deleting}
                errorMessage={deleteError}
            />
        </DashboardPortalLayout>
    );
}
