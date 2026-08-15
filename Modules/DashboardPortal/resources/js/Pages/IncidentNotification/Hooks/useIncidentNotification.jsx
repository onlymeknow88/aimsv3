import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/dashboard-portal/incident-notification';

const emptyForm = {
    date: '',
    case: '',
    category: '',
    description: '',
    file: null,
};

export default function useIncidentNotification() {
    // Data
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [search, setSearch]               = useState('');
    const [page, setPage]                   = useState(1);
    const [limit, setLimit]                 = useState(10);
    const [pagination, setPagination]       = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modal create/edit
    const [modalOpen, setModalOpen]   = useState(false);
    const [editId, setEditId]         = useState(null);
    const [form, setForm]             = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError]   = useState(null);

    // Modal delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [deleteError, setDeleteError]   = useState(null);

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(BASE_URL, { params: { search, page, limit } });
            if (res.data?.meta?.status === 'success') {
                setNotifications(res.data.result.data || []);
                const r = res.data.result;
                setPagination({
                    current_page: r.current_page,
                    last_page:    r.last_page,
                    total:        r.total,
                });
            }
        } catch (e) {
            setError('Gagal memuat data.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => { setPage(1); }, [search, limit]);
    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditId(item.id);
        setForm({
            date:        item.date?.substring(0, 10) ?? '',
            case:        item.case ?? '',
            category:    item.category ?? '',
            description: item.description ?? '',
            file:        null,
        });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditId(null); setForm(emptyForm); setFormError(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });

            if (editId) {
                fd.append('_method', 'PUT');
                await axios.post(`${BASE_URL}/${editId}/update`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await axios.post(BASE_URL, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchNotifications();
            closeModal();
        } catch (e) {
            setFormError(e.response?.data?.result || 'Gagal menyimpan data.');
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteModal  = (item) => { setDeleteTarget(item); setDeleteError(null); };
    const closeDeleteModal = () => { setDeleteTarget(null); setDeleteError(null); };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await axios.post(`${BASE_URL}/${deleteTarget.id}/delete`);
            fetchNotifications();
            closeDeleteModal();
            setSelectedIds(ids => ids.filter(i => i !== deleteTarget.id));
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === notifications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(notifications.map(n => n.id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
    };

    const [bulkDeleting, setBulkDeleting] = useState(false);
    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        setBulkDeleting(true);
        try {
            await axios.post(`${BASE_URL}/bulk-delete`, { ids: selectedIds });
            setSelectedIds([]);
            fetchNotifications();
        } catch (e) {
            console.error(e);
        } finally {
            setBulkDeleting(false);
        }
    };

    const toggleVisible = async (item) => {
        try {
            await axios.post(`${BASE_URL}/${item.id}/toggle-visible`);
            fetchNotifications();
        } catch (e) {
            console.error(e);
        }
    };

    const handleBulkToggleVisible = async () => {
        if (!selectedIds.length) return;
        try {
            await axios.post(`${BASE_URL}/bulk-toggle-visible`, { ids: selectedIds });
            fetchNotifications();
        } catch (e) {
            console.error(e);
        }
    };

    return {
        notifications, loading, error,
        search, setSearch,
        page, setPage,
        limit, setLimit,
        pagination,
        fetchNotifications,
        modalOpen, editId, form, setField, submitting, formError,
        openCreateModal, openEditModal, closeModal, handleSubmit,
        deleteTarget, deleting, deleteError,
        openDeleteModal, closeDeleteModal, confirmDelete,
        selectedIds, setSelectedIds,
        toggleSelectAll, toggleSelectOne,
        bulkDeleting, handleBulkDelete,
        toggleVisible, handleBulkToggleVisible,
    };
}
