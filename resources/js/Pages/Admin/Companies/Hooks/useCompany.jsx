import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

const BASE_URL = '/api/admin/companies';

const emptyForm = {
    company_name: '',
    document_code: '',
    address: '',
    email: '',
    phone_number: '',
    type: '',
    user_id: '',
    parent_company_id: '',
};

export default function useCompany() {
    // Data
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
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
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, company_name }
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // ── Fetch ─────────────────────────────────
    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE_URL, { params: { search, page, limit } });
            setCompanies(response.data?.result?.data || []);
            setPagination({
                current_page: response.data?.result?.current_page || 1,
                last_page: response.data?.result?.last_page || 1,
                total: response.data?.result?.total || 0,
            });
        } catch (e) {
            setError('Gagal memuat data perusahaan.');
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

    const fetchDropdownData = useCallback(async () => {
        try {
            const [usersRes, companiesRes] = await Promise.all([
                axios.get('/api/admin/users'),
                axios.get(BASE_URL, { params: { limit: 1000 } }),
            ]);
            const usersData = usersRes.data?.result;
            setUsers(Array.isArray(usersData) ? usersData : (usersData?.data || []));
            setAllCompanies(companiesRes.data?.result?.data || []);
        } catch (e) {
            console.error('Gagal mengambil data dropdown:', e);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
        fetchDropdownData();
    }, [fetchCompanies, fetchDropdownData]);

    // ── Modal helpers (create/edit) ──────────────────────────────────────────
    const openCreateModal = () => {
        setEditId(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEditModal = (company) => {
        setEditId(company.id);
        setForm({
            company_name: company.company_name || '',
            document_code: company.document_code || '',
            address: company.address || '',
            email: company.email || '',
            phone_number: company.phone_number || '',
            type: company.type || '',
            user_id: company.user_id || '',
            parent_company_id: company.parent_company_id || '',
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
                // Update existing company
                await axios.put(`${BASE_URL}/${editId}`, form);
            } else {
                // Create new company
                await axios.post(BASE_URL, form);
            }
            fetchCompanies();
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
    const openDeleteModal = (company) => {
        setDeleteTarget(company);
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
            fetchCompanies();
            closeDeleteModal();
        } catch (e) {
            setDeleteError('Gagal menghapus data.');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    return {
        companies,
        users,
        allCompanies,
        loading,
        error,
        search,
        setSearch,
        fetchCompanies,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
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
