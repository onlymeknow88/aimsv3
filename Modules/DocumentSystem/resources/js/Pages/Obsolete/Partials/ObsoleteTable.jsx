import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import BlobPreviewModal from '@/Components/BlobPreviewModal';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
export default function ObsoleteTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    visibleColumns,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    columnFilters = {},
    onColumnFilterChange,
}) {
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const getCompanyCode = (doc) => {
        return doc.company?.company_name || doc.company?.document_code || '-';
    };

    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        if (checked) {
            onSelectionChange(documents.map(d => d.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id, checked) => {
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(x => x !== id));
        }
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.original.id, checked)}
                />
            )
        },
        {
            id: 'company',
            header: 'Company',
            cell: ({ row }) => <span style={{ fontSize: '12px', fontWeight: 700 }}>   <a href={`/document-system/active/detail/${row.original.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{getCompanyCode(row.original)}</a></span>
        },
        {
            id: 'department',
            header: 'Department',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.department?.name || '-'}</span>
        },
        {
            id: 'pic',
            header: 'PIC',
            cell: ({ row }) => <span style={{ fontSize: '12px' }}>{row.original.owner?.name || '-'}</span>
        },
        {
            id: 'module',
            header: 'Modul',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.module?.index ? `${row.original.mapping.category.module.index}. ` : ''}
                    {row.original.mapping?.category?.module?.name || '-'}
                </span>
            )
        },
        {
            id: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.category?.index ? `${row.original.mapping.category.index}. ` : ''}
                    {row.original.mapping?.category?.name || '-'}
                </span>
            )
        },
        {
            accessorKey: 'document_level',
            id: 'document_level',
            header: 'Document Type',
            cell: info => (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {info.getValue()}
                </span>
            )
        },
        {
            id: 'mapping',
            header: 'Mapping',
            cell: ({ row }) => (
                <span style={{ fontSize: '12px' }}>
                    {row.original.mapping?.index ? `${row.original.mapping.index}. ` : ''}
                    {row.original.mapping?.name || '-'}
                </span>
            )
        },
        {
            accessorKey: 'document_number',
            id: 'document_number',
            header: 'No. Dokumen',
            cell: ({ row }) => (
                <span >
                    {row.original.document_number}
                </span>
            )
        },
        {
            accessorKey: 'title',
            id: 'title',
            header: 'Judul Dokumen',
            cell: info => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{info.getValue()}</span>
        },
        {
            accessorKey: 'revision',
            id: 'revision',
            header: 'Rev',
            cell: info => <span style={{ color: 'var(--text-secondary)' }}>Rev {info.getValue() || 0}</span>
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: 'Status',
            cell: info => {
                return (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--danger)',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '10px'
                    }}>
                        OBSOLETE
                    </span>
                );
            }
        },
        {
            id: 'attachment',
            header: 'Attachment',
            cell: ({ row }) => {
                const finalAttachments = (row.original.attachments || []).filter(
                    att => att.file_name && att.file_name.startsWith('FINAL_')
                );

                if (finalAttachments.length === 0) {
                    return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>;
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {finalAttachments.map(att => (
                            <span
                                key={att.id}
                                onClick={() => setPreviewAttachment(att)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--primary)',
                                    textDecoration: 'underline',
                                    textDecorationStyle: 'dotted',
                                    cursor: 'pointer',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                title={`Klik untuk preview: ${att.file_name}`}
                            >
                                <FileText size={11} style={{ flexShrink: 0 }} />
                                {att.file_name}
                            </span>
                        ))}
                    </div>
                );
            }
        }
    ], [selectedIds, isAllSelected, previewAttachment]);

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            'company': visibleColumns['Company'] ?? true,
            'department': visibleColumns['Department'] ?? true,
            'pic': visibleColumns['PIC'] ?? true,
            'module': visibleColumns['Modul'] ?? true,
            'category': visibleColumns['Category'] ?? true,
            'document_level': visibleColumns['Level'] ?? true,
            'mapping': visibleColumns['Mapping'] ?? true,
            'document_number': visibleColumns['No. Dokumen'] ?? true,
            'title': visibleColumns['Judul Dokumen'] ?? true,
            'revision': visibleColumns['Rev'] ?? true,
            'status': visibleColumns['Status'] ?? true,
            'actions': visibleColumns['Aksi'] ?? true,
        };
    }, [visibleColumns]);

    const table = useReactTable({
        data: documents,
        columns,
        state: {
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    const getPageNumbers = () => {
        if (!pagination) return [];
        const pages = [];
        const { current_page, last_page } = pagination;
        let startPage = Math.max(1, current_page - 2);
        let endPage = Math.min(last_page, current_page + 2);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("ellipsis");
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < last_page) {
            if (endPage < last_page - 1) pages.push("ellipsis");
            pages.push(last_page);
        }
        return pages;
    };

    return (<>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
            <Table style={{ fontSize: '12px', minWidth: '1100px' }}>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                            {hg.headers.map(h => {
                                const isSearchable = ['company', 'department', 'pic', 'module', 'category', 'document_level', 'mapping', 'document_number', 'title'].includes(h.id);
                                return (
                                    <TableHead key={h.id} style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '10px 12px', verticalAlign: 'top' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: isSearchable ? '120px' : 'auto' }}>
                                            <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                                            {isSearchable && onColumnFilterChange && (
                                                <input
                                                    type="text"
                                                    placeholder={`Cari...`}
                                                    value={columnFilters[h.id] || ''}
                                                    onChange={(e) => onColumnFilterChange(h.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        fontWeight: 'normal',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '4px',
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                        color: '#334155',
                                                        backgroundColor: '#fff'
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
                            <TableCell colSpan={visibleColsCount} style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
                                Memuat data dokumen usang...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={visibleColsCount} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Arsip kosong.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Pagination Controls */}
                {pagination && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 24px",
                            borderTop: "1px solid #f1f5f9",
                            backgroundColor: "#fafafa",
                            fontSize: "13px",
                            color: "#64748b",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                Menampilkan Halaman{" "}
                                <strong>{pagination.current_page}</strong> dari{" "}
                                <strong>{pagination.last_page}</strong> (Total{" "}
                                <strong>{pagination.total}</strong> data)
                            </div>
                            {onLimitChange && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#64748b",
                                        }}
                                    >
                                        Baris per halaman:
                                    </span>
                                    <select
                                        value={limit}
                                        onChange={(e) =>
                                            onLimitChange(Number(e.target.value))
                                        }
                                        style={{
                                            padding: "4px 24px 4px 8px",
                                            border: "1.5px solid #e2e8f0",
                                            borderRadius: "6px",
                                            backgroundColor: "#fff",
                                            fontSize: "12px",
                                            color: "#475569",
                                            cursor: "pointer",
                                            outline: "none",
                                        }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <Pagination className="mx-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            onPageChange(
                                                pagination.current_page - 1,
                                            )
                                        }
                                        disabled={pagination.current_page === 1}
                                        style={{
                                            opacity:
                                                pagination.current_page === 1
                                                    ? 0.5
                                                    : 1,
                                            cursor:
                                                pagination.current_page === 1
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    />
                                </PaginationItem>
        
                                {getPageNumbers().map((p, idx) => {
                                    if (p === "ellipsis") {
                                        return (
                                            <PaginationItem key={`ellipsis-${idx}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                isActive={
                                                    p === pagination.current_page
                                                }
                                                onClick={() => onPageChange(p)}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
        
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            onPageChange(
                                                pagination.current_page + 1,
                                            )
                                        }
                                        disabled={
                                            pagination.current_page ===
                                            pagination.last_page
                                        }
                                        style={{
                                            opacity:
                                                pagination.current_page ===
                                                pagination.last_page
                                                    ? 0.5
                                                    : 1,
                                            cursor:
                                                pagination.current_page ===
                                                pagination.last_page
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

        {previewAttachment && (
            <BlobPreviewModal
                attachment={previewAttachment}
                onClose={() => setPreviewAttachment(null)}
            />
        )}
    </>);
}
