import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TABS = ['limit-parameter', 'jenis-kta-tta', 'potensi-konsekuensi', 'kategori'];

export default function useMaster() {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = TABS.includes(tabParam) ? tabParam : 'limit-parameter';
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [limitParams, setLimitParams] = useState([]);
    const [ktaTta, setKtaTta]           = useState([]);
    const [potency, setPotency]         = useState([]);
    const [category, setCategory]       = useState([]);
    const [loading, setLoading]         = useState(true);
    
    const [pendingDelete, setPendingDelete] = useState(null); // { id, type, label }
    const [deleting, setDeleting]           = useState(false);

    useEffect(() => {
        if (tabParam && TABS.includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [lim, kta, pot, cat] = await Promise.all([
                axios.get('/api/field-leadership/masters/limit-parameters').catch(() => ({ data: { result: null } })),
                axios.get('/api/field-leadership/masters/kta-tta').catch(() => ({ data: { result: [] } })),
                axios.get('/api/field-leadership/masters/potencies').catch(() => ({ data: { result: [] } })),
                axios.get('/api/field-leadership/masters/categories').catch(() => ({ data: { result: [] } })),
            ]);
            const limResult = lim.data?.result ?? lim.data ?? null;
            setLimitParams(limResult ? (Array.isArray(limResult) ? limResult : [limResult]) : []);
            setKtaTta(Array.isArray(kta.data?.result) ? kta.data.result : []);
            setPotency(Array.isArray(pot.data?.result) ? pot.data.result : []);
            setCategory(Array.isArray(cat.data?.result) ? cat.data.result : []);
        } catch (err) {
            console.error('Master data fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Limit Parameter
    const saveLimitParam = async (form) => {
        await axios.put('/api/field-leadership/masters/limit-parameters', form);
        fetchAll();
    };

    // KTA/TTA
    const saveKtaTta = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/masters/kta-tta/${id}`, form);
        else    await axios.post('/api/field-leadership/masters/kta-tta', form);
        fetchAll();
    };
    const deleteKtaTta = (id) => {
        setPendingDelete({ id, type: 'kta-tta', label: 'Jenis KTA/TTA' });
    };
    const confirmDeleteKtaTta = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/field-leadership/masters/kta-tta/${pendingDelete.id}`);
            fetchAll();
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    // Potency
    const savePotency = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/masters/potencies/${id}`, form);
        else    await axios.post('/api/field-leadership/masters/potencies', form);
        fetchAll();
    };
    const deletePotency = (id) => {
        setPendingDelete({ id, type: 'potency', label: 'Potensi Konsekuensi' });
    };
    const confirmDeletePotency = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/field-leadership/masters/potencies/${pendingDelete.id}`);
            fetchAll();
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    // Category
    const saveCategory = async (form, id) => {
        if (id) await axios.put(`/api/field-leadership/masters/categories/${id}`, form);
        else    await axios.post('/api/field-leadership/masters/categories', form);
        fetchAll();
    };
    const deleteCategory = (id) => {
        setPendingDelete({ id, type: 'category', label: 'Kategori' });
    };
    const confirmDeleteCategory = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/field-leadership/masters/categories/${pendingDelete.id}`);
            fetchAll();
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    return {
        activeTab,
        setActiveTab,
        limitParams,
        ktaTta,
        potency,
        category,
        loading,
        pendingDelete,
        setPendingDelete,
        deleting,
        saveLimitParam,
        saveKtaTta,
        deleteKtaTta,
        confirmDeleteKtaTta,
        savePotency,
        deletePotency,
        confirmDeletePotency,
        saveCategory,
        deleteCategory,
        confirmDeleteCategory,
    };
}
