import { useState } from "react";
import { X, AlertTriangle, Plus, Pencil, Check, Trash2 } from "lucide-react";

function MultiCheckboxList({ label, items = [], value = [], onChange, onEditItem, onDeleteItem, getLabel, emptyText }) {
    const selected = Array.isArray(value) ? value : [];
    const allSelected = items.length > 0 && selected.length === items.length;

    const toggleItem = (id) => {
        onChange(
            selected.includes(id)
                ? selected.filter((itemId) => itemId !== id)
                : [...selected, id]
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    {label}
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                    <button
                        type="button"
                        onClick={() => onChange(items.map((item) => item.id))}
                        disabled={allSelected || items.length === 0}
                        style={{
                            border: "1px solid #dbeafe",
                            backgroundColor: allSelected ? "#f8fafc" : "#eff6ff",
                            color: allSelected ? "#94a3b8" : "#1d4ed8",
                            borderRadius: "7px",
                            padding: "5px 8px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: allSelected || items.length === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        Pilih Semua
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        disabled={selected.length === 0}
                        style={{
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#fff",
                            color: selected.length === 0 ? "#cbd5e1" : "#475569",
                            borderRadius: "7px",
                            padding: "5px 8px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: selected.length === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        Bersihkan
                    </button>
                </div>
            </div>

            <div
                style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    flex: 1,
                    overflowY: "auto",
                    backgroundColor: "#fff",
                }}
            >
                {items.length === 0 ? (
                    <div style={{ padding: "12px", color: "#94a3b8", fontSize: "13px" }}>
                        {emptyText}
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: "8px",
                                padding: "9px 12px",
                                borderBottom: "1px solid #f1f5f9",
                            }}
                        >
                            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", minWidth: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item.id)}
                                    onChange={() => toggleItem(item.id)}
                                    style={{ marginTop: "2px", flexShrink: 0 }}
                                />
                                <span style={{ fontSize: "13px", color: "#0f172a", lineHeight: 1.35 }}>
                                    {getLabel(item)}
                                </span>
                            </label>
                            {onEditItem && (
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button
                                        type="button"
                                        onClick={() => onEditItem(item)}
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDeleteItem(item)}
                                        style={{ color: "#dc2626" }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const getErrorMessage = (e, fallback) =>
    e.response?.data?.message ||
    Object.values(e.response?.data?.errors || {})[0]?.[0] ||
    fallback;

const fieldStyle = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
    color: "#0f172a",
    width: "100%",
    boxSizing: "border-box",
};

const actionButtonStyle = {
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
};

const cancelButtonStyle = {
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#475569",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
};

export default function SectionModal({
    isOpen,
    onClose,
    onSubmit,
    editId,
    form,
    setField,
    departments = [],
    areaLocations = [],
    areaManagers = [],
    users = [],
    sections = [],
    onCreateAreaLocation,
    onUpdateAreaLocation,
    onCreateAreaManager,
    onUpdateAreaManager,
    submitting,
    formError,
    deleteAreaManager,
    deleteAreaLocation
}) {
    const [locationName, setLocationName] = useState("");
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [locationSaving, setLocationSaving] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [managerUserId, setManagerUserId] = useState("");
    const [managerLocationIds, setManagerLocationIds] = useState([]);
    const [editingManagerId, setEditingManagerId] = useState(null);
    const [managerSaving, setManagerSaving] = useState(false);
    const [managerError, setManagerError] = useState(null);

    if (!isOpen) return null;

    const resetLocationForm = () => {
        setLocationName("");
        setEditingLocationId(null);
        setLocationError(null);
    };

    const resetManagerForm = () => {
        setManagerUserId("");
        setManagerLocationIds([]);
        setEditingManagerId(null);
        setManagerError(null);
    };

    const getManagerLocationIds = (manager) =>
        (manager.area_locations || []).map((location) => location.id);

    const selectedLocationIds = form.area_location_ids || [];

    const isManagerAvailableForSection = (manager, locationIds = selectedLocationIds) => {
        if (locationIds.length === 0) return false;

        const lockedLocationIds = getManagerLocationIds(manager);
        if (lockedLocationIds.length === 0) return false;

        return lockedLocationIds.some(id =>
            locationIds.includes(id)
        );
    };

    const availableAreaManagers = areaManagers.filter(manager => {

        const managerLocationIds = getManagerLocationIds(manager);

        return managerLocationIds.some(id =>
            form.area_location_ids.includes(id)
        );

    });

    const filteredAreaLocations = areaLocations.filter((loc) => {
        if (!loc.sections || loc.sections.length === 0) return true;
        return !loc.sections.some((sec) => sec.department_id && sec.department_id !== form.department_id);
    });

    const setSectionAreaLocations = (ids) => {
        const validManagerIds = (form.area_manager_ids || []).filter((managerId) => {
            const manager = areaManagers.find((item) => item.id === managerId);
            return manager && isManagerAvailableForSection(manager, ids);
        });

        setField("area_location_ids", ids);
        if (validManagerIds.length !== (form.area_manager_ids || []).length) {
            setField("area_manager_ids", validManagerIds);
        }
        setManagerLocationIds((prev) => prev.filter((id) => ids.includes(id)));
    };

    const submitAreaLocation = async () => {
        if (!locationName.trim()) return;

        setLocationSaving(true);
        setLocationError(null);
        try {
            const saved = editingLocationId
                ? await onUpdateAreaLocation(editingLocationId, locationName.trim())
                : await onCreateAreaLocation(locationName.trim());

            if (!editingLocationId && saved?.id && !form.area_location_ids?.includes(saved.id)) {
                setField("area_location_ids", [...(form.area_location_ids || []), saved.id]);
            }
            resetLocationForm();
        } catch (e) {
            setLocationError(getErrorMessage(e, "Gagal menyimpan area location."));
        } finally {
            setLocationSaving(false);
        }
    };

    const submitAreaManager = async () => {
        if (!managerUserId || managerLocationIds.length === 0) return;

        setManagerSaving(true);
        setManagerError(null);
        try {
            const saved = editingManagerId
                ? await onUpdateAreaManager(editingManagerId, managerUserId, managerLocationIds)
                : await onCreateAreaManager(managerUserId, managerLocationIds);

            if (!editingManagerId && saved?.id && isManagerAvailableForSection(saved) && !form.area_manager_ids?.includes(saved.id)) {
                setField("area_manager_ids", [...(form.area_manager_ids || []), saved.id]);
            }
            resetManagerForm();
        } catch (e) {
            setManagerError(getErrorMessage(e, "Gagal menyimpan area manager."));
        } finally {
            setManagerSaving(false);
        }
    };


    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.65)",
                backdropFilter: "blur(5px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "16px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "1500px",
                    height: "90vh",
                    maxHeight: "92vh",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}
                >
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        {editId ? "Edit Section" : "Tambah Section Baru"}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            borderRadius: "6px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form id="section-form" onSubmit={onSubmit} style={{ padding: "20px 24px 0 24px", overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    {formError && (
                        <div
                            style={{
                                backgroundColor: "#fef2f2",
                                color: "#b91c1c",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px",
                                fontSize: "13px",
                            }}
                        >
                            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                            <span>{formError}</span>
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1, minHeight: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="department_id" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                Departemen <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <select
                                id="department_id"
                                required
                                value={form.department_id}
                                onChange={(e) => setField("department_id", e.target.value)}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">— Pilih —</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label htmlFor="name" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                Nama Section <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="Contoh: Operation Pit A"
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "13px",
                                    color: "#0f172a",
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", flexGrow: 1, minHeight: 0 }}>
                            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>
                                        {editingLocationId ? "Edit Area Location" : "Tambah Area Location"}
                                    </label>
                                    {locationError && (
                                        <div style={{ color: "#b91c1c", fontSize: "12px", fontWeight: 600 }}>
                                            {locationError}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            type="text"
                                            value={locationName}
                                            onChange={(e) => setLocationName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    submitAreaLocation();
                                                }
                                            }}
                                            placeholder="Contoh: Workshop A"
                                            style={fieldStyle}
                                        />
                                        <button
                                            type="button"
                                            onClick={submitAreaLocation}
                                            disabled={locationSaving || !locationName.trim()}
                                            style={{
                                                ...actionButtonStyle,
                                                opacity: locationSaving || !locationName.trim() ? 0.6 : 1,
                                                cursor: locationSaving || !locationName.trim() ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {editingLocationId ? <Check size={14} /> : <Plus size={14} />}
                                            {locationSaving ? "..." : editingLocationId ? "Update" : "Tambah"}
                                        </button>
                                        {editingLocationId && (
                                            <button type="button" onClick={resetLocationForm} style={cancelButtonStyle}>
                                                Batal
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 10px 0", lineHeight: 1.4 }}>
                                    💡 <i>Cukup hilangkan centang untuk melepas lokasi dari Section ini. Tombol merah (tong sampah) digunakan untuk menghapus lokasi permanen dari database (hanya bisa jika tidak sedang digunakan).</i>
                                </p>
                                <MultiCheckboxList
                                    label="Area Location"
                                    items={filteredAreaLocations}
                                    value={form.area_location_ids}
                                    onChange={setSectionAreaLocations}
                                    onEditItem={(location) => {
                                        setEditingLocationId(location.id);
                                        setLocationName(location.name || "");
                                        setLocationError(null);
                                    }}
                                    onDeleteItem={async (location) => {

                                        if (!window.confirm(`Hapus Area Location "${location.name}" ?`))
                                            return;

                                        try {

                                            await deleteAreaLocation(location.id);

                                        } catch (e) {

                                            alert(
                                                e.response?.data?.message ??
                                                "Gagal menghapus Area Location."
                                            );

                                        }

                                    }}
                                    getLabel={(location) => location.name}
                                    emptyText="Belum ada area location."
                                />
                            </div>

                            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>
                                        {editingManagerId ? "Edit Area Manager" : "Tambah Area Manager"}
                                    </label>
                                    {managerError && (
                                        <div style={{ color: "#b91c1c", fontSize: "12px", fontWeight: 600 }}>
                                            {managerError}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <select
                                            value={managerUserId}
                                            onChange={(e) => setManagerUserId(e.target.value)}
                                            style={{ ...fieldStyle, cursor: "pointer" }}
                                        >
                                            <option value="">— Pilih User —</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name || user.email}{user.email ? ` (${user.email})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={submitAreaManager}
                                            disabled={managerSaving || !managerUserId || managerLocationIds.length === 0}
                                            style={{
                                                ...actionButtonStyle,
                                                opacity: managerSaving || !managerUserId || managerLocationIds.length === 0 ? 0.6 : 1,
                                                cursor: managerSaving || !managerUserId || managerLocationIds.length === 0 ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {editingManagerId ? <Check size={14} /> : <Plus size={14} />}
                                            {managerSaving ? "..." : editingManagerId ? "Update" : "Tambah"}
                                        </button>
                                        {editingManagerId && (
                                            <button type="button" onClick={resetManagerForm} style={cancelButtonStyle}>
                                                Batal
                                            </button>
                                        )}
                                    </div>

                                    <MultiCheckboxList
                                        label="Lock Area Location"
                                        items={areaLocations.filter((loc) => (form.area_location_ids || []).includes(loc.id))}
                                        value={managerLocationIds}
                                        onChange={setManagerLocationIds}
                                        getLabel={(location) => location.name}
                                        emptyText={form.area_location_ids?.length === 0 ? "Pilih area location pada section terlebih dahulu." : "Belum ada area location."}
                                    />
                                </div>

                                <MultiCheckboxList
                                    label="Area Manager"
                                    items={availableAreaManagers}
                                    value={form.area_manager_ids}
                                    onChange={(ids) => setField("area_manager_ids", ids)}
                                    onEditItem={(manager) => {
                                        setEditingManagerId(manager.id);
                                        setManagerUserId(manager.user_id || "");
                                        setManagerLocationIds(getManagerLocationIds(manager));
                                        setManagerError(null);
                                    }}
                                    onDeleteItem={(manager) => {
                                        if (confirm(`Hapus ${manager.user.name}?`)) {
                                            deleteAreaManager(manager.id);
                                        }
                                    }}
                                    getLabel={(manager) => {
                                        const name = manager.user?.name || manager.user?.email || "Manager tanpa user";
                                        const locationNames = (manager.area_locations || []).map(loc => loc.name).join(', ');
                                        return `${name} (${locationNames || 'tidak ada lokasi'})`;
                                    }}
                                    emptyText={selectedLocationIds.length === 0 ? "Pilih area location dulu." : "Belum ada area manager untuk location terpilih."}
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Sticky Footer */}
                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        flexShrink: 0,
                        backgroundColor: "#fff",
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#fff",
                            color: "#475569",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="section-form"
                        disabled={submitting}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#1d4ed8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: submitting ? "not-allowed" : "pointer",
                            opacity: submitting ? 0.6 : 1,
                        }}
                    >
                        {submitting ? (editId ? "Menyimpan..." : "Membuat...") : (editId ? "Simpan Perubahan" : "Buat Section")}
                    </button>
                </div>
            </div>
        </div>
    );
}
