import {
    CalendarDays,
    Edit2,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";
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

import CoeLayout from "../../../Layouts/CoeLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import EventModal from "./EventModal";
import { Head } from "@inertiajs/react";
import React from "react";
import TablePagination from "@/Components/TablePagination";
import useEvent from "../Hooks/useEvent";

// Form field helpers
const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
};

export default function EventTable() {
    const {
        events,
        categories,
        sections,
        loading,
        error,
        search,
        setSearch,
        fetchEvents,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        modalOpen,
        editId,
        form,
        setField,
        submitting,
        formError,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        deleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
    } = useEvent();

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Nama Agenda",
                cell: (info) => (
                    <span style={{ fontWeight: 600 }}>{info.getValue()}</span>
                ),
            },
            {
                accessorKey: "invited_emails",
                header: "Undangan (Emails)",
                cell: (info) => {
                    const emails = info.getValue() || [];
                    if (emails.length > 0) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2px",
                                }}
                            >
                                {emails.slice(0, 3).map((email, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            color: "#475569",
                                            fontSize: "11px",
                                        }}
                                    >
                                        {email}
                                    </span>
                                ))}
                                {emails.length > 3 && (
                                    <span
                                        style={{
                                            color: "var(--primary)",
                                            fontSize: "10px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        +{emails.length - 3} lainnya
                                    </span>
                                )}
                            </div>
                        );
                    }
                    return <span style={{ color: "#94a3b8" }}>-</span>;
                },
            },
            {
                accessorKey: "category",
                header: "Kategori",
                cell: (info) => {
                    const cat = info.getValue();
                    return (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "3px",
                                    backgroundColor: cat?.color || "#cbd5e1",
                                }}
                            />
                            <span style={{ fontSize: "12px", fontWeight: 600 }}>
                                {cat?.name || "-"}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "start_date",
                header: "Mulai",
                cell: (info) => {
                    const val = info.getValue();
                    return val
                        ? new Date(val).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })
                        : "-";
                },
            },
            {
                accessorKey: "end_date",
                header: "Akhir",
                cell: (info) => {
                    const val = info.getValue();
                    return val
                        ? new Date(val).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })
                        : "-";
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const val = info.getValue();
                    return (
                        <span
                            style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: "12px",
                                backgroundColor:
                                    val === "Completed"
                                        ? "#dcfce7"
                                        : val === "Cancelled"
                                          ? "#fee2e2"
                                          : "#fef9c3",
                                color:
                                    val === "Completed"
                                        ? "#15803d"
                                        : val === "Cancelled"
                                          ? "#b91c1c"
                                          : "#a16207",
                            }}
                        >
                            {val}
                        </span>
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Deskripsi",
                cell: (info) => {
                    const val = info.getValue();
                    const stripped = val ? val.replace(/<[^>]*>/g, "") : "-";
                    return (
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#64748b",
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                            }}
                            title={stripped}
                        >
                            {stripped}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: () => <div style={{ textAlign: "center" }}>Aksi</div>,
                cell: (info) => {
                    const ev = info.row.original;
                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            <button
                                onClick={() => openEditModal(ev)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#3b82f6",
                                    padding: "4px",
                                }}
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => openDeleteModal(ev)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#ef4444",
                                    padding: "4px",
                                }}
                                title="Hapus"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [openEditModal, openDeleteModal],
    );

    const table = useReactTable({
        data: events,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <CoeLayout>
            <Head title="Daftar Agenda CoE" />

            <div style={{ marginBottom: "20px" }}>
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "var(--primary)",
                        margin: 0,
                    }}
                >
                    Daftar Agenda CoE
                </h1>
                <p
                    style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        marginTop: "4px",
                    }}
                >
                    Daftar rapat koordinasi, agenda pertemuan, dan kegiatan
                    Center of Excellence.
                </p>
            </div>

            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                {/* Header / Actions */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            margin: 0,
                        }}
                    >
                        Daftar Agenda
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <Search
                                size={14}
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                }}
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari agenda..."
                                style={{
                                    ...inputStyle,
                                    paddingLeft: "34px",
                                    width: "200px",
                                }}
                            />
                        </div>

                        <button
                            onClick={fetchEvents}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "9px 14px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                                color: "#475569",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        <button
                            onClick={openCreateModal}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background:
                                    "linear-gradient(135deg, #1d4ed8, #153B73)",
                                color: "#fff",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(21,59,115,0.25)",
                            }}
                        >
                            <Plus size={16} /> Tambah Agenda
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div
                        style={{
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            marginBottom: "16px",
                            color: "#dc2626",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Table */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                >
                    <div style={{ overflowX: "auto" }}>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        style={{ backgroundColor: "#f8fafc" }}
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: "11px",
                                                    color: "#475569",
                                                    textTransform: "uppercase",
                                                    padding: "14px 16px",
                                                    width: header.column
                                                        .columnDef.width
                                                        ? `${header.column.columnDef.width}px`
                                                        : "auto",
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
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
                                            colSpan={columns.length}
                                            style={{
                                                textAlign: "center",
                                                padding: "48px",
                                                color: "#94a3b8",
                                            }}
                                        >
                                            Memuat data agenda...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #f1f5f9",
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            padding:
                                                                "14px 16px",
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            style={{
                                                textAlign: "center",
                                                padding: "48px",
                                                color: "#94a3b8",
                                            }}
                                        >
                                            Tidak ada data agenda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <TablePagination
                        pagination={pagination}
                        onPageChange={setPage}
                        limit={limit}
                        onLimitChange={setLimit}
                    />
                </div>
                {/* Modals */}
                <EventModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editId={editId}
                    form={form}
                    setField={setField}
                    submitting={submitting}
                    formError={formError}
                    categories={categories}
                    sections={sections}
                />

                <DeleteConfirmModal
                    isOpen={!!deleteTarget}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    itemName={deleteTarget?.title}
                    deleting={deleting}
                    errorMessage={deleteError}
                />
            </div>
        </CoeLayout>
    );
}
