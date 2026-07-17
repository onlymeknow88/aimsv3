import { useState, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function usePtw() {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPtw, setSelectedPtw] = useState(null);
    const [loading, setLoading] = useState(false);

    const openForm = useCallback(() => setFormModalOpen(true), []);
    const closeForm = useCallback(() => setFormModalOpen(false), []);

    const openDrawer = useCallback((ptw) => { setSelectedPtw(ptw); setDrawerOpen(true); }, []);
    const closeDrawer = useCallback(() => { setDrawerOpen(false); setSelectedPtw(null); }, []);

    const createPtw = useCallback(async (data) => {
        setLoading(true);
        try {
            await axios.post('/api/document-system/ptw', data);
            closeForm();
            router.reload();
        } catch (err) {
            console.error('Create PTW failed', err);
        } finally {
            setLoading(false);
        }
    }, [closeForm]);

    return {
        formModalOpen, drawerOpen, selectedPtw, loading,
        openForm, closeForm, openDrawer, closeDrawer, createPtw,
    };
}
