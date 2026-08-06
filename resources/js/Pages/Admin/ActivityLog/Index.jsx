import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, FileSpreadsheet, RotateCcw, RefreshCw } from 'lucide-react';
import useActivityLog from './Hooks/useActivityLog';
import ActivityLogStats from './Partials/ActivityLogStats';
import ActivityLogTable from './Partials/ActivityLogTable';
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
        actionFilter,
        setActionFilter,
        resourceFilter,
        setResourceFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        handleExport,
        fetchLogs,
        fetchStats,
    } = useActivityLog();

    const handleReset = () => {
        setSearch('');
        setActionFilter('');
        setResourceFilter('');
        setDateFrom('');
        setDateTo('');
    };

    const handleRefresh = () => {
        fetchLogs();
        fetchStats();
    };


    return (
        <AdminLayout title="Audit Trail Activity Log">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 4px' }}>
                
                {/* Title Banner */}
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Audit Trail Activity Log</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Pencatatan riwayat tindakan CRUD (Create, Update, Delete) yang dilakukan oleh administrator backoffice.
                    </p>
                </div>

                {/* Statistics Widget */}
                <ActivityLogStats stats={stats} />

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
                                    placeholder="Cari admin, deskripsi..."
                                    style={{ ...inputStyle, paddingLeft: '34px', width: '100%' }}
                                />
                            </div>

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
                                <option value="activate">ACTIVATE</option>
                                <option value="deactivate">DEACTIVATE</option>
                            </select>

                            {/* Resource Filter */}
                            <select
                                value={resourceFilter}
                                onChange={e => setResourceFilter(e.target.value)}
                                style={{ ...inputStyle, minWidth: '150px' }}
                            >
                                <option value="">Semua Resource</option>
                                <option value="User">User</option>
                                <option value="Company">Company</option>
                                <option value="Department">Department</option>
                                <option value="BusinessEntity">Business Entity</option>
                                <option value="Role">Role</option>
                                <option value="Permission">Permission Matrix</option>
                                <option value="AimsMenu">Menu</option>
                                <option value="AimsModule">Module</option>
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
                            {(search || actionFilter || resourceFilter || dateFrom || dateTo) && (
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
                    <ActivityLogTable logs={logs} loading={loading} />
                    
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
