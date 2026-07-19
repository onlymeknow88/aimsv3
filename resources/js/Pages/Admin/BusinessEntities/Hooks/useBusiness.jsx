import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

const BASE_URL = '/api/admin/business-entities';

const emptyForm = {
    name: '',
    code: '',
    document_code: '',
};


export default function useBusiness() {
    // Data
    const [businessEntities, setBusinessEntities] = useState([]);
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
    const fetchBusinessEntities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            setBusinessEntities(response.data?.result?.data || []);
            setPagination({
                current_page: response.data?.result?.current_page || 1,
                last_page: response.data?.result?.last_page || 1,
                total: response.data?.result?.total || 0,
            });
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
        fetchBusinessEntities();
    }, [fetchBusinessEntities]);

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
            code: entity.code || '',
            document_code: entity.document_code || '',
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
                // Update existing entity
                await axios.put(`${BASE_URL}/${editId}`, form);
            } else {
                // Create new entity
                await axios.post(BASE_URL, form);
            }
            fetchBusinessEntities();
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
     const openDeleteModal = (dept) => {
        setDeleteTarget(dept);
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
            fetchBusinessEntities();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        businessEntities,
        loading,
        error,
        search,
        setSearch,
        fetchBusinessEntities,
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



