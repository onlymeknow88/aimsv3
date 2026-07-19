import { Edit2, Trash2 } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import React, { useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

// ── Action buttons ────────────────────────────────────────────────────────────
function ActionBtns({ onEdit, onDelete }) {
    return (
        <div style={{ display: "inline-flex", gap: "2px" }}>
            <button
                onClick={onEdit}
                title="Edit"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#3b82f6",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#eff6ff")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                <Edit2 size={14} />
            </button>
            <button
                onClick={onDelete}
                title="Hapus"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fef2f2")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                }
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

export default function CompanyTable({
    companies = [],
    onEdit,
    onDelete,
    loading = false,
    pagination,
    limit,
    onLimitChange,
    onPageChange,
}) {
    const columns = useMemo(
        () => [
            { accessorKey: "company_name", header: "Nama Perusahaan" },
            { accessorKey: "document_code", header: "Kode Dokumen" },
            {
                accessorKey: "parent_company.company_name",
                header: "Parent Company",
                cell: ({ row }) =>
                    row.original.parent_company?.company_name || "-",
            },
            {
                accessorKey: "manager.name",
                header: "KTT / PJO",
                cell: ({ row }) => row.original.manager?.name || "-",
            },
            { accessorKey: "type", header: "Tipe" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "phone_number", header: "No. Telepon" },
            {
                id: "actions",
                header: "Aksi",
                meta: {
                    align: "center",
                },
                cell: ({ row }) => (
                    <div style={{ textAlign: "center" }}>
                        <ActionBtns
                            onEdit={() => onEdit(row.original)}
                            onDelete={() => onDelete(row.original)}
                        />
                    </div>
                ),
            },
        ],
        [onEdit, onDelete],
    );

    const table = useReactTable({
        data: companies,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    const visibleCount = table.getVisibleFlatColumns().length;

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

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow
                            key={hg.id}
                            style={{ backgroundColor: "#f8fafc" }}
                        >
                            {hg.headers.map((h) => (
                                <TableHead
                                    key={h.id}
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "11px",
                                        color: "#475569",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        padding: "14px 16px",
                                        whiteSpace: "nowrap",
                                        textAlign:
                                            h.column.columnDef.meta?.align ||
                                            "left",
                                    }}
                                >
                                    {flexRender(
                                        h.column.columnDef.header,
                                        h.getContext(),
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={visibleCount}
                                style={{
                                    textAlign: "center",
                                    padding: "48px",
                                    color: "#94a3b8",
                                }}
                            >
                                Memuat data perusahaan...
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                style={{ borderBottom: "1px solid #f1f5f9" }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        style={{
                                            padding: "12px 16px",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={visibleCount}
                                style={{
                                    textAlign: "center",
                                    padding: "48px",
                                    color: "#94a3b8",
                                    fontSize: "14px",
                                }}
                            >
                                Belum ada perusahaan. Klik "Tambah Perusahaan"
                                untuk mulai.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
        </div>
    );
}
