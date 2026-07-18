import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = "/api/admin/sections";

const emptyForm = {
    name: "",
    department_id: "",
    area_location_ids: [],
    area_manager_ids: [],
};

export default function useSection() {
    // Data
    const [sections, setSections] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [areaLocations, setAreaLocations] = useState([]);
    const [areaManagers, setAreaManagers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Modal (create/edit)
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Modal (delete confirmation)
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // ── Fetch sections ────────────────────────────────────────────────────────
    const fetchSections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE, { params: { search } });
            setSections(response.data?.result?.data || []);
        } catch (e) {
            setError("Gagal memuat data.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search]);

    // ── Fetch master data (daftar department untuk dropdown) ────────────────
    const fetchMasterData = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE}/master-data`);
            setDepartments(response.data?.result?.departments || []);
            setAreaLocations(response.data?.result?.area_locations || []);
            setAreaManagers(response.data?.result?.area_managers || []);
            setUsers(response.data?.result?.users || []);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    useEffect(() => {
        fetchMasterData();
    }, [fetchMasterData]);

    // ── Modal helpers (create/edit) ──────────────────────────────────────────
    const openCreateModal = () => {
        setEditId(null);
        setForm({ ...emptyForm, department_id: departments[0]?.id || "" });
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (sec) => {
        setEditId(sec.id);
        setForm({
            name: sec.name || "",
            department_id: sec.department_id || "",
            area_location_ids: (sec.area_locations || []).map((location) => location.id),
            area_manager_ids: (sec.area_managers || []).map((manager) => manager.id),
        });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
    };

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const createAreaLocation = async (name) => {
        const response = await axios.post(`${BASE}/area-locations`, { name });
        await fetchMasterData();
        return response.data?.result;
    };

    const updateAreaLocation = async (id, name) => {
        const response = await axios.put(`${BASE}/area-locations/${id}`, { name });
        await fetchMasterData();
        fetchSections();
        return response.data?.result;
    };

    const createAreaManager = async (userId, areaLocationIds = []) => {
        const response = await axios.post(`${BASE}/area-managers`, {
            user_id: userId,
            area_location_ids: areaLocationIds,
        });
        await fetchMasterData();
        return response.data?.result;
    };

    const updateAreaManager = async (id, userId, areaLocationIds = []) => {
        const response = await axios.put(`${BASE}/area-managers/${id}`, {
            user_id: userId,
            area_location_ids: areaLocationIds,
        });
        await fetchMasterData();
        fetchSections();
        return response.data?.result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            if (editId) {
                await axios.put(`${BASE}/${editId}`, form);
            } else {
                await axios.post(BASE, form);
            }
            closeModal();
            fetchSections();
        } catch (e) {
            const message =
                e.response?.data?.message ||
                Object.values(e.response?.data?.errors || {})[0]?.[0] ||
                "Gagal menyimpan data.";
            setFormError(message);
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Modal helpers (delete confirmation) ──────────────────────────────────
    const openDeleteModal = (sec) => {
        setDeleteTarget(sec);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setDeleteTarget(null);
        setDeleteError(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await axios.delete(`${BASE}/${deleteTarget.id}`);
            setDeleteTarget(null);
            fetchSections();
        } catch (e) {
            const message = e.response?.data?.message || "Gagal menghapus data.";
            setDeleteError(message);
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    const deleteAreaManager = async (id) => {
        await axios.delete(`${BASE}/area-managers/${id}`);

        await fetchMasterData();
        await fetchSections();
    };

    const deleteAreaLocation = async (id) => {
        await axios.delete(`${BASE}/area-locations/${id}`);

        await fetchMasterData();
        await fetchSections();
    };

    return {
        sections,
        departments,
        areaLocations,
        areaManagers,
        users,
        loading,
        error,
        search,
        setSearch,
        fetchSections,
        // modal create/edit
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
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        // modal delete confirmation
        deleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
        deleteAreaManager,
        deleteAreaLocation
    };
}
