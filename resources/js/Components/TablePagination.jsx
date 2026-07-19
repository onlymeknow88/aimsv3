import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function TablePagination({
    pagination,
    onPageChange,
    limit,
    onLimitChange,
}) {
    if (!pagination) return null;

    const { current_page, last_page, total } = pagination;

    const getPageNumbers = () => {
        const pages = [];
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
                    <strong>{current_page}</strong> dari{" "}
                    <strong>{last_page}</strong> (Total{" "}
                    <strong>{total}</strong> data)
                </div>
                {onLimitChange && limit !== undefined && (
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
                            onChange={(e) => onLimitChange(Number(e.target.value))}
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
            {last_page > 1 && (
                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(current_page - 1)}
                                disabled={current_page === 1}
                                style={{
                                    opacity: current_page === 1 ? 0.5 : 1,
                                    cursor: current_page === 1 ? "not-allowed" : "pointer",
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
                                        isActive={p === current_page}
                                        onClick={() => onPageChange(p)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange(current_page + 1)}
                                disabled={current_page === last_page}
                                style={{
                                    opacity: current_page === last_page ? 0.5 : 1,
                                    cursor: current_page === last_page ? "not-allowed" : "pointer",
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
