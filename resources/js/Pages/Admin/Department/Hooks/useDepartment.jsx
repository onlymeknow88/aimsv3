import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = "/api/admin/departments";

const emptyForm = {
    name: "",
    code: "",
    document_code: "",
    head_id: "",
};

export default function useDepartment() {
    // Data
    const [departments, setDepartments] = useState([]);
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

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE, { params: { search } });
            // ResponseFormatter::success membungkus hasil paginate(), datanya ada di result.data
            setDepartments(response.data?.result?.data || []);
        } catch (e) {
            setError("Gagal memuat data.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    // ── Modal helpers (create/edit) ──────────────────────────────────────────
    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (dept) => {
        setEditId(dept.id);
        setForm({
            name: dept.name || "",
            code: dept.code || "",
            document_code: dept.document_code || "",
            head_id: dept.head_id || "",
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
            fetchDepartments();
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
    const openDeleteModal = (dept) => {
        setDeleteTarget(dept);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        if (deleting) return; // jangan bisa ditutup saat masih proses
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
            fetchDepartments();
        } catch (e) {
            const message = e.response?.data?.message || "Gagal menghapus data.";
            setDeleteError(message);
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        departments, // filtering sudah dilakukan di server lewat query `search`
        loading,
        error,
        search,
        setSearch,
        fetchDepartments,
        // modal create/edit
        modalOpen,
        setModalOpen,
        editId,
        form,
        setField,
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
    };
}
