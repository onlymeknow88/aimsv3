import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE = '/api/admin/aims-menu';

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-_]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const emptyForm = {
    module_id: '',
    parent_id: '',
    order_by: 0,
    name: '',
    slug: '',
};

export default function useAimsMenu() {
    // Data states
    const [menus, setMenus]       = useState([]);   // tree (parent + children)
    const [flatMenus, setFlat]    = useState([]);   // flat list for parent dropdown
    const [modules, setModules]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [filterModule, setFilterModule] = useState('');

    // Modal / form states
    const [modalOpen, setModalOpen]   = useState(false);
    const [editId, setEditId]         = useState(null);
    const [form, setForm]             = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError]   = useState(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = filterModule ? `?module_id=${filterModule}` : '';
            const [treeRes, flatRes, modRes] = await Promise.all([
                axios.get(`${BASE}${params}`),
                axios.get(`${BASE}/list`),
                axios.get(`${BASE}/modules`),
            ]);
            setMenus(treeRes.data?.result || []);
            setFlat(flatRes.data?.result  || []);
            setModules(modRes.data?.result || []);
        } catch (e) {
            setError('Gagal memuat data. Pastikan server berjalan.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filterModule]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Modal helpers ──────────────────────────────────────────────────────────

    const openCreate = () => {
        setEditId(null);
        setForm({ ...emptyForm, module_id: filterModule || (modules[0]?.id ?? '') });
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (menu) => {
        setEditId(menu.id);
        setForm({
            module_id: menu.module_id ?? '',
            parent_id: menu.parent_id ?? '',
            order_by:  menu.order_by  ?? 0,
            name:      menu.name      ?? '',
            slug:      menu.slug      ?? '',
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

    const handleFormChange = (field, value) => {
        setForm(prev => {
            const next = { ...prev, [field]: value };
            // Auto-generate slug from name only on create
            if (field === 'name' && !editId) next.slug = slugify(value);
            // Reset parent when module changes
            if (field === 'module_id') next.parent_id = '';
            return next;
        });
    };

    // ── Submit (Create / Update) ───────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        const payload = {
            module_id: form.module_id,
            parent_id: form.parent_id || null,
            order_by:  Number(form.order_by) || 0,
            name:      form.name,
            slug:      form.slug,
        };

        try {
            if (editId) {
                await axios.put(`${BASE}/${editId}`, payload);
            } else {
                await axios.post(BASE, payload);
            }
            closeModal();
            fetchAll();
        } catch (err) {
            const data = err.response?.data;
            const msg  = data?.message
                || (data?.errors ? Object.values(data.errors).flat().join(' ') : null)
                || 'Terjadi kesalahan.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────

    const handleDelete = async (menu) => {
        const childCount = menu.children?.length || 0;
        const msg = childCount > 0
            ? `Menu "${menu.name}" memiliki ${childCount} sub-menu. Menghapus ini akan menghapus semua sub-menu. Lanjutkan?`
            : `Hapus menu "${menu.name}"?`;

        if (!confirm(msg)) return;

        try {
            await axios.delete(`${BASE}/${menu.id}`);
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus menu.');
        }
    };

    // ── Derived ────────────────────────────────────────────────────────────────

    // Only root menus of same module (no self-reference)
    const availableParents = flatMenus.filter(m =>
        String(m.module_id) === String(form.module_id) &&
        m.id !== editId &&
        !m.parent_id
    );

    const totalChildren = menus.reduce((s, m) => s + (m.children?.length || 0), 0);

    return {
        // Data
        menus,
        flatMenus,
        modules,
        loading,
        error,
        filterModule,
        setFilterModule,
        fetchAll,
        totalChildren,
        // Modal / form
        modalOpen,
        editId,
        form,
        submitting,
        formError,
        availableParents,
        openCreate,
        openEdit,
        closeModal,
        handleFormChange,
        handleSubmit,
        handleDelete,
    };
}
