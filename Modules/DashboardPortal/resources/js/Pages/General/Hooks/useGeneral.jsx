import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/dashboard-portal/general';

const emptyForm = {
    project_to_date: '',
    project_to_date_mark: 'UP',
    manhours: '',
    manhours_mark: 'UP',
    day_after_last_lti: '',
    day_after_last_lti_mark: 'UP',
    manpower: '',
    manpower_mark: 'UP',
};

export default function useGeneral() {
    // Data
    const [generals, setGenerals] = useState([]);
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

    // Fetch generals
    const fetchGenerals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            const result = response.data?.result;
            if (result && result.data) {
                setGenerals(result.data || []);
                setPagination({
                    current_page: result.current_page || 1,
                    last_page: result.last_page || 1,
                    total: result.total || 0,
                });
            } else {
                setGenerals(result || []);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    total: (result || []).length,
                });
            }
        } catch (e) {
            setError('Gagal memuat data general dashboard.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [search, limit]);

    useEffect(() => {
        fetchGenerals();
    }, [fetchGenerals]);

    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (entity) => {
        setEditId(entity.id);
        setForm({
            project_to_date: entity.project_to_date ?? '',
            project_to_date_mark: entity.project_to_date_mark || 'UP',
            manhours: entity.manhours ?? '',
            manhours_mark: entity.manhours_mark || 'UP',
            day_after_last_lti: entity.day_after_last_lti ?? '',
            day_after_last_lti_mark: entity.day_after_last_lti_mark || 'UP',
            manpower: entity.manpower ?? '',
            manpower_mark: entity.manpower_mark || 'UP',
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
            const payload = {
                project_to_date: form.project_to_date !== '' ? Number(form.project_to_date) : null,
                project_to_date_mark: form.project_to_date_mark,
                manhours: form.manhours !== '' ? Number(form.manhours) : null,
                manhours_mark: form.manhours_mark,
                day_after_last_lti: form.day_after_last_lti !== '' ? Number(form.day_after_last_lti) : null,
                day_after_last_lti_mark: form.day_after_last_lti_mark,
                manpower: form.manpower !== '' ? Number(form.manpower) : null,
                manpower_mark: form.manpower_mark,
            };

            if (editId) {
                await axios.put(`${BASE_URL}/${editId}`, payload);
            } else {
                await axios.post(BASE_URL, payload);
            }
            fetchGenerals();
            closeModal();
        } catch (err) {
            const message =
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors || {})[0]?.[0] ||
                'Gagal menyimpan data.';
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
            fetchGenerals();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        generals,
        loading,
        error,
        search,
        setSearch,
        fetchGenerals,
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