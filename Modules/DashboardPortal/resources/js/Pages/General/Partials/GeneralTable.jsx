import React from 'react';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Search, RefreshCw, Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardPortalLayout from '../../../Layouts/DashboardPortalLayout';
import TablePagination from '@/Components/TablePagination';
import ConfirmationModal from '@/Components/ConfirmationModal';
import useGeneral from '../Hooks/useGeneral';
import GeneralModal from './GeneralModal';

const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
};

const TrendBadge = ({ mark }) => {
    const isUp = mark === 'UP';
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: isUp ? '#f0fdf4' : '#fef2f2',
            color: isUp ? '#16a34a' : '#dc2626',
            border: `1px solid ${isUp ? '#bbf7d0' : '#fecaca'}`,
        }}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {mark || '-'}
        </span>
    );
};

export default function GeneralTable() {
    const {
        generals,
        loading,
        error,
        search,
        setSearch,
        fetchGenerals,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        modalOpen,
        editId,
        form,
        setField,
        submitting,
        formError,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        deleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
    } = useGeneral();

    return (
        <DashboardPortalLayout>
            <Head title="General - Dashboard Portal" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                    Data General KPI
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
                    Kelola indikator KPI utama keselamatan — Project to Date, Manhours, Day After Last LTI, dan Manpower.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                {/* Header / Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Safety Performance Indicators</h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari data..."
                                style={{ ...inputStyle, paddingLeft: '34px', width: '200px' }}
                            />
                        </div>

                        <button
                            onClick={fetchGenerals}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '9px 14px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                color: '#475569',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        <button
                            onClick={openCreateModal}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'linear-gradient(135deg, #1d4ed8, #153B73)',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 3px 10px rgba(21,59,115,0.25)',
                            }}
                        >
                            <Plus size={16} /> Tambah Data
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                {/* Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHeader>
                                <TableRow style={{ backgroundColor: '#f8fafc' }}>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Project to Date</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Manhours</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Day After Last LTI</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Manpower</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px' }}>Updated By</TableHead>
                                    <TableHead style={{ fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', padding: '14px 16px', textAlign: 'center', width: '100px' }}>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Memuat data general KPI...
                                        </TableCell>
                                    </TableRow>
                                ) : generals.length > 0 ? (
                                    generals.map(item => (
                                        <TableRow key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                                                    {item.project_to_date ?? '-'}
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>Hari</span>
                                                </div>
                                                <div style={{ marginTop: '4px' }}>
                                                    <TrendBadge mark={item.project_to_date_mark} />
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                                                    {item.manhours?.toLocaleString('id-ID') ?? '-'}
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>Jam</span>
                                                </div>
                                                <div style={{ marginTop: '4px' }}>
                                                    <TrendBadge mark={item.manhours_mark} />
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                                                    {item.day_after_last_lti ?? '-'}
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>Hari</span>
                                                </div>
                                                <div style={{ marginTop: '4px' }}>
                                                    <TrendBadge mark={item.day_after_last_lti_mark} />
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                                                    {item.manpower?.toLocaleString('id-ID') ?? '-'}
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>Orang</span>
                                                </div>
                                                <div style={{ marginTop: '4px' }}>
                                                    <TrendBadge mark={item.manpower_mark} />
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>
                                                {item.user?.name || '-'}
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(item)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                                            Belum ada data general KPI.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <TablePagination
                        pagination={pagination}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={setLimit}
                    />
                </div>

                {/* Form Create/Edit Modal */}
                <GeneralModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editId={editId}
                    form={form}
                    setField={setField}
                    submitting={submitting}
                    formError={formError}
                />

                {/* Delete Confirm Modal */}
                <ConfirmationModal
                    isOpen={!!deleteTarget}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title="Hapus Data General KPI"
                    description={`Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    isDestructive={true}
                    isLoading={deleting}
                />
            </div>
        </DashboardPortalLayout>
    );
}