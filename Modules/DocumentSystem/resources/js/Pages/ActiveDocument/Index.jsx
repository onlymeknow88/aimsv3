import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { Search, FileText, Plus, Edit, Trash2, X, SlidersHorizontal } from 'lucide-react';
import useActiveDocument from './Hooks/useActiveDocument';
import DocumentTable from './Partials/DocumentTable';
import DocumentPreviewModal from './Partials/DocumentPreviewModal';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export default function Index() {
    const { 
        search, 
        setSearch, 
        docs, 
        loading, 
        selectedIds, 
        setSelectedIds, 
        previewDoc, 
        openPreview, 
        closePreview, 
        downloadFile,
        handleEdit,
        handleDelete,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        columnFilters,
        setColumnFilters,
    } = useActiveDocument();

    const [visibleColumns, setVisibleColumns] = useState({
        'No. Dokumen': true,
        'Company': true,
        'Department': true,
        'PIC': true,
        'Modul': true,
        'Category': true,
        'Level': true,
        'Mapping': true,
        'Judul Dokumen': true,
        'Rev': true,
        'Status': true,
        'Aksi': true
    });

    const toggleColumn = (col) => {
        setVisibleColumns(prev => ({
            ...prev,
            [col]: !prev[col]
        }));
    };

    const filtered = docs;

    return (
        <DocumentSystemLayout>
            <Head title="Active Document" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Active Document</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen keselamatan kerja dan operasional yang telah aktif.</p>
            </div>

            {selectedIds.length > 0 ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(21, 59, 115, 0.05)',
                    border: '1px solid rgba(21, 59, 115, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    marginBottom: '20px',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {selectedIds.length} Row Selected
                        </span>
                        <button 
                            onClick={() => setSelectedIds([])}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                            title="Clear Selection"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {selectedIds.length === 1 && (
                            <button 
                                onClick={handleEdit}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Edit size={12} /> Edit
                            </button>
                        )}
                        <button 
                            onClick={handleDelete}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'var(--danger)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    gap: '16px'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari judul atau nomor dokumen..."
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <DropdownMenu>
                        <DropdownMenuTrigger style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}>
                                    <SlidersHorizontal size={14} /> Columns
                                </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md p-1">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-xs font-bold text-gray-500" style={{ padding: '8px 12px' }}>Toggle Columns</DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
                                {Object.keys(visibleColumns).map(col => (
                                    <DropdownMenuCheckboxItem
                                        key={col}
                                        checked={visibleColumns[col]}
                                        onCheckedChange={() => toggleColumn(col)}
                                        className="text-xs text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                                    >
                                        {col}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <a 
                            href="/document-system/active/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                        >
                            <Plus size={14} /> Create Document
                        </a>
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <DocumentTable
                    documents={filtered}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    visibleColumns={visibleColumns}
                    loading={loading}
                    pagination={pagination}
                    limit={limit}
                    onLimitChange={setLimit}
                    onPageChange={setPage}
                    columnFilters={columnFilters}
                    onColumnFilterChange={(colId, val) => setColumnFilters(prev => ({ ...prev, [colId]: val }))}

                />
            </div>

            <DocumentPreviewModal
                doc={previewDoc}
                onClose={closePreview}
                onDownload={(doc) => downloadFile(doc.attachments?.[0]?.id, doc.title)}
            />
        </DocumentSystemLayout>
    );
}


