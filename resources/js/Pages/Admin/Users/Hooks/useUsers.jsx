import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE = '/api/admin/users';
const MASTER_URL = '/api/admin/users/master-data';

const emptyEmployee = {
    company_id: '', department_id: '', section_id: '',
    emp_number: '', emp_id_number: '', emp_position: '', emp_grade: '',
    emp_gender: '', emp_status: '', emp_marital: '',
    emp_dob: '', emp_blood_type: '', emp_address: '',
};

const emptyForm = {
    name: '', email: '', password: '',
    with_employee: false,
    role_ids: [],
    ...emptyEmployee,
};

export default function useUsers() {
    // Data
    const [users, setUsers] = useState([]);
    const [master, setMaster] = useState({ companies: [], departments: [], sections: [], roles: [], modules: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Module expand tracking for roles
    const [expandedModules, setExpandedModules] = useState([]);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, masterRes] = await Promise.all([
                axios.get(BASE, { params: { search, page, limit } }),
                axios.get(MASTER_URL),
            ]);
            setUsers(usersRes.data?.result?.data || []);
            setPagination({
                current_page: usersRes.data?.result?.current_page || 1,
                last_page: usersRes.data?.result?.last_page || 1,
                total: usersRes.data?.result?.total || 0,
            });
            setMaster(masterRes.data?.result || {});
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

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Modal helpers ──────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditId(null);
        setForm({ ...emptyForm });
        setExpandedModules([]);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditId(user.id);
        const emp = user.employee || {};
        const roleIds = (user.document_roles || []).map(r => r.id);
        const activeModuleIds = [...new Set(
            (user.document_roles || []).map(r => r.module_id).filter(Boolean)
        )];
        setExpandedModules(activeModuleIds);
        setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            with_employee: !!user.employee,
            role_ids: roleIds,
            company_id: emp.company_id || '',
            department_id: emp.department_id || '',
            section_id: emp.section_id || '',
            emp_number: emp.number || '',
            emp_id_number: emp.id_number || '',
            emp_position: emp.position || '',
            emp_grade: emp.grade || '',
            emp_gender: emp.gender || '',
            emp_status: emp.employee_status || '',
            emp_marital: emp.marital_status || '',
            emp_dob: emp.date_of_birth || '',
            emp_blood_type: emp.blood_type || '',
            emp_address: emp.address || '',
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

    const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    // ── Role / Module handling ─────────────────────────────────────────────────
    const toggleModule = (moduleId) => {
        if (expandedModules.includes(moduleId)) {
            setExpandedModules(prev => prev.filter(id => id !== moduleId));
            // Uncheck all roles in this module
            const moduleRoleIds = (master.roles || []).filter(r => r.module_id === moduleId).map(r => r.id);
            setForm(prev => ({ ...prev, role_ids: prev.role_ids.filter(id => !moduleRoleIds.includes(id)) }));
        } else {
            setExpandedModules(prev => [...prev, moduleId]);
        }
    };

    const toggleRole = (roleId) => {
        setForm(prev => ({
            ...prev,
            role_ids: prev.role_ids.includes(roleId)
                ? prev.role_ids.filter(id => id !== roleId)
                : [...prev.role_ids, roleId],
        }));
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        try {
            const payload = { ...form };
            if (editId) {
                await axios.put(`${BASE}/${editId}`, payload);
            } else {
                await axios.post(BASE, payload);
            }
            closeModal();
            fetchUsers();
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message
                || (data?.errors ? Object.values(data.errors).flat().join(' ') : null)
                || 'Terjadi kesalahan.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (user) => {
        if (!confirm(`Hapus user "${user.name}" dan data employee-nya?`)) return;
        try {
            await axios.delete(`${BASE}/${user.id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus.');
        }
    };

    return {
        users,
        pagination,
        page,
        setPage,
        limit,
        setLimit,
        master,
        loading,
        error,
        search, setSearch,
        fetchUsers,
        // modal
        modalOpen,
        editId,
        form,
        setField,
        submitting,
        formError,
        expandedModules,
        toggleModule,
        toggleRole,
        openCreate,
        openEdit,
        closeModal,
        handleSubmit,
        handleDelete,
    };
}
