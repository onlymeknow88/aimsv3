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

export default function SectionTable({
    sections = [],
    onEdit,
    onDelete,
    loading = false,
    pagination = { current_page: 1, last_page: 1, total: 0 },
    onPageChange,
    limit = 10,
    onLimitChange,
}) {
    const columns = useMemo(
        () => [
            { accessorKey: "name", header: "Nama Section" },
            {
                id: "department",
                header: "Departemen",
                cell: ({ row }) => row.original.department?.name || "-",
            },
            {
                id: "area_locations",
                header: "Area Location",
                cell: ({ row }) => {
                    const locations = row.original.area_locations || [];
                    if (!locations.length) {
                        return (
                            <span
                                style={{ color: "#cbd5e1", fontSize: "12px" }}
                            >
                                -
                            </span>
                        );
                    }
                    const limit = 2;
                    const shown = locations.slice(0, limit);
                    const extra = locations.length - limit;
                    const tooltipText = locations
                        .slice(limit)
                        .map((loc) => loc.name)
                        .join(", ");

                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            {shown.map((loc) => (
                                <div
                                    key={loc.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "24px",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "3px 9px",
                                            borderRadius: "999px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            backgroundColor: "#eff6ff",
                                            color: "#1e40af",
                                            border: "1px solid #bfdbfe",
                                        }}
                                    >
                                        {loc.name}
                                    </span>
                                </div>
                            ))}
                            {extra > 0 && (
                                <span
                                    title={tooltipText}
                                    style={{
                                        fontSize: "10px",
                                        color: "#64748b",
                                        fontWeight: 700,
                                        cursor: "help",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        height: "24px",
                                    }}
                                >
                                    +{extra} lokasi lainnya...
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: "area_managers",
                header: "Area Manager",
                cell: ({ row }) => {
                    const locations = row.original.area_locations || [];
                    const managers = row.original.area_managers || [];

                    if (!locations.length) {
                        return (
                            <span
                                style={{ color: "#cbd5e1", fontSize: "12px" }}
                            >
                                -
                            </span>
                        );
                    }

                    const limit = 2;
                    const shownLocations = locations.slice(0, limit);
                    const extraLocations = locations.slice(limit);

                    const getManagersText = (loc) => {
                        const matching = managers.filter((m) => {
                            const mLocIds = (m.area_locations || []).map(
                                (l) => l.id,
                            );
                            return mLocIds.includes(loc.id);
                        });
                        return matching
                            .map(
                                (m) =>
                                    m.user?.name ||
                                    m.user?.email ||
                                    "Manager tanpa user",
                            )
                            .join(", ");
                    };

                    const tooltipText = extraLocations
                        .map((loc) => {
                            const mgrs = getManagersText(loc);
                            return `${loc.name}: ${mgrs || "-"}`;
                        })
                        .join("\n");

                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            {shownLocations.map((loc) => {
                                const matchingManagers = managers.filter(
                                    (manager) => {
                                        const mLocIds = (
                                            manager.area_locations || []
                                        ).map((l) => l.id);
                                        return mLocIds.includes(loc.id);
                                    },
                                );

                                return (
                                    <div
                                        key={loc.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            height: "24px",
                                        }}
                                    >
                                        {matchingManagers.length === 0 ? (
                                            <span
                                                style={{
                                                    color: "#cbd5e1",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                -
                                            </span>
                                        ) : (
                                            matchingManagers.map((manager) => (
                                                <span
                                                    key={manager.id}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        padding: "3px 9px",
                                                        borderRadius: "999px",
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        backgroundColor:
                                                            "#f0fdf4",
                                                        color: "#166534",
                                                        border: "1px solid #bbf7d0",
                                                    }}
                                                >
                                                    {manager.user?.name ||
                                                        manager.user?.email ||
                                                        "Manager tanpa user"}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                );
                            })}
                            {extraLocations.length > 0 && (
                                <span
                                    title={tooltipText}
                                    style={{
                                        fontSize: "10px",
                                        color: "#64748b",
                                        fontWeight: 700,
                                        cursor: "help",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        height: "24px",
                                    }}
                                >
                                    +{extraLocations.length} manager lainnya...
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: "Aksi",
                cell: ({ row }) => (
                    <div style={{ textAlign: "right" }}>
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
        data: sections,
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
                            Memuat data section...
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
                            Belum ada section. Klik "Tambah Section" untuk
                            mulai.
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
