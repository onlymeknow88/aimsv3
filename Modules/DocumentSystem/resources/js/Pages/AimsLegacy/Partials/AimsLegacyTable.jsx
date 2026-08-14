import React, { useMemo, useState } from 'react';
import { Download, Loader2, Eye } from 'lucide-react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DebouncedInput } from "@/lib/utils";
import TablePagination from "@/Components/TablePagination";
import AimsLegacyPreviewModal from './AimsLegacyPreviewModal';

export default function AimsLegacyTable({
    data = [],
    loading,
    columnFilters,
    onColumnFilterChange,
    page,
    onPageChange,
    limit,
    onLimitChange,
    pagination
}) {
    const [downloadingId, setDownloadingId] = useState(null);

    // Preview modal states
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewLoadingId, setPreviewLoadingId] = useState(null);

    const handleDownload = async (id, fallbackName) => {
        setDownloadingId(id);
        try {
            const res = await axios.get(`/api/document-system/aims-legacy/file/${id}`);
            const metaStatus = res.data?.meta?.status;
            if ((metaStatus === 'success' || res.data?.success) && res.data?.result) {
                const { FileName, FileType, FileBase } = res.data.result;

                const base64Content = FileBase.includes(',') ? FileBase.split(',')[1] : FileBase;

                const byteCharacters = atob(base64Content.trim());
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                let mime = 'application/octet-stream';
                if (FileType && FileType.toLowerCase() === 'pdf') {
                    mime = 'application/pdf';
                } else if (FileType && FileType.includes('/')) {
                    mime = FileType;
                }

                const blob = new Blob([byteArray], { type: mime });

                let finalName = FileName || fallbackName || 'document';
                if (mime === 'application/pdf' && !finalName.toLowerCase().endsWith('.pdf')) {
                    finalName += '.pdf';
                }

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = finalName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert(res.data?.meta?.message || 'Gagal mengunduh file.');
            }
        } catch (err) {
            console.error('Download error', err);
            alert('Gagal mendekode berkas: ' + (err.message || 'Format base64 tidak valid.'));
        } finally {
            setDownloadingId(null);
        }
    };

    const handlePreview = async (id) => {
        setPreviewLoadingId(id);
        try {
            const res = await axios.get(`/api/document-system/aims-legacy/file/${id}`);
            const metaStatus = res.data?.meta?.status;
            if ((metaStatus === 'success' || res.data?.success) && res.data?.result) {
                setPreviewDoc(res.data.result);
                setPreviewOpen(true);
            } else {
                alert(res.data?.meta?.message || 'Gagal memuat file.');
            }
        } catch (err) {
            console.error('Preview error', err);
            alert('Gagal memuat file: ' + (err.message || 'Terjadi kesalahan.'));
        } finally {
            setPreviewLoadingId(null);
        }
    };

    const columns = useMemo(() => [
        { accessorKey: 'ModulCode', header: 'Kode Modul' },
        { accessorKey: 'Modul', header: 'Modul' },
        { accessorKey: 'CompanyCode', header: 'Kode Company' },
        { accessorKey: 'Company', header: 'Company' },
        { accessorKey: 'Category', header: 'Kategori' },
        { accessorKey: 'Mapping', header: 'Mapping' },
        { accessorKey: 'Description', header: 'Deskripsi' },
        { accessorKey: 'CreatedBy', header: 'Dibuat Oleh' },
        {
            accessorKey: 'Created',
            header: 'Tanggal Dibuat',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const id = row.original.Id || row.original.id;
                const isDownloading = downloadingId === id;
                const isPreviewLoading = previewLoadingId === id;
                return (
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                            onClick={() => handlePreview(id)}
                            disabled={isPreviewLoading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: '#009ef9',
                                color: 'white',
                                cursor: isPreviewLoading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isPreviewLoading ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <></>
                                // <Eye size={12} />
                            )}
                            {isPreviewLoading ? 'Loading...' : 'Preview'}
                        </button>

                        <button
                            onClick={() => handleDownload(id, row.original.Description)}
                            disabled={isDownloading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: '#fff',
                                color: 'var(--text-primary)',
                                cursor: isDownloading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isDownloading ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Download size={12} />
                            )}
                            {isDownloading ? 'Loading...' : 'Download'}
                        </button>
                    </div>
                );
            }
        }
    ], [downloadingId, previewLoadingId]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    // Use server side pagination data supplied from Hook
    const serverPagination = pagination || {
        current_page: page,
        last_page: 1,
        total: data.length,
    };

    return (
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <Table style={{ fontSize: '12px' }}>
                    <TableHeader style={{ backgroundColor: '#f8fafc' }}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isActions = header.id === 'actions';
                                    return (
                                        <TableHead key={header.id}
                                            style={{
                                                padding: '12px 16px',
                                                verticalAlign: 'top',
                                                color: 'var(--text-secondary)',
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isActions ? '160px' : '120px' }}>
                                                <span style={{ fontWeight: 700 }}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                                {!isActions && ['Modul', 'Company', 'Category', 'Mapping', 'Description'].includes(header.column.id) && (
                                                    <DebouncedInput
                                                        type="text"
                                                        placeholder="Cari..."
                                                        value={columnFilters[header.column.id] || ""}
                                                        onChange={val => onColumnFilterChange(prev => ({ ...prev, [header.column.id]: val }))}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            width: "100%",
                                                            padding: "4px 8px",
                                                            fontSize: "11px",
                                                            fontWeight: "normal",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "4px",
                                                            outline: "none",
                                                            boxSizing: "border-box",
                                                            color: "#334155",
                                                            backgroundColor: "#fff",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        const isActions = cell.column.id === 'actions';
                                        return (
                                            <TableCell key={cell.id} style={{ padding: '12px 16px', color: 'var(--text-primary)', textAlign: isActions ? 'center' : 'left' }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                pagination={serverPagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />

            {previewOpen && (
                <AimsLegacyPreviewModal
                    isOpen={previewOpen}
                    onClose={() => {
                        setPreviewOpen(false);
                        setPreviewDoc(null);
                    }}
                    fileData={previewDoc}
                />
            )}

            {previewLoadingId && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Memuat dokumen...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
