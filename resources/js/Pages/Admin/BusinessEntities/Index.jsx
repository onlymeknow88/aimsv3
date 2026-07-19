import { AlertTriangle, Building, Bus, Plus, RefreshCw, Search } from "lucide-react";
import React, { useState } from "react";

import AdminLayout from "@/Layouts/AdminLayout";
import BusinessModal from "./Partials/BusinessModal";
import BusinessTable from "./Partials/BusinessTable";
import DeleteConfirmModal from "./Partials/DeleteConfirmModal";
import useBusiness from "./Hooks/useBusiness";

// ─── Form field helpers ────────────────────────────────────────────────────────
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
    transition: "border-color 0.15s",
};
const onFocus = (e) => (e.target.style.borderColor = "#2563eb");
const onBlur = (e) => (e.target.style.borderColor = "#e2e8f0");

export default function Index() {
    const {
        businessEntities,
        loading,
        error,
        search,
        setSearch,
        modalOpen,
        editId,
        openCreateModal,
        openEditModal,
        closeModal,
        form,
        setField,
        submitting,
        formError,
        handleSubmit,
        deleteTarget,
        openDeleteModal,
        closeDeleteModal,
        deleting,
        deleteError,
        confirmDelete,
        fetchBusinessEntities,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
    } = useBusiness();

    return (
        <AdminLayout title="Business Entities">
            <div style={{ margin: "0 auto" }}>
                {/* ── Header ──────────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "4px",
                            }}
                        >
                            <div
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "10px",
                                    background:
                                        "linear-gradient(135deg, #1d4ed8, #153B73)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Building size={20} color="#fff" />
                            </div>
                            <h1
                                style={{
                                    fontSize: "24px",
                                    fontWeight: 800,
                                    color: "#1e293b",
                                    margin: 0,
                                }}
                            >
                                Business Entities
                            </h1>
                        </div>
                        <p
                            style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px",
                            }}
                        >
                            Daftar dan manajemen entitas bisnis pada ekosistem
                            AIMS.
                        </p>
                    </div>
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
                                placeholder="Cari ... "
                                style={{
                                    ...inputStyle,
                                    paddingLeft: "34px",
                                    width: "220px",
                                }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>
                        <button
                            onClick={fetchBusinessEntities}
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
                            <Plus size={16} /> Tambah Business Entity
                        </button>
                    </div>
                </div>

                {/* ── Error banner ──────────────────────────────────────── */}
                {error && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            color: "#dc2626",
                            fontSize: "13px",
                            marginBottom: "16px",
                        }}
                    >
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                <div
                   style={{
                        backgroundColor: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                >
                    <BusinessTable
                        businessEntities={businessEntities}
                        loading={loading}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                         pagination={pagination}
                    limit={limit}
                    onLimitChange={setLimit}
                    onPageChange={setPage}
                    />
                </div>

                {!loading && businessEntities.length > 0 && (
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#94a3b8",
                            textAlign: "right",
                        }}
                    >
                        Menampilkan {businessEntities.length} entitas bisnis
                    </p>
                )}
            </div>

            {/* ── Modal Create/Edit ──────────────────────────────────── */}
            {modalOpen && (
                <BusinessModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editId={editId}
                    form={form}
                    setField={setField}
                    submitting={submitting}
                    formError={formError}

                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    isOpen={!!deleteTarget}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    deleting={deleting}
                    errorMessage={deleteError}
                    itemName={deleteTarget.name}
                />
            )}
        </AdminLayout>
    );
}
