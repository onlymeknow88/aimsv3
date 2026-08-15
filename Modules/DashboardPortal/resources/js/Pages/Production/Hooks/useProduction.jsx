import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/dashboard-portal/production';

const emptyForm = {
    month:         '',
    coal_shiping:  '',
    waste_removal: '',
    coal_mining:   '',
    coal_hauling:  '',
    coal_barged:   '',
};

export default function useProduction() {
    // Data
    const [productions, setProductions] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [search, setSearch]           = useState('');
    const [page, setPage]               = useState(1);
    const [limit, setLimit]             = useState(10);
    const [pagination, setPagination]   = useState({ current_page: 1, last_page: 1, total: 0 });

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

    // Bulk
    const [selectedIds, setSelectedIds]   = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const fetchProductions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(BASE_URL, { params: { search, page, limit } });
            if (res.data?.meta?.status === 'success') {
                setProductions(res.data.result.data || []);
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
    useEffect(() => { fetchProductions(); }, [fetchProductions]);

    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditId(item.id);
        // month stored as YYYY-MM-DD, input type="month" needs YYYY-MM
        const m = item.month ? item.month.substring(0, 7) : '';
        setForm({
            month:         m,
            coal_shiping:  item.coal_shiping  ?? '',
            waste_removal: item.waste_removal ?? '',
            coal_mining:   item.coal_mining   ?? '',
            coal_hauling:  item.coal_hauling  ?? '',
            coal_barged:   item.coal_barged   ?? '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            if (editId) {
                await axios.post(`${BASE_URL}/${editId}/update`, form);
            } else {
                await axios.post(BASE_URL, form);
            }
            fetchProductions();
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
            fetchProductions();
            closeDeleteModal();
            setSelectedIds(ids => ids.filter(i => i !== deleteTarget.id));
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === productions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(productions.map(p => p.id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        setBulkDeleting(true);
        try {
            await axios.post(`${BASE_URL}/bulk-delete`, { ids: selectedIds });
            setSelectedIds([]);
            fetchProductions();
        } catch (e) {
            console.error(e);
        } finally {
            setBulkDeleting(false);
        }
    };

    const toggleVisible = async (item) => {
        try {
            await axios.post(`${BASE_URL}/${item.id}/toggle-visible`);
            fetchProductions();
        } catch (e) {
            console.error(e);
        }
    };

    const handleBulkToggleVisible = async () => {
        if (!selectedIds.length) return;
        try {
            await axios.post(`${BASE_URL}/bulk-toggle-visible`, { ids: selectedIds });
            fetchProductions();
        } catch (e) {
            console.error(e);
        }
    };

    return {
        productions, loading, error,
        search, setSearch,
        page, setPage,
        limit, setLimit,
        pagination,
        fetchProductions,
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
