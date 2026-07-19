import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/coe/events';

const emptyForm = {
    title: '',
    category_id: '',
    section_id: '',
    start_date: '',
    end_date: '',
    status: 'Scheduled',
    description: '',
    invited_emails: [],
    repeat: true,
    must_send_email: true,
};

export default function useEvent() {
    // Data
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
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

    // Fetch master metadata
    const fetchMetadata = async () => {
        try {
            const catRes = await axios.get('/api/coe/categories');
            setCategories(catRes.data?.result || []);

            const secRes = await axios.get('/api/coe/sections');
            setSections(secRes.data?.result || []);
        } catch (e) {
            console.error('Failed to load metadata', e);
        }
    };

    // Fetch events
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            const result = response.data?.result;
            if (result && result.data) {
                setEvents(result.data || []);
                setPagination({
                    current_page: result.current_page || 1,
                    last_page: result.last_page || 1,
                    total: result.total || 0,
                });
            } else {
                setEvents(result || []);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    total: (result || []).length,
                });
            }
        } catch (e) {
            setError('Gagal memuat data event.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [search, limit]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (entity) => {
        setEditId(entity.id);
        
        let formattedEmails = [];
        if (Array.isArray(entity.invited_emails)) {
            formattedEmails = entity.invited_emails;
        } else if (typeof entity.invited_emails === 'string') {
            try {
                formattedEmails = JSON.parse(entity.invited_emails) || [];
            } catch (e) {
                formattedEmails = entity.invited_emails ? [entity.invited_emails] : [];
            }
        }

        setForm({
            title: entity.title || '',
            category_id: entity.category_id || '',
            section_id: entity.section_id || '',
            start_date: entity.start_date ? entity.start_date.split('T')[0] : '',
            end_date: entity.end_date ? entity.end_date.split('T')[0] : '',
            status: entity.status || 'Scheduled',
            description: entity.description || '',
            invited_emails: formattedEmails,
            repeat: entity.repeat !== false,
            must_send_email: entity.must_send_email !== false,
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
            fetchEvents();
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
            fetchEvents();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        events,
        categories,
        sections,
        loading,
        error,
        search,
        setSearch,
        fetchEvents,
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
