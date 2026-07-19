import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/document-system/modules';

const emptyForm = {
    name: '',
    index: '',
    has_document_number: true,
};

export default function useModule() {
    // Data
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

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

    // ── Fetch ─────────────────────────────────
    const fetchModules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            // Since backend might return list directly or in pagination format, handle both
            const result = response.data?.result;
            if (result && result.data) {
                setModules(result.data || []);
                setPagination({
                    current_page: result.current_page || 1,
                    last_page: result.last_page || 1,
                    total: result.total || 0,
                });
            } else {
                setModules(result || []);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    total: (result || []).length,
                });
            }
        } catch (e) {
            setError('Gagal memuat data.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    // Reset page to 1 on search change
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Reset page to 1 on limit change
    useEffect(() => {
        setPage(1);
    }, [limit]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    // ── Modal helpers (create/edit) ──────────────────────────────────────────
    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (entity) => {
        setEditId(entity.id);
        setForm({
            name: entity.name || '',
            index: entity.index || '',
            has_document_number: entity.has_document_number === undefined ? true : !!entity.has_document_number,
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
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setSubmitting(true);
        setFormError(null);
        try {
            if (editId) {
                // Update existing
                await axios.put(`${BASE_URL}/${editId}`, form);
            } else {
                // Create new
                await axios.post(BASE_URL, form);
            }
            fetchModules();
            closeModal();
        } catch (err) {
            const message =
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors || {})[0]?.[0] ||
                "Gagal menyimpan data.";
            setFormError(message);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Modal helpers (delete confirmation) ──────────────────────────────────────────
    const openDeleteModal = (moduleItem) => {
        setDeleteTarget(moduleItem);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        setDeleteTarget(null);
        setDeleteError(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await axios.delete(`${BASE_URL}/${deleteTarget.id}`);
            fetchModules();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        modules,
        loading,
        error,
        search,
        setSearch,
        fetchModules,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        // Modal (create/edit)
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
        // Modal (delete confirmation)
        deleteTarget,
        setDeleteTarget,
        deleting,
        deleteError,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
    };
}
