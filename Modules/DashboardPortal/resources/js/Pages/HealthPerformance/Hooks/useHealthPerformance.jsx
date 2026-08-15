import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = '/api/dashboard-portal/health-performance';

const emptyForm = { month: '', rkk: '', cmr: '', mmr: '', ssr: '', asr: '' };

export default function useHealthPerformance() {
    const [records, setRecords]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [limit, setLimit]           = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    const [modalOpen, setModalOpen]   = useState(false);
    const [editId, setEditId]         = useState(null);
    const [form, setForm]             = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError]   = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [deleteError, setDeleteError]   = useState(null);

    const [selectedIds, setSelectedIds]   = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const fetchRecords = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await axios.get(BASE_URL, { params: { search, page, limit } });
            if (res.data?.meta?.status === 'success') {
                setRecords(res.data.result.data || []);
                const r = res.data.result;
                setPagination({ current_page: r.current_page, last_page: r.last_page, total: r.total });
            }
        } catch { setError('Gagal memuat data.'); }
        finally { setLoading(false); }
    }, [search, page, limit]);

    useEffect(() => { setPage(1); }, [search, limit]);
    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const openCreateModal = () => { setEditId(null); setForm(emptyForm); setFormError(null); setModalOpen(true); };
    const openEditModal = (item) => {
        setEditId(item.id);
        setForm({ month: item.month?.substring(0, 7) ?? '', rkk: item.rkk ?? '', cmr: item.cmr ?? '', mmr: item.mmr ?? '', ssr: item.ssr ?? '', asr: item.asr ?? '' });
        setFormError(null); setModalOpen(true);
    };
    const closeModal = () => { setModalOpen(false); setEditId(null); setForm(emptyForm); setFormError(null); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError(null);
        try {
            if (editId) await axios.post(`${BASE_URL}/${editId}/update`, form);
            else        await axios.post(BASE_URL, form);
            fetchRecords(); closeModal();
        } catch (e) { setFormError(e.response?.data?.result || 'Gagal menyimpan.'); }
        finally { setSubmitting(false); }
    };

    const openDeleteModal  = (item) => { setDeleteTarget(item); setDeleteError(null); };
    const closeDeleteModal = () => { setDeleteTarget(null); setDeleteError(null); };
    const confirmDelete = async () => {
        setDeleting(true);
        try { await axios.post(`${BASE_URL}/${deleteTarget.id}/delete`); fetchRecords(); closeDeleteModal(); setSelectedIds(ids => ids.filter(i => i !== deleteTarget.id)); }
        catch { setDeleteError('Gagal menghapus.'); }
        finally { setDeleting(false); }
    };

    const toggleSelectAll = () => selectedIds.length === records.length ? setSelectedIds([]) : setSelectedIds(records.map(r => r.id));
    const toggleSelectOne = (id) => setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);

    const handleBulkDelete = async () => {
        setBulkDeleting(true);
        try { await axios.post(`${BASE_URL}/bulk-delete`, { ids: selectedIds }); setSelectedIds([]); fetchRecords(); }
        catch (e) { console.error(e); }
        finally { setBulkDeleting(false); }
    };

    const toggleVisible = async (item) => {
        try { await axios.post(`${BASE_URL}/${item.id}/toggle-visible`); fetchRecords(); }
        catch (e) { console.error(e); }
    };

    return {
        records, loading, error, search, setSearch, page, setPage, limit, setLimit, pagination, fetchRecords,
        modalOpen, editId, form, setField, submitting, formError, openCreateModal, openEditModal, closeModal, handleSubmit,
        deleteTarget, deleting, deleteError, openDeleteModal, closeDeleteModal, confirmDelete,
        selectedIds, toggleSelectAll, toggleSelectOne, bulkDeleting, handleBulkDelete, toggleVisible,
    };
}
