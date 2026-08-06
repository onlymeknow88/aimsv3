import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/coe/events';

const emptyForm = {
    title: '',
    category_id: '',
    section_id: '',
    start_date: '',
    end_date: '',
    frequency: 'once',
    repeat_day: 'once',
    status: 'PENDING',
    description: '',
    invited_emails: [],
    repeat: true,
    must_send_email: true,
    attachment: '',
    file: null,
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

        const startDateStr = entity.start_date ? entity.start_date.split('T')[0] : '';
        const endDateStr = entity.end_date ? entity.end_date.split('T')[0] : '';
        const isMultiDay = endDateStr && endDateStr !== startDateStr;

        setForm({
            title: entity.title || '',
            category_id: entity.category_id || '',
            section_id: entity.section_id || '',
            start_date: startDateStr,
            end_date: endDateStr,
            frequency: entity.frequency || 'once',
            repeat_day: isMultiDay ? 'more_than_once' : 'once',
            status: entity.status || 'Scheduled',
            description: entity.description || '',
            invited_emails: formattedEmails,
            repeat: String(entity.repeat) === '1' || entity.repeat === true || entity.repeat === 1,
            must_send_email: String(entity.must_send_email) === '1' || entity.must_send_email === true || entity.must_send_email === 1,
            attachment: entity.attachment || '',
            file: null,
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
            const formData = new FormData();
            formData.append('title', form.title || '');
            formData.append('category_id', form.category_id || '');
            formData.append('section_id', form.section_id || '');
            formData.append('start_date', form.start_date || '');
            
            const realEndDate = form.repeat_day === 'once' ? (form.start_date || '') : (form.end_date || '');
            formData.append('end_date', realEndDate);
            formData.append('frequency', form.frequency || 'once');
            
            formData.append('status', form.status || '');
            formData.append('description', form.description || '');
            formData.append('repeat', form.repeat ? '1' : '0');
            formData.append('must_send_email', form.must_send_email ? '1' : '0');

            if (form.invited_emails && form.invited_emails.length > 0) {
                form.invited_emails.forEach((email, idx) => {
                    formData.append(`invited_emails[${idx}]`, email);
                });
            }

            if (form.file) {
                formData.append('file', form.file);
            }

            if (editId) {
                await axios.post(`${BASE_URL}/${editId}/update`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(BASE_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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
            await axios.post(`${BASE_URL}/${deleteTarget.id}/delete`);
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
