import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/document-system/mappings';
const CATEGORIES_URL = '/api/document-system/categories';

const emptyForm = {
    category_id: '',
    name: '',
    index: '',
};

export default function useMapping() {
    // Data
    const [mappings, setMappings] = useState([]);
    const [categories, setCategories] = useState([]);
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
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Fetch mappings
    const fetchMappings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            const result = response.data?.result;
            if (result && result.data) {
                setMappings(result.data || []);
                setPagination({
                    current_page: result.current_page || 1,
                    last_page: result.last_page || 1,
                    total: result.total || 0,
                });
            } else {
                setMappings(result || []);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    total: (result || []).length,
                });
            }
        } catch (e) {
            setError('Gagal memuat data mapping.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    // Fetch categories list for dropdown select option
    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORIES_URL);
            const result = response.data?.result;
            setCategories(Array.isArray(result) ? result : result?.data || []);
        } catch (e) {
            console.error('Gagal memuat data kategori:', e);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [search, limit]);

    useEffect(() => {
        fetchMappings();
    }, [fetchMappings]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (entity) => {
        setEditId(entity.id);
        setForm({
            category_id: entity.category_id || '',
            name: entity.name || '',
            index: entity.index || '',
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
                await axios.put(`${BASE_URL}/${editId}`, form);
            } else {
                await axios.post(BASE_URL, form);
            }
            fetchMappings();
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

    const openDeleteModal = (item) => {
        setDeleteTarget(item);
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
            fetchMappings();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        mappings,
        categories,
        loading,
        error,
        search,
        setSearch,
        fetchMappings,
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
    };
}
