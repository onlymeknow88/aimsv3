import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DocumentSystemLayout from '@DS/Layouts/DocumentSystemLayout';
import { FileText, Clock, Search, SlidersHorizontal } from 'lucide-react';
import useOnGoing from './Hooks/useOnGoing';
import OnGoingTable from './Partials/OnGoingTable';
import ReviewDetailDrawer from './Partials/ReviewDetailDrawer';
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
        drawerOpen, 
        selectedDoc, 
        openDrawer, 
        closeDrawer 
    } = useOnGoing();

    const [visibleColumns, setVisibleColumns] = useState({
        'Company': true,
        'Department': true,
        'PIC': true,
        'Modul': true,
        'Category': true,
        'Level': true,
        'Mapping': true,
        'No. Dokumen': true,
        'Judul': true,
        'Status': true,
        'Aksi': true
    });

    const toggleColumn = (col) => {
        setVisibleColumns(prev => ({
            ...prev,
            [col]: !prev[col]
        }));
    };

    const filtered = docs.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.document_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DocumentSystemLayout>
            <Head title="Ongoing Workflows" />

            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Ongoing Workflows</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>Daftar dokumen yang sedang dalam proses review dan persetujuan.</p>
            </div>

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
                        <DropdownMenuTrigger asChild>
                            <button style={{
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
                            </button>
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
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <OnGoingTable 
                    documents={filtered} 
                    onViewDetail={openDrawer} 
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    visibleColumns={visibleColumns}
                    loading={loading}
                />
            </div>

            <ReviewDetailDrawer doc={selectedDoc} open={drawerOpen} onClose={closeDrawer} />
        </DocumentSystemLayout>
    );
}


