import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import SectionTable from "./Partials/SectionTable";
import SectionModal from "./Partials/SectionModal";
import DeleteConfirmModal from "./Partials/DeleteConfirmModal";
import useSection from "./Hooks/useSection";
import { Plus, RefreshCw, AlertTriangle, Search } from "lucide-react";

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
        sections,
        departments,
        areaLocations,
        areaManagers,
        users,
        loading,
        error,
        fetchSections,
        search,
        setSearch,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        modalOpen,
        editId,
        form,
        setField,
        createAreaLocation,
        updateAreaLocation,
        createAreaManager,
        updateAreaManager,
        submitting,
        formError,
        // delete confirmation
        deleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
        deleteAreaManager,
        deleteAreaLocation
    } = useSection();

    return (
        <AdminLayout title="Sections">
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
                        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                            Sections
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
                            Manajemen sub-divisi, area kerja atau lokasi spesifik K3LH.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <Search
                                size={14}
                                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari ... "
                                style={{ ...inputStyle, paddingLeft: "34px", width: "220px" }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>
                        <button
                            onClick={fetchSections}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px",
                                backgroundColor: "#fff", color: "#475569", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                        <button
                            onClick={openCreateModal}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: "linear-gradient(135deg, #1d4ed8, #153B73)", color: "#fff", border: "none",
                                padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(21,59,115,0.25)",
                            }}
                        >
                            <Plus size={16} /> Tambah Section
                        </button>
                    </div>
                </div>

                {/* ── Error banner ──────────────────────────────────────── */}
                {error && (
                    <div
                        style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                            padding: "10px 14px", color: "#dc2626", fontSize: "13px", marginBottom: "16px",
                        }}
                    >
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                <div
                    style={{
                        backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0",
                        overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                >
                    <SectionTable
                        sections={sections}
                        loading={loading}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />
                </div>

                {!loading && sections.length > 0 && (
                    <p style={{ marginTop: "10px", fontSize: "12px", color: "#94a3b8", textAlign: "right" }}>
                        Menampilkan {sections.length} section
                    </p>
                )}
            </div>

            {/* ── Modal Create/Edit ──────────────────────────────────── */}
            {modalOpen && (
                <SectionModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editId={editId}
                    form={form}
                    setField={setField}
                    departments={departments}
                    areaLocations={areaLocations}
                    areaManagers={areaManagers}
                    users={users}
                    onCreateAreaLocation={createAreaLocation}
                    onUpdateAreaLocation={updateAreaLocation}
                    onCreateAreaManager={createAreaManager}
                    onUpdateAreaManager={updateAreaManager}
                    submitting={submitting}
                    formError={formError}
                    deleteAreaManager={deleteAreaManager}
                    deleteAreaLocation={deleteAreaLocation}
                />
            )}

            {/* ── Delete Confirmation Modal ──────────────────────────── */}
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={deleteTarget?.name}
                deleting={deleting}
                errorMessage={deleteError}
            />
        </AdminLayout>
    );
}
