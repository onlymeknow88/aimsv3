import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, FileSpreadsheet, RotateCcw, RefreshCw } from 'lucide-react';
import useLoginLog from './Hooks/useLoginLog';
import LoginLogStats from './Partials/LoginLogStats';
import LoginLogTable from './Partials/LoginLogTable';
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
        eventFilter,
        setEventFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        handleExport,
        fetchLogs,
        fetchStats,
    } = useLoginLog();

    const handleReset = () => {
        setSearch('');
        setEventFilter('');
        setDateFrom('');
        setDateTo('');
    };

    const handleRefresh = () => {
        fetchLogs();
        fetchStats();
    };


    return (
        <AdminLayout title="Audit Trail Login Log">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 4px' }}>
                
                {/* Title Banner */}
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Audit Trail Login Log</h1>
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        Pencatatan riwayat autentikasi login, logout, dan aktivitas percobaan akses administrator backoffice.
                    </p>
                </div>

                {/* Statistics Widget */}
                <LoginLogStats stats={stats} />

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
                                    placeholder="Cari email, nama, IP..."
                                    style={{ ...inputStyle, paddingLeft: '34px', width: '100%' }}
                                />
                            </div>

                            {/* Event Type Filter */}
                            <select
                                value={eventFilter}
                                onChange={e => setEventFilter(e.target.value)}
                                style={{ ...inputStyle, minWidth: '160px' }}
                            >
                                <option value="">Semua Aktivitas</option>
                                <option value="login_success">Login Sukses</option>
                                <option value="login_failed">Login Gagal</option>
                                <option value="logout">Logout</option>
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
                            {(search || eventFilter || dateFrom || dateTo) && (
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
                                    boxShadow: '0 2px 8px rgba(16,185,129,0.15)',
                                }}
                            >
                                <FileSpreadsheet size={15} /> Export CSV
                            </button>
                        </div>

                    </div>
                </div>

                {/* Table & Pagination Grid */}
                <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                    
                    {/* Table Render */}
                    <LoginLogTable logs={logs} loading={loading} />

                    {/* Pagination control */}
                    {pagination && (
                        <TablePagination
                            pagination={pagination}
                            onPageChange={setPage}
                            limit={limit}
                            onLimitChange={setLimit}
                        />
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}
