import React, { useMemo } from "react";
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
    useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DebouncedInput } from "@/lib/utils";
import { Eye } from "lucide-react";
import TablePagination from "@/Components/TablePagination";

const STATUS_CONFIG = {
    Open: { text: "OPEN", color: "var(--accent)", bg: "rgba(255,140,36,0.08)" },
    "On Review PJA": { text: "ON REVIEW PJA", color: "var(--info)", bg: "rgba(45,127,249,0.08)" },
    "Pending CRS": { text: "PENDING CRS", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
    "On Review CRS": { text: "ON REVIEW CRS", color: "var(--info)", bg: "rgba(45,127,249,0.08)" },
    "Not Followed Up": { text: "NOT FOLLOWED UP", color: "#64748b", bg: "#f1f5f9" },
    Overdue: { text: "OVERDUE", color: "var(--danger)", bg: "rgba(239,68,68,0.08)" },
    Closed: { text: "CLOSED", color: "var(--success)", bg: "rgba(34,197,94,0.08)" },
    Draft: { text: "DRAFT", color: "#64748b", bg: "#f1f5f9" },
};

const TYPE_CONFIG = {
    "Planned Task Observation": { text: "PTO", color: "var(--primary)", bg: "rgba(21,59,115,0.08)" },
    "Take Time Talk": { text: "TTT", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
    "Hazard Report": { text: "HR", color: "var(--danger)", bg: "rgba(239,68,68,0.08)" },
};

// ID kolom yang tampilkan DebouncedInput search di header
const SEARCHABLE_COLUMNS = [
    "company", "ccow", "detail_company", "department",
    "section", "location", "detail_location", "repair_action",
];

const DATE_INPUT_STYLE = {
    width: "100%",
    padding: "3px 6px",
    fontSize: "10px",
    fontWeight: "normal",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box",
    color: "#334155",
    backgroundColor: "#fff",
    cursor: "pointer",
};

export default function PjaTable({
    documents = [],
    selectedIds = [],
    onSelectionChange,
    visibleColumns,
    loading = false,
    pagination,
    onPageChange,
    limit = 10,
    onLimitChange,
    onView,
    columnFilters = {},
    onColumnFilterChange,
}) {
    const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

    const handleSelectAll = (checked) => {
        onSelectionChange(checked ? documents.map((d) => d.id) : []);
    };

    const handleSelectRow = (id, checked) => {
        onSelectionChange(
            checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id),
        );
    };

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: () => (
                    <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={selectedIds.includes(row.original.id)}
                        onCheckedChange={(c) => handleSelectRow(row.original.id, c)}
                    />
                ),
            },
            {
                id: "company",
                header: "Company",
                cell: ({ row }) => (
                    <span
                        onClick={() => onView?.(row.original)}
                        style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary)", cursor: "pointer", textDecoration: "underline" }}
                    >
                        {row.original.company_name || "—"}
                    </span>
                ),
            },
            {
                id: "date",
                header: "Date",
                cell: ({ row }) => (
                    <span style={{ fontSize: "12px" }}>
                        {row.original.date
                            ? new Date(row.original.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                    </span>
                ),
            },
            {
                id: "ccow",
                header: "CCOW",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.ccow_name || "—"}</span>,
            },
            {
                id: "detail_company",
                header: "Detail Company",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.detail_company || "—"}</span>,
            },
            {
                id: "department",
                header: "Department",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.department_name || "—"}</span>,
            },
            {
                id: "section",
                header: "Section",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.section_name || "—"}</span>,
            },
            {
                id: "location",
                header: "Location",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.area_location_name || "—"}</span>,
            },
            {
                id: "detail_location",
                header: "Detail Location",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.detail_location || "—"}</span>,
            },
            {
                id: "type",
                header: "Type",
                cell: ({ row }) => {
                    const cfg = TYPE_CONFIG[row.original.type] ?? { text: row.original.type, color: "#64748b", bg: "#f1f5f9" };
                    return (
                        <span style={{ fontSize: "10px", fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "2px 8px", borderRadius: "10px" }}>
                            {cfg.text}
                        </span>
                    );
                },
            },
            {
                id: "members",
                header: "Members",
                cell: ({ row }) => (
                    <span style={{ fontSize: "12px" }}>
                        {row.original.members_count || row.original.members?.length || "—"}
                    </span>
                ),
            },
            {
                id: "positive_condition",
                header: "Positive Condition",
                cell: ({ row }) => (
                    <span style={{ fontSize: "12px" }}>
                        {row.original.positives_count || row.original.positives?.length || "—"}
                    </span>
                ),
            },
            {
                id: "risk_condition",
                header: "Risk Condition",
                cell: ({ row }) => (
                    <span style={{ fontSize: "12px" }}>
                        {row.original.risks_count || row.original.risks?.length || "—"}
                    </span>
                ),
            },
            {
                id: "repair_action",
                header: "Repair Action",
                cell: ({ row }) => <span style={{ fontSize: "12px" }}>{row.original.repair_action || "—"}</span>,
            },
            {
                id: "status",
                header: "Status",
                cell: ({ row }) => {
                    const cfg = STATUS_CONFIG[row.original.status] ?? { text: row.original.status, color: "#64748b", bg: "#f1f5f9" };
                    return (
                        <span style={{ fontSize: "10px", fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "2px 8px", borderRadius: "10px" }}>
                            {cfg.text}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "Aksi",
                cell: ({ row }) => (
                    <button
                        onClick={() => onView?.(row.original)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "transparent", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, color: "var(--primary)", cursor: "pointer" }}
                    >
                        <Eye size={12} /> Detail
                    </button>
                ),
            },
        ],
        [selectedIds, isAllSelected],
    );

    const columnVisibility = useMemo(() => {
        if (!visibleColumns) return {};
        return {
            date: visibleColumns["Tanggal"] ?? true,
            ccow: visibleColumns["CCOW"] ?? true,
            company: visibleColumns["Company"] ?? true,
            detail_company: visibleColumns["Detail Company"] ?? true,
            department: visibleColumns["Departemen"] ?? true,
            section: visibleColumns["Section"] ?? true,
            location: visibleColumns["Location"] ?? true,
            detail_location: visibleColumns["Detail Location"] ?? true,
            type: visibleColumns["Tipe"] ?? true,
            members: visibleColumns["Members"] ?? true,
            positive_condition: visibleColumns["Positive Condition"] ?? true,
            risk_condition: visibleColumns["Risk Condition"] ?? true,
            repair_action: visibleColumns["Repair Action"] ?? true,
            status: visibleColumns["Status"] ?? true,
            actions: visibleColumns["Aksi"] ?? true,
        };
    }, [visibleColumns]);

    const table = useReactTable({
        data: documents,
        columns,
        state: { columnVisibility },
        getCoreRowModel: getCoreRowModel(),
    });

    const visibleColsCount = table.getVisibleFlatColumns().length;

    return (
        <div>
            <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <Table style={{ fontSize: "12px", minWidth: "1200px" }}>
                    <TableHeader style={{ backgroundColor: "var(--header-bg, #f8fafc)" }}>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => {
                                    const isSearchable = SEARCHABLE_COLUMNS.includes(h.id);
                                    const isDate = h.id === "date";
                                    return (
                                        <TableHead
                                            key={h.id}
                                            style={{ fontWeight: 700, fontSize: "11px", color: "var(--text-secondary)", padding: "10px 12px", verticalAlign: "top", whiteSpace: "nowrap" }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: isSearchable ? "110px" : isDate ? "130px" : "auto" }}>
                                                <span>
                                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                                </span>
                                                {/* Date input */}
                                                {isDate && onColumnFilterChange && (
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="date"
                                                            value={columnFilters.date || ""}
                                                            onChange={(e) => onColumnFilterChange("date", e.target.value)}
                                                            style={DATE_INPUT_STYLE}
                                                        />
                                                    </div>
                                                )}
                                                {/* Text search inputs */}
                                                {isSearchable && onColumnFilterChange && (
                                                    <DebouncedInput
                                                        type="text"
                                                        placeholder="Cari..."
                                                        value={columnFilters[h.id] || ""}
                                                        onChange={(val) => onColumnFilterChange(h.id, val)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ width: "100%", padding: "4px 8px", fontSize: "11px", fontWeight: "normal", border: "1px solid #e2e8f0", borderRadius: "4px", outline: "none", boxSizing: "border-box", color: "#334155", backgroundColor: "#fff" }}
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
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: "center", padding: "40px 24px", color: "var(--text-secondary)" }}>
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColsCount} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-slate-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                limit={limit}
                onLimitChange={onLimitChange}
            />
        </div>
    );
}
