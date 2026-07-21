import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Search, Plus, Trash2, X, SlidersHorizontal, ClipboardList } from 'lucide-react';
import FieldLeadershipLayout from '@FLS/Layouts/FieldLeadershipLayout';
import useObservations from './Hooks/useObservations';
import ObservationsTable from './Partials/ObservationsTable';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const TYPE_LABELS = {
    'Planned Task Observation': 'PTO',
    'Take Time Talk': 'TTT',
    'Hazard Report': 'HR',
};

const STATUS_OPTIONS = [
    'Open', 'On Review PICA', 'On Review PJA', 'On Review Approval', 'Overdue', 'Closed',
];

export default function Index({ defaultType = '' }) {
    const {
        docs, loading,
        search, setSearch,
        page, setPage,
        limit, setLimit,
        pagination,
        selectedIds, setSelectedIds,
        columnFilters, setColumnFilters,
        handleDelete,
        openDrawer,
    } = useObservations(defaultType);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth <= 768);
        fn(); window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const [visibleColumns, setVisibleColumns] = useState({
        'Tanggal': true, 'Tipe': true, 'Company': true,
        'Departemen': true, 'Pekerjaan': true, 'Dibuat Oleh': true,
        'Status': true, 'Aksi': true,
    });
    const toggleColumn = col => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));

    const btnStyle = {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        backgroundColor: '#fff', border: '1px solid var(--border-color)',
        borderRadius: '6px', padding: '8px 12px',
        fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
    };

    const pageTitle = defaultType ? `Observasi — ${TYPE_LABELS[defaultType] ?? defaultType}` : 'Semua Observasi';

    return (
        <FieldLeadershipLayout>
            <Head title={pageTitle} />

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{pageTitle}</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
                    Daftar observasi Field Leadership — PTO, TTT, dan Hazard Report.
                </p>
            </div>

            {/* Filter bar — type & status */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <select
                    value={columnFilters.type}
                    onChange={e => setColumnFilters(prev => ({ ...prev, type: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="">Semua Tipe</option>
                    <option value="Planned Task Observation">PTO</option>
                    <option value="Take Time Talk">TTT</option>
                    <option value="Hazard Report">Hazard Report</option>
                </select>

                <select
                    value={columnFilters.status}
                    onChange={e => setColumnFilters(prev => ({ ...prev, status: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="">Semua Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <input type="date" value={columnFilters.date_from}
                    onChange={e => setColumnFilters(prev => ({ ...prev, date_from: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                />
                <input type="date" value={columnFilters.date_to}
                    onChange={e => setColumnFilters(prev => ({ ...prev, date_to: e.target.value }))}
                    style={{ padding: '7px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                />
            </div>

            {/* Toolbar */}
            {selectedIds.length > 0 ? (
                <div style={{
                    display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(21,59,115,0.05)', border: '1px solid rgba(21,59,115,0.15)',
                    borderRadius: '8px', padding: '10px 16px', marginBottom: '20px', gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {selectedIds.length} Row Selected
                        </span>
                        <button onClick={() => setSelectedIds([])}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                            <X size={14} />
                        </button>
                    </div>
                    <button onClick={handleDelete} style={{ ...btnStyle, backgroundColor: 'var(--danger)', color: '#fff', border: 'none' }}>
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari pekerjaan, lokasi, pembuat..."
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <DropdownMenu>
                            <DropdownMenuTrigger style={btnStyle}>
                                <SlidersHorizontal size={14} /> Columns
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md p-1">
                                <DropdownMenuLabel style={{ padding: '8px 12px' }}>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.keys(visibleColumns).map(col => (
                                    <DropdownMenuCheckboxItem key={col} checked={visibleColumns[col]}
                                        onCheckedChange={() => toggleColumn(col)}
                                        style={{ padding: '8px 12px', cursor: 'pointer' }}>
                                        {col}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <a href="/field-leadership/observations/create"
                            style={{ ...btnStyle, backgroundColor: 'var(--primary)', color: '#fff', border: 'none', textDecoration: 'none' }}>
                            <Plus size={14} /> Buat Observasi
                        </a>
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <ObservationsTable
                    documents={docs}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    visibleColumns={visibleColumns}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={setLimit}
                    columnFilters={columnFilters}
                    onColumnFilterChange={(colId, val) => setColumnFilters(prev => ({ ...prev, [colId]: val }))}
                    onView={openDrawer}
                />
            </div>
        </FieldLeadershipLayout>
    );
}
