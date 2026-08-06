import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, FileSpreadsheet, RotateCcw, RefreshCw } from 'lucide-react';
import useUserActivityLog from './Hooks/useUserActivityLog';
import UserActivityLogStats from './Partials/UserActivityLogStats';
import UserActivityLogTable from './Partials/UserActivityLogTable';
import TablePagination from '@/Components/TablePagination';

const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

const inputStyle = {
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#fff',
    height: '40px',
    boxSizing: 'border-box',
};

export default function Index() {
    const {
        logs,
        stats,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        search,
        setSearch,
        moduleFilter,
        setModuleFilter,
        actionFilter,
        setActionFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        handleExport,
        fetchLogs,
        fetchStats,
    } = useUserActivityLog();

    const handleReset = () => {
        setSearch('');
        setModuleFilter('');
        setActionFilter('');
        setDateFrom('');
        setDateTo('');
    };

    const handleRefresh = () => {
        fetchLogs();
        fetchStats();
    };


    return (
        <AdminLayout title="User Activity Log">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 4px' }}>
                
                {/* Title Banner */}
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>User Activity Log</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Pencatatan riwayat perubahan data dan aktivitas operasional yang dilakukan oleh pengguna (user biasa) pada modul fungsional.
                    </p>
                </div>

                {/* Statistics Widget */}
                <UserActivityLogStats stats={stats} />

                {/* Filters Bar */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: '1' }}>
                            {/* Search Input */}
                            <div style={{ position: 'relative', minWidth: '220px' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari user, deskripsi..."
                                    style={{ ...inputStyle, paddingLeft: '34px', width: '100%' }}
                                />
                            </div>

                            {/* Module Filter */}
                            <select
                                value={moduleFilter}
                                onChange={e => setModuleFilter(e.target.value)}
                                style={{ ...inputStyle, minWidth: '160px' }}
                            >
                                <option value="">Semua Modul</option>
                                <option value="coe">COE</option>
                                <option value="document_system">Document System</option>
                                <option value="dashboard_portal">Dashboard Portal</option>
                            </select>

                            {/* Action Filter */}
                            <select
                                value={actionFilter}
                                onChange={e => setActionFilter(e.target.value)}
                                style={{ ...inputStyle, minWidth: '130px' }}
                            >
                                <option value="">Semua Aksi</option>
                                <option value="create">CREATE (Buat)</option>
                                <option value="update">UPDATE (Ubah)</option>
                                <option value="delete">DELETE (Hapus)</option>
                                <option value="submit">SUBMIT</option>
                                <option value="approve">APPROVE</option>
                                <option value="reject">REJECT</option>
                            </select>

                            {/* Date Pickers */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={e => setDateFrom(e.target.value)}
                                    style={{ ...inputStyle, width: '140px' }}
                                    placeholder="Mulai"
                                />
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>s/d</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={e => setDateTo(e.target.value)}
                                    style={{ ...inputStyle, width: '140px' }}
                                    placeholder="Akhir"
                                />
                            </div>

                            {/* Reset Button */}
                            {(search || moduleFilter || actionFilter || dateFrom || dateTo) && (
                                <button
                                    onClick={handleReset}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '0 16px',
                                        height: '40px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        backgroundColor: '#f8fafc',
                                        color: '#64748b',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <RotateCcw size={13} /> Reset Filter
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    height: '40px',
                                    padding: '0 16px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    color: '#334155',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                            </button>

                            {/* Export Button */}
                            <button
                                onClick={handleExport}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    height: '40px',
                                    padding: '0 18px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: '#10b981',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                <FileSpreadsheet size={15} /> Export Excel/CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table & Pagination Wrapper */}
                <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                    <UserActivityLogTable logs={logs} loading={loading} />
                    
                    {pagination && pagination.last_page > 1 && (
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
                            <TablePagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
